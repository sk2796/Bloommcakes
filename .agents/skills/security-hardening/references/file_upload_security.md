# Secure File Upload Reference Guide

This reference details the security requirements and implementation patterns for file upload handling, content verification, storage isolation, and execution prevention.

---

## The Attack Vectors

1. **Remote Code Execution (RCE)**: Attacker uploads `.php`, `.py`, `.sh`, `.exe`, `.jsp`, or HTML/SVG with embedded `<script>` tags that execute on the server or in the victim's browser.
2. **File Inclusion / Path Traversal**: Attacker names a file `../../../../var/www/shell.py` to overwrite system files.
3. **Denial of Service (DoS)**: Attacker exhausts server memory or storage using oversized files or zip bombs ("decompression bombs").
4. **MIME Confusion / Sniffing**: Web browser treats an uploaded file as HTML or JavaScript if served without `nosniff`.

---

## 1. Magic Bytes & Content Inspection

File extensions (`.jpg`, `.pdf`) and HTTP `Content-Type` headers are user-controlled strings and **must never be trusted**. True file type verification requires inspecting the initial bytes (the "magic numbers").

### Common Magic Byte Signatures

| Format | Magic Bytes (Hex) | Leading ASCII / Details |
| :--- | :--- | :--- |
| **JPEG** | `FF D8 FF` | `ÿØÿ` |
| **PNG** | `89 50 4E 47 0D 0A 1A 0A` | `.PNG....` |
| **GIF** | `47 49 46 38 37 61` or `47 49 46 38 39 61` | `GIF87a` / `GIF89a` |
| **WEBP** | `52 49 46 46 ... 57 45 42 50` | `RIFF....WEBP` |
| **PDF** | `25 50 44 46` | `%PDF` |
| **ZIP** | `50 4B 03 04` | `PK..` |

### Python Implementation (Magic Bytes + Chunk Validation)

```python
import io
import uuid
import os
from fastapi import UploadFile, HTTPException, status
from PIL import Image

ALLOWED_MIME_SIGNATURES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp", # Requires secondary check for WEBP in bytes 8-12
    b"%PDF": "application/pdf"
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

async def validate_and_save_upload(file: UploadFile, storage_dir: str) -> str:
    # 1. Read the initial chunk (first 2048 bytes) for magic byte sniffing
    header = await file.read(2048)
    if len(header) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 2. Match against magic bytes
    detected_mime = None
    for signature, mime in ALLOWED_MIME_SIGNATURES.items():
        if header.startswith(signature):
            if signature == b"RIFF" and b"WEBP" not in header[8:12]:
                continue
            detected_mime = mime
            break

    if not detected_mime:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPEG, PNG, WEBP, and PDF are permitted."
        )

    # 3. For images, re-verify with Pillow to detect polyglots or corrupt structures
    if detected_mime.startswith("image/"):
        try:
            image_buffer = io.BytesIO(header + await file.read(MAX_FILE_SIZE))
            img = Image.open(image_buffer)
            img.verify()  # Validates image integrity
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image content.")

    # 4. Enforce strict size bounds during streaming
    file.file.seek(0)
    total_size = 0
    random_filename = f"{uuid.uuid4().hex}_{os.path.basename(detected_mime.replace('/', '_'))}"
    safe_path = os.path.join(storage_dir, random_filename)

    # Ensure storage_dir is strictly outside web root
    os.makedirs(storage_dir, exist_ok=True)
    
    with open(safe_path, "wb") as f:
        while chunk := await file.read(1024 * 1024): # 1MB chunks
            total_size += len(chunk)
            if total_size > MAX_FILE_SIZE:
                f.close()
                os.remove(safe_path)
                raise HTTPException(status_code=413, detail="File exceeds maximum size limit (5MB).")
            f.write(chunk)

    # 5. Restrict permissions (Read-only, no execution)
    os.chmod(safe_path, 0o644)
    
    return random_filename
```

---

## 2. Storage Outside Web Root & Execution Prevention

### Web Root Isolation
- **Vulnerability**: If files are saved to `src/assets/`, `public/uploads/`, or `dist/uploads/`, an uploaded script might be reachable at `https://example.com/uploads/evil.php` or `evil.js`.
- **Hardening**:
  1. Store uploaded files in an external directory outside the repository root (e.g., `/var/app/storage/uploads` or S3/object storage bucket).
  2. Never configure your web server (Nginx/Caddy/Apache) to execute files in this directory.
  3. In Nginx:
     ```nginx
     location /uploads/ {
         alias /var/app/storage/uploads/;
         # Disable script execution
         location ~ \.(php|py|sh|pl|cgi|phtml|jsp)$ {
             deny all;
         }
         add_header X-Content-Type-Options "nosniff" always;
         add_header Content-Security-Policy "default-src 'none'" always;
     }
     ```

### Secure Download / Delivery Headers
When delivering user files back to users, never serve them with an execution context:
- `Content-Disposition: attachment; filename="example.pdf"` (Forces download, prevents browser script execution).
- `X-Content-Type-Options: nosniff` (Prevents browsers from interpreting a text file as HTML/JS).
- `Content-Security-Policy: default-src 'none'` (Ensures that even if rendered inline, no scripts can execute).

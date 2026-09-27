---
name: security-hardening
description: >-
  Comprehensive security hardening and audit runbook for web applications and APIs.
  Enforces tiered rate limiting (strict auth with exponential backoff & configurable salts, moderate public, loose authenticated),
  strict schema validation (immediate rejection over sanitization), codebase secrets scanning (zero hardcoded keys, env var validation,
  frontend leakage prevention), dependency vulnerability auditing (pip-audit, npm audit), safe error handling (generic client responses,
  internal server logging, zero stack trace/path leaks), and secure file upload pipelines (magic byte validation, isolated storage,
  non-executable controls). Use when auditing, implementing, or reviewing application security, authentication, inputs, secrets, or file uploads.
---

# Application & API Security Hardening

This skill provides an actionable, end-to-end security hardening protocol across the six critical pillars of modern web application defense. Follow these procedures whenever building, reviewing, or refactoring endpoints, authentication, configuration, dependencies, and file handling.

---

## 1. Tiered Rate Limiting & Abuse Prevention

Apply granular, context-aware rate limiting tailored to endpoint sensitivity. Never apply a one-size-fits-all policy.

### Endpoint Tiers & Limits

| Endpoint Tier | Target Routes | Recommended Default Limit | Window | Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Strict Tier** | `/api/auth/login`, `/api/auth/signup`, `/api/auth/reset-password`, `/api/auth/verify-otp` | 5 failed attempts / IP & Account | 15 min | Exponential backoff per-IP + per-account; returns `Retry-After` |
| **Moderate Tier** | Public read endpoints: `/api/products`, `/api/catalogue`, `/api/locations`, `/api/search` | 30–60 req/min | 60 sec | Fixed/Sliding window per client IP |
| **Loose Tier** | Authenticated user actions: `/api/orders`, `/api/cart`, `/api/profile`, `/api/reviews` | 120–300 req/min | 60 sec | Sliding window per authenticated user ID |

### Dual-Key Auth Throttling & Exponential Backoff
Auth routes must prevent credential stuffing and brute-force attacks without enabling Denial of Service (DoS) against legitimate users:
1. **Combine Per-IP and Per-Account Limits**:
   - Track failures against hashed IP (`sha256(IP_SALT + client_ip)`) AND hashed username/email (`sha256(ACCOUNT_SALT + email)`).
   - If an attacker rotates IPs targeting one account, the account key throttles the attempt.
   - If an attacker sprays passwords across many accounts from one IP, the IP key throttles the attempt.
2. **Exponential Backoff Over Hard Lockout**:
   - Do **NOT** permanently lock accounts or lock them for hours after 5 tries (this allows attackers to lock out real users).
   - Instead, require an exponentially increasing delay after $N$ failed attempts:
     $$\text{delay} = \text{base\_delay} \times 2^{(\text{failures} - \text{max\_attempts})}$$
     (e.g., attempt 6 = 2s, attempt 7 = 4s, attempt 8 = 8s, attempt 9 = 16s, capped at e.g. 900s).
   - On successful authentication, immediately reset failure counters.
3. **Configurable Cryptographic Salts**:
   - Always load three separate salts from environment variables:
     - `IP_SALT`: For anonymizing client IP addresses before storage/lookup.
     - `ACCOUNT_SALT`: For hashing account identifiers (usernames, emails).
     - `GLOBAL_SALT` (or `ROUTE_SALT`): For hashing route keys or secondary session identifiers.
   - **Never hardcode salts**. If missing in production, fail fast or warn loudly.
4. **Rate Limit Response Contract**:
   - HTTP Status: `429 Too Many Requests`.
   - Header: `Retry-After: <seconds>`.
   - JSON Body: Generic friendly error message (e.g., `{"detail": "Too many attempts. Please try again in 12 seconds."}`).

*Deep dive & reference implementations:* See [Rate Limiting Patterns](./references/rate_limiting_patterns.md).

---

## 2. Strict Schema & Input Validation

Reject malformed requests at the boundary before application logic executes.

### The "Reject, Don't Sanitize" Principle
> [!IMPORTANT]
> **Do NOT attempt to sanitize, strip, or escape malformed data.**
> Sanitization creates subtle bypasses and impedance mismatches. Validate every field against an explicit schema and **immediately reject (`422 Unprocessable Entity` or `400 Bad Request`)** any request that does not match.

### Schema Requirements
Every request payload (JSON bodies, query parameters, path variables, form fields) must enforce:
1. **Strict Types**: Reject string-to-number coercions if ambiguous; forbid arbitrary dicts/objects.
2. **Length Boundaries**:
   - Every string field MUST have `min_length` and `max_length`.
   - Prevent ReDoS and memory exhaustion (e.g., usernames: 3–50 chars, emails: max 254 chars, bios/comments: max 1000 chars).
3. **Format & Regex Patterns**:
   - Emails must match RFC 5322 regex.
   - Phone numbers must match E.164 format.
   - Slugs, IDs, UUIDs must strictly conform to allowed character sets (e.g., `^[a-zA-Z0-9_-]+$`).
4. **Disallow Extra/Unexpected Fields**:
   - In Pydantic (FastAPI): `model_config = ConfigDict(extra='forbid')`.
   - In Zod (TypeScript): `schema.strict()`.
   - This prevents parameter tampering and mass-assignment vulnerabilities.

---

## 3. Codebase Secrets & Sensitive Data Scanning

Ensure zero hardcoded credentials exist and sensitive values are never leaked to client bundles or VCS.

### Secrets Policy
- **Zero Secrets in Git**: No API keys, database URLs, SMTP passwords, JWT secrets, or tokens committed to source control.
- **Environment Variables Only**:
  - Local development: Load from local untracked `.env` (with `.env.example` committed having dummy values).
  - Staging / Production: Read directly from environment variables injected by orchestrators (Docker, Kubernetes, AWS Secrets Manager, Vercel, Railway).
- **Frontend Leakage Isolation**:
  - In Vite: Only variables prefixed with `VITE_` are bundled into the client. **Never** prefix backend keys (e.g. Stripe Secret Keys, Razorpay Secrets, DB Passwords) with `VITE_` or `NEXT_PUBLIC_`.
  - In React/Vue: Scan built JavaScript bundles in `dist/` to verify no secret tokens are embedded.

### Secrets Scanning Workflow
Run the automated secrets scanner before any commit or release:
```bash
python .agents/skills/security-hardening/scripts/scan_secrets.py
```
Or manually run targeted grep patterns:
```bash
# Check for common secret tokens and keys
git grep -E -i "api[_-]?key|secret[_-]?key|auth[_-]?token|password|bearer|private[_-]?key" -- ":!.env*" ":!*.test.*"
```

*Helper Script:* See [scan_secrets.py](./scripts/scan_secrets.py).

---

## 4. Dependency Vulnerability Auditing

Continuously identify and patch third-party dependencies with known CVEs.

### Audit Workflow
1. **Frontend / Node.js**:
   ```bash
   npm audit --audit-level=moderate
   ```
   - For auto-patching safe semver updates: `npm audit fix`.
   - For breaking major updates, inspect release notes and test thoroughly before running `npm audit fix --force`.
2. **Backend / Python**:
   ```bash
   pip-audit -r backend/requirements.txt
   # Or using safety:
   safety check
   ```
3. **Vulnerability Triage Matrix**:
   - **CRITICAL**: Immediate blocker. Deploy patch or work around within 24 hours.
   - **HIGH**: Prioritize for next patch release. Check exploitability in application context.
   - **MEDIUM / LOW**: Update during regular sprint dependency maintenance.

*Helper Script:* Run the unified project dependency audit:
```bash
bash .agents/skills/security-hardening/scripts/audit_dependencies.sh
```

---

## 5. Safe Error Handling & Information Leakage Prevention

Prevent stack traces, internal paths, and database internals from reaching users or API consumers.

### Rules for Safe Errors
1. **Never Expose Internals to the Client**:
   - No stack traces (tracebacks).
   - No database schema details, SQL queries, table names, or raw constraint errors (e.g., `psycopg2.errors.UniqueViolation`).
   - No internal server file paths (`/Users/...`, `/var/app/...`).
   - No framework or library version banners (`Server: Apache/2.4.41`, `X-Powered-By: Express`).
2. **Unified Error Envelope**:
   Return a standardized, sanitized JSON envelope for all 4xx/5xx responses:
   ```json
   {
     "error": "An unexpected error occurred. Please try again later.",
     "code": "INTERNAL_SERVER_ERROR",
     "request_id": "req-9b8c2d1e-45fa"
   }
   ```
3. **Structured Server-Side Logging**:
   - Log full stack traces, contextual metadata, and request payloads **server-side** at `ERROR` level.
   - Include a unique `request_id` in both the server log and the response body so operators can correlate client reports with server logs.
   - **Mask Sensitive Fields in Logs**: Automatically redact passwords, credit card numbers, auth tokens, and PII from log output.

---

## 6. Secure File Upload Pipeline

File uploads are a high-risk attack vector. Enforce defensive controls at every layer.

### Upload Security Checklist
1. **Content & Magic Byte Inspection**:
   - **Never trust file extensions or client-sent `Content-Type` headers** (an attacker can upload a PHP or shell script named `avatar.jpg` with `Content-Type: image/jpeg`).
   - Inspect the file header bytes (magic numbers) using `python-magic`, `filetype`, or binary buffer checks.
   - Whitelist allowed MIME types strictly (e.g., `image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
2. **Strict Size Limits**:
   - Enforce a maximum file size (e.g., 5MB for images, 20MB for documents) at the reverse proxy (Nginx/Cloudflare) AND application layer.
   - Stream upload bytes with a running counter; abort if the limit is exceeded to prevent Denial of Service (disk/memory fill).
3. **Sanitized & Randomized Storage Filename**:
   - Discard the client-supplied filename for storage.
   - Generate a cryptographically random filename (e.g., `uuid.uuid4().hex + safe_extension`).
   - Prevent Path Traversal (`../../etc/passwd`).
4. **Storage Outside Web Root & Execution Prevention**:
   - **Store files outside the web document root** or in an isolated object store (S3, Cloudflare R2, Google Cloud Storage, private mount).
   - If stored on a local filesystem, set permissions to read-only (`chmod 0644`) and mount the partition with `noexec`.
   - Never allow web servers to execute scripts in the upload folder.
5. **Safe Serving Headers**:
   When serving or downloading user-uploaded files, enforce:
   - `Content-Disposition: attachment; filename="safe_name.ext"` (or inline for approved images).
   - `X-Content-Type-Options: nosniff`.
   - Restrictive `Content-Security-Policy: default-src 'none'`.

*Deep dive & reference implementations:* See [File Upload Security Guide](./references/file_upload_security.md).

---

## Verification & Audit Checklist

When conducting an audit with this skill, review and check off all items:

- [ ] **Rate Limiting**:
  - [ ] Strict rate limits on login, signup, password reset, OTP verification.
  - [ ] Dual-key throttling (per-IP and per-account identifier).
  - [ ] Exponential backoff active (no hard lockouts).
  - [ ] All three salts (`IP_SALT`, `ACCOUNT_SALT`, `GLOBAL_SALT`) loaded from environment variables.
  - [ ] Moderate limits on public endpoints.
  - [ ] Looser limits on authenticated user endpoints.
- [ ] **Input Validation**:
  - [ ] Schemas defined for all input payloads (Pydantic / Zod).
  - [ ] Extra/unknown fields explicitly forbidden.
  - [ ] Strings bounded by `min_length` and `max_length`.
  - [ ] Rejections return 422/400 without falling back to partial sanitization.
- [ ] **Secrets & Configuration**:
  - [ ] Zero hardcoded secrets in repository.
  - [ ] `.env` ignored in `.gitignore`.
  - [ ] `.env.example` contains only placeholder values.
  - [ ] No private keys or tokens exposed to frontend bundles (`VITE_` variables audited).
  - [ ] Production loads secrets strictly from environment variables.
- [ ] **Dependency Audit**:
  - [ ] `npm audit` / `pip-audit` executed without unmitigated High/Critical CVEs.
- [ ] **Error Handling**:
  - [ ] Global exception handlers catch unhandled errors.
  - [ ] Clients receive generic messages with correlation `request_id`.
  - [ ] Detailed tracebacks and database errors logged only to secure server logs.
- [ ] **File Uploads**:
  - [ ] Magic byte inspection validates actual file content.
  - [ ] File size limits strictly enforced.
  - [ ] Filenames randomized via UUID; user filenames sanitized.
  - [ ] Uploads stored outside web root or in dedicated object storage.
  - [ ] Uploaded directory has execution disabled (`noexec`, non-executable permissions).

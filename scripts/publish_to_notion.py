#!/usr/bin/env python3
"""
BloomCakes Notion Publisher Script
Converts Markdown technical documentation into Notion blocks and publishes
it directly to a target Notion workspace page via the official Notion REST API.

Usage:
    python scripts/publish_to_notion.py --token <NOTION_API_KEY> --page-id <NOTION_PAGE_ID> [--file docs/TECHNICAL_SPECIFICATION.md]

Environment Variables:
    NOTION_API_KEY: Notion Internal Integration Secret (starts with 'secret_...')
    NOTION_PAGE_ID: Target parent Notion page ID or URL
"""

import os
import re
import sys
import time
import argparse
from typing import List, Dict, Any
import requests

NOTION_VERSION = "2022-06-28"
NOTION_API_BASE = "https://api.notion.com/v1"

def clean_page_id(raw_id: str) -> str:
    """Extract standard UUID from raw page ID or full Notion URL."""
    # Remove query parameters
    raw = raw_id.split("?")[0]
    # Extract last 32 hex characters if a URL or slug is given
    hex_chars = "".join(c for c in raw if c in "0123456789abcdefABCDEF")
    if len(hex_chars) >= 32:
        clean = hex_chars[-32:]
        return f"{clean[0:8]}-{clean[8:12]}-{clean[12:16]}-{clean[16:20]}-{clean[20:32]}"
    return raw_id.strip()

def chunk_text(text: str, max_chars: int = 1900) -> List[str]:
    """Split text to ensure it never exceeds Notion's 2000-character limit per rich text block."""
    if len(text) <= max_chars:
        return [text]
    chunks = []
    while text:
        chunks.append(text[:max_chars])
        text = text[max_chars:]
    return chunks

def make_rich_text(content: str) -> List[Dict[str, Any]]:
    """Build Notion rich_text object array."""
    chunks = chunk_text(content)
    return [{"type": "text", "text": {"content": c}} for c in chunks]

def parse_markdown_to_blocks(md_content: str) -> List[Dict[str, Any]]:
    """Parse common Markdown elements into Notion API block structures."""
    blocks: List[Dict[str, Any]] = []
    lines = md_content.split("\n")
    
    in_code_block = False
    code_lang = "plain text"
    code_buffer: List[str] = []

    in_table = False
    table_rows: List[List[str]] = []

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            in_table = False
            return
        
        # Calculate width
        width = max(len(row) for row in table_rows)
        # Pad shorter rows
        padded_rows = [row + [""] * (width - len(row)) for row in table_rows]
        
        row_blocks = []
        for row in padded_rows:
            cells = [make_rich_text(cell.strip()) for cell in row]
            row_blocks.append({
                "type": "table_row",
                "table_row": {"cells": cells}
            })
            
        blocks.append({
            "object": "block",
            "type": "table",
            "table": {
                "table_width": width,
                "has_column_header": True,
                "has_row_header": False,
                "children": row_blocks[:99] # Notion limits children per table block
            }
        })
        table_rows = []
        in_table = False

    for line in lines:
        stripped = line.strip()

        # Handle Code Blocks
        if stripped.startswith("```"):
            if in_code_block:
                code_text = "\n".join(code_buffer)
                blocks.append({
                    "object": "block",
                    "type": "code",
                    "code": {
                        "rich_text": make_rich_text(code_text),
                        "language": code_lang.lower() if code_lang else "plain text"
                    }
                })
                code_buffer = []
                in_code_block = False
            else:
                if in_table:
                    flush_table()
                in_code_block = True
                lang = stripped[3:].strip()
                # Map to supported Notion languages
                supported_langs = {"python", "javascript", "typescript", "json", "html", "css", "sql", "bash", "shell", "markdown", "yaml"}
                code_lang = lang if lang in supported_langs else ("bash" if lang == "sh" else "plain text")
            continue

        if in_code_block:
            code_buffer.append(line)
            continue

        # Handle Tables
        if "|" in stripped and stripped.startswith("|") and stripped.endswith("|"):
            cells = [c.strip() for c in stripped[1:-1].split("|")]
            # Check if separator row (e.g. |---|---|)
            if all(re.match(r"^:?-+:?$", c) for c in cells):
                continue
            in_table = True
            table_rows.append(cells)
            continue
        elif in_table:
            flush_table()

        # Handle Horizontal Dividers
        if stripped in ("---", "***", "___"):
            blocks.append({
                "object": "block",
                "type": "divider",
                "divider": {}
            })
            continue

        # Handle Headings
        if stripped.startswith("# "):
            blocks.append({
                "object": "block",
                "type": "heading_1",
                "heading_1": {"rich_text": make_rich_text(stripped[2:].strip())}
            })
            continue
        elif stripped.startswith("## "):
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": make_rich_text(stripped[3:].strip())}
            })
            continue
        elif stripped.startswith("### "):
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": make_rich_text(stripped[4:].strip())}
            })
            continue

        # Handle Blockquotes / Callouts
        if stripped.startswith("> "):
            callout_text = stripped[2:].strip()
            blocks.append({
                "object": "block",
                "type": "callout",
                "callout": {
                    "rich_text": make_rich_text(callout_text),
                    "icon": {"emoji": "📌"}
                }
            })
            continue

        # Handle Bulleted Lists
        if stripped.startswith(("- ", "* ", "+ ")):
            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": make_rich_text(stripped[2:].strip())}
            })
            continue

        # Handle Numbered Lists
        match_numbered = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if match_numbered:
            blocks.append({
                "object": "block",
                "type": "numbered_list_item",
                "numbered_list_item": {"rich_text": make_rich_text(match_numbered.group(2).strip())}
            })
            continue

        # Regular Paragraph
        if stripped:
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": make_rich_text(stripped)}
            })

    if in_table:
        flush_table()

    return blocks

def publish_document(token: str, parent_page_id: str, title: str, file_path: str):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION
    }

    clean_id = clean_page_id(parent_page_id)
    print(f"[*] Reading source documentation: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    print("[*] Parsing markdown into Notion blocks...")
    all_blocks = parse_markdown_to_blocks(md_content)
    print(f"[+] Generated {len(all_blocks)} Notion blocks.")

    # 1. Create the parent page with first 100 blocks
    first_batch = all_blocks[:100]
    remaining_blocks = all_blocks[100:]

    payload = {
        "parent": {"page_id": clean_id},
        "properties": {
            "title": [
                {
                    "text": {
                        "content": title
                    }
                }
            ]
        },
        "children": first_batch
    }

    print(f"[*] Creating new child page in Notion under: {clean_id}...")
    res = requests.post(f"{NOTION_API_BASE}/pages", headers=headers, json=payload)
    if res.status_code != 200:
        print(f"[!] Error creating page (Status {res.status_code}):", file=sys.stderr)
        print(res.text, file=sys.stderr)
        sys.exit(1)

    page_data = res.json()
    new_page_id = page_data["id"]
    new_page_url = page_data.get("url", f"https://www.notion.so/{new_page_id.replace('-', '')}")
    print(f"[+] Page created successfully: {new_page_url}")

    # 2. Append remaining blocks in batches of 100
    batch_size = 100
    for i in range(0, len(remaining_blocks), batch_size):
        batch = remaining_blocks[i:i + batch_size]
        print(f"[*] Appending blocks {100 + i + 1} to {100 + i + len(batch)}...")
        append_res = requests.patch(
            f"{NOTION_API_BASE}/blocks/{new_page_id}/children",
            headers=headers,
            json={"children": batch}
        )
        if append_res.status_code != 200:
            print(f"[!] Error appending block batch (Status {append_res.status_code}):", file=sys.stderr)
            print(append_res.text, file=sys.stderr)
        time.sleep(0.35) # Comply with Notion's 3 requests/sec rate limit

    print("\n========================================================")
    print("       Documentation Published Successfully to Notion!   ")
    print(f"Page Title: {title}")
    print(f"Notion URL: {new_page_url}")
    print("========================================================")

def main():
    parser = argparse.ArgumentParser(description="Publish BloomCakes technical documentation to Notion.")
    parser.add_argument("--token", default=os.getenv("NOTION_API_KEY"), help="Notion Internal Integration Token (secret_...)")
    parser.add_argument("--page-id", default=os.getenv("NOTION_PAGE_ID"), help="Target parent Notion Page ID or Page URL")
    parser.add_argument("--file", default="docs/TECHNICAL_SPECIFICATION.md", help="Markdown document file to publish")
    parser.add_argument("--title", default="BloomCakes - System Technical Specification", help="Page Title in Notion")

    args = parser.parse_args()

    if not args.token or not args.page_id:
        print("[!] Missing required Notion credentials.", file=sys.stderr)
        print("\nPlease provide either command-line arguments:")
        print("  python scripts/publish_to_notion.py --token <NOTION_API_KEY> --page-id <NOTION_PAGE_ID>\n")
        print("Or set the environment variables:")
        print("  export NOTION_API_KEY='secret_...'")
        print("  export NOTION_PAGE_ID='your-page-id-or-url'")
        sys.exit(1)

    if not os.path.exists(args.file):
        print(f"[!] Error: File not found: {args.file}", file=sys.stderr)
        sys.exit(1)

    publish_document(args.token, args.page_id, args.title, args.file)

if __name__ == "__main__":
    main()

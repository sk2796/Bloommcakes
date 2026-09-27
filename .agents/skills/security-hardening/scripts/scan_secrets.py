#!/usr/bin/env python3
"""
Automated Secrets and Sensitive Data Scanner.
Scans repository for hardcoded API keys, secrets, tokens, passwords,
validates .gitignore coverage, and checks for sensitive frontend leaks.
"""

import os
import re
import sys
from pathlib import Path

# Sensitive regex patterns
PATTERNS = [
    (r"(?i)(?:api_key|apikey|secret_key|secretkey|app_secret|auth_token|access_token|private_key)[\s]*[=:]\s*['\"][a-zA-Z0-9_\-\.]{16,}['\"]", "High-entropy API key or secret token assignment"),
    (r"(?i)(?:password|passwd|pwd)[\s]*[=:]\s*['\"][^'\"]{6,}['\"]", "Hardcoded password assignment"),
    (r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----", "Private cryptographic key"),
    (r"ghp_[0-9a-zA-Z]{36}", "GitHub Personal Access Token"),
    (r"xox[baprs]-[0-9a-zA-Z]{10,48}", "Slack API Token"),
    (r"rzp_(?:live|test)_[0-9a-zA-Z]{14}", "Razorpay Key ID"),
    (r"sk_live_[0-9a-zA-Z]{24}", "Stripe Live Secret Key"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"(?i)mongodb(?:\+srv)?://[^\s'\"]+:[^\s'\"]+@[^\s'\"]+", "MongoDB connection string with credentials"),
    (r"(?i)postgres(?:ql)?://[^\s'\"]+:[^\s'\"]+@[^\s'\"]+", "PostgreSQL connection string with credentials"),
]

# Paths to ignore
IGNORE_DIRS = {
    ".git", "node_modules", "dist", ".venv", "__pycache__",
    ".idea", ".vscode", "test-results", "playwright-report",
    ".agents"
}

IGNORE_FILES = {
    ".env.example", "package-lock.json", "skills-lock.json"
}

def is_test_file(path_str: str) -> bool:
    return any(p in path_str for p in [".test.", ".spec.", "__tests__", "e2e/"])

def check_gitignore(repo_root: Path):
    gitignore_path = repo_root / ".gitignore"
    findings = []
    if not gitignore_path.exists():
        findings.append("CRITICAL: .gitignore does not exist in repo root!")
        return findings
    
    content = gitignore_path.read_text(encoding="utf-8", errors="ignore")
    if ".env" not in content:
        findings.append("WARNING: '.env' is not listed in .gitignore")
    return findings

def scan_files(repo_root: Path):
    findings = []
    for root, dirs, files in os.walk(repo_root):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file in IGNORE_FILES:
                continue
            if file.endswith((".pyc", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".xlsx", ".pdf", ".lock")):
                continue
            
            file_path = Path(root) / file
            rel_path = file_path.relative_to(repo_root)
            
            # Special check for .env files that are not .env.example
            if file.startswith(".env") and file != ".env.example":
                # Check if it is tracked by git
                is_tracked = os.system(f"git ls-files --error-unmatch '{rel_path}' >/dev/null 2>&1") == 0
                if is_tracked:
                    findings.append({
                        "file": str(rel_path),
                        "line": 0,
                        "issue": "CRITICAL: Sensitive environment file is TRACKED by git!",
                        "match": file
                    })
                else:
                    # File exists locally and is untracked
                    pass
                continue
            
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line_no, line in enumerate(f, 1):
                        # Skip comment lines
                        stripped = line.strip()
                        if stripped.startswith(("#", "//", "/*", "*")):
                            continue
                        
                        # Special check for frontend files exposing non-public credentials
                        if "src/" in str(rel_path) or "public/" in str(rel_path):
                            if re.search(r"(?i)(?:secret|private|admin_key)", line) and "VITE_" in line:
                                findings.append({
                                    "file": str(rel_path),
                                    "line": line_no,
                                    "issue": "Potential private secret exposed via frontend VITE_ variable",
                                    "match": line.strip()
                                })
                        
                        for pattern, desc in PATTERNS:
                            if is_test_file(str(rel_path)) and "password" in desc.lower():
                                continue
                            matches = re.findall(pattern, line)
                            if matches:
                                findings.append({
                                    "file": str(rel_path),
                                    "line": line_no,
                                    "issue": desc,
                                    "match": line.strip()
                                })
            except Exception as e:
                pass
    return findings

def main():
    repo_root = Path(os.getcwd())
    print(f"[*] Scanning repository at: {repo_root}")
    
    # 1. Check .gitignore
    gi_issues = check_gitignore(repo_root)
    for issue in gi_issues:
        print(f"[!] {issue}")
        
    # 2. Scan files
    issues = scan_files(repo_root)
    
    print("\n--- Scan Results ---")
    if not issues and not gi_issues:
        print("[+] No hardcoded secrets or sensitive leaks detected. Codebase clean.")
        sys.exit(0)
    else:
        print(f"[-] Detected {len(issues)} potential secret/leak findings:")
        for idx, item in enumerate(issues, 1):
            print(f"  {idx}. [{item['issue']}] {item['file']}:{item['line']}")
            snippet = item['match']
            if len(snippet) > 80:
                snippet = snippet[:77] + "..."
            print(f"     Snippet: {snippet}")
        sys.exit(1)

if __name__ == "__main__":
    main()

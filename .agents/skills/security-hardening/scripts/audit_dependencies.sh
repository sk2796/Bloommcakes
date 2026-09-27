#!/usr/bin/env bash
# Unified Dependency Vulnerability Audit Script
# Audits both Node.js (frontend) and Python (backend) ecosystems.

set -euo pipefail

echo "========================================================"
echo "          Unified Dependency Security Audit             "
echo "========================================================"

OVERALL_STATUS=0

# 1. Frontend / Node.js Audit
if [ -f "package.json" ]; then
    echo -e "\n[+] Auditing Node.js dependencies (package.json)..."
    if command -v npm &> /dev/null; then
        # Run npm audit
        if npm audit --audit-level=moderate; then
            echo "[OK] No moderate or higher vulnerabilities in Node dependencies."
        else
            echo "[WARN] Vulnerabilities detected in Node.js dependencies."
            echo "       Run 'npm audit' for breakdown, or 'npm audit fix' for safe semver upgrades."
            OVERALL_STATUS=1
        fi
    else
        echo "[!] npm command not found; skipping Node audit."
    fi
fi

# 2. Backend / Python Audit
if [ -f "backend/requirements.txt" ] || [ -f "requirements.txt" ]; then
    REQ_FILE="backend/requirements.txt"
    [ ! -f "$REQ_FILE" ] && REQ_FILE="requirements.txt"
    echo -e "\n[+] Auditing Python dependencies ($REQ_FILE)..."
    
    # Check for pip-audit in active environment or venv
    PIP_AUDIT_CMD=""
    if command -v pip-audit &> /dev/null; then
        PIP_AUDIT_CMD="pip-audit"
    elif [ -f ".venv/bin/pip-audit" ]; then
        PIP_AUDIT_CMD=".venv/bin/pip-audit"
    fi

    if [ -n "$PIP_AUDIT_CMD" ]; then
        if $PIP_AUDIT_CMD -r "$REQ_FILE"; then
            echo "[OK] No known vulnerabilities found in Python dependencies."
        else
            echo "[WARN] Vulnerabilities detected in Python dependencies."
            OVERALL_STATUS=1
        fi
    elif command -v safety &> /dev/null; then
        if safety check -r "$REQ_FILE"; then
            echo "[OK] No vulnerabilities reported by safety."
        else
            echo "[WARN] Vulnerabilities reported by safety."
            OVERALL_STATUS=1
        fi
    else
        echo "[!] Neither 'pip-audit' nor 'safety' is installed."
        echo "    Install with: pip install pip-audit (or activate .venv)"
    fi
fi

echo -e "\n========================================================"
if [ "$OVERALL_STATUS" -eq 0 ]; then
    echo "Audit Complete: All audited package ecosystems passed!"
else
    echo "Audit Complete: Action required to resolve flagged packages."
fi
echo "========================================================"

exit "$OVERALL_STATUS"

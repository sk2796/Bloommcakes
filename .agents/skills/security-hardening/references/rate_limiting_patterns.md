# Rate Limiting & Abuse Prevention Reference Guide

This reference details the implementation architecture for tiered rate limiting, dual-key throttling, exponential backoff, and cryptographic salt configuration.

---

## Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Incoming HTTP Request  │
                          └─────────────┬────────────┘
                                        │
                         Endpoint Classification Check
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           ▼                            ▼                           ▼
    [Strict Tier]                [Moderate Tier]              [Loose Tier]
  Auth Routes (/login)        Public Read (/products)     User Actions (/orders)
           │                            │                           │
  Dual-Key Extraction          Extract Client IP          Extract User / Auth ID
 (IP + Account Identifier)              │                           │
           │                     Hash with IP_SALT          Hash with ACCOUNT_SALT
   Hash with Salts                      │                           │
(IP_SALT & ACCOUNT_SALT)                ▼                           ▼
           │                     Sliding Window              Sliding Window
           ▼                     Standard Limit              Higher Limit
 Exponential Backoff             (e.g., 60/min)             (e.g., 120/min)
    Rate Limiter                        │                           │
           │                            └─────────────┬─────────────┘
           ▼                                          │
   Within Threshold?                                  ▼
      ├── No  ──► 429 Too Many Requests (with Retry-After header)
      └── Yes ──► Proceed to Route Handler
```

---

## 1. Configurable Cryptographic Salts

### Why Salts Are Mandatory
- **Privacy & Anonymization**: IP addresses and emails are Personally Identifiable Information (PII). Storing them in raw rate-limit caches (e.g., Redis or in-memory tables) exposes them in case of memory dumps or log leaks.
- **Cross-Service Unlinkability**: Different salts ensure that identifiers cannot be correlated across different environments or microservices.
- **Tamper & Rainbow Table Protection**: Salting prevents precomputed dictionary attacks on rate limit keys.

### The Three Configurable Salts
1. **`IP_SALT`**: Used to hash client IP addresses.
2. **`ACCOUNT_SALT`**: Used to hash account identifiers (emails, usernames, customer IDs).
3. **`GLOBAL_SALT` (or `ROUTE_SALT`)**: Used to hash generic route keys, session IDs, or combined scope identifiers.

### Configuration Best Practice
Load salts from environment variables with strong runtime warnings if default values are detected:
```python
import os
import hashlib
import logging

logger = logging.getLogger(__name__)

IP_SALT = os.getenv("IP_SALT")
ACCOUNT_SALT = os.getenv("ACCOUNT_SALT")
GLOBAL_SALT = os.getenv("GLOBAL_SALT")

if not all([IP_SALT, ACCOUNT_SALT, GLOBAL_SALT]):
    logger.warning("One or more rate limiting salts are missing! Using development fallbacks. Do not use in production.")
    IP_SALT = IP_SALT or "dev_fallback_ip_salt"
    ACCOUNT_SALT = ACCOUNT_SALT or "dev_fallback_account_salt"
    GLOBAL_SALT = GLOBAL_SALT or "dev_fallback_global_salt"

def hash_identifier(raw_value: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{raw_value}".encode("utf-8")).hexdigest()
```

---

## 2. Exponential Backoff vs. Hard Lockouts

### The Flaw with Hard Lockouts
If an authentication route locks an account for 1 hour after 5 failed attempts, an attacker can trivially execute a Denial of Service (DoS) attack against any user by simply sending 5 bad passwords for their known email address.

### The Exponential Backoff Solution
Instead of a binary lockout:
1. Allow a grace threshold of initial failed attempts (e.g., 5 attempts).
2. For every consecutive failure after the threshold:
   $$\text{wait\_seconds} = \text{base\_delay} \times 2^{(\text{failures} - \text{max\_attempts})}$$
   - Attempt 5: No extra delay.
   - Attempt 6: $1 \times 2^1 = 2$ seconds.
   - Attempt 7: $1 \times 2^2 = 4$ seconds.
   - Attempt 8: $1 \times 2^3 = 8$ seconds.
   - Attempt 9: $1 \times 2^4 = 16$ seconds.
   - Attempt 10: $1 \times 2^5 = 32$ seconds.
   - Cap maximum delay at e.g., 900 seconds (15 minutes).
3. Enforce the delay: If a request arrives before the required wait window expires, immediately reject with `429 Too Many Requests` and set `Retry-After: <seconds_remaining>`.
4. Reset on Success: When authentication succeeds, reset the failure counter to 0 immediately.
5. Inactivity Decay: Reset failures if no attempts occur within a configured inactivity window (e.g., 15–30 minutes).

---

## 3. Production FastAPI Implementation Blueprint

```python
import os
import time
import hashlib
from typing import Optional
from fastapi import Request, HTTPException, status

class TieredRateLimiter:
    def __init__(self):
        self.records = {}
        
        # Salt configuration
        self.ip_salt = os.getenv("IP_SALT", "default_ip_salt")
        self.account_salt = os.getenv("ACCOUNT_SALT", "default_account_salt")
        self.global_salt = os.getenv("GLOBAL_SALT", "default_global_salt")
        
        # Limits
        self.strict_limit = int(os.getenv("RATE_LIMIT_STRICT_COUNT", "5"))
        self.strict_window = int(os.getenv("RATE_LIMIT_STRICT_WINDOW", "900")) # 15 min
        
        self.moderate_limit = int(os.getenv("RATE_LIMIT_MODERATE_COUNT", "60"))
        self.moderate_window = int(os.getenv("RATE_LIMIT_MODERATE_WINDOW", "60"))
        
        self.loose_limit = int(os.getenv("RATE_LIMIT_LOOSE_COUNT", "120"))
        self.loose_window = int(os.getenv("RATE_LIMIT_LOOSE_WINDOW", "60"))

    def _hash(self, val: str, salt: str) -> str:
        return hashlib.sha256(f"{salt}:{val}".encode()).hexdigest()

    def check_auth_limit(self, request: Request, account_identifier: Optional[str] = None):
        client_ip = request.client.host if request.client else "unknown"
        hashed_ip = self._hash(client_ip, self.ip_salt)
        
        # Check IP
        self._evaluate_exponential(hashed_ip, self.strict_limit)
        
        # Check Account identifier if available
        if account_identifier:
            hashed_account = self._hash(account_identifier.strip().lower(), self.account_salt)
            self._evaluate_exponential(hashed_account, self.strict_limit)

    def _evaluate_exponential(self, key: str, max_attempts: int, base_delay: int = 1):
        now = time.time()
        record = self.records.setdefault(key, {"timestamps": [], "failures": 0, "last_attempt": 0})
        
        # Decay if idle for window
        if now - record["last_attempt"] > self.strict_window:
            record["failures"] = 0
            
        record["last_attempt"] = now
        
        if record["failures"] >= max_attempts:
            exponent = min(record["failures"] - max_attempts, 10)
            required_wait = base_delay * (2 ** exponent)
            
            time_since_last = now - (record["timestamps"][-1] if record["timestamps"] else 0)
            if time_since_last < required_wait:
                retry_after = int(required_wait - time_since_last)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many attempts. Please try again in {retry_after} seconds.",
                    headers={"Retry-After": str(max(1, retry_after))}
                )
        record["timestamps"].append(now)

    def record_auth_failure(self, request: Request, account_identifier: Optional[str] = None):
        client_ip = request.client.host if request.client else "unknown"
        hashed_ip = self._hash(client_ip, self.ip_salt)
        if hashed_ip in self.records:
            self.records[hashed_ip]["failures"] += 1
            
        if account_identifier:
            hashed_account = self._hash(account_identifier.strip().lower(), self.account_salt)
            if hashed_account in self.records:
                self.records[hashed_account]["failures"] += 1

    def record_auth_success(self, request: Request, account_identifier: Optional[str] = None):
        client_ip = request.client.host if request.client else "unknown"
        hashed_ip = self._hash(client_ip, self.ip_salt)
        if hashed_ip in self.records:
            self.records[hashed_ip]["failures"] = 0
            
        if account_identifier:
            hashed_account = self._hash(account_identifier.strip().lower(), self.account_salt)
            if hashed_account in self.records:
                self.records[hashed_account]["failures"] = 0
```

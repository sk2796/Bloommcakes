import { test, expect } from '@playwright/test';

const API_BASE = 'http://127.0.0.1:8000';

test.describe('Security Hardening & Protection E2E Tests', () => {

  test.beforeEach(async ({ request }) => {
    // Reset rate limiter records before each test for clean test isolation
    await request.post(`${API_BASE}/api/test/reset-rate-limits`).catch(() => {});
  });

  test('1. Strict Rate Limiting: Authentication endpoints trigger 429 and Retry-After header on abuse', async ({ request }) => {
    const testEmail = `attacker-${Date.now()}@example.com`;
    let got429 = false;
    let retryAfterHeader = null;

    // Send rapid repeated failed login attempts
    for (let i = 0; i < 12; i++) {
      const response = await request.post(`${API_BASE}/admin/auth/login`, {
        data: {
          email: testEmail,
          password: 'WrongPassword123!',
        },
      });

      if (response.status() === 429) {
        got429 = true;
        retryAfterHeader = response.headers()['retry-after'];
        const body = await response.json();
        expect(body.detail).toMatch(/too many attempts/i);
        break;
      }
    }

    expect(got429).toBe(true);
    expect(retryAfterHeader).toBeDefined();
    expect(Number(retryAfterHeader)).toBeGreaterThan(0);
  });

  test('2. Strict Schema Validation: Unexpected fields and schema violations are immediately rejected with 422', async ({ request }) => {
    // Test extra/forbidden field injection
    const responseWithExtra = await request.post(`${API_BASE}/admin/pincodes`, {
      data: {
        pincode: '380099',
        city: 'Ahmedabad',
        state: 'Gujarat',
        injected_malicious_field: 'drop table users;',
      },
    });

    // Must be rejected with 422 Unprocessable Entity
    expect(responseWithExtra.status()).toBe(422);
    const bodyExtra = await responseWithExtra.json();
    expect(JSON.stringify(bodyExtra)).toMatch(/extra.*not permitted|extra_forbidden/i);

    // Test format validation violation (invalid 4-digit pincode instead of 6 digits)
    const responseInvalidFormat = await request.post(`${API_BASE}/admin/pincodes`, {
      data: {
        pincode: '1234',
        city: 'Ahmedabad',
        state: 'Gujarat',
      },
    });

    expect(responseInvalidFormat.status()).toBe(422);
  });

  test('3. Information Leakage Prevention: Internal errors do not leak stack traces or file paths', async ({ request }) => {
    // Attempt invalid input to trigger error handler
    const response = await request.get(`${API_BASE}/customers/verify-reset-token?token=non_existent_token_12345`);
    
    // Should return 400 Bad Request, never exposing server paths or raw DB statements
    expect(response.status()).toBe(400);
    const body = await response.json();
    const textContent = JSON.stringify(body);

    // Assert zero internal paths or tracebacks leak
    expect(textContent).not.toMatch(/\/Users\//i);
    expect(textContent).not.toMatch(/Traceback \(most recent call last\)/i);
    expect(textContent).not.toMatch(/pymysql|sqlalchemy|select.*from/i);
  });

  test('4. Secure File Upload: Rejects fake/executable scripts and safely stores verified images', async ({ request }) => {
    // A. Attempt to upload an executable bash script disguised with a .png extension
    const fakeScriptContent = Buffer.from('#!/bin/bash\necho "Malicious code execution attempt"\n');
    const fakeUploadRes = await request.post(`${API_BASE}/api/upload`, {
      multipart: {
        file: {
          name: 'shell.png',
          mimeType: 'image/png',
          buffer: fakeScriptContent,
        },
      },
    });

    expect(fakeUploadRes.status()).toBe(400);
    const fakeBody = await fakeUploadRes.json();
    expect(fakeBody.detail).toMatch(/Invalid file format/i);

    // B. Upload a valid PNG image with true magic bytes (\x89PNG\r\n\x1a\n)
    // Minimal 1x1 valid PNG binary buffer
    const validPngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);

    const validUploadRes = await request.post(`${API_BASE}/api/upload`, {
      multipart: {
        file: {
          name: 'custom-cake.png',
          mimeType: 'image/png',
          buffer: validPngBuffer,
        },
      },
    });

    expect(validUploadRes.status()).toBe(200);
    const validBody = await validUploadRes.json();
    expect(validBody.status).toBe('success');
    expect(validBody.filename).toMatch(/^[a-f0-9]{32}\.png$/);
    expect(validBody.mime_type).toBe('image/png');

    // C. Retrieve the stored image and verify security headers (nosniff)
    const getFileRes = await request.get(`${API_BASE}/api/uploads/${validBody.filename}`);
    expect(getFileRes.status()).toBe(200);
    expect(getFileRes.headers()['x-content-type-options']).toBe('nosniff');

    // D. Verify path traversal attempt is safely rejected
    const pathTraversalRes = await request.get(`${API_BASE}/api/uploads/../../etc/passwd`);
    expect(pathTraversalRes.status()).toBe(404);
  });

  test('5. Storefront & Admin RBAC Integration: Normal flows remain operational', async ({ page }) => {
    // Verify customer storefront renders correctly
    await page.goto('/');
    await expect(page).toHaveTitle(/Bloom/i);
    await expect(page.locator('nav')).toBeVisible();

    // Verify admin protection redirect works
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

});

import { test, expect } from '@playwright/test';

test.describe('Admin Portal & RBAC Security E2E', () => {
  test('unauthenticated users accessing /admin are redirected to /admin/login', async ({ page }) => {
    // Navigate directly to protected /admin
    await page.goto('/admin');

    // Should automatically redirect to /admin/login
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.getByRole('heading', { name: /bloomcakes admin/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('super admin can log in and view the admin dashboard', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill credentials
    await page.locator('input[type="email"]').fill('admin@bloomcakes.co');
    await page.locator('input[type="password"]').fill('Admin@Bloom123');

    // Submit
    await page.getByRole('button', { name: /sign in to dashboard/i }).click();

    // Verify redirected to /admin overview
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole('heading', { name: /store performance overview/i })).toBeVisible();

    // Verify Staff & Roles navigation button is visible for super_admin
    await expect(page.getByRole('button', { name: /staff & roles/i })).toBeVisible();
  });

  test('super admin can navigate to Staff & Roles management', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.locator('input[type="email"]').fill('admin@bloomcakes.co');
    await page.locator('input[type="password"]').fill('Admin@Bloom123');
    await page.getByRole('button', { name: /sign in to dashboard/i }).click();

    await expect(page).toHaveURL(/\/admin\/?$/);

    // Navigate to Staff & Roles
    await page.getByRole('button', { name: /staff & roles/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/users/);

    // Verify page elements
    await expect(page.getByRole('heading', { name: /admin staff & access control/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add staff user/i })).toBeVisible();
  });

  test('admin can use common filters to filter and reset data', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.locator('input[type="email"]').fill('admin@bloomcakes.co');
    await page.locator('input[type="password"]').fill('Admin@Bloom123');
    await page.getByRole('button', { name: /sign in to dashboard/i }).click();

    // Navigate to Products
    await page.getByRole('button', { name: /products & menu/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/products/);

    // Verify common filter bar is visible
    const searchInput = page.getByPlaceholder(/search catalog/i);
    await expect(searchInput).toBeVisible();

    // Filter by search query
    await searchInput.fill('chocolate');
    await expect(page.getByText(/showing.*record/i)).toBeVisible();

    // Clear filters using reset button
    const resetBtn = page.getByRole('button', { name: /reset/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await expect(searchInput).toHaveValue('');
    }
  });
});


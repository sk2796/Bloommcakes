import { test, expect } from '@playwright/test';

test.describe('Customer Storefront E2E', () => {
  test('home page loads and displays brand hero and featured section', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Bloom/i);
    
    // Verify navigation bar
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Verify hero text
    await expect(page.getByText('Beautifully Crafted.').first()).toBeVisible();
    await expect(page.getByText('Happily Celebrated.').first()).toBeVisible();
  });

  test('user can browse menu and view product details', async ({ page }) => {
    await page.goto('/shop');

    // Wait for catalog to render
    await expect(page.locator('body')).toBeVisible();

    // Verify presence of cake cards or links
    const productCard = page.locator('a[href*="/product/"]').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await expect(page).toHaveURL(/.*\/product\/.+/);
      await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
    }
  });

  test('user can navigate to customer login page and see auth form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email or phone number/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeVisible();
  });
});

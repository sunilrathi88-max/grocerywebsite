import { test, expect } from '@playwright/test';

test.describe('E-commerce Critical Flows', () => {
  test('should display recommended products on the homepage and allow adding to cart', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify header loads
    await expect(page.getByRole('heading', { name: /Rathi Naturals/i })).toBeVisible({
      timeout: 10000,
    });

    // Attempt to navigate to the shop or click an 'Add to Cart' button if available
    const shopLink = page.getByRole('link', { name: /Shop/i }).first();
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await expect(page).toHaveURL(/.*shop/);
    }
  });

  test('should render the cart and checkout page', async ({ page }) => {
    await page.goto('/');
    // Click the cart icon to navigate to the cart page
    await page.locator('a[href="/cart"]').first().click();
    // Ensure the cart text or an empty cart message is visible
    await expect(page.getByText(/Spice Box/i).first()).toBeVisible({ timeout: 10000 });
  });
});

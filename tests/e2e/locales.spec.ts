import { test, expect } from '@playwright/test';

test('German is served at root', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('p')).toHaveText('Sprache: Deutsch');
});

test('English is served at /en/', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('p')).toHaveText('Language: English');
});

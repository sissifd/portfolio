import { test, expect } from '@playwright/test';

test('hero renders name and role on German page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Christian Sislak');
  await expect(page.locator('.role')).toContainText('Solution Architect');
});

test('language switch navigates from DE to EN and back', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="lang-switch"]');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.click('[data-testid="lang-switch"]');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('CTA button links to contact anchor', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a.cta')).toHaveAttribute('href', '#contact');
});

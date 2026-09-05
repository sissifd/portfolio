import { test, expect } from '@playwright/test';

test('projects section renders placeholder items', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('[data-testid="project-list"] article');
  await expect(items).toHaveCount(2);
});

test('contact section has working mailto link', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('[data-testid="contact-email"]')).toHaveAttribute(
    'href',
    'mailto:chris.sislak@googlemail.com'
  );
});

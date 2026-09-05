import { test, expect } from '@playwright/test';

test('career timeline renders all 7 entries on German page', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('[data-testid="career-timeline"] li');
  await expect(items).toHaveCount(7);
  await expect(items.first()).toContainText('SAP');
});

test('certifications render on English page', async ({ page }) => {
  await page.goto('/en/');
  const certs = page.locator('[data-testid="certifications"] li');
  await expect(certs).toHaveCount(2);
  await expect(certs.first()).toContainText('Generative AI Developer');
});

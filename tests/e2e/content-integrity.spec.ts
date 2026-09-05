import { test, expect } from '@playwright/test';
import de from '../../src/content/site.de';
import en from '../../src/content/site.en';

test('DE and EN content have matching structure', () => {
  expect(en.about.career.length).toBe(de.about.career.length);
  expect(en.about.certifications.length).toBe(de.about.certifications.length);
  expect(en.projects.items.length).toBe(de.projects.items.length);
  expect(en.lang).toBe('en');
  expect(de.lang).toBe('de');
});

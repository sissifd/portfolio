import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    // Astro 7 detects agentic CLI environments (e.g. Claude Code) and forces
    // `astro preview` into a detached background daemon unless this is set,
    // which breaks Playwright's webServer process lifecycle management.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
});

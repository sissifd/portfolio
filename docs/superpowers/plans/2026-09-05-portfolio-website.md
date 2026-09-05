# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (DE/EN) static portfolio website for Christian Sislak using Astro, deployed via GitHub + Vercel, replacing the currently hosted `christiansislak.de` site.

**Architecture:** Astro static site with i18n routing (`/` = German default, `/en/` = English). Content lives in typed data files separate from markup so both locales stay in sync. Four sections (Hero, About, Projects, Contact) render as a single page per locale. Playwright covers the cross-cutting behaviors (locale switching, navigation, contact links) that would otherwise only be checked by hand.

**Tech Stack:** Astro 7.3.1, Node 22, Playwright (E2E), Vercel (hosting + CI-less deploys via Git integration), plain CSS (no framework — see Task 6 for design-system decisions via `design-taste-frontend`).

## Global Constraints

- Framework: Astro (per spec `docs/superpowers/specs/2026-09-05-portfolio-website-design.md`)
- Node version: pin via `.nvmrc` to the major version installed at scaffold time (verify with `node --version` — do not assume)
- No backend, no CMS, no contact form with server processing — contact section is links only (email, LinkedIn, GitHub)
- Content (DE/EN text) must live in data files, never hardcoded twice in markup
- i18n: `/` = German (default locale), `/en/` = English, via Astro's built-in `i18n` config (`astro.config.mjs`), not a third-party i18n library
- Project placeholders use literal `[PLACEHOLDER]` text so they're greppable later
- Visual design (colors, type, spacing) is decided in Task 6 using the `design-taste-frontend` skill — earlier tasks use minimal unstyled/semantic HTML only
- Before DNS cutover: run the `web-design-guidelines` review (Task 8) — accessibility, responsiveness, UX basics
- No dependency on external form services (e.g., Formspree) — out of scope per spec

---

### Task 1: Scaffold Astro project with i18n routing skeleton

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `.nvmrc`
- Create: `.gitignore`
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`
- Test: `tests/e2e/locales.spec.ts`

**Interfaces:**
- Consumes: nothing (first task)
- Produces:
  - Astro project buildable via `npm run build`
  - Two routes: `/` (German) and `/en/` (English), each rendering a `<h1>` with locale-distinguishing text so tests can assert on it
  - `astro.config.mjs` exports `i18n: { defaultLocale: 'de', locales: ['de', 'en'], routing: { prefixDefaultLocale: false } }`

- [ ] **Step 1: Scaffold the Astro project**

Run:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

When prompted (if not fully non-interactive), choose: minimal template, TypeScript strict, no install (we'll install explicitly next).

- [ ] **Step 2: Record the Node version and install dependencies**

```bash
node --version > .nvmrc
sed -i '' 's/^v//' .nvmrc
npm install
```

- [ ] **Step 3: Configure i18n routing in `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 4: Create the German homepage**

`src/pages/index.astro`:
```astro
---
---
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Christian Sislak — Portfolio</title>
  </head>
  <body>
    <h1>Christian Sislak</h1>
    <p>Sprache: Deutsch</p>
  </body>
</html>
```

- [ ] **Step 5: Create the English homepage**

`src/pages/en/index.astro`:
```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Christian Sislak — Portfolio</title>
  </head>
  <body>
    <h1>Christian Sislak</h1>
    <p>Language: English</p>
  </body>
</html>
```

- [ ] **Step 6: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes with no errors, `dist/index.html` and `dist/en/index.html` exist.

Run: `test -f dist/index.html && test -f dist/en/index.html && echo "OK"`
Expected: `OK`

- [ ] **Step 7: Install Playwright and write the first E2E test**

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

`tests/e2e/locales.spec.ts`:
```typescript
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
```

Create `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
});
```

- [ ] **Step 8: Run the test to verify it fails (before build is wired to preview)**

Run: `npx playwright test`
Expected: Tests either fail or pass depending on whether `npm run preview` serves the build — if `dist/` from Step 6 is stale, run `npm run build` first. The point of this step is confirming the test harness actually exercises the page, not a false positive from a cached server.

- [ ] **Step 9: Run build + test to verify pass**

```bash
npm run build
npx playwright test
```
Expected: Both tests PASS.

- [ ] **Step 10: Add `.gitignore` and commit**

`.gitignore`:
```
node_modules/
dist/
.astro/
test-results/
playwright-report/
```

```bash
git add package.json package-lock.json astro.config.mjs .nvmrc .gitignore src/pages/index.astro src/pages/en/index.astro tests/e2e/locales.spec.ts playwright.config.ts
git commit -m "Scaffold Astro project with DE/EN i18n routing"
```

---

### Task 2: Content data layer (DE/EN text separated from markup)

**Files:**
- Create: `src/content/site.de.ts`
- Create: `src/content/site.en.ts`
- Create: `src/content/types.ts`
- Test: `tests/e2e/content-integrity.spec.ts`

**Interfaces:**
- Consumes: nothing new
- Produces:
  - `SiteContent` TypeScript type (from `src/content/types.ts`) — used by every page/component task from here on
  - `site.de.ts` and `site.en.ts` each default-export a `SiteContent` object
  - Shape (exact, used by all later tasks):
    ```typescript
    export interface CareerEntry {
      role: string;
      company: string;
      period: string;
      location: string;
    }

    export interface Certification {
      name: string;
      validUntil: string;
    }

    export interface Project {
      title: string;
      description: string;
      link: string | null;
    }

    export interface SiteContent {
      lang: 'de' | 'en';
      nav: {
        about: string;
        projects: string;
        contact: string;
      };
      hero: {
        name: string;
        role: string;
        pitch: string;
        ctaLabel: string;
      };
      about: {
        heading: string;
        careerHeading: string;
        career: CareerEntry[];
        educationHeading: string;
        education: string;
        certificationsHeading: string;
        certifications: Certification[];
      };
      projects: {
        heading: string;
        items: Project[];
      };
      contact: {
        heading: string;
        email: string;
        linkedin: string;
        github: string;
      };
    }
    ```

- [ ] **Step 1: Write the type definitions**

`src/content/types.ts`:
```typescript
export interface CareerEntry {
  role: string;
  company: string;
  period: string;
  location: string;
}

export interface Certification {
  name: string;
  validUntil: string;
}

export interface Project {
  title: string;
  description: string;
  link: string | null;
}

export interface SiteContent {
  lang: 'de' | 'en';
  nav: {
    about: string;
    projects: string;
    contact: string;
  };
  hero: {
    name: string;
    role: string;
    pitch: string;
    ctaLabel: string;
  };
  about: {
    heading: string;
    careerHeading: string;
    career: CareerEntry[];
    educationHeading: string;
    education: string;
    certificationsHeading: string;
    certifications: Certification[];
  };
  projects: {
    heading: string;
    items: Project[];
  };
  contact: {
    heading: string;
    email: string;
    linkedin: string;
    github: string;
  };
}
```

- [ ] **Step 2: Write the German content file**

`src/content/site.de.ts`:
```typescript
import type { SiteContent } from './types';

const site: SiteContent = {
  lang: 'de',
  nav: {
    about: 'Über mich',
    projects: 'Projekte',
    contact: 'Kontakt',
  },
  hero: {
    name: 'Christian Sislak',
    role: 'Solution Architect — Custom Development & Custom AI',
    pitch:
      'Ich berate Kunden bei kundeneigenen Entwicklungen auf SAP BTP, treibe interne Team- und KI-Initiativen voran und verbinde technische Tiefe mit strategischer Beratung.',
    ctaLabel: 'Kontakt aufnehmen',
  },
  about: {
    heading: 'Über mich',
    careerHeading: 'Werdegang',
    career: [
      {
        role: 'Cloud Solution Architect — Custom Development & Custom AI',
        company: 'SAP',
        period: 'Juli 2024–Heute',
        location: 'Eschborn (Hybrid)',
      },
      {
        role: 'Projektleiter S/4HANA',
        company: 'DB Systel GmbH',
        period: 'Apr. 2020–Juli 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner Team SAP Business Technology Platform',
        company: 'DB Systel GmbH',
        period: 'März 2020–Juli 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner Einheit SAP Mobile',
        company: 'DB Systel GmbH',
        period: 'Jan. 2018–März 2020',
        location: 'Frankfurt/Rhein-Main (Hybrid)',
      },
      {
        role: 'SAP Consultant',
        company: 'DB Systel GmbH',
        period: 'Jan. 2016–Jan. 2018',
        location: 'Frankfurt/Rhein-Main (Hybrid)',
      },
      {
        role: 'Senior Consultant / Consultant',
        company: 'Sopra Steria',
        period: 'März 2013–Dez. 2015',
        location: 'Frankfurt/Rhein-Main',
      },
      {
        role: 'Business Process Consultant',
        company: 'Goodyear Dunlop Tires Germany GmbH',
        period: 'Dez. 2010–Feb. 2013',
        location: 'Fulda',
      },
    ],
    educationHeading: 'Ausbildung',
    education:
      "Bachelor's Degree, Computer Software and Media Applications — Fachhochschule Wiesbaden, 2006–2010",
    certificationsHeading: 'Zertifizierungen',
    certifications: [
      { name: 'SAP Certified Associate – SAP Generative AI Developer', validUntil: 'Juni 2026' },
      { name: 'SAP Certified Professional – Solution Architect, SAP BTP', validUntil: 'Aug. 2026' },
    ],
  },
  projects: {
    heading: 'Projekte',
    items: [
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
    ],
  },
  contact: {
    heading: 'Kontakt',
    email: 'chris.sislak@googlemail.com',
    linkedin: '[PLACEHOLDER]',
    github: '[PLACEHOLDER]',
  },
};

export default site;
```

- [ ] **Step 3: Write the English content file**

`src/content/site.en.ts`:
```typescript
import type { SiteContent } from './types';

const site: SiteContent = {
  lang: 'en',
  nav: {
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    name: 'Christian Sislak',
    role: 'Solution Architect — Custom Development & Custom AI',
    pitch:
      'I advise customers on custom development for SAP BTP, drive internal team and AI initiatives, and connect deep technical expertise with strategic consulting.',
    ctaLabel: 'Get in touch',
  },
  about: {
    heading: 'About Me',
    careerHeading: 'Career',
    career: [
      {
        role: 'Cloud Solution Architect — Custom Development & Custom AI',
        company: 'SAP',
        period: 'Jul 2024–Present',
        location: 'Eschborn (Hybrid)',
      },
      {
        role: 'Project Lead S/4HANA',
        company: 'DB Systel GmbH',
        period: 'Apr 2020–Jul 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner, SAP Business Technology Platform Team',
        company: 'DB Systel GmbH',
        period: 'Mar 2020–Jul 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner, SAP Mobile Unit',
        company: 'DB Systel GmbH',
        period: 'Jan 2018–Mar 2020',
        location: 'Frankfurt/Rhine-Main (Hybrid)',
      },
      {
        role: 'SAP Consultant',
        company: 'DB Systel GmbH',
        period: 'Jan 2016–Jan 2018',
        location: 'Frankfurt/Rhine-Main (Hybrid)',
      },
      {
        role: 'Senior Consultant / Consultant',
        company: 'Sopra Steria',
        period: 'Mar 2013–Dec 2015',
        location: 'Frankfurt/Rhine-Main',
      },
      {
        role: 'Business Process Consultant',
        company: 'Goodyear Dunlop Tires Germany GmbH',
        period: 'Dec 2010–Feb 2013',
        location: 'Fulda',
      },
    ],
    educationHeading: 'Education',
    education:
      "Bachelor's Degree, Computer Software and Media Applications — Fachhochschule Wiesbaden, 2006–2010",
    certificationsHeading: 'Certifications',
    certifications: [
      { name: 'SAP Certified Associate – SAP Generative AI Developer', validUntil: 'Jun 2026' },
      { name: 'SAP Certified Professional – Solution Architect, SAP BTP', validUntil: 'Aug 2026' },
    ],
  },
  projects: {
    heading: 'Projects',
    items: [
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
    ],
  },
  contact: {
    heading: 'Contact',
    email: 'chris.sislak@googlemail.com',
    linkedin: '[PLACEHOLDER]',
    github: '[PLACEHOLDER]',
  },
};

export default site;
```

- [ ] **Step 4: Write a content-integrity test**

This is a structural check, not a browser test — it verifies both locale files stay in sync (same career entry count, same project count), which is the actual risk with hand-duplicated i18n content files.

`tests/e2e/content-integrity.spec.ts`:
```typescript
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
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npx playwright test content-integrity`
Expected: FAIL — Playwright test files without a `page` fixture run as plain Node in `test()` but importing `.astro`-adjacent TS from a non-page context needs `tsconfig` module resolution; if this fails with an import error, that's expected at this point only if files from Step 2/3 aren't saved yet. Since Steps 2–3 already created the files, this should actually PASS. Run it anyway to confirm the assertions are real (temporarily change one array length in `site.en.ts`, rerun to see it FAIL, then revert).

- [ ] **Step 6: Confirm pass after revert**

Run: `npx playwright test content-integrity`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/content/site.de.ts src/content/site.en.ts tests/e2e/content-integrity.spec.ts
git commit -m "Add DE/EN content data layer with typed schema"
```

---

### Task 3: Hero and navigation, wired to content data

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Hero.astro`
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Test: `tests/e2e/hero-nav.spec.ts`

**Interfaces:**
- Consumes: `SiteContent` type and `site.de.ts`/`site.en.ts` from Task 2
- Produces:
  - `BaseLayout.astro` accepts props `{ content: SiteContent }` and renders `<html lang={content.lang}>`, includes `<Nav>` and a `<slot />`
  - `Nav.astro` accepts props `{ content: SiteContent }`, renders anchor links to `#about`, `#projects`, `#contact` using `content.nav.*` labels, plus a language-switch link (DE page links to `/en/`, EN page links to `/`)
  - `Hero.astro` accepts props `{ content: SiteContent }`, renders `content.hero.name`, `.role`, `.pitch`, and a CTA anchor to `#contact` with `content.hero.ctaLabel`

- [ ] **Step 1: Write the layout**

`src/layouts/BaseLayout.astro`:
```astro
---
import Nav from '../components/Nav.astro';
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
---
<html lang={content.lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{content.hero.name} — {content.hero.role}</title>
  </head>
  <body>
    <Nav content={content} />
    <main>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 2: Write the Nav component**

`src/components/Nav.astro`:
```astro
---
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
const altLangHref = content.lang === 'de' ? '/en/' : '/';
const altLangLabel = content.lang === 'de' ? 'English' : 'Deutsch';
---
<nav>
  <a href="#about">{content.nav.about}</a>
  <a href="#projects">{content.nav.projects}</a>
  <a href="#contact">{content.nav.contact}</a>
  <a href={altLangHref} data-testid="lang-switch">{altLangLabel}</a>
</nav>
```

- [ ] **Step 3: Write the Hero component**

`src/components/Hero.astro`:
```astro
---
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
---
<section id="hero">
  <h1>{content.hero.name}</h1>
  <p class="role">{content.hero.role}</p>
  <p class="pitch">{content.hero.pitch}</p>
  <a href="#contact" class="cta">{content.hero.ctaLabel}</a>
</section>
```

- [ ] **Step 4: Wire the German page**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import content from '../content/site.de';
---
<BaseLayout content={content}>
  <Hero content={content} />
</BaseLayout>
```

- [ ] **Step 5: Wire the English page**

`src/pages/en/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import content from '../../content/site.en';
---
<BaseLayout content={content}>
  <Hero content={content} />
</BaseLayout>
```

- [ ] **Step 6: Write the E2E test**

`tests/e2e/hero-nav.spec.ts`:
```typescript
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
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm run build && npx playwright test hero-nav`
Expected: FAIL initially if run before Steps 1–5 are saved; since they're already written, run once to confirm real assertions by temporarily renaming `data-testid="lang-switch"` to something else, observe FAIL, then revert.

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run build && npx playwright test hero-nav`
Expected: PASS (all 3 tests)

- [ ] **Step 9: Commit**

```bash
git add src/components/Nav.astro src/components/Hero.astro src/layouts/BaseLayout.astro src/pages/index.astro src/pages/en/index.astro tests/e2e/hero-nav.spec.ts
git commit -m "Add hero section, nav, and language switcher"
```

---

### Task 4: About section (career timeline, education, certifications)

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Test: `tests/e2e/about.spec.ts`

**Interfaces:**
- Consumes: `SiteContent` type from Task 2, `BaseLayout`/page wiring pattern from Task 3
- Produces: `About.astro` accepts `{ content: SiteContent }`, renders section with `id="about"`, iterates `content.about.career` as a list, renders education and certifications

- [ ] **Step 1: Write the About component**

`src/components/About.astro`:
```astro
---
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
---
<section id="about">
  <h2>{content.about.heading}</h2>

  <h3>{content.about.careerHeading}</h3>
  <ol data-testid="career-timeline">
    {content.about.career.map((entry) => (
      <li>
        <strong>{entry.role}</strong>
        <span>{entry.company}</span>
        <span>{entry.period}</span>
        <span>{entry.location}</span>
      </li>
    ))}
  </ol>

  <h3>{content.about.educationHeading}</h3>
  <p>{content.about.education}</p>

  <h3>{content.about.certificationsHeading}</h3>
  <ul data-testid="certifications">
    {content.about.certifications.map((cert) => (
      <li>{cert.name} — {cert.validUntil}</li>
    ))}
  </ul>
</section>
```

- [ ] **Step 2: Add About to both pages**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import content from '../content/site.de';
---
<BaseLayout content={content}>
  <Hero content={content} />
  <About content={content} />
</BaseLayout>
```

`src/pages/en/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import content from '../../content/site.en';
---
<BaseLayout content={content}>
  <Hero content={content} />
  <About content={content} />
</BaseLayout>
```

- [ ] **Step 3: Write the E2E test**

`tests/e2e/about.spec.ts`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm run build && npx playwright test about.spec`
Expected: If Steps 1-2 have a typo (e.g., wrong `data-testid`), this fails. Confirm real signal by temporarily changing expected count to 8, observe FAIL, revert to 7.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run build && npx playwright test about.spec`
Expected: PASS (both tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/About.astro src/pages/index.astro src/pages/en/index.astro tests/e2e/about.spec.ts
git commit -m "Add About section with career timeline, education, certifications"
```

---

### Task 5: Projects and Contact sections

**Files:**
- Create: `src/components/Projects.astro`
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Test: `tests/e2e/projects-contact.spec.ts`

**Interfaces:**
- Consumes: `SiteContent` type and page wiring from Tasks 2–4
- Produces:
  - `Projects.astro` accepts `{ content: SiteContent }`, renders `id="projects"` section iterating `content.projects.items`
  - `Contact.astro` accepts `{ content: SiteContent }`, renders `id="contact"` section with `mailto:` link and LinkedIn/GitHub links

- [ ] **Step 1: Write the Projects component**

`src/components/Projects.astro`:
```astro
---
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
---
<section id="projects">
  <h2>{content.projects.heading}</h2>
  <div data-testid="project-list">
    {content.projects.items.map((project) => (
      <article>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.link && <a href={project.link}>{project.link}</a>}
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Write the Contact component**

`src/components/Contact.astro`:
```astro
---
import type { SiteContent } from '../content/types';

interface Props {
  content: SiteContent;
}
const { content } = Astro.props;
---
<section id="contact">
  <h2>{content.contact.heading}</h2>
  <a href={`mailto:${content.contact.email}`} data-testid="contact-email">{content.contact.email}</a>
  <a href={content.contact.linkedin} data-testid="contact-linkedin">LinkedIn</a>
  <a href={content.contact.github} data-testid="contact-github">GitHub</a>
</section>
```

- [ ] **Step 3: Add both sections to both pages**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Projects from '../components/Projects.astro';
import Contact from '../components/Contact.astro';
import content from '../content/site.de';
---
<BaseLayout content={content}>
  <Hero content={content} />
  <About content={content} />
  <Projects content={content} />
  <Contact content={content} />
</BaseLayout>
```

`src/pages/en/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Projects from '../../components/Projects.astro';
import Contact from '../../components/Contact.astro';
import content from '../../content/site.en';
---
<BaseLayout content={content}>
  <Hero content={content} />
  <About content={content} />
  <Projects content={content} />
  <Contact content={content} />
</BaseLayout>
```

- [ ] **Step 4: Write the E2E test**

`tests/e2e/projects-contact.spec.ts`:
```typescript
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
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm run build && npx playwright test projects-contact`
Expected: Confirm real signal — temporarily change expected count to 3, observe FAIL, revert to 2.

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run build && npx playwright test projects-contact`
Expected: PASS (both tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/Projects.astro src/components/Contact.astro src/pages/index.astro src/pages/en/index.astro tests/e2e/projects-contact.spec.ts
git commit -m "Add Projects and Contact sections"
```

---

### Task 6: Visual design pass with design-taste-frontend

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (global styles, font imports)
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/About.astro`
- Modify: `src/components/Projects.astro`
- Modify: `src/components/Contact.astro`
- Create: `src/styles/global.css` (or equivalent, decided during design pass)
- Test: existing suite from Tasks 1–5 must still pass (no new test file — this task must not change `data-testid` attributes or DOM structure that tests depend on)

**Interfaces:**
- Consumes: all components from Tasks 1–5 as-is (same props, same `data-testid` attributes)
- Produces: visually styled site with no structural/DOM contract changes — all existing `data-testid` selectors and element roles (`h1`, `.role`, `.pitch`, `a.cta`) must remain intact

- [ ] **Step 1: Invoke the design-taste-frontend skill**

Run the skill against the current component set, providing: portfolio context (Solution Architect, custom development + custom AI focus), the four existing sections, and constraint that this is a personal/professional portfolio (not a product landing page) — tone should read credible and technical, not sales-y.

Do not let the skill change element `id`s (`#hero`, `#about`, `#projects`, `#contact`), `data-testid` attributes, or remove the `h1`/`.role`/`.pitch`/`a.cta` selectors — these are load-bearing for the Task 1–5 tests.

- [ ] **Step 2: Apply the resulting styles**

Implement whatever CSS/typography/layout system the skill recommends, scoped to the files listed above.

- [ ] **Step 3: Run the full existing test suite to confirm no regressions**

Run: `npm run build && npx playwright test`
Expected: All tests from Tasks 1–5 still PASS (locales, hero-nav, about, projects-contact, content-integrity).

- [ ] **Step 4: Manually verify responsive behavior**

Run: `npm run preview`, then open `http://localhost:4321` and resize the viewport (or use browser dev tools device emulation) to check mobile (375px), tablet (768px), and desktop (1280px) widths render without horizontal scroll or overlapping text.

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/components src/styles
git commit -m "Apply visual design system via design-taste-frontend"
```

---

### Task 7: Vercel deployment configuration

**Files:**
- Create: `vercel.json` (only if non-default settings are needed — Astro is zero-config on Vercel; check output first)
- Create: `README.md` (deployment instructions)

**Interfaces:**
- Consumes: buildable Astro project from Tasks 1–6
- Produces: a project that Vercel's GitHub integration can build and deploy with zero manual configuration

- [ ] **Step 1: Verify the production build output is Vercel-compatible**

Run: `npm run build`
Expected: `dist/` contains static HTML/CSS/JS with no server-only output (this project has no SSR routes, so Astro's default `output: 'static'` applies — confirm `astro.config.mjs` has no `output: 'server'` or `adapter` set).

- [ ] **Step 2: Push the repository to GitHub**

Target repository: `https://github.com/sissifd/portfolio` (confirmed by user). Pushing code to this repository is a visible, external action — confirm with the user immediately before running the push (not just once at plan approval) that this repo is ready to receive this content (e.g., it's empty or pushing to it won't clobber unrelated work).

```bash
git remote add origin https://github.com/sissifd/portfolio.git
git push -u origin main
```

If the remote repository already has commits (e.g., a README created via the GitHub UI), `git push` will be rejected — in that case run `git pull --rebase origin main` first, resolve any conflicts, then push.

- [ ] **Step 3: Document the Vercel import steps for the user**

`README.md`:
```markdown
# Christian Sislak — Portfolio

Bilingual (DE/EN) static portfolio built with Astro.

## Local development

npm install
npm run dev

## Testing

npx playwright test

## Deployment

This project deploys via Vercel's GitHub integration:

1. Go to vercel.com and sign in with GitHub
2. Click "Add New Project" and import this repository
3. Vercel auto-detects Astro — no build configuration needed
4. Click "Deploy"
5. After the first deploy, go to Project Settings → Domains and add `christiansislak.de`
6. Vercel shows the exact DNS record (A or CNAME) to set at your domain registrar
7. Update the DNS record at your registrar; propagation can take up to 24 hours
```

- [ ] **Step 4: Commit the README**

```bash
git add README.md
git commit -m "Add deployment documentation"
```

- [ ] **Step 5: Hand off to the user for the actual Vercel import and DNS change**

These are external actions (creating a Vercel project, changing DNS at a third-party registrar) that require the user's own accounts and credentials — Claude cannot perform them. Tell the user the exact steps from the README and wait for confirmation before considering this task done.

---

### Task 8: Web Interface Guidelines review

**Files:**
- No new files — this is a review/fix pass across all files from Tasks 1–7

**Interfaces:**
- Consumes: the complete site from Tasks 1–7
- Produces: a site that passes the `web-design-guidelines` checklist

- [ ] **Step 1: Invoke the web-design-guidelines skill**

Run it against the built site (`npm run preview` running locally) covering: color contrast, focus states, semantic HTML, keyboard navigation, responsive behavior, and general UX.

- [ ] **Step 2: Fix any findings inline**

Apply fixes directly to the relevant component/style files. If a fix would change a `data-testid` or structural element the tests depend on, update the corresponding test in the same commit.

- [ ] **Step 3: Run the full test suite after fixes**

Run: `npm run build && npx playwright test`
Expected: All tests PASS.

- [ ] **Step 4: Manual keyboard navigation check**

Using only Tab/Shift+Tab/Enter, navigate through the nav links, hero CTA, and contact links in a browser. Confirm every interactive element has a visible focus outline and is reachable in a logical order.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Apply web interface guidelines fixes"
```

---

## Self-Review Notes

- **Spec coverage:** Hero/About/Projects/Contact (spec §Seitenstruktur) → Tasks 3–5. i18n DE/EN (spec §Zielgruppe & Sprache) → Task 1 (routing) + Task 2 (content). Astro/Vercel/GitHub stack (spec §Tech-Stack) → Tasks 1, 7. No backend/CMS/contact form (spec constraints) → honored throughout (Contact is links-only). `design-taste-frontend` for visual design (spec §Design-Umsetzung) → Task 6. `web-design-guidelines` review (spec §Qualitätsanforderung) → Task 8. Career timeline/education/certifications content → Task 2 data, Task 4 rendering. `[PLACEHOLDER]` for unwritten project content and LinkedIn/GitHub URLs → Task 2.
- **Out of scope confirmed not built:** no CMS, no contact form backend, no old-site content migration.
- **Type consistency:** `SiteContent` defined once in Task 2 (`src/content/types.ts`) and imported by every component in Tasks 3–5 without redefinition. `data-testid` values (`lang-switch`, `career-timeline`, `certifications`, `project-list`, `contact-email`, `contact-linkedin`, `contact-github`) are each defined in exactly one task and consumed by that same task's test — Task 6 explicitly forbids changing them.

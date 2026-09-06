# Christian Sislak — Portfolio

Bilingual (DE/EN) static portfolio built with Astro.

## Local development

npm install
npm run dev

## Testing

npx playwright test

## Deployment

Note: the current code lives on the `portfolio-website` branch, not `main`. Either merge it into `main` before importing to Vercel, or set `portfolio-website` as the Production Branch in the Vercel project's Git settings after import.

This project deploys via Vercel's GitHub integration:

1. Go to vercel.com and sign in with GitHub
2. Click "Add New Project" and import this repository
3. Vercel auto-detects Astro — no build configuration needed
4. Click "Deploy"
5. After the first deploy, go to Project Settings → Domains and add `christiansislak.de`
6. Vercel shows the exact DNS record (A or CNAME) to set at your domain registrar
7. Update the DNS record at your registrar; propagation can take up to 24 hours

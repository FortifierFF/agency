# Project preview assets

Generated from live sites via:

```bash
npm run capture:projects
```

Each slug folder contains:

- `collage.webp` — bento preview for home / projects grid cards
- `hero.webp` — homepage screenshot for case-study hero
- `logo.png` — favicon or header logo from the site
- `hero.png`, `detail.png` — source captures (optional to commit)

Requires Playwright Chromium (`npx playwright install chromium` on first run).

Cookie banners are dismissed before capture (site-specific: MedBoard Cookie Information decline, PAL Recruitment “Приеми всички”, plus generic accept/reject fallbacks).

Re-capture one or two projects:

```bash
npm run capture:projects -- medboard pal-recruitment
```

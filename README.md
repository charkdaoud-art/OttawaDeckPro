# Ottawa Deck Pro: website rebuild

Static, server-rendered site built from React/TypeScript components and Tailwind. Every existing
page is generated from the crawl of ottawadeckpro.ca (content/blocks.json + content/meta.json),
so URLs, titles, meta descriptions, canonicals, body copy and internal links carry over exactly.

    npm install
    npx tsx src/build.tsx            # production build → dist/ (clean URLs, sitemap, robots, tracking)
    npx tsx src/build.tsx --preview  # self-contained preview → preview/ (relative links, no tracking)
    python3 qa.py                    # migration check: old site vs dist/ → migration-report.csv

Where things live
- src/site.ts      company facts, tracking IDs, testimonials, photos, navigation
- src/pages.tsx    page templates (home, existing pages, gallery, FAQ, contact, blog, wellness)
- src/parse.ts     turns each live page's content into designed sections without changing words
- src/ui.tsx       shared components (header, footer, hero, forms, FAQ, stats, reviews)
- assets/site.js   menu, gallery lightbox, before/after, form validation (progressive enhancement)
- public/img       re-hosted project photos (60 of 185; the rest still load from Wix in production)

Forms: set window.ODP_FORM_ENDPOINT (any JSON/FormData endpoint) in production. Without it the form
validates and shows a confirmation but sends nothing.
Deploy: Railway builds the Dockerfile (npm ci, build, then Caddy serves dist/). Caddyfile handles clean URLs, no trailing slash and the 301s. See DEV-HANDOFF.md.

## 2026 upgrade: content admin
Edit reels, jobsite updates, projects, before/after, map markers, team, wellness products and verified stats at /admin (Decap CMS).
Collections live in content/collections/*.json. Saving commits to the repo and triggers a rebuild.
Setup: push this folder to GitHub, set `repo:` in public/admin/config.yml, and connect GitHub OAuth (or Netlify Identity + git-gateway).
Forms: set window.ODP_FORM_ENDPOINT (or wire to ZigBuild) before launch. Until then, forms send nothing.
Concept renderings are labelled via `source: concept` and must never be marked `actual`.

# Ottawa Deck Pro website: project context

Owner: Charbel (Ottawa Deck Pro). Live domain: www.ottawadeckpro.ca (www is canonical).

## What this is
Static React SSR + Tailwind rebuild of the old Wix site. Every Wix URL, title, meta, canonical and body text is preserved (content/meta.json + content/blocks.json). Do not change URLs, titles, metas, canonicals or page text without asking.

## Build and check
- `npm ci` then `npx tsx src/build.tsx` → dist/ (production). `--preview` → preview/.
- `python3 qa.py` → SEO check vs the old site. Expect 107/107 titles, metas, canonicals; 0 lost or broken links.

## Hosting
- Railway project, auto-deploys from `main` of charkdaoud-art/OttawaDeckPro. Temp URL: ottawadeckpro-production.up.railway.app
- Dockerfile: builds dist/, then Caddy serves it and proxies /api/* to server/api.mjs.
- Caddyfile: clean URLs, no trailing slash, 301s (/copy-of-pvc-deck-carp, /welness), bare domain → www, real 404 page.
- DNS is on Cloudflare (GoDaddy is only the registrar). Email is Google Workspace: never touch MX/SPF/DKIM/DMARC/Brevo records.

## Forms (server/api.mjs, Brevo)
- /api/lead: lead email to hello@ottawadeckpro.ca (photos attached) + branded client confirmation (team photo, "within 24 hours", 3D vs built).
- /api/subscribe: $5,000 offer list (Brevo list ID 2) + welcome email with offer conditions + notice to owner.
- Homepage flow (Nov 21): hero, trust bar, divisions+services, work (grid, before/after, reels), how it works (3D vs built + 4 steps), crew, reviews (top 10 + /reviews page), FAQ top 5, service area map, wizard + estimate. Review count shown as "100+" (content/collections/settings.json).
- /api/unsubscribe: signed one-click link in the welcome email (and List-Unsubscribe header). Blacklists the contact in Brevo and removes it from the list.
- Railway variables: BREVO_API_KEY, BREVO_LIST_ID. Brevo IP blocking for API keys must stay OFF (Railway IPs rotate).
- Health: /api/health?check=1

## Rules from the owner
- No em dashes in any copy. Short, direct writing.
- Never invent reviews, stats or facts. Only real ones.
- No duplicate photos on the homepage. SEO file names for images (city + material + service).
- $5,000 offer condition ($40k+ signed projects) stays visible as small print, not hidden.
- Ask before changing DNS or anything that affects the live site.

See DEV-HANDOFF.md for the go-live checklist and README.md for file layout.

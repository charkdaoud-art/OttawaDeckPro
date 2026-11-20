# Ottawa Deck Pro: go-live handoff (Wix to new static site)

Goal: replace the Wix site on www.ottawadeckpro.ca without losing 7 months of rankings and indexed pages.

## What is already done in the build

- `dist/` is the production site: 110 static pages, plain HTML + CSS + JS, no server needed.
- Every Wix URL is rebuilt at the **exact same path** (108 URLs crawled from the live site). Example: Wix `/deck-builder-kanata` serves from `dist/deck-builder-kanata/index.html`.
- Per page, matched 1:1 with Wix (verified by `python3 qa.py`, results in `migration-report.csv`):
  - `<title>`, meta description, canonical (all `https://www.ottawadeckpro.ca/...`, no trailing slash)
  - H1, body copy (100% of text blocks), internal links (0 lost, 0 broken)
- `vercel.json`: `cleanUrls: true`, `trailingSlash: false` (matches Wix URL format), plus one 301 (`/copy-of-pvc-deck-carp` to `/pvc-deck-carp`).
- `sitemap.xml` (111 URLs + 2,132 image entries), `robots.txt`.
- GA4 `G-ZSY1FWD658` and Meta Pixel already in the production build. Search Console verification: re-add your existing meta tag or use DNS verification.
- All images are self-hosted in `/img` (nothing loads from Wix CDN anymore).
- Rebuild: `npm install && npx tsx src/build.tsx` (source in this zip).

## Rule: URLs, canonicals and the domain must not change

- Keep `www.ottawadeckpro.ca` as the primary host. Redirect apex `ottawadeckpro.ca` to `www` with a 301, the same as Wix does today.
- No trailing slashes. `/decks` must stay `/decks`, not `/decks/`.
- Do not rename any slug. If a slug ever changes, add a 301 in `vercel.json`.

## Steps

1. **Export what Google actually has indexed** before touching DNS:
   - Search Console > Indexing > Pages > export the "Indexed" list
   - Search Console > Performance > Pages (last 6 months), export
   - Diff that list against `migration-report.csv`. Any URL Google knows that is not in our 108 (old Wix blog category/tag pages, `/blog/page/2`, `/post/...` variants, old test pages) gets a **301 in `vercel.json`** to the closest matching page. No URL that has traffic or backlinks may end in a 404.
2. **Deploy `dist/` to Vercel** (or Netlify or Cloudflare Pages; the redirects must then be ported to that host's format). Test on the `*.vercel.app` URL:
   - spot check 10 pages: same URL, same title, canonical points to `www.ottawadeckpro.ca`
   - `curl -I` the redirect URLs and confirm a 301
   - on the preview domain, add `noindex` or password-protect it so it never competes with the live site
3. **Wire the estimate forms before launch.** Right now they validate but send nothing. Set `window.ODP_FORM_ENDPOINT` (Formspree, a webhook, or ZigBuild) and test all 3 forms (residential, commercial, wellness) including the photo upload.
4. **DNS cutover (approved by Charbel):**
   - Lower TTL to 300 a day before.
   - Point `www` CNAME and the apex A record to Vercel. Add both domains in Vercel and let it issue SSL.
   - **Do not touch MX, SPF, DKIM or TXT records.** Email (hello@ottawadeckpro.ca) must keep working. If DNS is managed inside Wix, copy every existing record first, then either change them in Wix or move DNS to Cloudflare with all records copied.
   - Keep the Wix plan active for at least 30 days as a rollback.
5. **Same day, after go-live:**
   - Search Console: submit `https://www.ottawadeckpro.ca/sitemap.xml`
   - URL Inspection > Request indexing for the homepage and the top 10 pages by traffic
   - Google Business Profile: confirm the website link still works
   - Check GA4 Realtime is receiving hits
6. **Monitor for 4 to 6 weeks:** Search Console coverage and 404 reports weekly. Any new 404 gets a 301. Rankings usually wobble for 1 to 3 weeks after a platform move and then settle, as long as URLs, titles and content stayed the same, which they did here.

## Do not

- Do not use Wix's "connect domain" option to point the domain at Wix again after cutover.
- Do not launch with the preview build (`preview/`). It uses relative links and has no tracking. Deploy `dist/` only.
- Do not let the `.vercel.app` preview get indexed.

## Files in this zip

- `dist/`: deploy this
- `src/`, `content/`, `public/`, `styles/`, `assets/`: source
- `migration-report.csv`: every original URL with title, meta, canonical, H1, text and link match
- `qa.py`: rerun after any change to confirm nothing SEO-critical moved

## Email list ($5,000 offer)
- Set `window.ODP_LIST_ENDPOINT` to the list provider's form endpoint (Mailchimp, Klaviyo or Brevo).
- Each signup POSTs: email, first_name, consent, consent_text, consent_at, source (offer-pop / offer-footer), page.
- Keep consent_text and consent_at stored: that's the CASL proof of consent.

## Hosting on Railway + GoDaddy DNS (replaces the Vercel steps)
- Repo root has `Dockerfile` + `Caddyfile`. Railway builds it and serves `dist/` with Caddy on $PORT.
- Caddy does what vercel.json did: clean URLs, no trailing slash (301), /copy-of-pvc-deck-carp → /pvc-deck-carp (301), real 404 status. Run `npx tsx src/build.tsx` before each deploy so dist/ is current.
- Railway custom domain: add **www.ottawadeckpro.ca** only (the canonical). GoDaddy can't CNAME the root.
- GoDaddy DNS: edit the existing `www` record → CNAME to the `xxxx.up.railway.app` target Railway shows. Add TXT `_railway-verify.www` with Railway's value. Remove any old www A record. Do not touch MX / SPF / DKIM / other TXT.
- Root domain: GoDaddy Forwarding, ottawadeckpro.ca → https://www.ottawadeckpro.ca, Permanent (301), "forward only". Then check https://ottawadeckpro.ca redirects with no certificate warning. If it fails, move nameservers to Cloudflare (free) and copy every record across first.

## Forms: Brevo (replaces Formspree)
- server/api.mjs runs inside the same Railway container; Caddy proxies /api/lead and /api/subscribe to it.
- Railway Variables: BREVO_API_KEY (required), BREVO_LIST_ID (the "Website $5,000 offer" list), optional LEAD_TO (comma-separated, default hello@ottawadeckpro.ca), MAIL_FROM.
- Check it at /api/health → {"ok":true,"brevo":true,"list":true}.
- Brevo: authenticate ottawadeckpro.ca (DKIM/DMARC records in GoDaddy) so mail doesn't land in spam.
- Lead email: branded, reply-to is the customer, photos attached (15MB cap). Customer gets an auto-reply. Signups go to the Brevo list + welcome email with the offer conditions + a notice to you.

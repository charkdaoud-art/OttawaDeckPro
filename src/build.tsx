// Static build. `tsx src/build.tsx` → dist/ (production, clean URLs) ; `--preview` → preview/ (relative links, no tracking)
import IMGMAP_RAW from '../content/image-map.json'
const IMGMAP = IMGMAP_RAW as Record<string, string>
import { PHOTOS as _PH, RENDERS as _RE } from './site'
const ALTS: Record<string, string> = {}
Object.values({ ..._PH, ..._RE } as any).forEach((p: any) => { if (p && p.file && p.alt) ALTS[p.file] = p.alt })
const PLACES = ['ottawa', 'kanata', 'stittsville', 'barrhaven', 'nepean', 'orleans', 'carp', 'almonte', 'manotick', 'arnprior']
const humanize = (f: string) => {
  const w = f.replace(/\.(webp|png|jpe?g)$/, '').split('-').filter(Boolean)
  const place = w.length && PLACES.includes(w[w.length - 1]) ? w.pop()! : PLACES.includes(w[0]) ? w.shift()! : 'ottawa'
  const t = w.join(' ').replace(/\bpvc\b/g, 'PVC').replace(/(\d+)x(\d+)/, '$1x$2')
  return `${t.charAt(0).toUpperCase() + t.slice(1)} in ${place.charAt(0).toUpperCase() + place.slice(1)} by Ottawa Deck Pro`
}
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import metaJson from '../content/meta.json'
import { CTX } from './lib'
import { ORIGIN } from './site'
import { ExistingPage, Home, Gallery, Faq, Contacts, BlogIndex, Post, ServiceAreas, Wellness, Commercial, WellnessProduct, PRODUCTS } from './pages'

const preview = process.argv.includes('--preview')
const OUT = path.resolve(preview ? 'preview' : 'dist')
CTX.preview = preview

const existing = Object.keys(metaJson as object)
const routes: [string, () => React.ReactElement][] = []
for (const p of existing) {
  if (p === '/') routes.push([p, () => <Home />])
  else if (p === '/gallery') routes.push([p, () => <Gallery />])
  else if (p === '/faq') routes.push([p, () => <Faq />])
  else if (p === '/contacts') routes.push([p, () => <Contacts />])
  else if (p === '/blog') routes.push([p, () => <BlogIndex />])
  else if (p.startsWith('/post/')) routes.push([p, () => <Post path={p} />])
  else if (p === '/copy-of-pvc-deck-carp') continue // proposed 301 → /pvc-deck-carp (see redirects)
  else routes.push([p, () => <ExistingPage path={p} />])
}
if (existing.includes('/commercial-deck-construction')) throw new Error('URL conflict: /commercial-deck-construction already exists')
routes.push(['/service-areas', () => <ServiceAreas />], ['/wellness', () => <Wellness />], ['/commercial-deck-construction', () => <Commercial />])
for (const p of PRODUCTS) routes.push(['/wellness/products/' + p.slug, () => <WellnessProduct p={p} />])

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })
let n = 0
for (const [p, render] of routes) {
  CTX.path = p
  CTX.depth = p === '/' ? 0 : p.split('/').filter(Boolean).length
  // any remaining Wix CDN reference (structured data, og:image) points at the rehosted copy
  let html = ('<!DOCTYPE html>' + renderToStaticMarkup(render())).replace(/https:\/\/static\.wixstatic\.com\/media\/[^"'\s)\\]+/g, (u) => { const b = u.replace(/%7E/gi, '~').split('/v1/')[0]; return IMGMAP[b] ? ORIGIN + '/img/' + IMGMAP[b] : u })
  const file = p === '/' ? path.join(OUT, 'index.html') : path.join(OUT, p.slice(1), 'index.html')
  // fill empty or generic alt text from the photo library, else from the keyword file name
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/aria-hidden="true"/.test(tag)) return tag
    const src = /src="([^"]+)"/.exec(tag)?.[1] || ''; const f = src.split('/img/').pop() || ''
    const alt = /alt="([^"]*)"/.exec(tag)?.[1]
    const weak = alt === undefined || alt === '' || /^(Ottawa Deck Pro project photo|Image by .*|IMG_?\d+.*|.*\.(jpe?g|png|webp|JPG)|BEFORE|AFTER)$/i.test(alt)
    if (!weak || !/\.(webp|png|jpe?g)$/.test(f)) return tag
    const good = ALTS[f] || humanize(f)
    return alt === undefined ? tag.replace('<img', `<img alt="${good}"`) : tag.replace(/alt="[^"]*"/, `alt="${good}"`)
  })
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  n++
}
// assets
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true })
execSync(`npx tailwindcss -c tailwind.config.cjs -i styles/input.css -o ${OUT}/assets/site.css --minify`, { stdio: 'pipe' })
fs.copyFileSync('assets/site.js', path.join(OUT, 'assets/site.js'))
fs.cpSync('public/img', path.join(OUT, 'img'), { recursive: true })
if (fs.existsSync('public/media')) fs.cpSync('public/media', path.join(OUT, 'media'), { recursive: true })
if (!preview && fs.existsSync('public/admin')) fs.cpSync('public/admin', path.join(OUT, 'admin'), { recursive: true })
// 3D retreat configurator (built separately in ../retreat)
const cfg = path.resolve('../retreat/dist/index.html')
if (fs.existsSync(cfg)) { fs.mkdirSync(path.join(OUT, 'wellness/retreat-configurator'), { recursive: true }); fs.copyFileSync(cfg, path.join(OUT, 'wellness/retreat-configurator/index.html')) }

if (!preview) {
  const urls = routes.map(([p]) => p).concat(['/wellness/retreat-configurator'])
  // sitemap with image entries (keyword-rich file names + alt text as captions help Google Images)
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  const imgsFor = (u: string) => {
    const f = path.join(OUT, u === '/' ? 'index.html' : u.slice(1) + '/index.html')
    if (!fs.existsSync(f)) return ''
    const html = fs.readFileSync(f, 'utf8'); const seen = new Set<string>(); let out = ''
    for (const m of html.matchAll(/<img[^>]*?src="\/img\/([^"]+)"[^>]*?alt="([^"]*)"/g)) {
      if (seen.has(m[1]) || /logo|bbb/.test(m[1])) continue; seen.add(m[1])
      out += `<image:image><image:loc>${ORIGIN}/img/${m[1]}</image:loc>${m[2] ? `<image:caption>${m[2]}</image:caption>` : ''}</image:image>`
    }
    return out
  }
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map((u) => `  <url><loc>${ORIGIN}${u === '/' ? '' : u}</loc>${imgsFor(u)}</url>`).join('\n')}\n</urlset>\n`)
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: PetalBot\nDisallow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`)
  // Vercel config: clean URLs, no trailing slash (matches Wix), and the one proposed redirect
  fs.writeFileSync(path.join(OUT, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: false, redirects: [{ source: '/copy-of-pvc-deck-carp', destination: '/pvc-deck-carp', permanent: true }] }, null, 2))
}
console.log(`${preview ? 'preview' : 'production'}: ${n} pages → ${OUT}`)

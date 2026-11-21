import React from 'react'
import faqsJson from '../content/collections/faqs.json'
import { href, plain, Inline } from './lib'

export type Faq = { id: string; cat: string; tags: string[]; q: string; a: string; link?: [string, string] | null }
const DEFAULT_CATS: Record<string, string> = { cost: 'Cost & budgeting', materials: 'Decking materials', lifespan: 'Lifespan & maintenance', permits: 'Permits & building code', design: 'Design & features', railings: 'Railings', hottub: 'Hot tubs & pools', climate: 'Ottawa climate & seasons', repair: 'Repair, resurfacing & staining', fences: 'Fences', process: 'Working with Ottawa Deck Pro', commercial: 'Commercial & multi-unit', wellness: 'Saunas, cold plunges & wellness' }
export const FAQ_CATS = ((faqsJson as any).categories || DEFAULT_CATS) as Record<string, string>
export const FAQS = (faqsJson as any).items as Faq[]
export const FAQ_TOTAL = `${Math.floor((FAQS.length + 22) / 10) * 10}+`
export const slugQ = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)

/* which topics fit which page */
const POSTS: Record<string, string[]> = {
  '/post/deck-cost-ottawa': ['cost'],
  '/post/how-much-should-you-budget-for-deck-building-in-ottawa': ['cost', 'permits'],
  '/post/composite-vs-wood-decking-for-ottawa-homeowners-which-is-the-right-choice': ['composite', 'wood', 'materials'],
  '/post/deck-building-mistakes-ottawa': ['permits', 'framing', 'lifespan', 'process'],
  '/post/deck-with-hot-tub-ottawa': ['hottub'],
  '/post/top-5-benefits-of-custom-deck-building-for-ottawa-homeowners': ['design', 'general'],
  '/post/transforming-almonte-backyards-from-old-pressure-treated-wood-to-stunning-low-maintenance-composite': ['composite', 'repair'],
}
const FAMILY: Record<string, string[]> = {
  'deck-builder': ['general', 'cost', 'permits', 'process', 'design', 'climate', 'lifespan', 'materials'],
  'composite-deck': ['composite', 'maintenance', 'cost', 'materials'],
  'pvc-deck': ['pvc', 'hottub', 'maintenance', 'materials'],
  'aluminum-railing': ['aluminum', 'railings', 'code'],
  'glass-railing': ['glass', 'railings', 'code'],
  'deck-repair': ['repair', 'lifespan', 'framing'],
  'backyard-makeover': ['makeover', 'design', 'privacy', 'lighting', 'hottub'],
}
const CORE: Record<string, string[]> = {
  '/': ['cost', 'materials', 'permits', 'lifespan', 'design', 'climate'],
  '/decks': ['materials', 'design', 'cost', 'composite'],
  '/railings': ['railings', 'code', 'glass', 'aluminum'],
  '/staining': ['staining', 'wood', 'maintenance'],
  '/fences': ['fences'],
  '/backyard-makeover': FAMILY['backyard-makeover'],
  '/gallery': ['design'], '/contacts': ['process'], '/service-areas': ['process', 'permits'], '/blog': ['cost', 'materials'],
  '/commercial-deck-construction': ['commercial'], '/wellness': ['wellness'],
}
export function topicsFor(path: string): string[] {
  if (POSTS[path]) return POSTS[path]
  if (CORE[path]) return CORE[path]
  const fam = Object.keys(FAMILY).find((k) => path.startsWith('/' + k + '-'))
  return fam ? FAMILY[fam] : ['general', 'cost', 'materials']
}

const words = (s: string) => new Set(plain(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3))
const similar = (a: string, b: string) => { const A = words(a), Bw = words(b); let n = 0; A.forEach((w) => Bw.has(w) && n++); return n / Math.max(1, Math.min(A.size, Bw.size)) }
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** Topic-matched FAQs for a page. Rotates through the pool so sibling location pages show different questions. */
export function pickFaqs(path: string, existingQs: string[] = [], n = 8): Faq[] {
  const t = topicsFor(path)
  const NICHE = ['fences', 'commercial', 'wellness', 'hottub']
  const scored = FAQS.map((f) => ({ f, s: f.tags.filter((x) => t.includes(x)).length + (t.includes(f.cat) ? 2 : 0) + (f.tags.some((x) => t.slice(0, 2).includes(x)) ? 2 : 0) }))
    .filter((x) => x.s > 0 && (!NICHE.includes(x.f.cat) || t.includes(x.f.cat) || x.f.tags.some((g) => t.slice(0, 1).includes(g))) && !existingQs.some((q) => similar(q, x.f.q) > 0.6))
    .sort((a, b) => b.s - a.s)
  // round-robin across categories so each page gets a mix (cost, materials, permits...) rather than one topic
  const byCat = new Map<string, Faq[]>() // insertion order follows best score, so the page's main topic leads
  scored.forEach(({ f }) => { if (!byCat.has(f.cat)) byCat.set(f.cat, []); byCat.get(f.cat)!.push(f) })
  const mixed: Faq[] = []
  for (let i = 0; mixed.length < scored.length; i++) byCat.forEach((list) => { if (list[i]) mixed.push(list[i]) })
  const pool = mixed.slice(0, Math.min(mixed.length, n * 4))
  if (pool.length <= n) return pool
  // keep the 3 most relevant, rotate the rest so sibling location pages differ
  const head = scored.slice(0, 3).map((x) => x.f)
  const rest = pool.filter((f) => !head.includes(f))
  const start = hash(path) % rest.length
  return head.concat(Array.from({ length: n - 3 }, (_, i) => rest[(start + i) % rest.length]))
}

export const toQA = (list: Faq[]): [string, string][] => list.map((f) => [f.q, f.a])

function Answer({ f, light }: { f: Faq; light?: boolean }) {
  return (
    <div className={`pb-6 pr-8 text-[16px] leading-[1.7] ${light ? 'text-ivory/75' : 'text-graphite/75'}`}>
      <p><Inline text={f.a} /></p>
      {f.link ? <a href={href(f.link[0])} className={`mt-3 inline-flex items-center gap-1 text-[14px] font-semibold ${light ? 'text-bronze-light' : 'text-bronze-dark'} hover:underline`}>{f.link[1]} →</a> : null}
    </div>
  )
}

export function FaqItem({ f, open = false, light = false }: { f: Faq; open?: boolean; light?: boolean }) {
  return (
    <details id={f.id} className="faq group" open={open} data-faq-q={plain(f.q + ' ' + f.a).toLowerCase()}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5">
        <h3 className="text-[17px] font-semibold leading-snug">{plain(f.q)}</h3>
        <span className="faq-icon" aria-hidden="true" />
      </summary>
      <Answer f={f} light={light} />
    </details>
  )
}

/** "More answers" block for every SEO page. */
export function MoreFaqs({ items, heading = 'More questions from Ottawa homeowners', dark = false }: { items: Faq[]; heading?: string; dark?: boolean }) {
  if (!items.length) return null
  const half = Math.ceil(items.length / 2)
  return (
    <section className={dark ? 'bg-charcoal text-ivory' : 'bg-white'} id="more-faq">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`eyebrow ${dark ? 'text-bronze-light' : 'text-bronze'}`}>FAQ</p>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-[1.08] tracking-tight">{heading}</h2>
          </div>
          <a href={href('/faq')} className={`btn ${dark ? 'btn-ghost-light' : 'btn-outline'}`}>All {FAQ_TOTAL} answers →</a>
        </div>
        <div className="mt-10 grid gap-x-14 lg:grid-cols-2">
          {[items.slice(0, half), items.slice(half)].map((col, c) => (
            <div key={c} className={`divide-y border-t ${dark ? 'divide-ivory/10 border-ivory/10' : 'divide-graphite/10 border-graphite/10'} ${c === 1 ? 'lg:border-t' : ''}`}>
              {col.map((f) => <FaqItem key={f.id} f={f} light={dark} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Full library for /faq, grouped by category with search. */
export function FaqLibrary({ legacy }: { legacy: [string, string][] }) {
  const legacyItems: Faq[] = legacy.map(([q, a]) => ({ id: slugQ(q), cat: 'top', tags: [], q, a, link: null }))
  const groups: [string, string, Faq[]][] = [['top', 'Most asked', legacyItems], ...Object.entries(FAQ_CATS).map(([k, label]) => [k, label, FAQS.filter((f) => f.cat === k)] as [string, string, Faq[]])]
  return (
    <section className="bg-ivory" data-faq-lib>
      <div className="sticky top-[72px] z-20 border-b border-graphite/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:px-10">
          <label className="relative block shrink-0 lg:w-[300px]">
            <span className="sr-only">Search questions</span>
            <input type="search" placeholder={`Search ${legacyItems.length + FAQS.length} questions…`} className="w-full rounded-full border border-graphite/15 bg-white px-5 py-3 text-[15px] outline-none focus:border-bronze" data-faq-search />
          </label>
          <nav aria-label="FAQ topics" className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {groups.map(([k, label]) => <a key={k} href={`#topic-${k}`} className="chip shrink-0 whitespace-nowrap">{label}</a>)}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] px-5 py-14 lg:py-20">
        <p className="hidden pb-10 text-[15px] text-graphite/60" data-faq-empty>No questions match that search. <a className="link" href="#estimate">Ask us directly</a>.</p>
        {groups.map(([k, label, items]) => (
          <div key={k} id={`topic-${k}`} className="scroll-mt-40 pb-14" data-faq-group>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-tight">{k === 'top' ? 'Your questions, answered' : label}</h2>
            {k === 'top' ? null : <p className="mt-1 text-[14px] text-graphite/55">{items.length} questions</p>}
            <div className="mt-6 divide-y divide-graphite/10 border-y border-graphite/10">
              {items.map((f, i) => <FaqItem key={f.id} f={f} open={k === 'top' && i === 0} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Turns the crawled block stream of a live page into designed sections without changing its words.
export type Block = { t: string; x?: string; h?: string; s?: string; a?: string }
export type Card = { img?: Block; title: Block; body: Block[] }
export type Section =
  | { kind: 'prose'; eyebrow?: string; heading?: Block; blocks: Block[]; cards: Card[]; imgs: Block[] }
  | { kind: 'faq'; heading?: Block; qa: [string, string][] }
  | { kind: 'stats' }
  | { kind: 'testimonials'; heading?: Block }
  | { kind: 'contact'; heading?: Block }
  | { kind: 'brands'; heading?: Block }
  | { kind: 'hero'; heading: Block; eyebrow?: string; blocks: Block[]; img?: Block }

const STAT_LABEL = /^(DECKS BUILT|BACKYARD MAKEOVER|RAILINGS INSTALLED|FENCES INSTALLED)$/i
const TESTI = /(TESTIMONIAL|CLIENTS DESCRIBE|CLIENT REVIEW|Satisfied as well)/i
const CONTACT = /(LET.S BUILD YOUR DREAM BACKYARD|^CONTACT INFO$)/i
const BRANDS = /HIGH-PERFORMANCE MATERIALS/i
const STATS_H = /^PROJECT STATS$/i
const FAQ_H = /question/i
const CONTACT_LINE = /^(EMAIL|PHONE|ADDRESS|TIMING|TEXT)\s*:/i
const FORM_JUNK = /^\*?(NAME|EMAIL|PHONE|ADDRESS|SERVICE INTERESTED IN|PREFERRED START DATE|HOW DID YOU HEAR|ATTACHMENT|UPLOAD FILE|MESSAGE|SUBMIT)/i

const txt = (b?: Block) => (b?.x || '').replace(/​/g, '').trim()
const isHeading = (b: Block) => /^h[1-4]$/.test(b.t)
const isEyebrow = (b: Block) => b.t === 'p' && txt(b).length <= 48 && txt(b) === txt(b).toUpperCase() && /[A-Z]/.test(txt(b)) && !/\[/.test(txt(b)) && !/^[-–]/.test(txt(b))

export function parsePage(raw: Block[]): Section[] {
  const blocks = raw.filter((b) => {
    if (b.t === 'img' && (/11062b_/.test(b.s || '') || /\/media\/[^/]*~mv2\.(avif|webp)$/.test(b.s || ''))) return false
    if (b.t === 'li' && /^\[\]\(/.test(txt(b))) return false
    if (b.t === 'a' && /^(Shop|View Deck Packages)$/i.test(txt(b)) && false) return false
    if (b.t === 'a' && /^Shop$/i.test(txt(b))) return false
    if (b.t === 'p' && (CONTACT_LINE.test(txt(b)) || FORM_JUNK.test(txt(b)))) return false
    return true
  })
  const out: Section[] = []
  let cur: Extract<Section, { kind: 'prose' }> | null = null
  let skip = false // inside a section replaced by a component
  let sawH1 = false
  const close = () => { if (cur && (cur.heading || cur.blocks.length || cur.imgs.length)) out.push(cur); cur = null }
  const start = (heading?: Block, eyebrow?: string) => { close(); cur = { kind: 'prose', heading, eyebrow, blocks: [], cards: [], imgs: [] } }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    const t = txt(b)
    // stats pairs
    if (b.t === 'h6' && STAT_LABEL.test(t)) { if (!out.some((s) => s.kind === 'stats') && !STATS_H.test(txt(cur?.heading))) { close(); out.push({ kind: 'stats' }) } i++; continue }
    // testimonial names
    if (b.t === 'h5' && /google\.com\/maps/.test(t)) continue
    // FAQ: an h4 "... Questions ..." followed by heading pairs
    if (b.t === 'h4' && FAQ_H.test(t)) {
      close(); const qa: [string, string][] = []
      while (blocks[i + 1] && blocks[i + 2] && /^h[23]$/.test(blocks[i + 1].t) && /\?\s*$/.test(txt(blocks[i + 1])) && blocks[i + 2].t !== 'h4') {
        qa.push([txt(blocks[i + 1]), txt(blocks[i + 2])]); i += 2
      }
      out.push({ kind: 'faq', heading: b, qa }); skip = false; continue
    }
    if (b.t === 'h4' && !(TESTI.test(t) || CONTACT.test(t) || BRANDS.test(t))) {
      // h4 on the live site is used for short lead lines and step numbers, not structure
      if (skip) continue
      if (!cur) start()
      if (/^\d+$/.test(t)) continue
      cur!.blocks.push({ t: 'p', x: t }); continue
    }
    if (isHeading(b)) {
      if (STATS_H.test(t)) { close(); if (!out.some((s) => s.kind === 'stats')) out.push({ kind: 'stats' }); skip = true; continue }
      if (TESTI.test(t)) { close(); out.push({ kind: 'testimonials', heading: b }); skip = true; continue }
      if (CONTACT.test(t)) { close(); out.push({ kind: 'contact', heading: b }); skip = true; continue }
      if (BRANDS.test(t)) { close(); out.push({ kind: 'brands', heading: b }); skip = true; continue }
      skip = false
      // a short caps paragraph right before a heading reads as its eyebrow
      let eyebrow: string | undefined
      const prev = cur?.blocks[cur.blocks.length - 1]
      if (prev && isEyebrow(prev)) { cur!.blocks.pop(); eyebrow = txt(prev) }
      if (b.t === 'h1') {
        if (!sawH1) { sawH1 = true; close(); const hero: Section = { kind: 'hero', heading: b, eyebrow, blocks: [] }
          // hero takes the tagline paragraph(s) and buttons that follow, and the first photo on the page
          while (blocks[i + 1] && (blocks[i + 1].t === 'p' || blocks[i + 1].t === 'a')) { hero.blocks.push(blocks[++i]) }
          out.push(hero); continue }
        b.t = 'h2' // only one H1 per page
      }
      start(b, eyebrow); continue
    }
    if (skip) {
      // replaced sections hold only names, photos and buttons; real copy after them starts a new section
      if (b.t === 'img' || b.t === 'h5' || b.t === 'h6' || b.t === 'a') continue
      skip = false; start()
    }
    if (!cur) start()
    if (b.t === 'img') { cur!.imgs.push(b); cur!.blocks.push(b); continue }
    cur!.blocks.push(b)
  }
  close()
  // hero image = first photo anywhere on the page
  const firstImg = raw.find((b) => b.t === 'img' && !/11062b_/.test(b.s || ''))
  const hero = out.find((s) => s.kind === 'hero') as Extract<Section, { kind: 'hero' }> | undefined
  if (hero && firstImg) hero.img = firstImg
  // h5/h6 groups become cards (the image just before a card title belongs to it)
  for (const s of out) {
    if (s.kind !== 'prose') continue
    if (!s.blocks.some((b) => b.t === 'h6' || (b.t === 'h5' && !/^\$/.test(txt(b))))) continue
    const keep: Block[] = []; let card: Card | null = null; let pendingImg: Block | undefined
    for (const b of s.blocks) {
      if (b.t === 'img') { if (card && !card.body.length && !card.img) { card.img = b } else pendingImg = b; continue }
      if (b.t === 'h6' || (b.t === 'h5' && !/^\$/.test(txt(b)) && !card?.body.some((x) => x.t === 'h5'))) {
        if (card) s.cards.push(card)
        card = { title: b, body: [], img: pendingImg }; pendingImg = undefined; continue
      }
      if (card) card.body.push(b); else keep.push(b)
    }
    if (card) s.cards.push(card)
    // trailing paragraphs after the last card that are not part of it (long text with links) go back to the section
    const last = s.cards[s.cards.length - 1]
    if (last) { const idx = last.body.findIndex((b) => b.t === 'p' && txt(b).length > 160); if (idx > 0) { keep.push(...last.body.splice(idx)) } }
    s.blocks = keep
  }
  return out
}

export const textOfSections = (secs: Section[]) => JSON.stringify(secs)

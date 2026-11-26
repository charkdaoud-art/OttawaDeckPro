/* New blog posts: content/posts/*.md (frontmatter + simple markdown).
   Frontmatter: title, description, h1, slug, date (YYYY-MM-DD), cover (file in public/img), coverAlt, keyword, category, status (draft|published)
   Body: ## / ### headings, paragraphs, - lists, > callout, ![alt](file.webp "caption"), [text](/link), **bold**.
   A "## Frequently asked questions" section with "### question" + answer paragraphs becomes the FAQ block and FAQPage schema. */
import React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { BRAND, ORIGIN, PHOTOS } from './site'
import { href, imgSrc } from './lib'
import { Document, Crumbs, crumbLd, EstimateSection, Btn, Arrow, Eyebrow, type Meta } from './ui'

export type BlogPost = { slug: string; path: string; title: string; description: string; h1: string; date: string; cover: string; coverAlt: string; keyword: string; category: string; status: string; body: string; words: number; faqs: [string, string][] }
const DIR = path.resolve('content/posts')

function front(raw: string) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw)
  if (!m) throw new Error('post is missing frontmatter')
  const meta: Record<string, string> = {}
  for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
  return { meta, body: m[2].trim() }
}

export function loadPosts(includeDrafts: boolean): BlogPost[] {
  if (!fs.existsSync(DIR)) return []
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => {
    const { meta, body } = front(fs.readFileSync(path.join(DIR, f), 'utf8'))
    for (const k of ['title', 'description', 'h1', 'slug', 'date', 'cover']) if (!meta[k]) throw new Error(`${f}: missing "${k}"`)
    if (/—/.test(body + meta.title + meta.h1 + meta.description)) throw new Error(`${f}: contains an em dash (owner rule)`)
    if (!fs.existsSync(path.resolve('public/img', meta.cover))) throw new Error(`${f}: cover image not found: ${meta.cover}`)
    const faqs: [string, string][] = []
    const fq = body.split(/\n## Frequently asked questions\s*\n/i)[1]
    if (fq) { const parts = fq.split(/\n?### /).slice(1); for (const p of parts) { const [q, ...a] = p.split('\n'); faqs.push([q.trim(), a.join(' ').replace(/\s+/g, ' ').trim()]) } }
    return { slug: meta.slug, path: '/post/' + meta.slug, title: meta.title, description: meta.description, h1: meta.h1, date: meta.date, cover: meta.cover, coverAlt: meta.coverAlt || meta.h1, keyword: meta.keyword || '', category: meta.category || 'Guides', status: meta.status || 'draft', body, words: body.split(/\s+/).length, faqs }
  }).filter((p) => includeDrafts || p.status === 'published').sort((a, b) => b.date.localeCompare(a.date))
}

/* ---- tiny markdown renderer ---- */
function inline(t: string, k = 0): React.ReactNode[] {
  const out: React.ReactNode[] = []; const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g; let last = 0; let m: RegExpExecArray | null; let i = 0
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(t.slice(last, m.index))
    if (m[1]) out.push(<strong key={k + '-' + i++}>{m[1]}</strong>)
    else { const ext = /^https?:/.test(m[3]); out.push(<a key={k + '-' + i++} href={ext ? m[3] : href(m[3])} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{m[2]}</a>) }
    last = re.lastIndex
  }
  if (last < t.length) out.push(t.slice(last))
  return out
}
function render(md: string) {
  const body = md.split(/\n## Frequently asked questions\s*\n/i)[0]
  const lines = body.split('\n'); const nodes: React.ReactNode[] = []; let para: string[] = []; let list: string[] = []; let olist: string[] = []; let quote: string[] = []
  const flush = (k: number) => {
    if (para.length) { nodes.push(<p key={'p' + k}>{inline(para.join(' '), k)}</p>); para = [] }
    if (list.length) { nodes.push(<ul key={'u' + k}>{list.map((l, i) => <li key={i}>{inline(l, k * 100 + i)}</li>)}</ul>); list = [] }
    if (olist.length) { nodes.push(<ol key={'o' + k}>{olist.map((l, i) => <li key={i}>{inline(l, k * 100 + i)}</li>)}</ol>); olist = [] }
    if (quote.length) { nodes.push(<aside key={'q' + k} className="post-callout">{inline(quote.join(' '), k)}</aside>); quote = [] }
  }
  lines.forEach((ln, k) => {
    const img = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/.exec(ln)
    if (!ln.trim()) return flush(k)
    if (img) { flush(k); nodes.push(<figure key={'f' + k} className="post-figure"><img src={imgSrc(img[2])} alt={img[1]} loading="lazy" decoding="async" />{img[3] ? <figcaption>{img[3]}</figcaption> : null}</figure>); return }
    if (/^### /.test(ln)) { flush(k); nodes.push(<h3 key={'h' + k}>{inline(ln.slice(4), k)}</h3>); return }
    if (/^## /.test(ln)) { flush(k); nodes.push(<h2 key={'h' + k} id={ln.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}>{inline(ln.slice(3), k)}</h2>); return }
    if (/^- /.test(ln)) { if (para.length || quote.length || olist.length) flush(k); list.push(ln.slice(2)); return }
    if (/^\d+\. /.test(ln)) { if (para.length || quote.length || list.length) flush(k); olist.push(ln.replace(/^\d+\. /, '')); return }
    if (/^> /.test(ln)) { if (para.length || list.length) flush(k); quote.push(ln.slice(2)); return }
    para.push(ln.trim())
  })
  flush(lines.length)
  return nodes
}
const toc = (md: string) => (md.split(/\n## Frequently asked questions\s*\n/i)[0].match(/^## .+$/gm) || []).map((h) => [h.slice(3), h.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')])
const longDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

export function NewPost({ post }: { post: BlogPost }) {
  const trail: [string, string][] = [['Home', '/'], ['All Posts', '/blog'], [post.h1.slice(0, 48), post.path]]
  const ld: object[] = [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.h1, description: post.description, image: ORIGIN + '/img/' + post.cover, datePublished: post.date, dateModified: post.date, mainEntityOfPage: ORIGIN + post.path, author: { '@type': 'Organization', name: BRAND.name, url: ORIGIN }, publisher: { '@type': 'Organization', name: BRAND.name, logo: { '@type': 'ImageObject', url: ORIGIN + '/img/ottawa-deck-pro-logo.png' } } }]
  if (post.faqs.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '') } })) })
  const meta: Meta = { title: post.title, desc: post.description, canonical: ORIGIN + post.path, og: ORIGIN + '/img/' + post.cover, extraLd: ld, ...(post.status !== 'published' ? { robots: 'noindex' } : {}) } as any
  const mins = Math.max(3, Math.round(post.words / 230))
  const T = toc(post.body)
  return (
    <Document meta={meta}>
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img src={imgSrc(post.cover)} alt={post.coverAlt} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-40 lg:pb-24 lg:pt-48">
          <Crumbs trail={trail} />
          {post.status !== 'published' ? <p className="mt-6 inline-block rounded-full bg-[#F4C430] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.16em] text-charcoal">Draft preview, not published</p> : null}
          <p className="mt-6 eyebrow text-bronze-light">{post.category}</p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">{post.h1}</h1>
          <p className="mt-6 text-[15px] text-ivory/70">{longDate(post.date)} · {mins} min read · By the Ottawa Deck Pro team</p>
        </div>
      </section>
      <div className="bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_280px] lg:py-20">
          <article className="article post-body">{render(post.body)}</article>
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              {T.length > 2 ? <nav className="rounded-[22px] bg-white p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,.4)]" aria-label="In this article"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite/45">In this article</p><ol className="mt-3 space-y-2 text-[14px]">{T.map(([t, id]) => <li key={id}><a href={'#' + id} className="text-graphite/75 hover:text-graphite">{t}</a></li>)}</ol></nav> : null}
              <div className="rounded-[22px] bg-charcoal p-6 text-ivory"><p className="font-display text-[20px] font-bold leading-tight">Planning a deck?</p><p className="mt-2 text-[14px] text-ivory/70">Get a free on-site quote. We reply within 1 business day.</p><Btn to="/contacts#estimate" className="mt-5 w-full justify-center">Free estimate <Arrow /></Btn><a href={href('/decks#calculator')} className="mt-3 block text-center text-[13px] text-ivory/70 underline underline-offset-4">Try the deck cost calculator</a></div>
            </div>
          </aside>
        </div>
      </div>
      {post.faqs.length ? (
        <section className="bg-white"><div className="mx-auto max-w-3xl px-5 py-16">
          <Eyebrow>FAQ</Eyebrow><h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-graphite/10 border-y border-graphite/10">{post.faqs.map(([q, a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">{q}<span className="text-bronze-dark transition group-open:rotate-45">+</span></summary><p className="mt-3 text-[16px] leading-relaxed text-graphite/75">{inline(a)}</p></details>)}</div>
        </div></section>
      ) : null}
      <EstimateSection photo={PHOTOS.luxuryCovered} />
    </Document>
  )
}

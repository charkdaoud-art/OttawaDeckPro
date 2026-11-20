import React from 'react'
import imageMap from '../content/image-map.json'
import { ORIGIN } from './site'

/** Render context: depth of the current page and whether we build the self-contained preview. */
export const CTX = { depth: 0, preview: false, path: '/' }

export function href(p?: string): string {
  if (!p) return '#'
  if (p.startsWith(ORIGIN)) p = p.slice(ORIGIN.length) || '/'
  if (p.startsWith('https://ottawadeckpro.ca')) p = p.slice('https://ottawadeckpro.ca'.length) || '/'
  if (/^(https?:|mailto:|tel:|#)/.test(p)) return p
  if (!CTX.preview) return p
  const [path, hash] = p.split('#')
  const clean = path.replace(/\/$/, '') || '/'
  const target = clean === '/' ? 'index.html' : clean.slice(1) + '/index.html'
  return '../'.repeat(CTX.depth) + target + (hash ? '#' + hash : '')
}
export const asset = (p: string) => (CTX.preview ? '../'.repeat(CTX.depth) : '/') + p
export const imgSrc = (file: string) => asset('img/' + file)

const MAP = imageMap as Record<string, string>
/** Local copy of a Wix image if we have one; in production fall back to the original URL. */
export function wixImage(url?: string): string | null {
  if (!url) return null
  const base = url.split('/v1/')[0]
  if (MAP[base]) return imgSrc(MAP[base])
  return CTX.preview ? null : base
}

/** Text from the crawl may hold [label](href) links and line breaks. */
export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const re = /\[([^\]]*)\]\(([^)]+)\)/g
  let last = 0, m: RegExpExecArray | null, k = 0
  const pushText = (t: string) => {
    t.split(/\n+/).forEach((line, i) => { if (i) parts.push(<br key={'b' + k++} />); if (line) parts.push(line) })
  }
  while ((m = re.exec(text))) {
    pushText(text.slice(last, m.index))
    const label = m[1].replace(/\n+/g, ' ').trim()
    if (label) {
      const h = m[2]
      const ext = /^https?:/.test(h) && !h.includes('ottawadeckpro.ca')
      parts.push(<a key={'a' + k++} href={href(h)} className="link" {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{label}</a>)
    }
    last = m.index + m[0].length
  }
  pushText(text.slice(last))
  return <>{parts}</>
}

export const plain = (t: string) => t.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1').replace(/\s*\n+\s*/g, ' ').replace(/\s+/g, ' ').trim()
export const isCaps = (t: string) => { const p = plain(t); return p.length > 3 && p === p.toUpperCase() && /[A-Z]/.test(p) }
export const slugify = (t: string) => plain(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

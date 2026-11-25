// New 2026 sections: divisions, reels, live feed, map markers, commercial spotlight, before/after, project wizard, team, lead paths.
import React from 'react'
import settings from '../content/collections/settings.json'
import projectsRaw from '../content/collections/projects.json'
const projects = (projectsRaw as any).items
import conceptsRaw from '../content/collections/commercialConcepts.json'
import wellnessPhotosRaw from '../content/collections/wellnessPhotos.json'
const concepts = (conceptsRaw as any).items
import reelsRaw from '../content/collections/reels.json'
const reels = (reelsRaw as any).items
import updatesRaw from '../content/collections/updates.json'
const updates = (updatesRaw as any).items
import beforeAfterRaw from '../content/collections/beforeAfter.json'
const beforeAfter = (beforeAfterRaw as any).items
import markersRaw from '../content/collections/mapMarkers.json'
const markers = (markersRaw as any).items
import teamRaw from '../content/collections/team.json'
const team = (teamRaw as any).items
import { href, imgSrc, asset } from './lib'
import { Arrow, Btn, Eyebrow } from './ui'
import { BRAND, PHOTOS, WALKTHROUGHS, COMMERCIAL_STOCK as CS } from './site'

export type MediaItem = { src: string; alt: string; caption?: string; category?: string; location?: string; beforeAfter?: string; source?: 'actual' | 'concept' | string }

/** Every image goes through this: swap `src` in the CMS and the layout stays the same. Concept images are always labelled. */
export function Media({ item, className = '', imgClass = '', sizes = '100vw', eager = false, showCaption = false }: { item: MediaItem; className?: string; imgClass?: string; sizes?: string; eager?: boolean; showCaption?: boolean }) {
  const concept = item.source === 'concept'
  const src = /^https?:|^\//.test(item.src) ? item.src : imgSrc(item.src)
  return (
    <figure className={`media ${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`} data-source={item.source || 'actual'} data-category={item.category || ''} data-location={item.location || ''} data-before-after={item.beforeAfter || 'none'}>
      <img src={src} alt={item.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes} className={`h-full w-full object-cover ${imgClass}`} />
      {showCaption && (item.caption || item.location) ? <figcaption className="absolute bottom-3 left-3 rounded-full bg-charcoal/70 px-3 py-1 text-[12px] text-ivory backdrop-blur">{[item.caption, item.location].filter(Boolean).join(' · ')}</figcaption> : null}
    </figure>
  )
}

const S = settings as any
const P = projects as any[]
// real photos first; labelled photoreal concept renderings fill in until project photos are uploaded
const byActual = (a: MediaItem, b: MediaItem) => (a.source === 'actual' ? 0 : 1) - (b.source === 'actual' ? 0 : 1)
const C = [...(concepts as MediaItem[])].sort(byActual)
const WELL = [...((wellnessPhotosRaw as any).items as MediaItem[])].sort(byActual)

/* Typographic panel used until real commercial / wellness photography is uploaded */
export function Panel({ kind, className = '', big = false }: { kind: 'commercial' | 'wellness'; className?: string; big?: boolean }) {
  const c = kind === 'commercial'
  return (
    <div className={`panel ${c ? 'panel-commercial' : 'panel-wellness'} ${className}`} role="img" aria-label={c ? 'Ottawa Deck Pro commercial division: 10+ condominium and multi-unit decks completed in 2026' : 'ODP Wellness: outdoor saunas and cold plunges'}>
      <div className="panel-lines" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7 lg:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">{c ? 'Commercial & multi-unit' : 'ODP Wellness'}</p>
        {c ? (
          <div><p className={`font-display font-light leading-none tracking-[-0.04em] ${big ? 'text-[clamp(6rem,14vw,12rem)]' : 'text-[clamp(4rem,9vw,7.5rem)]'}`}>10+</p><p className="mt-3 max-w-[260px] text-[13px] leading-snug opacity-80 sm:text-[15px]">Condominium and multi-unit decks completed in 2026.</p></div>
        ) : (
          <div><p className={`font-display font-light leading-[0.95] tracking-[-0.03em] ${big ? 'text-[clamp(3.4rem,7vw,6rem)]' : 'text-[clamp(2.8rem,5vw,4rem)]'}`}>Heat.<br />Cold.<br /><span className="opacity-60">Stillness.</span></p></div>
        )}
      </div>
    </div>
  )
}
const Visual = ({ kind, photos, className = '', big = false, sizes = '100vw' }: any) => photos.length ? <Media item={photos[0]} className={className} sizes={sizes} /> : <Panel kind={kind} className={className} big={big} />
const proj = (id: string) => P.find((p) => p.id === id)!.image as MediaItem
const WELLNESS_IMG: MediaItem = { src: 'wellness-hero.webp', alt: 'Concept rendering of a backyard sauna, cold plunge and composite deck at dusk', source: 'concept', category: 'wellness' }

const Section = ({ id, dark = false, tone = '', children, className = '' }: any) => (
  <section id={id} className={`${dark ? 'bg-charcoal text-ivory' : tone || 'bg-ivory'} ${className}`}><div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">{children}</div></section>
)
const Title = ({ eyebrow, children, light = false, sub }: any) => (
  <div className="max-w-3xl">
    {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
    <h2 className="reveal mt-4 font-display text-[clamp(2.3rem,4.8vw,4.4rem)] font-semibold leading-[1.0] tracking-[-0.035em]">{children}</h2>
    {sub ? <p className={`reveal mt-5 max-w-xl text-[17px] leading-relaxed ${light ? 'text-ivory/70' : 'text-graphite/70'}`}>{sub}</p> : null}
  </div>
)

/* 03 — three divisions */
export function Divisions() {
  const cards = [
    { k: 'Custom residential · Our specialty', title: 'Luxury Outdoor Living', quote: 'Beautifully designed decks and outdoor spaces crafted for the way you live.', img: { src: PHOTOS.loungeBalcony.file, alt: PHOTOS.loungeBalcony.alt, source: 'actual', category: 'residential' }, cta: 'Explore residential', to: '/decks',
      list: ['Custom composite decks', 'Premium pressure-treated decks', 'Cedar decks', 'Multi-level decks', 'Aluminum railings', 'Covered decks', 'Pergolas', 'Sunrooms', 'Complete backyard transformations'] },
    { k: 'Commercial & multi-unit', title: 'Built for bigger projects.', quote: 'Professional deck construction and replacement solutions for condominiums, multi-unit properties, and commercial developments.', img: null, kind: 'commercial', cta: 'Explore commercial', to: '/commercial-deck-construction',
      list: ['Condominium deck replacement', 'Multi-unit deck construction', 'Commercial deck installation', 'Apartment and townhouse decks', 'Property management upgrades', 'Large-scale deck rehabilitation', 'Multi-deck projects', 'Commercial aluminum railings'] },
    { k: 'ODP Wellness', title: 'Your private backyard retreat.', quote: 'Premium outdoor saunas, cold plunges, and beautifully integrated backyard wellness spaces.', img: null, kind: 'wellness', cta: 'Explore wellness', to: '/wellness',
      list: ['Outdoor saunas', 'Luxury cedar saunas', 'Modern glass-front saunas', 'Cold plunges', 'Sauna and cold-plunge combinations', 'Custom backyard wellness spaces', 'Smart sauna technology, where supported'] },
  ]
  return (
    <Section id="divisions" tone="bg-sand">
      <Title eyebrow={S.tagline} sub={S.statement}>Three divisions.<br />One standard of excellence.</Title>
      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
        {cards.map((c, i) => (
          <a key={c.k} href={href(c.to)} className={`division reveal group ${i === 0 ? 'division-lead lg:row-span-2' : 'division-side'}`} style={{ transitionDelay: i * 80 + 'ms' }}>
            {c.img ? <Media item={c.img} className="division-media" imgClass="transition duration-[1.4s] group-hover:scale-[1.05]" sizes="(min-width:1024px) 33vw, 100vw" /> : <Visual kind={(c as any).kind} photos={(c as any).kind === 'commercial' ? [CS.multiUnitReal] : WELL.slice(1)} className="division-media" />}
            <div className="p-7 lg:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bronze-dark">{c.k}</p>
              <h3 className="mt-3 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-graphite/65">{c.quote}</p>
              <p className="mt-5 text-[13px] leading-relaxed text-graphite/50">{c.list.slice(0, 5).join(' · ')}</p>
              <span className="mt-7 inline-flex items-center gap-2 border-b border-graphite/20 pb-1 text-[14px] font-semibold text-graphite transition group-hover:border-bronze group-hover:text-bronze-dark">{c.cta} <Arrow /></span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  )
}

/* 02 — social proof chips (verified, owner-provided) */
export function ProofStrip() {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {(S.verifiedStats as any[]).map((s) => (
        <div key={s.detail} className="proof-chip reveal"><span className="font-display text-[22px] font-extrabold">{s.value}</span><span className="text-[13px] leading-tight text-graphite/70"><b className="font-semibold uppercase tracking-[0.12em] text-graphite">{s.label}</b><br />{s.detail}</span></div>
      ))}
    </div>
  )
}

/* project walkthrough video card (muted preview, tap for full video with sound) */
export function WalkReel({ w }: { w: { src: string; preview: string; poster: string; title: string; desc: string } }) {
  return (
    <figure className="reel reveal" data-rv-video>
      <video src={asset(w.preview)} data-full={asset(w.src)} poster={imgSrc(w.poster)} muted loop playsInline autoPlay preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-label={w.title + ': ' + w.desc} />
      <span className="reel-shade" />
      <button type="button" className="rv-play" data-rv-play><span aria-hidden="true">▶</span> Watch</button>
      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">Project walkthrough</span>
      <figcaption className="pointer-events-none absolute inset-x-4 bottom-16 z-[2] text-left"><span className="block text-[15px] font-semibold leading-snug">{w.title}</span><span className="mt-1 block text-[12px] text-ivory/65">{w.desc}</span></figcaption>
    </figure>
  )
}

/* 05 — reels */
const IG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
const FB = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v6h4v-6h3l.5-4H14V8.6c0-.4.2-.6.6-.6z" /></svg>
export function Reels() {
  const list = reels as any[]
  const featured = (S.verifiedStats as any[]).find((s) => /views/i.test(s.label))
  // Until Reel URLs are added in the CMS, the slots show real project photos that link to the profiles (no fake view counts).
  const fallback = [PHOTOS.frameStairs, PHOTOS.screenBbq, PHOTOS.ptBalcony, PHOTOS.brownStairs].map((ph, i) => ({ platform: i % 2 ? 'facebook' : 'instagram', url: i % 2 ? BRAND.facebook : BRAND.instagram, image: { src: ph.file, alt: ph.alt, source: 'actual', category: ph.cats[0] }, description: ph.alt.split(/ with | and /)[0] }))
  const cards = list.length ? list : fallback
  return (
    <section id="reels" className="overflow-hidden bg-charcoal text-ivory">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 lg:px-10 lg:pt-20">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Title eyebrow="On Instagram & Facebook" light sub="Real projects. Real craftsmanship. Real people. Follow the Ottawa Deck Pro team as we transform outdoor spaces across the city.">Built in Ottawa.<br /><span className="text-bronze-light">Watched everywhere.</span></Title>
          {featured ? <div className="reveal shrink-0 border-l border-ivory/15 pl-6"><p className="font-display text-[64px] font-extrabold leading-none" data-count={featured.value}>{featured.value}</p><p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory/60">Views</p><p className="mt-1 max-w-[220px] text-[14px] text-ivory/70">{featured.detail}</p></div> : null}
        </div>
      </div>
      <div className="reel-track no-scrollbar" data-reels tabIndex={0} aria-label="Reels">
        <figure className="reel reveal" data-rv-video>
          <video src={asset('media/testimonial-preview.mp4')} data-full={asset('media/testimonial-reel.mp4')} poster={imgSrc('ottawa-deck-pro-client-testimonial.webp')} muted loop playsInline autoPlay preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-label="Client testimonial Reel" />
          <span className="reel-shade" />
          <button type="button" className="rv-play" data-rv-play><span aria-hidden="true">▶</span> Play with sound</button>
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-semibold backdrop-blur"><IG />Client testimonial</span>
        </figure>
        {WALKTHROUGHS.map((w) => <WalkReel key={w.src} w={w} />)}
        {cards.map((r: any, i: number) => (
          <a key={i} href={r.url} target="_blank" rel="noopener" className="reel reveal" aria-label={`${r.platform === 'facebook' ? 'Facebook' : 'Instagram'}: ${r.description}`}>
            <Media item={r.image || { src: r.thumbnail, alt: r.description }} className="absolute inset-0" />
            <span className="reel-shade" />
            <span className="reel-play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">{r.platform === 'facebook' ? <FB /> : <IG />}{r.views && r.viewsVerified ? r.views + ' views' : r.platform === 'facebook' ? 'Facebook' : 'Instagram'}</span>
            <span className="absolute inset-x-4 bottom-4 text-left"><span className="block text-[15px] font-semibold leading-snug">{r.description}</span>{r.location ? <span className="mt-1 block text-[12px] text-ivory/65">{r.location}</span> : null}</span>
          </a>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-5 pb-14 lg:px-10 lg:pb-20">
        <a href={BRAND.instagram} target="_blank" rel="noopener" className="btn btn-primary">Follow the build <Arrow /></a>
        <a href={BRAND.facebook} target="_blank" rel="noopener" className="btn btn-ghost-light"><FB /> Facebook</a>
        {!list.length ? <p className="text-[12px] text-ivory/45">Reel links are added from the admin panel.</p> : null}
      </div>
    </section>
  )
}

/* 07 — map: same look as before, plus project markers and filters */
const MAP_PTS: [string, string, number, number][] = [
  ['Arnprior', '/deck-builder-arnprior', 8, 30], ['Dunrobin', '/deck-builder-dunrobin', 30, 18], ['Carp', '/deck-builder-carp', 26, 36], ['Kanata', '/deck-builder-kanata', 38, 44],
  ['Carleton Place', '/deck-builder-carleton-place', 12, 56], ['Stittsville', '/deck-builder-stittsville', 32, 56], ['Bells Corners', '/deck-builder-bells-corners', 46, 52], ['Westboro', '/deck-builder-westboro', 57, 42],
  ['Nepean', '/deck-builder-nepean', 52, 58], ['Vanier', '/deck-builder-vanier', 66, 40], ['Orleans', '/deck-builder-orleans', 80, 40], ['Cumberland', '/deck-builder-cumberland', 84, 28],
  ['Gloucester', '/deck-builder-gloucester', 72, 52], ['Barrhaven', '/deck-builder-barrhaven', 50, 70], ['Riverside South', '/deck-builder-riverside-south', 62, 72], ['Findlay Creek', '/deck-builder-findlay-creek', 72, 66],
  ['Manotick', '/deck-builder-manotick', 56, 84], ['Greely', '/deck-builder-greely', 72, 84], ['Osgoode', '/deck-builder-osgoode', 66, 96], ['Metcalfe', '/composite-deck-metcalfe', 80, 90],
]
const MAP_FILTERS = [['all', 'All projects'], ['residential', 'Residential'], ['commercial', 'Commercial'], ['composite', 'Composite decks'], ['wood', 'Wood decks'], ['railings', 'Railings'], ['wellness', 'Wellness']]
export function ShowroomMap({ legacyHeading }: { legacyHeading: string }) {
  const M = markers as any[]
  return (
    <Section id="map">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr]">
        <div>
          <Eyebrow>Service areas</Eyebrow>
          <h2 className="reveal mt-4 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.015em]">Ottawa is our showroom.</h2>
          <h3 className="mt-5 text-[19px] font-semibold">{legacyHeading}</h3>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-graphite/70">{BRAND.radius} Based at {BRAND.street}. Gold markers are verified client reviews; project markers are added as projects are documented.</p>
          <div className="mt-7 flex flex-wrap gap-2" role="toolbar" aria-label="Filter map" data-map-filters>
            {MAP_FILTERS.map(([id, l], i) => <button key={id} type="button" className={`chip ${i === 0 ? 'chip-on' : ''}`} data-map-filter={id} aria-pressed={i === 0}>{l}</button>)}
          </div>
          <p className="mt-4 text-[13px] text-graphite/55" data-map-empty hidden>No documented projects in this category yet.</p>
          <Btn to="/service-areas" variant="outline" className="mt-8">All service areas <Arrow /></Btn>
        </div>
        <div className="reveal map-live relative aspect-[5/4] overflow-hidden rounded-[28px]" data-map>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><radialGradient id="mapGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#7CBC42" stopOpacity=".28" /><stop offset="1" stopColor="#7CBC42" stopOpacity="0" /></radialGradient></defs>
            <circle cx="50" cy="48" r="44" fill="url(#mapGlow)" />
            <path d="M8 70 C 22 62, 30 80, 46 74 S 70 60, 92 70" stroke="#ffffff" strokeOpacity=".55" strokeWidth=".5" fill="none" />
            <path d="M4 52 C 20 46, 34 58, 50 52 S 80 40, 98 46" stroke="#ffffff" strokeOpacity=".45" strokeWidth=".5" fill="none" />
            <path d="M10 88 C 30 82, 52 94, 70 86 S 90 82, 100 84" stroke="#ffffff" strokeOpacity=".45" strokeWidth=".5" fill="none" />
            <path d="M0 34 C 20 30, 40 34, 60 30 S 90 22, 100 24" stroke="#7FB8E0" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M0 34 C 20 30, 40 34, 60 30 S 90 22, 100 24" stroke="#BFE0F5" strokeWidth="1" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="48" r="44" stroke="#4F8A2A" strokeOpacity=".55" strokeDasharray="1.2 1.4" fill="none" strokeWidth=".45" />
          </svg>
          <span className="absolute left-[3%] top-[6%] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3d6f8f]">Ottawa River</span>
          <span className="map-radius-tag">60 km service radius</span>
          {MAP_PTS.map(([n, p, x, y]) => <a key={n} href={href(p)} className="map-pt" style={{ left: x + '%', top: y + '%' }}><i />{n}</a>)}
          {M.map((m) => (
            <button key={m.id} type="button" className="map-marker" style={{ left: m.x + '%', top: m.y + '%' }} data-marker data-cats={[m.division, m.category].join(' ')}
              data-title={m.title} data-desc={m.description} data-area={m.area} data-link={m.link || ''} data-img={m.image ? imgSrc(m.image.src) : ''} data-type={m.type} aria-label={m.title}>
              <span />
            </button>
          ))}
          <div className="map-card" data-map-card hidden role="dialog" aria-label="Project">
            <button type="button" className="absolute right-3 top-2 text-[22px] text-graphite/50" data-map-close aria-label="Close">×</button>
            <img alt="" data-mc-img hidden className="mb-3 aspect-[16/9] w-full rounded-xl object-cover" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze-dark" data-mc-area />
            <p className="mt-1 font-display text-[18px] font-bold" data-mc-title />
            <p className="mt-2 text-[14px] leading-relaxed text-graphite/70" data-mc-desc />
            <a className="link mt-3 inline-block text-[14px]" data-mc-link target="_blank" rel="noopener">View</a>
          </div>
          <span className="absolute right-4 top-[6%] text-[10px] text-graphite/45">Schematic, not to scale</span>
        </div>
      </div>
    </Section>
  )
}

/* 08 — live construction feed */
const STATUS = ['PROJECT STARTED', 'FRAMING UNDERWAY', 'DECKING INSTALLATION', 'RAILINGS IN PROGRESS', 'FINAL DETAILS', 'PROJECT COMPLETED']
export function LiveFeed() {
  const U = [...(updates as any[])].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  if (!U.length) return null // appears automatically once the first jobsite update is posted in /admin
  const recent = ['grey-raised', 'pool-deck', 'front-porch-railing', 'timber-portico'].map((id) => P.find((p) => p.id === id))
  return (
    <Section id="on-site" tone="bg-sand">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <Title eyebrow="From the jobsite" sub="From residential backyard transformations to multi-unit commercial construction, follow the Ottawa Deck Pro team on the job.">We’re out there.<br />Every day.</Title>
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-graphite/60"><span className={`live-dot ${U.length ? '' : 'idle'}`} />{U.length ? 'Live jobsite journal' : 'Recent completed work'}</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {U.length ? U.slice(0, 8).map((u, i) => (
          <article key={i} className="feed-card reveal">
            <Media item={{ src: u.image, alt: u.caption, source: 'actual', category: u.category, location: u.area }} className="aspect-[4/5]" />
            <div className="p-5"><p className="status">{u.status}</p><p className="mt-3 text-[15px] font-semibold leading-snug">{u.caption}</p><p className="mt-2 text-[13px] text-graphite/55">{[u.category, u.area].filter(Boolean).join(' · ')} · <time dateTime={u.date}>{new Date(u.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</time></p></div>
          </article>
        )) : recent.map((p, i) => (
          <article key={p.id} className="feed-card reveal">
            <Media item={p.image} className="aspect-[4/5]" />
            <div className="p-5"><p className="status done">PROJECT COMPLETED</p><p className="mt-3 text-[15px] font-semibold leading-snug">{p.title}</p><p className="mt-2 text-[13px] text-graphite/55">Residential · completed work</p></div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-[12px] text-graphite/50">Statuses used on updates: {STATUS.join(' · ')}. Every update shows its real publication date.</p>
    </Section>
  )
}

/* 09 — commercial spotlight */
export function CommercialSpotlight() {
  return (
    <section id="commercial" className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <div>
            <Title eyebrow="Commercial & multi-unit" light sub="From one exceptional backyard to full condominium developments, Ottawa Deck Pro brings the same commitment to quality to every project.">Built for homes.<br /><span className="text-bronze-light">Equipped for scale.</span></Title>
            <Btn to="/commercial-deck-construction" className="mt-9">Explore our commercial work <Arrow /></Btn>
          </div>
          <div className="grid grid-cols-2 gap-3 reveal">
            <Visual kind="commercial" photos={[CS.rooftopNight]} className="aspect-[3/4] rounded-[24px]" sizes="(min-width:1024px) 28vw, 50vw" />
            <Visual kind="commercial" photos={[CS.condoRooftop]} className="aspect-[3/4] rounded-[24px]" sizes="(min-width:1024px) 28vw, 50vw" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* 10 — before / after */
export function Transformations() {
  const B = beforeAfter as any[]
  return (
    <Section id="transformations" dark>
      <Title eyebrow="Before & after" light sub="Drag the handle to reveal the finished project. Real before-and-after photos from an Ottawa Deck Pro project.">The transformation<br /><span className="text-bronze-light">speaks for itself.</span></Title>
      <div className="mt-12" data-ba-grid>
        {B.slice(0, 1).map((b) => (
          <div key={b.id}>
            <div className="ba ba-wide reveal" data-ba style={{ ['--pos' as any]: '50%' }}>
              <img src={imgSrc(b.after.src)} alt={b.after.alt} className="ba-img" loading="lazy" />
              <div className="ba-before"><img src={imgSrc(b.before.src)} alt={b.before.alt} className="ba-img" loading="lazy" /></div>
              <span className="ba-tag left-4">Before</span><span className="ba-tag right-4">After</span>
              <input type="range" min="0" max="100" defaultValue="50" aria-label={`Compare before and after: ${b.title}`} className="ba-range" />
              <span className="ba-handle" aria-hidden="true" />
            </div>
            <p className="mt-4 text-[15px] text-ivory/65">{b.title}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* Crew */
export function Crew() {
  return (
    <section id="crew" className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-8 pt-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-10 lg:pb-10 lg:pt-20">
        <figure className="reveal order-2 overflow-hidden rounded-[28px] lg:order-1"><img src={imgSrc('ottawa-deck-pro-team.webp')} alt="The Ottawa Deck Pro team in front of a finished composite deck project" loading="lazy" className="aspect-[16/10] w-full object-cover" /></figure>
        <div className="reveal order-1 lg:order-2">
          <Eyebrow>Meet the team</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.035em]">The people behind<br />the projects.</h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-graphite/70">A local Stittsville crew that designs, builds and answers your calls. The same people who quote your project are the ones who show up to build it.</p>
          <Btn to="/contacts#estimate" variant="dark" className="mt-8">Book a consultation <Arrow /></Btn>
        </div>
      </div>
      {(() => {
        const card = ([src, name, sub, alt, cls = '']: string[]) => (
          <figure key={src} className={`reveal group relative overflow-hidden rounded-[22px] bg-charcoal ${cls}`}>
            <img src={imgSrc(src)} alt={alt} loading="lazy" className="aspect-[4/5] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-4 pt-12 text-ivory sm:p-5 sm:pt-16"><span className="block font-display text-[20px] font-bold leading-none">{name}</span><span className="mt-1.5 block text-[12.5px] leading-snug text-ivory/75">{sub}</span></figcaption>
          </figure>
        )
        return (<>
          {/* founders and office on top, centred over the crew */}
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-5 sm:gap-4 lg:grid-cols-4 lg:px-10">
            {[
              ['charbel-founder-ottawa-deck-pro.webp', 'Charbel', 'Founder', 'Charbel, founder of Ottawa Deck Pro, in a white Ottawa Deck Pro hoodie', 'lg:col-start-2'],
              ['stephanie-office-ottawa-deck-pro.webp', 'Stephanie', 'Office and client care. Your first call, every schedule and every detail in between.', 'Stephanie from the Ottawa Deck Pro office in a white Ottawa Deck Pro hoodie'],
            ].map(card)}
          </div>
          <div className="mx-auto mt-3 grid max-w-[1440px] grid-cols-2 gap-3 px-5 pb-14 sm:mt-4 sm:gap-4 lg:grid-cols-4 lg:px-10 lg:pb-20">
            {[
              ['elie-ottawa-deck-pro-crew.webp', 'Elie', 'Co-founder', 'Elie, co-founder of Ottawa Deck Pro', 'lg:order-2'],
              ['mike-ottawa-deck-pro-deck-builder.webp', 'Mike', 'Team lead', 'Mike, team lead at Ottawa Deck Pro', 'lg:order-1'],
              ['sami-and-ivy-ottawa-deck-pro-crew.webp', 'Sami & Ivy', 'Site manager. Ivy is our unofficial site inspector', 'Sami, site manager at Ottawa Deck Pro, holding Ivy, a French bulldog wearing sunglasses', 'lg:order-3'],
              ['constantine-coast-ottawa-deck-pro-crew.webp', 'Constantine “Coast”', 'Ottawa Deck Pro crew', 'Constantine, known as Coast, from the Ottawa Deck Pro crew', 'lg:order-4'],
            ].map(card)}
          </div>
        </>)
      })()}
    </section>
  )
}

/* 12 — interactive project inspiration */
export function ProjectWizard() {
  const opt = (name: string, values: string[]) => (
    <fieldset className="wiz-field"><legend>{name}</legend><div className="flex flex-wrap gap-2">{values.map((v) => <label key={v} className="wiz-opt"><input type="radio" name={'wz-' + name} value={v} /><span>{v}</span></label>)}</div></fieldset>
  )
  return (
    <Section id="plan" tone="bg-white">
      <Title eyebrow="Plan your project" sub="Choose your project, pick your options, see relevant work, then send it to us as a custom estimate request. No instant prices: every quote is built for your site.">Your vision.<br /><span className="text-bronze">Our craftsmanship.</span></Title>
      <div className="wizard mt-12" data-wizard>
        <ol className="wiz-steps" aria-label="Steps"><li data-step-dot="1" className="on">Select</li><li data-step-dot="2">Options</li><li data-step-dot="3">Inspiration</li><li data-step-dot="4">Estimate</li></ol>
        <div data-step="1">
          <div className="grid gap-4 md:grid-cols-3">
            {[['residential', 'Luxury Residential Deck', { src: PHOTOS.loungeBalcony.file, alt: PHOTOS.loungeBalcony.alt, source: 'actual', category: 'residential' }], ['commercial', 'Commercial / Multi-Unit Project', CS.multiUnitReal], ['wellness', 'Outdoor Wellness', WELL[1]]].map(([k, l, im]: any) => (
              <button key={k} type="button" className="wiz-type group" data-wiz-type={k}>{im ? <Media item={im} className="aspect-[4/3]" imgClass="transition duration-700 group-hover:scale-105" sizes="33vw" /> : <Panel kind={k} className="aspect-[4/3]" />}<span className="block p-5 text-left font-display text-[19px] font-semibold tracking-tight">{l}</span></button>
            ))}
          </div>
        </div>
        <div data-step="2" hidden>
          <div data-wiz-opts="residential" hidden>{opt('Deck size', ['Under 150 sq ft', '150–300 sq ft', '300–500 sq ft', '500+ sq ft'])}{opt('Material', ['Composite', 'PVC', 'Pressure-treated', 'Cedar'])}{opt('Railing style', ['Aluminum picket', 'Glass', 'Wood & aluminum hybrid', 'None'])}{opt('Cover', ['Uncovered', 'Covered / roof', 'Pergola'])}{opt('Upgrades', ['Lighting', 'Privacy screens', 'Skirting', 'Multi-level', 'Hot tub ready'])}</div>
          <div data-wiz-opts="commercial" hidden>{opt('Property type', ['Condominium', 'Apartment', 'Townhouse complex', 'Commercial property'])}{opt('Number of decks', ['2–5', '6–10', '10–25', '25+'])}{opt('Approximate deck size', ['Under 80 sq ft', '80–150 sq ft', '150+ sq ft', 'Mixed'])}{opt('Scope', ['Replacement', 'New construction', 'Rehabilitation'])}{opt('Timeline', ['This season', 'Next season', 'Planning / budgeting'])}</div>
          <div data-wiz-opts="wellness" hidden>{opt('Interest', ['Sauna', 'Cold plunge', 'Sauna + plunge combination', 'Custom wellness area'])}{opt('Capacity', ['2–4 people', '4–6 people', 'Larger / custom'])}</div>
          <div className="mt-8 flex gap-3"><button type="button" className="btn btn-outline" data-wiz-back>Back</button><button type="button" className="btn btn-dark" data-wiz-next>See inspiration <Arrow /></button></div>
        </div>
        <div data-step="3" hidden>
          <div className="grid gap-3 md:grid-cols-3" data-wiz-insp />
          <div className="hidden" data-insp-pool>
            {P.map((p) => <span key={p.id} data-k={'residential ' + p.category} data-src={imgSrc(p.image.src)} data-alt={p.image.alt} data-concept="0" />)}
            {C.map((c) => <span key={c.src} data-k="commercial" data-src={imgSrc(c.src)} data-alt={c.alt} data-concept="0" />)}
            {WELL.map((c) => <span key={c.src} data-k="wellness" data-src={imgSrc(c.src)} data-alt={c.alt} data-concept="0" />)}
          </div>
          <div className="mt-8 flex gap-3"><button type="button" className="btn btn-outline" data-wiz-back>Back</button><button type="button" className="btn btn-dark" data-wiz-next>Request a custom estimate <Arrow /></button></div>
        </div>
        <div data-step="4" hidden>
          <p className="text-[17px] text-graphite/70">Your selections are attached to the estimate form below.</p>
          <div className="mt-4 rounded-2xl bg-ivory p-5 text-[15px]" data-wiz-summary />
          <a href="#estimate" className="btn btn-dark mt-6" data-wiz-go>Continue to the estimate form <Arrow /></a>
        </div>
      </div>
    </Section>
  )
}

/* 13 — team */
export function Team() {
  const T = (team as any[]).filter((m) => m.photo)
  if (!T.length) return null // shows once team photos are added in /admin
  return (
    <Section id="team" tone="bg-white">
      <Title eyebrow="Meet the team" sub="People want to know who is coming to their property. These are the people who plan, build and answer your calls.">The people behind<br />the projects.</Title>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {T.map((m, i) => (
          <article key={i} className="reveal overflow-hidden rounded-[24px] bg-ivory">
            {m.photo ? <Media item={m.photo} className="aspect-[4/5]" /> : <div className="team-ph aspect-[1/1] sm:aspect-[4/5]"><span>Team photo<br />coming soon</span></div>}
            <div className="p-4 sm:p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze-dark">{m.group}</p><h3 className="mt-2 font-display text-[20px] font-bold">{m.name || m.role}</h3>{m.bio ? <p className="mt-2 text-[14px] text-graphite/65">{m.bio}</p> : null}</div>
          </article>
        ))}
      </div>
    </Section>
  )
}

/* REAL PEOPLE. REAL PROJECTS. REAL RESULTS. */
export function RealResults() {
  return (
    <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-graphite/10 md:grid-cols-3">
      {[['Real people', 'An Ottawa-based crew and team you can call at 613-639-1744.'], ['Real projects', 'Every photo marked as a project on this site is Ottawa Deck Pro work. Concept renderings are labelled.'], ['Real results', 'Reviews from named Ottawa-area homeowners, linked to their Google profiles.']].map(([t, d]) => (
        <div key={t} className="reveal bg-ivory p-8"><h3 className="font-display text-[22px] font-extrabold uppercase">{t}.</h3><p className="mt-3 text-[15px] leading-relaxed text-graphite/65">{d}</p></div>
      ))}
    </div>
  )
}

/* Premium layouts for the core service pages: /decks, /railings, /staining, /fences.
   Every original heading, paragraph and internal link from the Wix pages is kept (see qa.py). */
import React from 'react'
import blocksJson from '../content/blocks.json'
import pricingJson from '../content/collections/pricing.json'
import { BRAND, PHOTOS, type Photo } from './site'
import { href, imgSrc, wixImage, Inline, plain } from './lib'
import { type Block } from './parse'
import { Document, Crumbs, crumbLd, Testimonials, faqLd, EstimateSection, Btn, Arrow, Eyebrow, Img, TrustBar, type Meta } from './ui'
import { Transformations } from './divisions'
import { pickFaqs, toQA, MoreFaqs } from './faqs'

const B = blocksJson as Record<string, Block[]>
const P = pricingJson as any
const STOCK = /wood-deck-boards-ottawa|deck-staining-application-ottawa/
const x = (path: string, i: number) => (B[path][i] as any).x as string
const h = (path: string, i: number) => (B[path][i] as any).h as string
const src = (path: string, i: number) => wixImage((B[path][i] as any).s) || ''
const imgsIn = (path: string, from: number, to: number, drop: string[] = []) => {
  const out: string[] = []
  for (let i = from; i <= to; i++) { const b = B[path][i] as any; if (b?.t !== 'img') continue; const s = wixImage(b.s); if (!s || STOCK.test(s) || drop.some((d) => s.includes(d)) || out.includes(s)) continue; out.push(s) }
  return out
}
const stats = (path: string) => { const bl = B[path]; const i0 = bl.findIndex((b) => b.t === 'h2' && /PROJECT STATS/.test(b.x || '')); const out: [string, string][] = []; for (let i = i0 + 1; i < bl.length - 1; i += 2) { if (bl[i].t !== 'h6' || bl[i + 1].t !== 'h3') break; out.push([bl[i].x || '', bl[i + 1].x || '']) } return out }
const Pic = ({ s, className = '', eager = false }: { s: string; className?: string; eager?: boolean }) => <img src={s} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />

function SvcHero({ trail, h1, intro, photo, s, eyebrow, second }: { trail: [string, string][]; h1: string; intro: string; photo?: Photo; s?: string; eyebrow: string; second?: [string, string] }) {
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-charcoal text-ivory">
      <div className="parallax absolute inset-0 -z-10" data-parallax>{photo ? <Img photo={photo} eager className="hero-img kenburns h-full w-full object-cover" /> : <Pic s={s!} eager className="hero-img kenburns h-full w-full object-cover" />}</div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/35" />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-36 lg:px-10 lg:pb-20">
        <div className="reveal"><Crumbs trail={trail} /></div>
        <p className="reveal eyebrow mt-8 text-bronze-light">{eyebrow}</p>
        <h1 className="reveal mt-4 font-display text-[clamp(3rem,9vw,8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">{h1}</h1>
        <p className="reveal mt-6 max-w-2xl text-[18px] leading-relaxed text-ivory/85"><Inline text={intro} /></p>
        <div className="reveal mt-9 flex flex-wrap gap-3">
          <Btn to="/contacts#estimate">Get a free estimate <Arrow /></Btn>
          {second ? <a href={second[1]} className="btn btn-ghost-light">{second[0]}</a> : null}
          <a href={BRAND.phoneHref} className="btn btn-ghost-light" data-track="phone">Call {BRAND.phone}</a>
        </div>
      </div>
    </section>
  )
}

function Head({ eyebrow, title, sub, center = false, light = false, as = 'h2' }: { eyebrow?: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean; light?: boolean; as?: 'h2' | 'h3' }) {
  const H = as
  return (
    <div className={`reveal ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <H className="mt-4 font-display text-[clamp(2.1rem,4.4vw,3.8rem)] font-bold uppercase leading-[1] tracking-[-0.02em]">{title}</H>
      {sub ? <p className={`mt-5 text-[17px] leading-relaxed ${light ? 'text-ivory/70' : 'text-graphite/70'}`}>{sub}</p> : null}
    </div>
  )
}

function TypeCards({ items }: { items: { title: string; text: string; photo?: Photo; s?: string; chip?: string }[] }) {
  return (
    <div className={`mt-12 grid gap-5 sm:grid-cols-2 ${items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {items.map((it) => (
        <article key={it.title} className="svc-card reveal group">
          <div className="svc-card-media">{it.photo ? <Img photo={it.photo} className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-[1.06]" sizes="(min-width:1024px) 25vw, 50vw" /> : <Pic s={it.s!} className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-[1.06]" />}{it.chip ? <span className="svc-chip">{it.chip}</span> : null}</div>
          <div className="p-6"><h3 className="font-display text-[20px] font-bold uppercase tracking-tight">{it.title}</h3><p className="mt-2 text-[15px] leading-relaxed text-graphite/70">{it.text}</p></div>
        </article>
      ))}
    </div>
  )
}

function Gallery({ items }: { items: string[] }) {
  return <div className="svc-gallery mt-10">{items.map((s) => <figure key={s} className="reveal svc-gal-item"><Pic s={s} className="block w-full transition duration-[1.2s] hover:scale-[1.04]" /></figure>)}</div>
}

function TrustStats({ path, heading, text, links = [], photo }: { path: string; heading: string; text?: string; links?: [string, string][]; photo: Photo }) {
  const S = stats(path)
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
      <div className="absolute inset-0 -z-10 opacity-25"><Img photo={photo} className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:px-10 lg:py-20">
        <div className="reveal">
          <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.02em]">{heading}</h2>
          {text ? <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/70">{text}</p> : null}
          <div className="mt-7 flex flex-wrap gap-3">{links.map(([l, to], i) => i === 0 ? <Btn key={to} to={to}>{l} <Arrow /></Btn> : <a key={to} href={to} target={/^https?:/.test(to) ? '_blank' : undefined} rel="noopener" className="btn btn-ghost-light">{l}</a>)}</div>
        </div>
        <div className="reveal">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-light">PROJECT STATS</p>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ivory/10">
            {S.map(([l, v]) => <div key={l} className="bg-charcoal/80 p-6"><dd className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-none tracking-[-0.03em]">{v}</dd><dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze-light">{l}</dt></div>)}
          </dl>
        </div>
      </div>
    </section>
  )
}

const REVIEW_VIDEO = { src: 'media/kanata-composite-deck-client-testimonial.mp4', preview: 'media/kanata-composite-deck-client-testimonial-preview.mp4', poster: 'kanata-composite-deck-client-testimonial.webp', caption: 'Client testimonial · Composite deck in Kanata', label: 'Kanata homeowners talk about their new composite deck with Ottawa Deck Pro' }

function Tail({ path, reviewsHeading, reviewsEyebrow, planning, sub, estHeading, photo }: { path: string; reviewsHeading?: string; reviewsEyebrow?: string; planning: string; sub: string; estHeading?: string; photo: Photo }) {
  return <>
    <Testimonials heading={reviewsHeading} eyebrow={reviewsEyebrow} limit={6} allHref="/reviews" video={REVIEW_VIDEO} />
    <MoreFaqs items={pickFaqs(path, [], 6)} />
    <EstimateSection eyebrow={plain(planning)} sub={sub} photo={photo} {...(estHeading ? { heading: estHeading } : {})} />
  </>
}
const meta = (metaFor: (p: string, ld?: object[]) => Meta, path: string, trail: [string, string][]) => metaFor(path, [crumbLd(trail), faqLd(toQA(pickFaqs(path, [], 6)))])

/* ---------------- /decks ---------------- */
const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-CA')
function DeckCalculator() {
  const cfg = { materials: P.materials, railings: P.railings, stairs: P.stairs }
  const matPhoto: Record<string, Photo> = { pt: PHOTOS.ptLarge, cedar: PHOTOS.cedarDeck, composite: PHOTOS.frameStairs, pvc: PHOTOS.greyWater }
  return (
    <div className="calc reveal mt-12" data-calc={JSON.stringify(cfg)}>
      <div className="calc-inputs">
        <fieldset className="calc-group">
          <legend>1. Deck size</legend>
          <div className="calc-size">
            <label><span>Length (ft)</span><input type="number" min="4" max="80" step="1" defaultValue="16" data-calc-l inputMode="numeric" /></label>
            <span className="calc-x">×</span>
            <label><span>Width (ft)</span><input type="number" min="4" max="60" step="1" defaultValue="12" data-calc-w inputMode="numeric" /></label>
            <p className="calc-area"><b data-calc-area>192</b> sq ft</p>
          </div>
          <input type="range" min="60" max="1200" step="10" defaultValue="192" className="calc-range" data-calc-slider aria-label="Deck area in square feet" />
        </fieldset>
        <fieldset className="calc-group">
          <legend>2. Decking material</legend>
          <div className="calc-mats">
            {P.materials.map((m: any, i: number) => (
              <label key={m.id} className="calc-mat"><input type="radio" name="calc-mat" value={m.id} defaultChecked={m.id === 'composite'} /><span className="calc-mat-img"><Img photo={matPhoto[m.id]} className="h-full w-full object-cover" sizes="160px" /></span><span className="calc-mat-name">{m.label}</span><span className="calc-mat-price">${m.low} to ${m.high}{m.plus ? '+' : ''}/sq ft</span></label>
            ))}
          </div>
        </fieldset>
        <fieldset className="calc-group">
          <legend>3. Railing</legend>
          <div className="calc-chips">{P.railings.map((r: any) => <label key={r.id} className="calc-chip"><input type="radio" name="calc-rail" value={r.id} defaultChecked={r.id === 'aluminum'} /><span>{r.label}</span></label>)}</div>
          <label className="calc-lf" data-calc-lf-wrap><span>Railing length (ft)</span><input type="number" min="0" max="400" defaultValue="40" data-calc-lf inputMode="numeric" /><small>Estimated from your size (3 open sides). Adjust if needed.</small></label>
        </fieldset>
        <fieldset className="calc-group">
          <legend>4. Stairs</legend>
          <div className="calc-chips">{P.stairs.map((s: any) => <label key={s.id} className="calc-chip"><input type="radio" name="calc-stairs" value={s.id} defaultChecked={s.id === 'short'} /><span>{s.label}</span></label>)}</div>
        </fieldset>
      </div>
      <aside className="calc-result">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bronze-light">Your estimated range</p>
        <p className="calc-total" data-calc-total aria-live="polite">$15,000 to $25,000</p>
        <p className="mt-5 text-[13px] leading-relaxed text-ivory/60">Typical installed price in Ottawa, before tax. Height, site access, permits and design details change the final number. A free on-site quote gives you the exact price.</p>
        <a href="#estimate" className="btn btn-primary mt-6 w-full justify-center" data-calc-cta>Get my exact quote <Arrow /></a>
      </aside>
    </div>
  )
}

export function DecksPage({ metaFor }: { metaFor: (p: string, ld?: object[]) => Meta }) {
  const path = '/decks'
  const trail: [string, string][] = [['Home', '/'], ['Decks', path]]
  return (
    <Document meta={meta(metaFor, path, trail)}>
      <SvcHero trail={trail} h1={x(path, 2)} intro={x(path, 3)} photo={PHOTOS.wrapStairs} eyebrow="Ottawa deck builders" second={['Estimate my cost', '#calculator']} />
      <TrustBar />

      <section className="bg-ivory"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head eyebrow="Choose your material" title={<>Four materials.<br />One standard.</>} sub="Every deck is framed to Ontario code by our own crew. Pick the surface that fits your backyard, budget and how much upkeep you want." />
        <TypeCards items={[
          { title: x(path, 5), text: x(path, 6), photo: PHOTOS.frameStairs },
          { title: x(path, 11), text: x(path, 12), photo: PHOTOS.greyWater },
          { title: x(path, 8), text: x(path, 9), photo: PHOTOS.cedarDeck },
          { title: x(path, 14), text: x(path, 15), photo: PHOTOS.ptLarge },
        ]} />
      </div></section>

      <section id="calculator" className="calc-band text-ivory"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head light eyebrow="Deck cost calculator" title={x(path, 26)} sub="Set your size, material, railing and stairs to see a realistic range in seconds." />
        <DeckCalculator />
      </div></section>

      <section className="bg-sand"><div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-10 lg:py-24">
        <div className="reveal">
          <Eyebrow>{x(path, 27)}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold uppercase leading-[1.08] tracking-[-0.01em]">{x(path, 28)}</h2>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">{[29, 30, 31, 32, 33, 34].map((i) => <li key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-[15px] font-medium"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bronze text-charcoal"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg></span>{x(path, i)}</li>)}</ul>
          <p className="mt-7 text-[16px] leading-relaxed text-graphite/70"><Inline text={x(path, 16)} /></p>
        </div>
        <figure className="reveal overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(14,19,17,.45)]"><Img photo={PHOTOS.luxuryCovered} className="aspect-[4/5] w-full object-cover" sizes="(min-width:1024px) 45vw, 100vw" /></figure>
      </div></section>

      <Transformations />
      <TrustStats path={path} heading={x(path, 18)} text={x(path, 19)} links={[[x(path, 20), h(path, 20)]]} photo={PHOTOS.evening} />
      <Tail path={path} reviewsHeading={x(path, 69)} reviewsEyebrow={x(path, 25)} planning={x(path, 77)} sub={x(path, 79)} photo={PHOTOS.multiLevel} />
    </Document>
  )
}

/* ---------------- /railings ---------------- */
export function RailingsPage({ metaFor }: { metaFor: (p: string, ld?: object[]) => Meta }) {
  const path = '/railings'
  const trail: [string, string][] = [['Home', '/'], ['Railings', path]]
  const cols = [
    { title: x(path, 20), text: x(path, 21), main: src(path, 0), swatches: imgsIn(path, 22, 24) },
    { title: x(path, 25), text: x(path, 26), main: src(path, 3), swatches: imgsIn(path, 27, 30) },
    { title: x(path, 31), text: x(path, 32), main: src(path, 35), swatches: [] as string[], photos: imgsIn(path, 33, 36, ['second-storey-deck-glass-railing']) },
  ]
  return (
    <Document meta={meta(metaFor, path, trail)}>
      <SvcHero trail={trail} h1={x(path, 5)} intro={x(path, 6)} s={src(path, 2)} eyebrow="Aluminum & glass railings" second={['See the collections', '#collections']} />
      <TrustBar />
      <section id="collections" className="bg-ivory"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head eyebrow="Railing collections" title={<>Three collections.<br />Built to last.</>} sub="Powder-coated aluminum and tempered glass systems, installed by our own crew and built for Ottawa winters." />
        <div className="mt-12 grid gap-6">
          {cols.map((c, i) => (
            <article key={c.title} className={`rail-col reveal ${i % 2 ? 'rail-col-flip' : ''}`}>
              <figure className="rail-main"><Pic s={c.main} className="h-full w-full object-cover" /></figure>
              <div className="rail-body">
                <span className="font-display text-[13px] font-bold tracking-[0.2em] text-bronze-dark">0{i + 1}</span>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em]">{c.title}</h3>
                {i < 2 ? <h4 className="mt-3 text-[17px] leading-relaxed text-graphite/70">{c.text}</h4> : <p className="mt-3 text-[17px] leading-relaxed text-graphite/70">{c.text}</p>}
                {c.swatches.length ? <><p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite/45">Panel styles</p><div className="rail-swatches mt-3">{c.swatches.map((s) => <Pic key={s} s={s} className="h-full w-full object-contain" />)}</div></> : null}
                {(c as any).photos?.length ? <div className="rail-photos mt-6">{(c as any).photos.map((s: string) => <Pic key={s} s={s} className="h-full w-full object-cover" />)}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </div></section>
      <section className="bg-white"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head as="h3" eyebrow="Recent installs" title={x(path, 37)} />
        <Gallery items={[imgSrc(PHOTOS.blackRailCorner.file), src(path, 45), imgSrc(PHOTOS.glassGrey.file), imgSrc(PHOTOS.litStairs.file), imgSrc(PHOTOS.frontPorch.file), src(path, 4), imgSrc(PHOTOS.glassStairs.file)]} />
      </div></section>
      <TrustStats path={path} heading={x(path, 8)} text={x(path, 9)} links={[['Get a free estimate', '/contacts#estimate'], ['Instant online quote', h(path, 48)]]} photo={PHOTOS.secondStoreyGlass} />
      <Tail path={path} reviewsHeading={x(path, 38)} reviewsEyebrow="Client reviews" planning={x(path, 46)} sub={x(path, 47)} photo={PHOTOS.porchRailing} />
    </Document>
  )
}

/* ---------------- /staining ---------------- */
export function StainingPage({ metaFor }: { metaFor: (p: string, ld?: object[]) => Meta }) {
  const path = '/staining'
  const trail: [string, string][] = [['Home', '/'], ['Staining', path]]
  const hero = src(path, 27)
  const work = imgsIn(path, 15, 46, ['timber-frame-entry-portico-staining', 'timber-frame-construction', 'deck-staining-before-after', 'cedar-wraparound-deck-staining'])
  return (
    <Document meta={meta(metaFor, path, trail)}>
      <SvcHero trail={trail} h1={x(path, 4)} intro={x(path, 2)} s={hero} eyebrow="Sanding, staining & sealing" second={['See our work', '#work']} />
      <TrustBar />
      <section className="bg-ivory"><div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10 lg:py-24">
        <div>
          <Head eyebrow="How we do it" title={x(path, 48)} />
          <ol className="mt-10 grid gap-4">
            {[[49, 50], [51, 52], [53, 54]].map(([n, t]) => <li key={n} className="reveal flex items-center gap-5 rounded-[22px] bg-white p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,.35)]"><h4 className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-charcoal font-display text-[24px] font-bold text-bronze-light">{x(path, n)}</h4><h5 className="font-display text-[18px] font-bold uppercase tracking-tight">{x(path, t)}</h5></li>)}
          </ol>
        </div>
        <figure className="reveal relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(14,19,17,.45)]">
          <Pic s={src(path, 20)} className="aspect-[4/5] w-full object-cover" />
          <figcaption className="absolute left-4 top-4 rounded-full bg-charcoal/85 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory backdrop-blur">Before &amp; after staining</figcaption>
        </figure>
      </div></section>
      <section id="work" className="bg-white"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head eyebrow="Recent projects" title={x(path, 14)} sub="Decks, railings, porticos and pergolas across Ottawa, washed, sanded and finished by our crew." />
        <Gallery items={work} />
      </div></section>
      <TrustStats path={path} heading={x(path, 56)} text={x(path, 57)} links={[[x(path, 58), h(path, 58)]]} photo={PHOTOS.raisedCedar} />
      <Tail path={path} planning={x(path, 60)} sub={x(path, 61)} photo={PHOTOS.cedarDeck} />
    </Document>
  )
}

/* ---------------- /fences ---------------- */
export function FencesPage({ metaFor }: { metaFor: (p: string, ld?: object[]) => Meta }) {
  const path = '/fences'
  const trail: [string, string][] = [['Home', '/'], ['Fences', path]]
  const hero = src(path, 0)
  const typePics = [src(path, 4), src(path, 7), src(path, 24)] // chain-link card uses the clean black chain-link install
  const work = imgsIn(path, 24, 34, ['residential-fence-contractor', 'grey-pvc-fence-installation', 'ottawa-kanata-chainlink-fence', 'backyard-fence-installation-kanata', ...typePics.map((s) => s.split('/').pop()!)])
  return (
    <Document meta={meta(metaFor, path, trail)}>
      <SvcHero trail={trail} h1={x(path, 2)} intro={x(path, 3)} s={hero} eyebrow="Fence installation Ottawa" second={['See our work', '#work']} />
      <TrustBar />
      <section className="bg-ivory"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head eyebrow="Fence types" title={<>Privacy, security<br />and clean lines.</>} />
        <TypeCards items={[
          { title: x(path, 8), text: x(path, 9), s: typePics[1] },
          { title: x(path, 5), text: x(path, 6), s: typePics[0] },
          { title: x(path, 11), text: x(path, 12), s: typePics[2] },
        ]} />
      </div></section>
      <section id="work" className="bg-white"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Head as="h3" eyebrow="Recent projects" title={x(path, 23)} />
        <Gallery items={work} />
      </div></section>
      <TrustStats path={path} heading="Ottawa’s trusted fence builders" text="Clear communication. Clean execution. Attention to every detail." links={[['Get a free estimate', '/contacts#estimate'], [x(path, 37).replace(/^\W+/, ''), h(path, 37)]]} photo={PHOTOS.evening} />
      <Tail path={path} planning={x(path, 35)} sub={x(path, 36)} estHeading={x(path, 33)} photo={PHOTOS.fenceDeck} />
    </Document>
  )
}

import React from 'react'
import blocksJson from '../content/blocks.json'
import metaJson from '../content/meta.json'
import { WALKTHROUGHS, COMMERCIAL_STOCK as CS } from './site'
import { BRAND, ORIGIN, PHOTOS, RENDERS, GALLERY_FILTERS, AREAS, STATS, type Photo } from './site'
import { CTX, href, imgSrc, wixImage, Inline, plain, asset } from './lib'
import { parsePage, type Block } from './parse'
import { Stars, GLogo, REVIEW_TAGS, reviewTags } from './ui'
import reviewsJson from '../content/collections/reviews.json'
import { Document, PageHero, Sections, Crumbs, crumbLd, StatsBand, Testimonials, FaqBlock, faqLd, EstimateSection, EstimateForm, Btn, Arrow, Eyebrow, Img, Brands, PhotoBand, TrustBar, ProcessSteps, type Meta } from './ui'
import { Divisions, Reels, ShowroomMap, LiveFeed, CommercialSpotlight, Transformations, ProjectWizard, Team, Crew, Media, Panel, WalkReel } from './divisions'
import { TESTIMONIALS } from './site'
import { pickFaqs, toQA, MoreFaqs, FaqLibrary, FAQS, FAQ_TOTAL, type Faq } from './faqs'
const withFaqs = (path: string, n = 8, existing: string[] = []) => { const items = pickFaqs(path, existing, n); return { items, ld: items.length ? [faqLd(toQA(items))] : [] } }
import settingsJson from '../content/collections/settings.json'
import { DecksPage, RailingsPage, StainingPage, FencesPage } from './service'
import { loadPosts } from './blog'
const SETTINGS = settingsJson as any
import wellnessPhotosRaw from '../content/collections/wellnessPhotos.json'
const WELLP = [...(wellnessPhotosRaw as any).items].sort((a: any, b: any) => (a.source === 'actual' ? 0 : 1) - (b.source === 'actual' ? 0 : 1))
import conceptsJsonRaw from '../content/collections/commercialConcepts.json'
const conceptsJson = [...(conceptsJsonRaw as any).items].sort((a: any, b: any) => (a.source === 'actual' ? 0 : 1) - (b.source === 'actual' ? 0 : 1))
import productsJsonRaw from '../content/collections/wellnessProducts.json'
const productsJson = (productsJsonRaw as any).items

const B = blocksJson as Record<string, Block[]>
const M = metaJson as Record<string, { title: string; desc: string; canonical: string; robots: string; og: string; ld: string[] }>

const metaFor = (path: string, extraLd: object[] = []): Meta => {
  const m = M[path]
  return { title: m.title, desc: m.desc || undefined, canonical: m.canonical, robots: m.robots || undefined, og: m.og || undefined, ld: m.ld, extraLd }
}
const find = (path: string, re: RegExp) => (B[path] || []).find((b) => re.test(b.x || ''))?.x || ''

/* ---------- families ---------- */
export const FAMILIES: Record<string, { label: string; parent: [string, string]; photos: Photo[] }> = {
  'deck-builder': { label: 'Deck Builder', parent: ['Decks', '/decks'], photos: [PHOTOS.longRailing, PHOTOS.multiLevel, PHOTOS.greyRaised] },
  'composite-deck': { label: 'Composite Deck', parent: ['Decks', '/decks'], photos: [PHOTOS.frameStairs, PHOTOS.groundComposite, PHOTOS.brownStairs] },
  'pvc-deck': { label: 'PVC Deck', parent: ['Decks', '/decks'], photos: [PHOTOS.greyWater, PHOTOS.pool, PHOTOS.compositeGrill] },
  'aluminum-railing': { label: 'Aluminum Railing', parent: ['Railings', '/railings'], photos: [PHOTOS.whiteRailStairs, PHOTOS.glassStairs, PHOTOS.stairRailing] },
  'glass-railing': { label: 'Glass Railing', parent: ['Railings', '/railings'], photos: [PHOTOS.frostedGlass, PHOTOS.townRailing, PHOTOS.stoneStairs] },
  'deck-repair': { label: 'Deck Repair', parent: ['Decks', '/decks'], photos: [PHOTOS.build1, PHOTOS.ptRailing] },
  'backyard-makeover': { label: 'Backyard Makeover', parent: ['Backyard Makeover', '/backyard-makeover'], photos: [PHOTOS.multiLevel, PHOTOS.coveredPatio] },
}
const CORE: Record<string, { label: string; photo: Photo; photos: Photo[] }> = {
  '/decks': { label: 'Decks', photo: PHOTOS.longRailing, photos: [PHOTOS.loungeBalcony, PHOTOS.multiLevel, PHOTOS.cedarWrap] },
  '/railings': { label: 'Railings', photo: PHOTOS.glassStairs, photos: [PHOTOS.frontRailing, PHOTOS.frostedGlass, PHOTOS.porchRailing] },
  '/staining': { label: 'Staining', photo: PHOTOS.cedarWrap, photos: [PHOTOS.cedarDeck, PHOTOS.ptStep] },
  '/fences': { label: 'Fences', photo: PHOTOS.pvcFence, photos: [PHOTOS.ironFence, PHOTOS.whiteFence, PHOTOS.chainlink] },
  '/backyard-makeover': { label: 'Backyard Makeover', photo: PHOTOS.multiLevel, photos: [PHOTOS.pool, PHOTOS.coveredPatio, PHOTOS.octagon] },
  '/deck-packages': { label: 'Deck Packages', photo: PHOTOS.groundComposite, photos: [PHOTOS.ptPlatform, PHOTOS.compositeLounge] },
}

const BAND: Record<string, string[]> = { 'deck-builder': ['composite', 'wood', 'structures'], 'composite-deck': ['composite'], 'pvc-deck': ['composite'], 'aluminum-railing': ['railings'], 'glass-railing': ['railings'], 'deck-repair': ['wood', 'construction'], 'backyard-makeover': ['structures', 'composite'], '/decks': ['composite', 'wood'], '/railings': ['railings'], '/staining': ['wood'], '/fences': ['fences'], '/backyard-makeover': ['structures', 'composite'], '/deck-packages': ['composite', 'wood'] }
/* ---------- generic page for every existing service and location URL ---------- */
export function ExistingPage({ path }: { path: string }) {
  if (path === '/decks') return <DecksPage metaFor={metaFor} />
  if (path === '/railings') return <RailingsPage metaFor={metaFor} />
  if (path === '/staining') return <StainingPage metaFor={metaFor} />
  if (path === '/fences') return <FencesPage metaFor={metaFor} />
  let raw = (B[path] || []).map((b) => ({ ...b }))
  // Proposed fix: /decks has a promo line as its H1; the page heading "CUSTOM DECKS" becomes the H1.
  if (path === '/decks') raw = raw.map((b) => (b.t === 'h1' ? { ...b, t: 'h2' } : b.t === 'h3' && /^CUSTOM DECKS$/.test(b.x || '') ? { ...b, t: 'h1' } : b))
  const secs = parsePage(raw)
  let hero = secs.find((s) => s.kind === 'hero') as any
  const famKey = Object.keys(FAMILIES).find((k) => path.startsWith('/' + k + '-'))
  const core = CORE[path]
  const fam = famKey ? FAMILIES[famKey] : null
  const area = famKey ? path.slice(famKey.length + 2) : ''
  const areaName = AREAS.find(([s]) => s === area || s.replace('-', '') === area)?.[1] || area.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const trail: [string, string][] = fam
    ? [['Home', '/'], fam.parent, ['Service areas', '/service-areas'], [`${fam.label}, ${areaName}`, path]]
    : [['Home', '/'], [core?.label || plain(hero?.heading?.x || path), path]]
  if (!hero) hero = { heading: { t: 'h1', x: core?.label || path }, blocks: [] }
  const heroImg = wixImage(hero.img?.s)
  const photos = fam?.photos || core?.photos || [PHOTOS.multiLevel]
  const faqs = secs.filter((s) => s.kind === 'faq').flatMap((s: any) => s.qa)
  const extraLd: object[] = [crumbLd(trail)]
  const more = pickFaqs(path, faqs.map(([q]: [string, string]) => q), 8)
  if (faqs.length || more.length) extraLd.push(faqLd([...faqs, ...toQA(more)]))
  if (fam) extraLd.push({ '@context': 'https://schema.org', '@type': 'Service', serviceType: `${fam.label}`, areaServed: { '@type': 'Place', name: `${areaName}, Ontario` }, provider: { '@type': 'LocalBusiness', name: BRAND.name, url: ORIGIN } })
  const finalCta = secs.length && (secs[secs.length - 1] as any).heading && /QUOTE|ESTIMATE|START|READY|PLANNING/i.test((secs[secs.length - 1] as any).heading?.x || '')
  return (
    <Document meta={metaFor(path, extraLd)}>
      <PageHero h1={hero.heading} eyebrow={hero.eyebrow} blocks={hero.blocks} img={heroImg} photo={heroImg ? undefined : core?.photo || photos[0]} trail={trail} />
      <PhotoBand cats={BAND[famKey || path] || ['composite', 'railings']} heading="Recent work across Ottawa" />
      <Sections sections={secs} fallbackPhotos={photos} />
      <MoreFaqs items={more} heading={fam ? `${fam.label} questions, answered` : undefined} />
      {fam ? <RelatedAreas family={famKey!} current={area} /> : null}
      <EstimateSection heading={plain((secs.find((x) => x.kind === 'contact') as any)?.heading?.x || '') || undefined} photo={photos[0]} />
    </Document>
  )
}

function RelatedAreas({ family, current }: { family: string; current: string }) {
  const slugs = Object.keys(M).filter((p) => p.startsWith('/' + family + '-') && !p.endsWith('-' + current))
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
        <p className="eyebrow text-bronze">Also serving</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {slugs.map((p) => <li key={p}><a href={href(p)} className="chip">{M[p].title.split('|')[0].trim()}</a></li>)}
        </ul>
      </div>
    </section>
  )
}

/* ---------- home ---------- */
const SERVICES = [
  { title: 'DECK BUILDING', text: 'Custom wood, composite & PVC decks.', to: '/decks', photo: PHOTOS.whiteRailRaised },
  { title: 'RAILINGS', text: 'Modern aluminum & glass systems.', to: '/railings', photo: PHOTOS.blackRailCorner },
  { title: 'STAINING & FINISHING', text: 'Extend the life and look of your deck.', to: '/staining', photo: PHOTOS.cedarWrap },
  { title: 'FENCE BUILDING', text: 'Modern PVC, Iron & Chainlink fences.', to: '/fences', photo: PHOTOS.pvcFence },
]
export function Home() {
  const seo = find('/', /^Ottawa Deck Pro is a leading deck builder/)
  const viz = find('/', /^Our team provides realistic 3D/)
  const projects = [PHOTOS.wrapStairs, PHOTOS.whiteRailSide, PHOTOS.glassGrey, PHOTOS.litStairs, PHOTOS.twoLevel, PHOTOS.treetopDeck, PHOTOS.raisedStorage, PHOTOS.ptGazebo]
  const ld = [{ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': ORIGIN + '/#business', name: BRAND.name, url: ORIGIN, image: imgAbs('ottawa-deck-pro-logo.png'), telephone: '+1-613-639-1744', email: BRAND.email,
    address: { '@type': 'PostalAddress', streetAddress: BRAND.street, addressLocality: 'Ottawa', addressRegion: 'ON', postalCode: BRAND.postal, addressCountry: 'CA' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' }],
    areaServed: AREAS.map(([, n]) => n).concat(['Ottawa', 'Richmond', 'Almonte', 'Calabogie', 'Mississippi Mills']), sameAs: [BRAND.instagram, BRAND.facebook] }]
  const meta = metaFor('/', [...ld, faqLd(toQA(pickFaqs('/', [], 5)))]); meta.ld = (meta.ld || []).filter((s) => !/"LocalBusiness"/.test(s))
  return (
    <Document meta={meta}>
      {/* 01 HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-ivory">
        <div className="parallax absolute inset-0 -z-10" data-parallax>{SETTINGS.heroVideo ? <video className="hero-img h-full w-full object-cover" src={asset(SETTINGS.heroVideo.replace(/^\//, ""))} poster={imgSrc(PHOTOS.luxuryCovered.file)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" /> : <Img photo={PHOTOS.luxuryCovered} eager className="hero-img kenburns h-full w-full object-cover" />}</div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/50" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-40 lg:px-10 lg:pb-20">
          <p className="reveal eyebrow text-bronze-light">DESIGNED TO LAST. BUILT TO IMPRESS</p>
          <h1 className="reveal mt-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-ivory/80">OTTAWA’S TRUSTED DECK &amp; RAILING EXPERTS.</h1>
          <p className="reveal mt-4 font-display text-[clamp(3rem,10vw,9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">Your backyard.<br /><span className="text-bronze-light">Reimagined.</span></p>
          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="reveal">
              <p className="max-w-xl text-[18px] leading-relaxed text-ivory/80">Premium decks, outdoor structures, and backyard living spaces designed and built in Ottawa.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn to="/contacts#estimate">Get a free estimate <Arrow /></Btn>
                <Btn to="/gallery" variant="ghost-light">Explore our projects</Btn>
              </div>
            </div>
            <a href="#trust" className="scroll-cue reveal hidden lg:flex" aria-label="Scroll to content"><span /></a>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* 06 FEATURED PROJECTS */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><Eyebrow>REAL OTTAWA PROJECTS</Eyebrow><h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-bold tracking-tight">OUR PROJECTS</h2></div>
            <Btn to="/gallery" variant="outline">View our projects <Arrow /></Btn>
          </div>
          <div className="mt-10 grid grid-flow-dense auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4">
            {projects.map((p, i) => (
              <a key={p.file} href={href('/gallery')} className={`reveal group overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : i === 4 ? 'row-span-2' : ''}`}>
                <Img photo={p} className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-[1.05]" sizes="(min-width:768px) 25vw, 50vw" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* real client interview, featured */}
      <ClientInterview />

      {/* 04 RESIDENTIAL SERVICES */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><Eyebrow>Luxury residential</Eyebrow><h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-bold tracking-tight">OUR SERVICES</h2></div>
            <Btn to="/decks" variant="outline">Explore our services <Arrow /></Btn>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <a key={s.title} href={href(s.to)} className="svc reveal group">
                <Img photo={s.photo} className="svc-img" sizes="(min-width:1024px) 33vw, 100vw" />
                <div className="svc-shade" />
                <div className="relative mt-auto p-7">
                  <h3 className="font-display text-[22px] font-bold tracking-tight text-ivory">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] text-ivory/80">{s.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-bronze-light">View service <Arrow /></span>
                </div>
              </a>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-4xl text-center text-[17px] leading-relaxed text-graphite/70"><Inline text={seo} /></p>
        </div>
      </section>


      {/* before/after */}
      <Transformations />
      {/* mid-page estimate nudge */}
      <div className="mid-cta bg-white"><div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-3 px-5 pb-4 pt-2 text-center sm:flex-row sm:gap-5 lg:px-10">
        <p className="text-[16px] font-medium text-graphite/70">Like what you see? Let's talk about your backyard.</p>
        <Btn to="#estimate-team">Get a free estimate <Arrow /></Btn>
      </div></div>

      {/* 05 HOW IT WORKS: 3D design vs built + the 4 steps */}
      <section className="bg-white" id="how-it-works"><div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div><Eyebrow>How it works</Eyebrow><h2 className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Visualize Your Deck Before You Build.</h2></div>
          <p className="max-w-lg text-[17px] leading-relaxed text-graphite/70 lg:justify-self-end">{viz}</p>
        </div>
        <p className="reveal mt-10 text-center font-display text-[clamp(1.25rem,2.2vw,1.7rem)] font-semibold tracking-[-0.02em]">Same deck. <span className="text-graphite/45">Designed first,</span> <span className="text-bronze-dark">then built.</span></p>
        <div className="vs-wrap reveal mt-6">
          <figure className="vs-card vs-design">
            <div className="vs-label"><span className="vs-num">1</span><span><b>The 3D design</b><small>What you approve</small></span></div>
            <div className="vs-media"><img src={imgSrc('3d-deck-design-rendering-second-storey-composite-deck-ottawa.webp')} alt="3D design rendering of a second-storey composite deck with black aluminum railing, lit stairs, privacy screen and under-deck storage in Ottawa" loading="lazy" /><span className="vs-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2l9 5v10l-9 5-9-5V7z" /><path d="M12 22V12M21 7l-9 5-9-5" /></svg>3D RENDER</span></div>
          </figure>
          <div className="vs-arrow" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
          <figure className="vs-card vs-built">
            <div className="vs-label"><span className="vs-num">2</span><span><b>Built by our crew</b><small>What you get</small></span></div>
            <div className="vs-media"><img src={imgSrc(PHOTOS.storeyEnclosure.file)} alt="The finished deck built from the 3D design: second-storey composite deck with black aluminum railing and under-deck storage" loading="lazy" /><span className="vs-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>REAL PHOTO</span></div>
          </figure>
        </div>
        <ol className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[['Free consultation', 'We visit, measure your yard and talk through options.'], ['Design in 3D', 'See layout, materials and railings in 3D. Revise until it is right.'], ['Clear estimate', 'A straightforward proposal. No pressure, no surprises.'], ['Build', 'Permits, materials and a crew that builds what you approved.']].map(([t, d], i) => (
            <li key={t} className="reveal rounded-2xl border border-graphite/10 bg-ivory p-5"><span className="font-display text-[13px] font-bold tracking-[0.18em] text-bronze-dark">STEP {i + 1}</span><p className="mt-2 text-[16px] font-semibold">{t}</p><p className="mt-1 text-[14px] leading-snug text-graphite/60">{d}</p></li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Btn to="/contacts#estimate" variant="dark">Book a design consultation <Arrow /></Btn></div>
      </div></section>
      {/* reels */}
      <Reels />

      {/* 06 CREW */}
      <Crew />

      {/* estimate form after the team */}
      <EstimateSection id="estimate-team" eyebrow="Free estimate" heading="Meet the crew in your backyard." sub="Tell us about your project and our team will reach out within 24 hours to book your free on-site consultation." photo={PHOTOS.coveredPatio} />

      {/* 14 REVIEWS */}
      {/* Trust: original copy + project stats, compact */}
      <section id="trust" className="bg-charcoal text-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:px-10 lg:py-14">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Ottawa’s Trusted Deck Builders</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ivory/65">Clear communication. Clean execution. Attention to every detail. The kind of craftsmanship homeowners confidently recommend.</p>
          </div>
          <p className="sr-only">PROJECT STATS</p>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ivory/10 sm:grid-cols-4">
            {STATS.map((s) => { const m = /^([\d,.]+\+?)\s*(.*)$/.exec(s.value) || [s.value, s.value, '']; return (
              <div key={s.label} className="bg-charcoal p-5"><dd className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-light leading-none tracking-[-0.04em]"><span data-count={m[1]}>{m[1]}</span> <span className="text-[13px] font-medium tracking-normal text-ivory/45">{m[2]}</span></dd><dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze-light">{s.label}</dt></div>
            ) })}
          </dl>
        </div>
      </section>
      <Testimonials heading="HOW OUR CLIENTS DESCRIBE US" eyebrow="Real Client Testimonials" limit={6} allHref="/reviews" noVideo video={{ src: 'media/kanata-composite-deck-client-testimonial.mp4', preview: 'media/kanata-composite-deck-client-testimonial-preview.mp4', poster: 'kanata-composite-deck-client-testimonial.webp', caption: 'Client testimonial · Composite deck in Kanata', label: 'Kanata homeowners talk about their new composite deck with Ottawa Deck Pro' }} />
      {/* estimate form after the reviews */}
      <EstimateSection id="estimate-reviews" eyebrow="Real Google reviews" heading="Your backyard is next." sub={`Rated ${(settingsJson as any).googleRating.value} from ${(settingsJson as any).googleRating.count} Google reviews. Send your project and a team member will be in touch within 24 hours.`} photo={PHOTOS.evening} />
      <Brands heading="HIGH-PERFORMANCE MATERIALS FROM TRUSTED BRAND" />

      {/* 08 FAQ */}
      <MoreFaqs items={pickFaqs('/', [], 5)} heading="Answers before you build" dark />

      {/* 09 SERVICE AREAS */}
      <ShowroomMap legacyHeading="Deck & Fence Services Across Ottawa" />

      {/* 10 ESTIMATE: wizard is step 1 */}
      <ProjectWizard />
      <EstimateSection eyebrow="PLANNING YOUR 2026 DECK PROJECT?" sub="Limited spots available — book your project early! Choose residential, commercial or wellness and tell us about your project." photo={PHOTOS.multiLevel} />
    </Document>
  )
}
const imgAbs = (f: string) => ORIGIN + '/img/' + f

function BeforeAfter({ before, after }: { before: Photo; after: Photo }) {
  return (
    <div className="ba reveal" data-ba style={{ ['--pos' as any]: '50%' }}>
      <Img photo={after} className="ba-img" sizes="(min-width:1024px) 55vw, 100vw" />
      <div className="ba-before"><Img photo={before} className="ba-img" sizes="(min-width:1024px) 55vw, 100vw" /></div>
      <span className="ba-tag left-4">Before</span><span className="ba-tag right-4">After</span>
      <input type="range" min="0" max="100" defaultValue="50" aria-label="Compare before and after" className="ba-range" />
      <span className="ba-handle" aria-hidden="true" />
    </div>
  )
}

// Rough relative positions of communities around Ottawa (schematic, not to scale).
const MAP_PTS: [string, string, number, number][] = [
  ['Arnprior', '/deck-builder-arnprior', 8, 30], ['Dunrobin', '/deck-builder-dunrobin', 30, 18], ['Carp', '/deck-builder-carp', 26, 36], ['Kanata', '/deck-builder-kanata', 38, 44],
  ['Carleton Place', '/deck-builder-carleton-place', 12, 56], ['Stittsville', '/deck-builder-stittsville', 32, 56], ['Bells Corners', '/deck-builder-bells-corners', 46, 52], ['Westboro', '/deck-builder-westboro', 57, 42],
  ['Nepean', '/deck-builder-nepean', 52, 58], ['Vanier', '/deck-builder-vanier', 66, 40], ['Orleans', '/deck-builder-orleans', 80, 40], ['Cumberland', '/deck-builder-cumberland', 84, 28],
  ['Gloucester', '/deck-builder-gloucester', 72, 52], ['Barrhaven', '/deck-builder-barrhaven', 50, 70], ['Riverside South', '/deck-builder-riverside-south', 62, 72], ['Findlay Creek', '/deck-builder-findlay-creek', 72, 66],
  ['Manotick', '/deck-builder-manotick', 56, 84], ['Greely', '/deck-builder-greely', 72, 84], ['Osgoode', '/deck-builder-osgoode', 66, 96], ['Metcalfe', '/composite-deck-metcalfe', 80, 90],
]
function AreaMap() {
  return (
    <div className="reveal relative aspect-[5/4] overflow-hidden rounded-[28px] bg-charcoal">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 34 C 20 30, 40 34, 60 30 S 90 22, 100 24" stroke="#2f4152" strokeWidth="2.2" fill="none" />
        <circle cx="50" cy="48" r="44" stroke="#7CBC42" strokeOpacity=".25" strokeDasharray="1 1.5" fill="none" strokeWidth=".4" />
      </svg>
      <span className="absolute left-[3%] top-[6%] text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/40">Ottawa River</span>
      {MAP_PTS.map(([n, p, x, y]) => (
        <a key={n} href={href(p)} className="map-pt" style={{ left: x + '%', top: y + '%' }}><i />{n}</a>
      ))}
      <span className="absolute right-4 top-[6%] text-[10px] text-ivory/35">Schematic, not to scale</span>
    </div>
  )
}

/* ---------- gallery ---------- */
export function Gallery() {
  const intro = find('/gallery', /^Browse through our collection/)
  const NEW = ['luxuryCovered', 'loungeBalcony', 'wrapStairs', 'frameStairs', 'riserLights', 'brownStairs', 'whiteRailSide', 'whiteRailRear', 'whiteRailStairs', 'whiteRailRaised', 'storeyEnclosure', 'litStairs', 'screenBbq', 'screenClose', 'blackRailCorner', 'twoLevel', 'fenceDeck', 'ptGazebo', 'ptLarge', 'ptBalcony']
  const all = Object.entries(PHOTOS).filter(([k]) => !PHOTOS[k].cats.includes('before-after')).sort(([a], [b]) => (NEW.includes(a) ? NEW.indexOf(a) : 99) - (NEW.includes(b) ? NEW.indexOf(b) : 99))
  const trail: [string, string][] = [['Home', '/'], ['Our Projects', '/gallery']]
  const areaLinks = (B['/gallery'] || []).filter((b) => b.t === 'a' && /deck-builder-/.test(b.h || ''))
  return (
    <Document meta={metaFor('/gallery', [crumbLd(trail), faqLd(toQA(pickFaqs('/gallery', [], 6)))])}>
      <section className="bg-charcoal pb-14 pt-36 text-ivory lg:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <Crumbs trail={trail} />
          <h1 className="reveal mt-8 max-w-5xl font-display text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">SEE WHAT WE’VE BUILT ACROSS OTTAWA.</h1>
          <p className="reveal mt-6 max-w-2xl text-[18px] leading-relaxed text-ivory/75">{intro}</p>
          <div className="mt-10 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects" data-filters>
            {GALLERY_FILTERS.map((f, i) => <button key={f.id} type="button" className={`filter ${i === 0 ? 'is-on' : ''}`} data-filter={f.id} aria-pressed={i === 0}>{f.label}</button>)}
          </div>
        </div>
      </section>
      <section className="bg-charcoal pb-24">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="mb-12">
            <h2 className="eyebrow text-bronze-light">PROJECT WALKTHROUGHS</h2>
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[{ src: 'media/testimonial-reel.mp4', preview: 'media/testimonial-preview.mp4', poster: 'ottawa-deck-pro-client-testimonial.webp', title: 'Client testimonial', desc: 'In their own words' }, { src: 'media/kanata-composite-deck-client-testimonial.mp4', preview: 'media/kanata-composite-deck-client-testimonial-preview.mp4', poster: 'kanata-composite-deck-client-testimonial.webp', title: 'Kanata client testimonial', desc: 'Composite deck under a covered balcony' }, ...WALKTHROUGHS].map((w) => <WalkReel key={w.src} w={w} />)}
            </div>
          </div>
          <div className="masonry" data-gallery>
            {all.map(([k, p]) => (
              <button key={k} type="button" className="m-item" data-cats={p.cats.join(' ')} data-full={imgSrc(p.file)} data-alt={p.alt} aria-label={`Open photo: ${p.alt}`}>
                <Img photo={p} className="w-full rounded-xl" sizes="(min-width:1024px) 33vw, 50vw" />
              </button>
            ))}
          </div>
          <div className="mt-20 grid items-center gap-10 text-ivory lg:grid-cols-2">
            <div className="lg:col-span-2"><BeforeAfter before={PHOTOS.beforeCovered} after={PHOTOS.afterCovered} /></div>
          </div>
        </div>
      </section>
      <div className="lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="Project photo">
        <button className="lb-close" data-lb-close aria-label="Close">×</button>
        <button className="lb-nav lb-prev" data-lb-prev aria-label="Previous photo">‹</button>
        <figure><img alt="" data-lb-img /><figcaption data-lb-cap /></figure>
        <button className="lb-nav lb-next" data-lb-next aria-label="Next photo">›</button>
      </div>
      <StatsBand />
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
          <h2 className="eyebrow text-bronze">AREAS WE SERVE</h2>
          <ul className="mt-6 flex flex-wrap gap-2">{areaLinks.map((a) => <li key={a.h + (a.x || '')}><a href={href(a.h)} className="chip">{(a.x || '').replace(/^\W+\s*/, '').replace('STITSVILLE', 'STITTSVILLE')}</a></li>)}</ul>
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/gallery', [], 6)} />
      <EstimateSection heading="LIKE WHAT YOU SEE?" sub={find('/gallery', /DESIGN YOURS/i) || 'Let’s design yours.'} />
    </Document>
  )
}

/* ---------- FAQ ---------- */
export function Faq() {
  const raw = B['/faq'] || []
  const qa: [string, string][] = []
  let q: string | null = null, a: string[] = []
  for (const b of raw) {
    if (b.t === 'h3') { if (q) qa.push([q, a.join('\n')]); q = b.x || ''; a = [] }
    else if (q && (b.t === 'p' || b.t === 'li')) a.push((b.t === 'li' ? '• ' : '') + (b.x || ''))
  }
  if (q) qa.push([q, a.join('\n')])
  const trail: [string, string][] = [['Home', '/'], ['FAQ', '/faq']]
  return (
    <Document meta={metaFor('/faq', [crumbLd(trail), faqLd([...qa, ...toQA(FAQS)])])}>
      <PageHero h1={{ t: 'h1', x: 'FREQUENTLY ASKED QUESTIONS' }} blocks={[{ t: 'p', x: 'ANSWERS TO THE MOST COMMON QUESTIONS FROM OTTAWA HOMEOWNERS.' }, { t: 'p', x: `${FAQ_TOTAL} straight answers on cost, materials, permits, railings, hot tubs, saunas and more.` }]} photo={PHOTOS.evening} trail={trail} short />
      <FaqLibrary legacy={qa} />
      <EstimateSection />
    </Document>
  )
}

/* ---------- contact ---------- */
export function Contacts() {
  const trail: [string, string][] = [['Home', '/'], ['Contact', '/contacts']]
  return (
    <Document meta={metaFor('/contacts', [crumbLd(trail), faqLd(toQA(pickFaqs('/contacts', [], 6)))])}>
      <section className="bg-charcoal pb-10 pt-36 text-ivory lg:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <Crumbs trail={trail} />
          <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">Contact Ottawa Deck Pro</h1>
          <p className="mt-5 max-w-xl text-[18px] text-ivory/75">You'll be Satisfied as well, we Promise!</p>
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/contacts', [], 6)} />
      <TrustBar />
      <ProcessSteps />
      <EstimateSection heading="CONTACT INFO" sub="Tell us about your backyard project and let our team help bring it to life." photo={PHOTOS.longRailing} />
      <Testimonials heading="HOW OUR CLIENTS DESCRIBE US" />
      <StatsBand dark />
    </Document>
  )
}

/* ---------- blog ---------- */
const POSTS = Object.keys(M).filter((p) => p.startsWith('/post/'))
export function BlogIndex() {
  const trail: [string, string][] = [['Home', '/'], ['Blog', '/blog']]
  return (
    <Document meta={metaFor('/blog', [crumbLd(trail), faqLd(toQA(pickFaqs('/blog', [], 6)))])}>
      <section className="bg-charcoal pb-16 pt-36 text-ivory lg:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <Crumbs trail={trail} />
          <p className="mt-8 eyebrow text-bronze-light">Deck building tips &amp; ideas</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">All Posts</h1>
        </div>
      </section>
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
          {loadPosts(CTX.preview).map((bp) => (
            <a key={bp.path} href={href(bp.path)} className="card reveal group">
              <div className="card-media relative"><img src={imgSrc(bp.cover)} alt={bp.coverAlt} loading="lazy" />{bp.status !== 'published' ? <span className="absolute left-3 top-3 rounded-full bg-[#F4C430] px-2.5 py-1 text-[11px] font-bold uppercase text-charcoal">Draft</span> : null}</div>
              <div className="p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze-dark">{bp.category}</p><h2 className="mt-2 font-display text-[21px] font-bold leading-snug tracking-tight group-hover:text-bronze-dark">{bp.h1}</h2><p className="mt-3 line-clamp-3 text-[15px] text-graphite/65">{bp.description}</p></div>
            </a>
          ))}
          {POSTS.map((p, i) => {
            const bl = B[p] || []; const h1 = bl.find((b) => b.t === 'h1')?.x || M[p].title
            const first = bl.find((b) => b.t === 'p')?.x || ''
            const src = bl.filter((b) => b.t === 'img').map((b) => wixImage(b.s)).find(Boolean)
            const fallback = [PHOTOS.multiLevel, PHOTOS.groundComposite, PHOTOS.pool, PHOTOS.cedarWrap, PHOTOS.longRailing, PHOTOS.greyRaised, PHOTOS.evening][i % 7]
            return (
              <a key={p} href={href(p)} className="card reveal group">
                <div className="card-media"><img src={src || imgSrc(fallback.file)} alt="" loading="lazy" /></div>
                <div className="p-7"><h2 className="font-display text-[21px] font-bold leading-snug tracking-tight group-hover:text-bronze-dark">{plain(h1)}</h2><p className="mt-3 line-clamp-3 text-[15px] text-graphite/65">{plain(first)}</p><span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-bronze-dark">Read article <Arrow /></span></div>
              </a>
            )
          })}
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/blog', [], 6)} />
      <EstimateSection />
    </Document>
  )
}
export function Post({ path }: { path: string }) {
  const bl = (B[path] || []).filter((b) => !(b.t === 'li' && /\(\/blog\)/.test(b.x || '')))
  const h1 = bl.find((b) => b.t === 'h1')
  const trail: [string, string][] = [['Home', '/'], ['All Posts', '/blog'], [plain(h1?.x || M[path].title).slice(0, 48), path]]
  const body = bl.slice(bl.indexOf(h1!) + 1)
  const nodes: React.ReactNode[] = []; let list: Block[] = []
  const flush = (k: number) => { if (list.length) { nodes.push(<ul key={'u' + k}>{list.map((b, i) => <li key={i}><Inline text={b.x || ''} /></li>)}</ul>); list = [] } }
  body.forEach((b, i) => {
    if (b.t === 'li') { list.push(b); return }
    flush(i)
    if (b.t === 'p') nodes.push(<p key={i}><Inline text={b.x || ''} /></p>)
    else if (/^h[2-6]$/.test(b.t)) { const T: any = b.t === 'h2' ? 'h2' : 'h3'; nodes.push(<T key={i}><Inline text={b.x || ''} /></T>) }
    else if (b.t === 'img') { const s = wixImage(b.s); if (s) nodes.push(<img key={i} src={s} alt={b.a || ''} loading="lazy" />) }
    else if (b.t === 'a' && b.x) nodes.push(<p key={i}><a className="link" href={href(b.h)}>{b.x}</a></p>)
  })
  flush(99999)
  const heroSrc = bl.filter((b) => b.t === 'img').map((b) => wixImage(b.s)).find(Boolean)
  const pf = withFaqs(path, 6, bl.filter((b) => /^h[2-4]$/.test(b.t)).map((b) => b.x || ''))
  return (
    <Document meta={metaFor(path, [crumbLd(trail), ...pf.ld])}>
      <section className="bg-charcoal pb-16 pt-36 text-ivory lg:pt-44">
        <div className="mx-auto max-w-4xl px-5">
          <Crumbs trail={trail} />
          <h1 className="mt-8 font-display text-[clamp(2.1rem,4.6vw,3.8rem)] font-extrabold leading-[1.04] tracking-tight">{plain(h1?.x || '')}</h1>
        </div>
      </section>
      {heroSrc ? <div className="bg-charcoal"><div className="mx-auto max-w-5xl px-5"><img src={heroSrc} alt="" className="aspect-[16/8] w-full translate-y-10 rounded-[28px] object-cover" /></div></div> : null}
      <article className="article mx-auto max-w-3xl px-5 py-24">{nodes}</article>
      <PhotoBand cats={['composite', 'railings', 'structures']} heading="Built by Ottawa Deck Pro" />
      <MoreFaqs items={pf.items} heading="Related questions" />
      <EstimateSection />
    </Document>
  )
}

/* ---------- service areas hub (new) ---------- */
export function ServiceAreas() {
  const trail: [string, string][] = [['Home', '/'], ['Service areas', '/service-areas']]
  const fams = ['deck-builder', 'composite-deck', 'pvc-deck', 'aluminum-railing', 'glass-railing']
  const label: Record<string, string> = { 'deck-builder': 'Deck builder', 'composite-deck': 'Composite deck', 'pvc-deck': 'PVC deck', 'aluminum-railing': 'Aluminum railing', 'glass-railing': 'Glass railing' }
  const pages = Object.keys(M)
  const meta: Meta = { title: 'Service Areas | Ottawa Deck Pro', desc: 'Ottawa Deck Pro builds decks, railings and fences across Ottawa and communities within 60 km, from Arnprior and Carleton Place to Orleans and Osgoode.', canonical: ORIGIN + '/service-areas', extraLd: [crumbLd(trail), faqLd(toQA(pickFaqs('/service-areas', [], 6)))] }
  return (
    <Document meta={meta}>
      <section className="bg-charcoal pb-16 pt-36 text-ivory lg:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <Crumbs trail={trail} />
          <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">Service areas</h1>
          <p className="mt-5 max-w-2xl text-[18px] text-ivory/75">{BRAND.radius} Choose your community and service.</p>
        </div>
      </section>
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {AREAS.map(([slug, name]) => {
              const links = fams.map((f) => pages.find((p) => p === `/${f}-${slug}` || p === `/${f}-${slug.replace('-', '')}`)).filter(Boolean) as string[]
              return (
                <div key={slug} className="reveal rounded-3xl bg-white p-6">
                  <h2 className="font-display text-[20px] font-bold">{name}</h2>
                  <ul className="mt-4 space-y-2 text-[15px]">
                    {links.map((l) => <li key={l}><a href={href(l)} className="link">{label[fams.find((f) => l.startsWith('/' + f))!]}</a></li>)}
                    {slug === 'kanata' ? <><li><a href={href('/deck-repair-kanata')} className="link">Deck repair</a></li><li><a href={href('/backyard-makeover-kanata')} className="link">Backyard makeover</a></li></> : null}
                  </ul>
                </div>
              )
            })}
            <div className="reveal rounded-3xl bg-white p-6"><h2 className="font-display text-[20px] font-bold">Ottawa</h2><ul className="mt-4 space-y-2 text-[15px]"><li><a href={href('/deck-builder-ottawa')} className="link">Deck builder</a></li></ul></div>
          </div>
          {fams.map((f) => <span key={f} id={f} />)}
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/service-areas', [], 6)} />
      <EstimateSection />
    </Document>
  )
}

/* ---------- wellness (new, proposed) ---------- */
export function Wellness() {
  const trail: [string, string][] = [['Home', '/'], ['Wellness', '/wellness']]
  const meta: Meta = { title: 'ODP Wellness | Outdoor Saunas & Cold Plunges Ottawa | Ottawa Deck Pro', desc: 'Outdoor saunas, cold plunges and backyard wellness spaces designed and built into your Ottawa backyard by Ottawa Deck Pro. Now taking inquiries.', canonical: ORIGIN + '/wellness', extraLd: [crumbLd(trail), faqLd(toQA(pickFaqs('/wellness', [], 10)))] }
  const cats = [
    ['Outdoor Saunas', 'Modern outdoor saunas designed for Canadian backyards, with glass-front designs, cedar interiors and architectural exterior finishes.', ['2–4 person saunas', '4–6 person saunas', 'Larger custom saunas']],
    ['Cold Plunges', 'Outdoor cold-plunge systems, planned as part of a complete backyard wellness experience rather than a stand-alone tub.', ['Placement on your deck or patio', 'Chiller and cover options', 'Lighting and privacy']],
    ['Sauna + Cold Plunge Packages', 'Complete hot-and-cold installations: deck, sauna, plunge, lighting and privacy designed and built together.', ['Essential and Signature concepts', 'Live 3D configurator', 'One team, one plan']],
    ['Custom Wellness Spaces', 'Saunas and cold plunges integrated into a full outdoor living space.', ['Composite deck with sauna', 'Cedar sauna with privacy screening', 'Pergola and wellness area', 'Integrated lighting and landscaping']],
  ] as const
  return (
    <Document meta={meta}>
      <section className="relative isolate overflow-hidden bg-[#0f1714] text-ivory">
        <div className="wellness-band absolute inset-0 -z-20" />{WELLP[1] ? <img src={imgSrc(WELLP[1].src)} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" /> : <div className="panel-lines" aria-hidden="true" />}
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 pb-16 pt-32 lg:min-h-[92svh] lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-10 lg:pt-32">
          <div>
            <Crumbs trail={trail} />
            <p className="reveal mt-8 eyebrow text-sage-light">ODP Wellness · Wellness, built into your backyard</p>
            <h1 className="reveal mt-5 font-display text-[clamp(2.8rem,6.4vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">Your backyard.<br /><span className="text-sage-light">Your sanctuary.</span></h1>
            <p className="reveal mt-6 max-w-md text-[18px] leading-relaxed text-ivory/80">Beautifully designed outdoor saunas, cold plunges, and integrated wellness retreats.</p>
            <div className="reveal mt-8 flex flex-wrap gap-3"><a href={href('/wellness/retreat-configurator') + '#configure'} className="btn btn-sage" data-track="configurator">Design your retreat <Arrow /></a><a href="#saunas" className="btn btn-ghost-light">Explore our saunas</a></div>
            <p className="mt-6 text-[13px] text-ivory/55">Pick a package, decking, sauna, plunge, lighting and privacy. See it in 3D with a live estimate. <a href="#wellness-quote" className="underline underline-offset-4 hover:text-ivory">Or request a wellness quote</a>.</p>
          </div>
          <div className="reveal">
            <div className="cfg-frame relative overflow-hidden rounded-[28px] border border-ivory/10 bg-black/40 shadow-2xl">
              <a href={href('/wellness/retreat-configurator')} className="cfg-poster group absolute inset-0 z-10 block lg:hidden" aria-label="Open the Retreat Configurator">
                {WELLP[0] ? <Media item={WELLP[0]} className="h-full w-full" eager /> : <Panel kind="wellness" className="h-full w-full" />}
                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-[#0f1714]/85 px-5 py-4 text-[15px] font-semibold backdrop-blur">Tap to design yours in 3D <Arrow /></span>
              </a>
              <iframe data-cfg-src={href('/wellness/retreat-configurator') + '#configure'} title="Retreat Configurator: design your sauna and cold plunge in 3D" className="hidden h-full w-full lg:block" loading="eager" allow="fullscreen" />
            </div>
            <div className="mt-3 hidden items-center justify-between text-[12px] text-ivory/50 lg:flex"><span>Live configurator. Products, specifications and pricing are being finalized.</span><a href={href('/wellness/retreat-configurator')} className="font-semibold text-sage-light hover:underline">Open full screen ↗</a></div>
            <p className="mt-3 text-[12px] text-ivory/50 lg:hidden">Products, specifications and pricing are being finalized.</p>
          </div>
        </div>
      </section>
      <section id="saunas" className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>Proposed offerings</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight">Heat, cold and stillness, built to last in Ottawa.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {cats.map(([t, d, list], i) => (
              <article key={t} className="reveal rounded-[28px] bg-white p-8 lg:p-10">
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-sage">0{i + 1} · Now taking inquiries</span>
                <h3 className="mt-4 font-display text-[26px] font-bold tracking-tight">{t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-graphite/70">{d}</p>
                <ul className="check-list mt-5">{list.map((l) => <li key={l}>{l}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#0f1714] text-ivory">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <Eyebrow light>Design yours in 3D</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-tight tracking-tight">The Retreat Configurator</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ivory/75">Pick a package, decking colour, sauna and plunge options, pergola, lighting and privacy, and watch a live 3D model and estimate update as you go.</p>
            <a href={href('/wellness/retreat-configurator')} className="btn btn-sage mt-8">Open the configurator <Arrow /></a>
          </div>
          <a href={href('/wellness/retreat-configurator')} className="reveal block aspect-[4/3] overflow-hidden rounded-[28px]">{WELLP[1] ? <Media item={WELLP[1]} className="h-full w-full" /> : <Panel kind="wellness" className="h-full w-full" big />}</a>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>Smart sauna technology</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-bold uppercase leading-[1.02] tracking-tight">Smart wellness.<br />Seamless control.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] bg-graphite/10 sm:grid-cols-2 lg:grid-cols-5">
            {['App-enabled temperature control', 'Scheduled heating', 'Remote heater management', 'Smart lighting', 'Temperature monitoring'].map((f) => (
              <div key={f} className="bg-white p-7"><h3 className="text-[16px] font-semibold">{f}</h3><p className="mt-2 text-[13px] text-graphite/55">Depends on the heater manufacturer selected. To be confirmed.</p></div>
            ))}
          </div>
        </div>
      </section>
      <section id="wellness-quote" className="bg-sand">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr] lg:px-10 lg:py-20">
          <div><Eyebrow>Request a wellness quote</Eyebrow><h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-tight tracking-tight">Tell us about your retreat.</h2><p className="mt-5 max-w-md text-[17px] text-graphite/70">We’ll follow up as products and pricing are confirmed. Related: <a className="link" href={href('/decks')}>custom decks</a>, <a className="link" href={href('/backyard-makeover')}>backyard makeovers</a>, <a className="link" href={href('/railings')}>railings</a>.</p></div>
          <EstimateForm wellness />
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/wellness', [], 10)} heading="Sauna & cold plunge questions" />
  
    </Document>
  )
}

/* ---------- commercial division (new) ---------- */
export function Commercial() {
  const C = conceptsJson as any[]
  const trail: [string, string][] = [['Home', '/'], ['Commercial', '/commercial-deck-construction']]
  const meta: Meta = { title: 'Commercial & Multi-Unit Deck Construction Ottawa | Ottawa Deck Pro', desc: 'Deck construction and replacement for condominiums, multi-unit properties and commercial developments in Ottawa. Coordinated crews, phased scheduling, aluminum railings.', canonical: ORIGIN + '/commercial-deck-construction',
    extraLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Commercial and multi-unit deck construction', areaServed: { '@type': 'City', name: 'Ottawa' }, provider: { '@type': 'LocalBusiness', name: BRAND.name, url: ORIGIN } }, faqLd(toQA(pickFaqs('/commercial-deck-construction', [], 7)))] }
  const services = ['Condominium deck replacement', 'Multi-unit deck construction', 'Apartment deck upgrades', 'Townhouse deck replacements', 'Commercial composite decking', 'Pressure-treated deck construction', 'Aluminum railing installations', 'Deck rehabilitation and reconstruction']
  const strengths: [string, string][] = [
    ['Coordinated construction teams', 'Crews organized around your building, so work moves unit by unit without losing consistency.'],
    ['Multi-unit project planning', 'Scope, layouts and material lists prepared for every deck before work begins.'],
    ['Material procurement', 'Decking, framing and railing ordered and staged for the full project, not one deck at a time.'],
    ['Phased construction scheduling', 'Work sequenced in phases to limit disruption for residents and property staff.'],
    ['Consistent workmanship', 'The same details, fastening and finishes on the first deck and the last.'],
    ['Professional communication', 'One point of contact for the board or property manager, with regular progress updates.'],
    ['Site coordination', 'Access, staging areas and resident notices planned with your team.'],
    ['Efficient project execution', 'Clear daily plans so crews spend their time building.'],
  ]
  const who = [['Condominium corporations', 'Balcony and patio deck replacement across a building or complex.'], ['Property management companies', 'Planned upgrades and rehabilitation across a portfolio.'], ['Real estate developers', 'New multi-unit deck construction to your drawings and schedule.'], ['Multi-unit property owners', 'Townhouse and apartment decks, replaced or rebuilt.'], ['Commercial property managers', 'Commercial decking and aluminum railing installations.']]
  return (
    <Document meta={meta}>
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-ivory">
        {C[0] ? <><div className="parallax absolute inset-0 -z-10" data-parallax><Media item={CS.rooftopNight} className="h-full w-full" eager /></div><div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/35" /></> : <><div className="panel-commercial absolute inset-0 -z-20" /><div className="panel-lines" aria-hidden="true" /></>}
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-40 lg:px-10">
          <Crumbs trail={trail} />
          <p className="reveal mt-8 eyebrow text-bronze-light">Commercial & multi-unit division</p>
          <h1 className="reveal mt-5 font-display text-[clamp(2.8rem,8vw,7.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">Commercial scale.<br /><span className="text-bronze-light">Uncompromising quality.</span></h1>
          <p className="reveal mt-7 max-w-xl text-[18px] leading-relaxed text-ivory/80">Professional deck construction and replacement for condominiums, multi-unit developments, and commercial properties throughout Ottawa.</p>
          <div className="reveal mt-9 flex flex-wrap gap-3"><a href="#commercial-quote" className="btn btn-primary">Request a commercial quote <Arrow /></a><a href="#commercial-projects" className="btn btn-ghost-light">View commercial projects</a></div>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <Eyebrow>Proven multi-unit experience</Eyebrow>
            <h2 className="reveal mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold uppercase leading-[1] tracking-tight">Beyond the single backyard.</h2>
            <p className="reveal mt-6 max-w-lg text-[17px] leading-relaxed text-graphite/75">Ottawa Deck Pro completed commercial work during 2026, including condominium and multi-unit projects. Our team coordinates multiple deck structures, material logistics, scheduling and phased construction, so a building gets the same craftsmanship as a single custom backyard.</p>
          </div>
          <article className="reveal overflow-hidden rounded-[28px] bg-charcoal text-ivory">
            {C[1] ? <Media item={C[1]} className="aspect-[16/9]" /> : null}
            <div className="grid gap-6 p-8 sm:grid-cols-[auto_1fr] sm:items-center">
              <p className="font-display text-[72px] font-extrabold leading-none text-bronze-light">10+</p>
              <div><p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory/60">2026 commercial work</p><p className="mt-2 text-[17px] leading-snug text-ivory/80">Condominium and multi-unit decks completed in 2026.</p></div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>Commercial services</Eyebrow>
          <h2 className="reveal mt-4 max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold uppercase leading-[1] tracking-tight">Decks and railings for every kind of property.</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[28px] bg-graphite/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => <li key={s} className="reveal bg-white p-7"><span className="font-display text-[15px] font-bold text-bronze">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-4 text-[18px] font-semibold leading-snug">{s}</h3></li>)}
          </ul>
          <p className="mt-8 max-w-3xl text-[16px] leading-relaxed text-graphite/70">The same materials we install on residential projects, including <a className="link" href={href('/decks')}>composite, PVC and pressure-treated decking</a> and <a className="link" href={href('/railings')}>aluminum and glass railings</a>, built to the scale of a building.</p>
        </div>
      </section>

      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow light>Built for complex projects</Eyebrow>
          <h2 className="reveal mt-4 max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold uppercase leading-[1] tracking-tight">Organized for many decks at once.</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map(([t, d]) => <div key={t} className="reveal border-t border-ivory/15 pt-5"><h3 className="text-[17px] font-semibold">{t}</h3><p className="mt-2 text-[15px] leading-relaxed text-ivory/65">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section id="commercial-projects" className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>Commercial project gallery</Eyebrow>
          <h2 className="reveal mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold uppercase leading-[1] tracking-tight">Multi-unit work.</h2>
          {C.length ? null : <div className="mt-10 grid gap-3 lg:grid-cols-[1.4fr_1fr]"><Panel kind="commercial" className="aspect-[16/10] rounded-[28px]" big /><div className="flex flex-col justify-end rounded-[28px] bg-white p-8"><p className="font-display text-[26px] font-semibold leading-tight tracking-tight">Recent multi-unit work, on request.</p><p className="mt-3 text-[15px] leading-relaxed text-graphite/65">Ask us for photos and references from our 2026 condominium and multi-unit projects during your site review.</p><a href="#commercial-quote" className="btn btn-dark mt-6 self-start">Request a site review <Arrow /></a></div></div>}
          {C.length ? <div className="mt-6 grid gap-3 md:grid-cols-3">{C.map((c: any) => <Media key={c.src} item={c} className="reveal aspect-[4/3] rounded-2xl" sizes="33vw" />)}</div> : null}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>Who we work with</Eyebrow>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {who.map(([t, d]) => <article key={t} className="reveal rounded-[24px] bg-ivory p-7"><h3 className="font-display text-[19px] font-extrabold uppercase leading-tight">{t}</h3><p className="mt-3 text-[14px] leading-relaxed text-graphite/65">{d}</p></article>)}
          </div>
        </div>
      </section>

      <section id="commercial-quote" className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr] lg:px-10 lg:py-20">
          <div className="reveal"><Eyebrow light>Commercial inquiry</Eyebrow><h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold uppercase leading-[0.98]">Discuss your commercial project.</h2><p className="mt-6 max-w-md text-[17px] leading-relaxed text-ivory/75">Share the property, number of decks and timeline. Plans and documents are welcome.</p><p className="mt-8 text-[15px] text-ivory/70">Phone: <a href={BRAND.phoneHref} className="text-ivory hover:underline">{BRAND.phone}</a> · Email: <a href={`mailto:${BRAND.email}`} className="text-ivory hover:underline">{BRAND.email}</a></p></div>
          <EstimateForm kind="commercial" />
        </div>
      </section>
      <MoreFaqs items={pickFaqs('/commercial-deck-construction', [], 7)} heading="Commercial project questions" />
  
    </Document>
  )
}

/* ---------- wellness product template (only published products are built) ---------- */
export const PRODUCTS = (productsJson as any[]).filter((p) => p.published)
export function WellnessProduct({ p }: { p: any }) {
  const path = '/wellness/products/' + p.slug
  const trail: [string, string][] = [['Home', '/'], ['Wellness', '/wellness'], [p.name, path]]
  const meta: Meta = { title: `${p.name} | ODP Wellness | Ottawa Deck Pro`, desc: p.summary || `${p.name}, designed and installed by Ottawa Deck Pro.`, canonical: ORIGIN + path, extraLd: [crumbLd(trail), { '@context': 'https://schema.org', '@type': 'Product', name: p.name, brand: 'ODP Wellness', ...(p.price ? { offers: { '@type': 'Offer', priceCurrency: 'CAD', price: p.price } } : {}) }] }
  const rows: [string, any][] = [['Dimensions', p.dimensions], ['Capacity', p.capacity], ['Materials', p.materials], ['Heater options', (p.heaterOptions || []).join(', ')], ['Electrical requirements', p.electrical], ['Available finishes', (p.finishes || []).join(', ')], ['Smart features', (p.smartFeatures || []).join(', ')], ['Optional upgrades', (p.upgrades || []).join(', ')], ['Installation', p.installation], ['Price', p.price ? `$${p.price} CAD` : 'Quote on request']]
  return (
    <Document meta={meta}>
      <section className="bg-[#0f1714] pb-16 pt-36 text-ivory"><div className="mx-auto max-w-[1440px] px-5 lg:px-10"><Crumbs trail={trail} /><h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.95]">{p.name}</h1></div></section>
      <section className="bg-ivory"><div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-2 lg:px-10">
        <div className="grid gap-3">{(p.images || []).map((im: any) => <Media key={im.src} item={im} className="rounded-2xl" />)}</div>
        <dl className="divide-y divide-graphite/10 border-y border-graphite/10">{rows.filter(([, v]) => v).map(([k, v]) => <div key={k} className="grid grid-cols-[180px_1fr] gap-4 py-4"><dt className="text-graphite/55">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
      </div></section>
      {(p.faqs || []).length ? <FaqBlock qa={p.faqs.map((f: any) => [f.q, f.a])} /> : null}
      <section id="wellness-quote" className="bg-sand"><div className="mx-auto max-w-3xl px-5 py-20"><EstimateForm kind="wellness" /></div></section>
    </Document>
  )
}

export function NotFound() {
  const links: [string, string][] = [['Decks', '/decks'], ['Railings', '/railings'], ['Wellness', '/wellness'], ['Our projects', '/gallery'], ['Service areas', '/service-areas'], ['Contact', '/contacts']]
  return (
    <Document meta={{ title: 'Page not found | Ottawa Deck Pro', canonical: ORIGIN + '/', robots: 'noindex' }}>
      <section className="bg-charcoal pb-24 pt-40 text-ivory lg:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bronze-light">404</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">Page not found</h1>
          <p className="mt-5 max-w-xl text-[18px] text-ivory/75">This page moved or never existed. Try one of these:</p>
          <div className="mt-8 flex flex-wrap gap-3">{links.map(([l, h]) => <a key={h} href={h} className="btn btn-ghost-light">{l}</a>)}</div>
          <a href="/" className="btn btn-primary mt-8">Back to home</a>
        </div>
      </section>
    </Document>
  )
}

function ClientInterview() {
  const G = (settingsJson as any).googleRating
  return (
    <section className="ci bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:px-10 lg:py-20">
        <div className="reveal">
          <p className="eyebrow text-bronze-light">Real client interview</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-tight">Hear it from our clients</h2>
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-ivory/75">Kanata homeowners talk about their new composite deck, on camera, in their own backyard. Hear what it was like working with our crew.</p>
          <a href={(settingsJson as any).googleReviewsUrl} target="_blank" rel="noopener" className="mt-8 flex items-center gap-3 text-[15px] text-ivory/70 hover:text-ivory"><Stars size={17} /><span><b className="font-semibold text-ivory">{G.value}</b> · {G.count} Google reviews</span></a>
          <div className="mt-8 flex flex-wrap gap-3"><Btn to="/reviews" variant="primary">Read all reviews <Arrow /></Btn><Btn to="#estimate-team" variant="ghost-light">Get a free estimate</Btn></div>
        </div>
        <figure className="ci-video rv-video reveal" data-rv-video>
          <video src={asset('media/kanata-composite-deck-client-testimonial-preview.mp4')} data-full={asset('media/kanata-composite-deck-client-testimonial.mp4')} poster={imgSrc('kanata-composite-deck-client-testimonial.webp')} muted loop playsInline autoPlay preload="metadata" aria-label="Kanata homeowners talk about their new composite deck with Ottawa Deck Pro" />
          <button type="button" className="rv-play" data-rv-play><span aria-hidden="true">▶</span> Play the interview</button>
          <figcaption>Client interview · Composite deck in Kanata</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Reviews() {
  const trail: [string, string][] = [['Home', '/'], ['Reviews', '/reviews']]
  const G = (settingsJson as any).googleRating
  const GURL = (settingsJson as any).googleReviewsUrl
  const ALL = (reviewsJson as any).items as { name: string; quote: string; href?: string }[]
  // what clients mention most: counted from the review text at build time, so the numbers stay true
  const sentences = (q: string) => q.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/)
  const THEMES: [string, RegExp][] = [['Would recommend', /recommend/i], ['Professional', /professional/i], ['Clean work', /clean/i], ['Quality craftsmanship', /quality|craftsmanship/i], ['Design help', /design/i], ['On time', /on time|when they said/i], ['Attention to detail', /attention to detail|the details/i], ['Permits handled', /permit/i]]
  const used = new Set<string>()
  const themes = THEMES.map(([label, re]) => {
    const hits = ALL.filter((r) => re.test(r.quote))
    let pick: { name: string; line: string } | null = null
    for (const r of hits) { if (used.has(r.name)) continue; const line = sentences(r.quote).find((x) => re.test(x) && x.length >= 30 && x.length <= 170); if (line) { pick = { name: r.name, line }; used.add(r.name); break } }
    return { label, count: hits.length, pick }
  }).filter((t) => t.count >= 5).sort((x, y) => y.count - x.count)
  const tagCount = (k: string) => ALL.filter((r) => reviewTags(r.quote).split(' ').includes(k)).length
  const tags = REVIEW_TAGS.map(([k, label]) => ({ k, label, n: tagCount(k) })).filter((t) => t.n >= 2)
  const top = themes[0]
  const qa: [string, string][] = [
    ['Are these real Ottawa Deck Pro reviews?', `Yes. Every review on this page was written by a client on our Google Business Profile and is shown word for word. Click a reviewer's name to see the original on Google.`],
    ['What is Ottawa Deck Pro’s Google rating?', `${G.value} out of 5 stars from ${G.count} Google reviews.`],
    ['What do clients mention most in their reviews?', themes.slice(0, 4).map((t) => `${t.label.toLowerCase()} (${t.count} reviews)`).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'],
    ['What kinds of projects do the reviews cover?', `Mostly decks (${tagCount('decks')} reviews), plus railings, fences, composite and PVC decking, staining, and help with permits and drafting, across Ottawa and nearby towns.`],
    ['How do I leave a review for Ottawa Deck Pro?', 'Open our Google listing and tap Write a review. It takes a minute and helps other Ottawa homeowners choose their builder.'],
  ]
  const meta: Meta = {
    title: `Ottawa Deck Builder Reviews | ${G.value} Stars, ${G.count} Google Reviews`,
    desc: `Read ${ALL.length} real Google reviews of Ottawa Deck Pro. Rated ${G.value} out of 5 by ${G.count} Ottawa homeowners for decks, railings, fences, staining and permits.`,
    canonical: ORIGIN + '/reviews',
    extraLd: [crumbLd(trail), faqLd(qa)],
  }
  const links: [string, string, string][] = [['/decks', 'Decks', 'Composite, PVC and wood decks'], ['/railings', 'Railings', 'Glass, aluminum and wood'], ['/fences', 'Fences', 'Privacy and pool fences'], ['/staining', 'Staining', 'Restore and protect wood'], ['/gallery', 'Project gallery', 'Photos of our recent builds'], ['/service-areas', 'Service areas', 'Ottawa and surrounding towns']]
  return (
    <Document meta={meta}>
      {/* hero */}
      <section className="rvp-hero bg-charcoal pb-16 pt-36 text-ivory lg:pb-20 lg:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <Crumbs trail={trail} />
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="eyebrow text-bronze-light">Client reviews</p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Ottawa deck builder reviews</h1>
              <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ivory/75">Real words from Ottawa homeowners who built with us. Every review below comes straight from our Google listing, unedited.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href={GURL} target="_blank" rel="noopener" className="btn btn-primary">Read them on Google <Arrow /></a><Btn to="#estimate" variant="ghost-light">Get a free estimate</Btn></div>
            </div>
            <div className="rvp-score">
              <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory/70"><span className="grid h-8 w-8 place-items-center rounded-full bg-white"><GLogo size={18} /></span>Google rating</p>
              <div className="mt-4 flex items-end gap-4"><span className="font-display text-[84px] font-light leading-none tracking-[-0.04em]">{G.value}</span><span className="pb-3"><Stars size={22} /><span className="mt-2 block text-[14px] text-ivory/70">{G.count} Google reviews</span></span></div>
              {top ? <p className="mt-5 border-t border-ivory/10 pt-5 text-[14.5px] text-ivory/70"><b className="text-ivory">{top.count} of {ALL.length}</b> written reviews say they would recommend us.</p> : null}
            </div>
          </div>
        </div>
      </section>

      {/* themes */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>In their words</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">What Ottawa clients mention most</h2>
          <p className="mt-4 max-w-2xl text-[16px] text-graphite/65">Counted across all {ALL.length} written reviews on this page.</p>
          <div className="rvp-themes mt-10">
            {themes.map((t) => (
              <figure key={t.label} className="rvp-theme reveal">
                <p className="rvp-num">{t.count}<span> reviews</span></p>
                <h3 className="mt-1 text-[17px] font-semibold">{t.label}</h3>
                {t.pick ? <blockquote className="mt-4 text-[14.5px] leading-relaxed text-graphite/70">“{t.pick.line}”<figcaption className="mt-2 text-[12.5px] font-semibold not-italic text-graphite/50">{t.pick.name}</figcaption></blockquote> : null}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* filter + every review */}
      <div className="rvp-filter-wrap bg-sand" data-rvp-filter>
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-5 pt-12 lg:px-10 lg:pt-16" role="group" aria-label="Filter reviews by project">
          <span className="mr-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-graphite/50">Filter</span>
          <button type="button" className="rvp-chip on" data-rvp-tag="" aria-pressed="true">All reviews <span>{ALL.length}</span></button>
          {tags.map((t) => <button key={t.k} type="button" className="rvp-chip" data-rvp-tag={t.k} aria-pressed="false">{t.label} <span>{t.n}</span></button>)}
        </div>
      </div>
      <Testimonials heading="Every written review" eyebrow={`${ALL.length} Google reviews`} showAll video={{ src: 'media/kanata-composite-deck-client-testimonial.mp4', preview: 'media/kanata-composite-deck-client-testimonial-preview.mp4', poster: 'kanata-composite-deck-client-testimonial.webp', caption: 'Client testimonial · Composite deck in Kanata', label: 'Kanata homeowners talk about their new composite deck with Ottawa Deck Pro' }} />

      {/* leave a review */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center lg:px-10">
          <div><h2 className="font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-[-0.02em]">Built with us? Tell Ottawa how it went.</h2><p className="mt-2 text-[16px] text-ivory/65">Your review helps other homeowners pick the right builder.</p></div>
          <a href={GURL} target="_blank" rel="noopener" className="btn btn-primary shrink-0"><span className="grid h-6 w-6 place-items-center rounded-full bg-white"><GLogo size={14} /></span>Leave a Google review</a>
        </div>
      </section>

      {/* explore the work */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
          <Eyebrow>The work behind the reviews</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">See what our clients are talking about</h2>
          <div className="rvp-links mt-10">
            {links.map(([to, t, d]) => <a key={to} href={href(to)} className="rvp-link"><span><b>{t}</b><small>{d}</small></span><Arrow /></a>)}
          </div>
        </div>
      </section>

      <FaqBlock heading="Questions about our reviews" qa={qa} />
      <EstimateSection eyebrow="Your backyard is next" heading="Join our happy Ottawa clients." sub="Tell us about your project and a team member will be in touch within 24 hours." photo={PHOTOS.multiLevel} />
    </Document>
  )
}

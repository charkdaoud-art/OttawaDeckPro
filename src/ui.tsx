import React from 'react'
import reviewsJson from '../content/collections/reviews.json'
import occasionsJson from '../content/collections/occasions.json'
import settingsJson from '../content/collections/settings.json'
import { BRAND, NAV, STATS, TESTIMONIALS, ORIGIN, TRACKING, FORMS, PHOTOS, type Photo } from './site'
import { CTX, href, asset, imgSrc, wixImage, Inline, plain, isCaps } from './lib'
import type { Block, Card, Section } from './parse'

/* ---------- primitives ---------- */
export const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const Btn = ({ to, children, variant = 'primary', className = '', ...rest }: any) => (
  <a href={href(to)} className={`btn btn-${variant} ${className}`} {...rest}>{children}</a>
)
export function Img({ photo, className = '', sizes = '100vw', eager = false }: { photo: Photo; className?: string; sizes?: string; eager?: boolean }) {
  return <img src={imgSrc(photo.file)} alt={photo.alt} width={photo.w} height={photo.h} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchpriority={eager ? 'high' : undefined} sizes={sizes} className={className} />
}
export const Eyebrow = ({ children, light = false }: any) => <p className={`eyebrow ${light ? 'text-bronze-light' : 'text-bronze'}`}>{children}</p>

function Heading({ b, as, className = '' }: { b: Block; as?: string; className?: string }) {
  const Tag: any = as || b.t
  const caps = isCaps(b.x || '')
  return <Tag className={`${caps ? 'h-caps' : 'h-sentence'} ${className}`}><Inline text={(b.x || '').replace(/​/g, '').replace(/\s*\n+\s*/g, ' ')} /></Tag>
}

/* ---------- logo ---------- */
export const Logo = ({ inverse = false }: { inverse?: boolean }) => (
  <span className="flex items-center gap-3">
    <img src={imgSrc('ottawa-deck-pro-logo.png')} alt="Ottawa Deck Pro logo" width="48" height="48" className={`h-11 w-11 object-contain transition ${inverse ? 'logo-inverse' : ''}`} />
    <span className="leading-none">
      <span className="block font-display text-[15px] font-extrabold tracking-[0.14em]">OTTAWA DECK PRO</span>
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">Outdoor Living. Elevated.</span>
    </span>
  </span>
)

/* ---------- head ---------- */
export type Meta = { title: string; desc?: string; canonical: string; robots?: string; og?: string; ld?: string[]; extraLd?: object[] }
export function Document({ meta, children, dark = true }: { meta: Meta; children: React.ReactNode; dark?: boolean }) {
  const ld = [...(meta.ld || []), ...(meta.extraLd || []).map((o) => JSON.stringify(o))]
  return (
    <html lang="en-CA">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{meta.title}</title>
        {meta.desc ? <meta name="description" content={meta.desc} /> : null}
        <link rel="canonical" href={meta.canonical} />
        {meta.robots ? <meta name="robots" content={meta.robots} /> : null}
        <meta property="og:title" content={meta.title} />
        {meta.desc ? <meta property="og:description" content={meta.desc} /> : null}
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:type" content="website" />
        {meta.og ? <meta property="og:image" content={meta.og} /> : null}
        <meta name="theme-color" content="#0E1311" />
        {!CTX.preview ? <meta name="google-site-verification" content={TRACKING.gscVerification} /> : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={asset('assets/site.css')} />
        <link rel="icon" href={imgSrc('ottawa-deck-pro-logo.png')} />
        {ld.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: s }} />)}
        {!CTX.preview ? <script dangerouslySetInnerHTML={{ __html: trackingSnippet() }} /> : null}
      </head>
      <body className={`bg-ivory text-graphite antialiased ${dark ? 'has-dark-hero' : ''}`}>
        <a href="#main" className="skip">Skip to content</a>
        <script type="application/json" id="odp-occasions" dangerouslySetInnerHTML={{ __html: JSON.stringify(occasionsJson).replace(/</g, '\\u003c') }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <OfferPopup />
        {!CTX.preview && (FORMS.estimate || FORMS.emailList) && <script dangerouslySetInnerHTML={{ __html: `window.ODP_FORM_ENDPOINT=${JSON.stringify(FORMS.estimate)};window.ODP_LIST_ENDPOINT=${JSON.stringify(FORMS.emailList || FORMS.estimate)};` }} />}
        <script src={asset('assets/site.js')} defer />
      </body>
    </html>
  )
}
const trackingSnippet = () => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${TRACKING.ga4}');gtag('config','${TRACKING.googleAds}');
(function(){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${TRACKING.ga4}';document.head.appendChild(s)})();
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${TRACKING.metaPixel}');fbq('track','PageView');`

/* ---------- header ---------- */
function Header() {
  return (<>
    <header className="site-header" data-header>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 lg:h-[84px] lg:px-10">
        <a href={href('/')} aria-label="Ottawa Deck Pro home" className="shrink-0"><Logo /></a>
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-[14px] font-semibold">
            {NAV.map((n) => (
              <li key={n.label} className="nav-item">
                <a href={href(n.href)} className="nav-link" aria-haspopup={n.items ? 'true' : undefined}>
                  {n.label}{n.items ? <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="ml-1.5 opacity-60"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg> : null}
                </a>
                {n.items ? (
                  <div className="mega">
                    <div className="mega-inner">
                      {n.items.map((it) => (
                        <a key={it.label} href={href(it.href)} className="mega-link">
                          <span className="block text-[15px] font-semibold text-graphite">{it.label}</span>
                          <span className="mt-0.5 block text-[13px] font-normal text-graphite/60">{it.desc}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href={BRAND.phoneHref} className="hidden text-[14px] font-semibold lg:inline" data-track="phone">{BRAND.phone}</a>
          <Btn to="/contacts#estimate" className="hidden sm:inline-flex">Get a free estimate</Btn>
          <button className="menu-btn xl:hidden" aria-label="Open menu" aria-expanded="false" data-menu-open>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
      <div className="mobile-menu" data-menu hidden>
      <div className="flex h-[72px] items-center justify-between px-5">
        <Logo inverse />
        <button className="text-ivory" aria-label="Close menu" data-menu-close>
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><path d="M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
      </div>
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 pb-10 pt-4">
        <a href={href('/')} className="m-link">Home</a>
        {NAV.map((n) => n.items ? (
          <details key={n.label} className="m-group">
            <summary className="m-link">{n.label}</summary>
            <div className="pb-4 pl-1">
              {n.items.map((it) => <a key={it.label} href={href(it.href)} className="block py-2.5 text-[17px] text-ivory/75">{it.label}</a>)}
            </div>
          </details>
        ) : <a key={n.label} href={href(n.href)} className="m-link">{n.label}</a>)}
        <div className="mt-10 space-y-3">
          <Btn to="/contacts#estimate" className="w-full justify-center">Get a free estimate</Btn>
          <a href={BRAND.phoneHref} className="btn btn-ghost-light w-full justify-center" data-track="phone">Call {BRAND.phone}</a>
        </div>
      </nav>
    </div>
  </>)
}

/* ---------- footer ---------- */
const FOOTER_AREAS: [string, string][] = [['Stittsville', 'stittsville'], ['Kanata', 'kanata'], ['Carp', 'carp'], ['Arnprior', 'arnprior'], ['Carleton Place', 'carleton-place'], ['Barrhaven', 'barrhaven'], ['Nepean', 'nepean'], ['Manotick', 'manotick'], ['Dunrobin', 'dunrobin']]

/* ---------- email list offer: footer band + one-time popup ---------- */
const OFFER_TERMS = [
  'Valid on new projects with a signed contract of $40,000 or more, before tax.',
  'You must join the list before your contract is signed. One offer per household and property.',
  'Applied as a credit on your final invoice. No cash value. Cannot be combined with other offers.',
  'Available in Ottawa Deck Pro service areas only. Ottawa Deck Pro may change or end this offer at any time; offers already in a signed contract are honoured.',
]
export function OfferForm({ id, dark = false }: { id: string; dark?: boolean }) {
  const inp = `w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition focus:border-bronze ${dark ? 'border-ivory/15 bg-ivory/5 text-ivory placeholder:text-ivory/40' : 'border-graphite/15 bg-white text-graphite placeholder:text-graphite/40'}`
  return (
    <form data-list={id} noValidate className="offer-form">
      <div className="grid gap-2.5 sm:grid-cols-[1fr_1.4fr_auto]">
        <label className="sr-only" htmlFor={`${id}-name`}>First name</label>
        <input id={`${id}-name`} name="first_name" type="text" autoComplete="given-name" placeholder="First name" className={inp} />
        <label className="sr-only" htmlFor={`${id}-email`}>Email</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder="Email address" className={inp} />
        <button type="submit" className="btn btn-primary whitespace-nowrap">Get my $5,000 offer</button>
      </div>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className={`mt-3 flex items-start gap-2.5 text-[12.5px] leading-snug ${dark ? 'text-ivory/60' : 'text-graphite/60'}`}>
        <input type="checkbox" name="consent" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#7CBC42]" />
        <span>Yes, email me Ottawa Deck Pro offers and project ideas. Unsubscribe anytime. Ottawa Deck Pro, {BRAND.street}, {BRAND.city}, {BRAND.region}, {BRAND.email}</span>
      </label>
      <p className="offer-err mt-2 text-[13px] font-semibold text-[#E5484D]" role="alert"></p>
      <details className={`mt-2 text-[12px] ${dark ? 'text-ivory/50' : 'text-graphite/50'}`}>
        <summary className="cursor-pointer underline underline-offset-2">Offer conditions</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">{OFFER_TERMS.map((t) => <li key={t}>{t}</li>)}</ul>
      </details>
    </form>
  )
}
function OfferBand() {
  return (
    <div className="border-b border-ivory/10">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:px-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bronze-light">Backyard makeover offer</p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold leading-[1.05] tracking-tight">Join the list. Get <span className="text-gold">$5,000 off</span> your backyard makeover.</h2>
          <p className="mt-3 text-[14px] text-ivory/60">On signed projects of $40,000+ before tax. Conditions apply.</p>
        </div>
        <OfferForm id="offer-footer" dark />
      </div>
    </div>
  )
}
function OfferPopup() {
  return (
    <div className="offer-pop" data-offer-pop hidden role="dialog" aria-modal="true" aria-labelledby="offer-pop-h">
      <div className="offer-pop-bg" data-offer-close></div>
      <div className="offer-pop-card">
        <button type="button" className="offer-pop-x" data-offer-close aria-label="Close">×</button>
        <img src={imgSrc('luxury-composite-deck-covered-patio-ottawa.webp')} alt="" className="offer-pop-img" loading="lazy" />
        <div className="p-6 sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bronze-dark">New visitor offer</p>
          <h2 id="offer-pop-h" className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-[1.05] tracking-tight">$5,000 off your backyard makeover</h2>
          <p className="mt-2 text-[15px] text-graphite/70">Join our list for design ideas, seasonal offers and early booking spots.</p>
          <p className="mt-1 text-[13px] font-medium text-graphite/55">On signed projects of $40,000+ before tax. Conditions apply.</p>
          <div className="mt-5"><OfferForm id="offer-pop" /></div>
          <button type="button" className="mt-3 text-[13px] text-graphite/50 underline underline-offset-2" data-offer-close>No thanks</button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <OfferBand />
      <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-14 lg:px-10 lg:pb-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo inverse />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ivory/60">Premium decks, railings and backyard living spaces, designed and built in Ottawa.</p>
            <div className="mt-6 flex gap-3">
              <a href={BRAND.instagram} target="_blank" rel="noopener" className="social" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a>
              <a href={BRAND.facebook} target="_blank" rel="noopener" className="social" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v6h4v-6h3l.5-4H14V8.6c0-.4.2-.6.6-.6z" /></svg></a>
            </div>
          </div>
          <div>
            <h2 className="footer-h">Quick links</h2>
            <ul className="space-y-2.5 text-[15px] text-ivory/70">
              {[['Home', '/'], ['Decks', '/decks'], ['Railing', '/railings'], ['Staining', '/staining'], ['Fences', '/fences'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['FAQ', '/faq'], ['Contact', '/contacts']].map(([l, h]) => <li key={l}><a href={href(h)} className="hover:text-ivory">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Contact info</h2>
            <ul className="space-y-2.5 text-[15px] text-ivory/70">
              <li>Email: <a href={`mailto:${BRAND.email}`} className="hover:text-ivory">{BRAND.email}</a></li>
              <li>Phone: <a href={BRAND.phoneHref} className="hover:text-ivory" data-track="phone">{BRAND.phone}</a></li>
              <li>Text: {BRAND.text}</li>
              <li>Address: {BRAND.street}, {BRAND.city}, {BRAND.region}</li>
              <li>{BRAND.hours}</li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Areas we serve</h2>
            <p className="text-[15px] leading-relaxed text-ivory/70">
              {BRAND.radius}{' '}
              {FOOTER_AREAS.map(([l, s], i) => <React.Fragment key={s}><a href={href('/deck-builder-' + s)} className="underline decoration-ivory/25 underline-offset-4 hover:text-ivory">{l}</a>{', '}</React.Fragment>)}
              Richmond, Almonte, Calabogie, Mississippi Mills, and nearby areas.
            </p>
            <a href={href('/service-areas')} className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-bronze-light">All service areas <Arrow /></a>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-[12px] text-ivory/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Ottawa Deck Pro. All rights reserved.</p>
          {CTX.preview ? <p>Preview build. Not the live site.</p> : null}
        </div>
      </div>
    </footer>
  )
}
function MobileBar() {
  return (
    <div className="mobile-bar lg:hidden" data-mobile-bar>
      <a href={BRAND.phoneHref} className="btn btn-ghost-light flex-1 justify-center" data-track="phone">Call</a>
      <Btn to="/contacts#estimate" className="flex-[2] justify-center">Get a free estimate</Btn>
    </div>
  )
}

/* ---------- breadcrumbs ---------- */
export function Crumbs({ trail, light = true }: { trail: [string, string][]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] ${light ? 'text-ivory/70' : 'text-graphite/60'}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map(([label, path], i) => (
          <li key={path} className="flex items-center gap-2">
            {i ? <span aria-hidden="true">/</span> : null}
            {i < trail.length - 1 ? <a href={href(path)} className="hover:underline">{label}</a> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
export const crumbLd = (trail: [string, string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ORIGIN + (path === '/' ? '/' : path) })),
})

/* ---------- page hero ---------- */
export function PageHero({ h1, eyebrow, blocks = [], img, photo, trail, short = false }: { h1: Block; eyebrow?: string; blocks?: Block[]; img?: string | null; photo?: Photo; trail: [string, string][]; short?: boolean }) {
  const src = img || (photo ? imgSrc(photo.file) : null)
  const ps = blocks.filter((b) => b.t === 'p')
  const as = blocks.filter((b) => b.t === 'a')
  return (
    <section className={`relative isolate flex ${short ? 'min-h-[62svh]' : 'min-h-[78svh]'} items-end overflow-hidden bg-charcoal text-ivory`}>
      {src ? <img src={src} alt={photo?.alt || ''} className="hero-img absolute inset-0 -z-10 h-full w-full object-cover" fetchpriority="high" /> : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/30" />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-36 lg:px-10 lg:pb-20">
        <div className="reveal"><Crumbs trail={trail} /></div>
        {eyebrow ? <div className="reveal mt-8"><Eyebrow light>{eyebrow}</Eyebrow></div> : null}
        <h1 className={`reveal mt-5 max-w-5xl font-display text-[clamp(2.4rem,6.4vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em] ${isCaps(h1.x || '') ? 'uppercase' : ''}`}>{plain(h1.x || '')}</h1>
        {ps.map((p, i) => <p key={i} className="reveal mt-6 max-w-2xl text-[17px] leading-relaxed text-ivory/80 md:text-[19px]"><Inline text={p.x || ''} /></p>)}
        <div className="reveal mt-9 flex flex-wrap gap-3">
          <Btn to="/contacts#estimate">Get a free estimate <Arrow /></Btn>
          {as.filter((a) => a.h?.startsWith('tel:')).map((a, i) => <a key={i} href={BRAND.phoneHref} className="btn btn-ghost-light" data-track="phone">Call {BRAND.phone}</a>)}
          {as.filter((a) => a.h && !a.h.startsWith('tel:') && !/contacts|deck-packages$/.test(a.h) && a.x).map((a, i) => <Btn key={i} to={a.h} variant="ghost-light">{a.x}</Btn>)}
        </div>
      </div>
    </section>
  )
}

/* ---------- reusable sections ---------- */
export function StatsBand({ dark = false }: { dark?: boolean }) {
  return (
    <section aria-label="Project stats" className={dark ? 'bg-charcoal text-ivory' : 'bg-ivory'}>
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        <p className={`eyebrow ${dark ? 'text-bronze-light' : 'text-bronze'}`}>Project stats</p>
        <dl className="mt-8 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className={`reveal border-l pl-5 ${dark ? 'border-ivory/15' : 'border-graphite/15'}`}>
              <dd className="font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-bold tracking-tight">{s.value}</dd>
              <dt className={`mt-1 text-[13px] font-semibold uppercase tracking-[0.18em] ${dark ? 'text-ivory/55' : 'text-graphite/55'}`}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

const Stars = ({ size = 15 }: { size?: number }) => <span className="stars inline-flex" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L10 14.8l-5.4 2.9 1.2-5.9L1.4 7.7l6-.7z" /></svg>)}</span>

/* Review collage: Google rating summary, real client reviews, the client video and real project photos */
export function Testimonials({ heading, eyebrow, noVideo = false, video, limit, allHref, showAll = false, headingTag = 'h2' }: { heading?: string; eyebrow?: string; noVideo?: boolean; video?: { src: string; preview: string; poster: string; caption: string; label: string }; limit?: number; allHref?: string; showAll?: boolean; headingTag?: 'h1' | 'h2' }) {
  const V = video || { src: 'media/testimonial-reel.mp4', preview: 'media/testimonial-preview.mp4', poster: 'ottawa-deck-pro-client-testimonial.webp', caption: 'Client testimonial · Ottawa Deck Pro on Instagram', label: 'Client video testimonial' }
  const ALL = ((reviewsJson as any).items as any[]).map((r) => ({ ...r, area: r.area || (TESTIMONIALS.find((t) => t.name === r.name) || ({} as any)).area || '' })) // every written review from the Google listing
  // homepage: the original site testimonials first, then the newest Google reviews
  const R = limit ? [...ALL.filter((r) => TESTIMONIALS.some((t) => t.name === r.name)), ...ALL.filter((r) => !TESTIMONIALS.some((t) => t.name === r.name))].slice(0, limit) : ALL
  const G = (settingsJson as any).googleRating
  const FIRST = showAll || limit ? R.length : 14
  const H = headingTag
  const photo = (p: Photo) => <figure key={p.file} className="rv-tile rv-photo reveal"><Img photo={p} sizes="(min-width:1024px) 25vw, 50vw" /><figcaption>Built by Ottawa Deck Pro</figcaption></figure>
  const text = (t: any, i: number) => (
    <figure key={t.name + i} className={`rv-tile rv-text ${t.photos ? 'rv-has-photo' : ''} ${i >= FIRST ? 'rv-extra' : 'reveal'}`}>
      {t.photos ? <div className={`rv-photos rv-photos-${t.photos.length}`}>{t.photos.map((ph: any) => <img key={ph.src} src={imgSrc(ph.src)} alt={ph.alt} loading="lazy" decoding="async" />)}</div> : null}
      <div className="rv-body">
        <div className="flex items-center justify-between"><Stars /><span className="rv-src"><GLogo size={15} />{t.photos ? 'Google review with photos' : 'Google review'}</span></div>
        <blockquote className="rv-quote mt-4 text-[15.5px] leading-relaxed text-graphite/85" data-rv-quote>{t.quote}</blockquote>
        <figcaption className="mt-5 flex items-center gap-3"><span className="rv-avatar" aria-hidden="true">{t.name.split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</span><span>{t.href ? <a href={t.href} target="_blank" rel="noopener" className="block text-[14px] font-semibold hover:underline">{t.name}</a> : <span className="block text-[14px] font-semibold">{t.name}</span>}<span className="block text-[12.5px] text-graphite/50">{t.area || 'Posted on Google'}</span></span></figcaption>
      </div>
    </figure>
  )
  const pics = [PHOTOS.riserLights, PHOTOS.whiteRailStairs, PHOTOS.screenClose, PHOTOS.secondStoreyGlass, PHOTOS.elevatedPrivacy, PHOTOS.stairDetail]
  const tiles: any[] = [
    <div key="sum" className="rv-tile rv-summary reveal">
      <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory/70"><span className="grid h-8 w-8 place-items-center rounded-full bg-white"><GLogo size={18} /></span>Google rating</p>
      <p className="mt-3 font-display text-[64px] font-light leading-none tracking-[-0.04em]">{G.value}</p>
      <div className="mt-3"><Stars size={18} /></div>
      <p className="mt-3 text-[15px] text-ivory/75">{G.count} Google reviews from Ottawa-area homeowners.</p>
      <a href={(settingsJson as any).googleReviewsUrl} target="_blank" rel="noopener" className="btn btn-primary mt-6">Read our Google reviews <Arrow /></a>
    </div>,
  ]
  R.forEach((t, i) => {
    tiles.push(text(t, i))
    if (i === 1 && !noVideo) tiles.push(
      <figure key="vid" className="rv-tile rv-video reveal" data-rv-video>
        <video src={asset(V.preview)} data-full={asset(V.src)} poster={imgSrc(V.poster)} muted loop playsInline autoPlay preload="metadata" aria-label={V.label} />
        <button type="button" className="rv-play" data-rv-play><span aria-hidden="true">▶</span> Hear it from our clients</button>
        <figcaption>{V.caption}</figcaption>
      </figure>)
    if (i < FIRST && i % 2 === 0 && pics[i / 2]) tiles.push(photo(pics[i / 2]))
  })
  return (
    <section className="bg-sand" id="reviews" data-rv>
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><Eyebrow>{eyebrow || 'Client reviews'}</Eyebrow><H className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-[-0.03em]">{heading || 'How our clients describe us'}</H></div>
          <a href={(settingsJson as any).googleReviewsUrl} target="_blank" rel="noopener" className="flex items-center gap-3 text-[15px] text-graphite/65 hover:text-graphite"><Stars /><span><b className="font-semibold text-graphite">{G.value}</b> · {G.count} Google reviews</span></a>
        </div>
        <div className="rv-grid mt-12">{tiles}</div>
        {allHref ? <div className="mt-8 text-center"><a href={href(allHref)} className="btn btn-dark">See all {G.count} reviews <Arrow /></a></div> : R.length > FIRST ? <div className="mt-6 text-center"><button type="button" className="btn btn-outline" data-rv-more>Show all {R.length} written reviews</button></div> : null}
        <FoundOn />
      </div>
    </section>
  )
}

export function FaqBlock({ heading, qa, id = 'faq' }: { heading?: string; qa: [string, string][]; id?: string }) {
  return (
    <section id={id} className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-20">
        <div><Eyebrow>Questions</Eyebrow><h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-tight tracking-tight">{heading ? plain(heading) : 'Frequently asked questions'}</h2></div>
        <div className="divide-y divide-graphite/10 border-y border-graphite/10">
          {qa.map(([q, a], i) => (
            <details key={i} className="faq group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                <h3 className="text-[18px] font-semibold leading-snug">{plain(q)}</h3>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <div className="pb-7 pr-10 text-[16px] leading-relaxed text-graphite/75"><Inline text={a} /></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
export const faqLd = (qa: [string, string][]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(a) } })) })

export function EstimateSection({ heading = 'Let’s build something exceptional.', sub = 'Tell us about your backyard project and let our team help bring it to life.', photo = PHOTOS.multiLevel, eyebrow }: any) {
  return <LeadPaths heading={heading} sub={sub} photo={photo} eyebrow={eyebrow} />
}

export function EstimateForm({ wellness = false, kind }: { wellness?: boolean; kind?: 'residential' | 'commercial' | 'wellness' }) {
  const k = kind || (wellness ? 'wellness' : 'residential')
  const sel = (label: string, name: string, opts: string[], required = false) => (
    <label className="field"><span>{label}{required ? <i aria-hidden="true"> *</i> : null}</span><select name={name} required={required} defaultValue=""><option value="" disabled={required}>Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select><em className="err" /></label>
  )
  const budget = sel('Budget range', 'budget', ['Under $20K', '$20K to $40K', '$40K to $60K', '$60K to $90K', '$90K+'])
  const timeline = sel('Desired timeline', 'timeline', ['As soon as possible', 'Spring 2027', 'Summer 2027', 'Fall 2027', 'Just planning'])
  const cta = { residential: 'Request your free estimate', commercial: 'Discuss your commercial project', wellness: 'Request a wellness quote' }[k]
  return (
    <form className="estimate-form reveal rounded-[28px] bg-ivory p-6 text-graphite shadow-2xl sm:p-9" data-form={k} noValidate encType="multipart/form-data">
      <input type="hidden" name="selections" data-selections />
      <div className="grid gap-4 sm:grid-cols-2">
        {k === 'commercial' ? <><Field label="Company name" name="company" auto="organization" required /><Field label="Contact name" name="name" auto="name" required /></> : <Field label="Name" name="name" auto="name" required wide />}
        <Field label="Email" name="email" type="email" auto="email" required />
        <Field label="Phone" name="phone" type="tel" auto="tel" required />
        <Field label={k === 'wellness' ? 'Installation location' : 'Project location'} name="area" auto="street-address" required />
        {k === 'residential' ? sel('Service required', 'service', ['Deck', 'Railing', 'Fences', 'Staining', 'Backyard Makeover', '3D Design', 'Deck Package', 'Outdoor Wellness'], true) : null}
        {k === 'commercial' ? sel('Property type', 'propertyType', ['Condominium', 'Apartment', 'Townhouse complex', 'Commercial property', 'Other'], true) : null}
        {k === 'wellness' ? sel('Product interest', 'service', ['Outdoor sauna', 'Cold plunge', 'Sauna + cold plunge', 'Custom wellness space', 'Not sure yet'], true) : null}
      </div>
      <details className="more mt-5">
        <summary className="cursor-pointer text-[14px] font-semibold text-bronze-dark">+ Add project details (optional)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {k === 'residential' ? <><Field label="Deck size" name="size" placeholder="e.g. 16 × 20 ft" />{sel('Material preference', 'material', ['Composite', 'PVC', 'Pressure-treated', 'Cedar', 'Not sure'])}{timeline}{budget}<label className="field sm:col-span-2"><span>Photos of your space</span><input type="file" name="photos" accept="image/*" multiple /></label></> : null}
          {k === 'commercial' ? <><Field label="Number of decks or units" name="units" placeholder="e.g. 12" />{sel('Expected timeline', 'timeline', ['This season', 'Next season', '12+ months', 'Budgeting only'])}<label className="field sm:col-span-2"><span>Plans or documents</span><input type="file" name="documents" accept=".pdf,image/*,.dwg,.doc,.docx" multiple /></label></> : null}
          {k === 'wellness' ? <>{sel('Preferred capacity', 'capacity', ['2 to 4 people', '4 to 6 people', 'Larger / custom'])}{timeline}{budget}</> : null}
          <label className="field sm:col-span-2"><span>{k === 'commercial' ? 'Project description' : 'Project details'}</span><textarea name="message" rows={4} placeholder={k === 'commercial' ? 'Scope, phasing, access, current condition…' : 'What would you like built?'} /></label>
        </div>
      </details>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button type="submit" className="btn btn-dark mt-7 w-full justify-center">{cta} <Arrow /></button>
      <p className="form-status mt-4 text-center text-[13px] text-graphite/55" role="status" aria-live="polite">No obligation. Your details go only to Ottawa Deck Pro.</p>
    </form>
  )
}

/** Final conversion: three lead paths in one place. */
export function LeadPaths({ heading = 'Let’s build something exceptional.', eyebrow, sub = 'Tell us about your backyard project and let our team help bring it to life.', photo = PHOTOS.multiLevel }: any) {
  return (
    <section id="estimate" className="relative isolate overflow-hidden bg-charcoal text-ivory">
      <img src={imgSrc(photo.file)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr] lg:px-10 lg:py-20">
        <div className="reveal">
          <Eyebrow light>{eyebrow || 'Free estimate'}</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.01em]">{heading}</h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ivory/75">{sub}</p>
          <ul className="mt-10 space-y-3 text-[15px] text-ivory/70">
            <li>Email: <a href={`mailto:${BRAND.email}`} className="text-ivory hover:underline">{BRAND.email}</a></li>
            <li>Phone: <a href={BRAND.phoneHref} className="text-ivory hover:underline" data-track="phone">{BRAND.phone}</a> · Text: {BRAND.text}</li>
            <li>Address: {BRAND.street}, {BRAND.city}, {BRAND.region}</li>
            <li>Timing: {BRAND.hours}</li>
          </ul>
        </div>
        <div>
          <div className="mb-4 flex gap-1 rounded-full bg-ivory/10 p-1" role="tablist" data-lead-tabs>
            {[['residential', 'Residential'], ['commercial', 'Commercial'], ['wellness', 'Wellness']].map(([k, l], i) => <button key={k} type="button" role="tab" aria-selected={i === 0} className={`lead-tab ${i === 0 ? 'on' : ''}`} data-lead-tab={k}>{l}</button>)}
          </div>
          <div data-lead-panel="residential"><EstimateForm kind="residential" /></div>
          <div data-lead-panel="commercial" hidden><EstimateForm kind="commercial" /></div>
          <div data-lead-panel="wellness" hidden><EstimateForm kind="wellness" /></div>
        </div>
      </div>
    </section>
  )
}
function Field({ label, name, type = 'text', auto, required, wide, placeholder }: any) {
  return (
    <label className={`field ${wide ? 'sm:col-span-2' : ''}`}>
      <span>{label}{required ? <i aria-hidden="true"> *</i> : null}</span>
      <input name={name} type={type} autoComplete={auto} required={required} placeholder={placeholder} />
      <em className="err" />
    </label>
  )
}

/* ---------- preserved content renderer ---------- */
function BlockList({ blocks, light = false }: { blocks: Block[]; light?: boolean }) {
  const out: React.ReactNode[] = []
  let list: Block[] = []
  const flush = (k: number) => { if (list.length) { out.push(<ul key={'l' + k} className="check-list">{list.map((b, i) => <li key={i}><Inline text={b.x || ''} /></li>)}</ul>); list = [] } }
  blocks.forEach((b, i) => {
    if (b.t === 'li') { list.push(b); return }
    flush(i)
    if (b.t === 'p') {
      const x = b.x || ''
      if (/^\s*-\s/.test(x) || /\n\s*-\s/.test(x)) { // dash lists typed as one paragraph
        const items = x.split(/\n+/).map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean)
        out.push(<ul key={i} className="check-list">{items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>)
      } else if (isCaps(x) && plain(x).length < 70) out.push(<p key={i} className={`eyebrow mt-8 ${light ? 'text-bronze-light' : 'text-bronze-dark'}`}><Inline text={x} /></p>)
      else out.push(<p key={i}><Inline text={x} /></p>)
    } else if (b.t === 'a') {
      if (!b.x || /^Instant Quote!?$/i.test(b.x)) return
      out.push(<p key={i}><a href={b.h?.startsWith('tel:') ? BRAND.phoneHref : href(b.h)} className={`btn ${light ? 'btn-ghost-light' : 'btn-outline'} mt-2`}>{b.x} <Arrow /></a></p>)
    } else if (/^h[56]$/.test(b.t)) out.push(<h3 key={i} className="mt-8 text-[18px] font-semibold"><Inline text={b.x || ''} /></h3>)
  })
  flush(9999)
  return <div className={`prose-odp ${light ? 'prose-light' : ''}`}>{out}</div>
}

function CardGrid({ cards, light }: { cards: Card[]; light?: boolean }) {
  const cols = cards.length >= 4 ? 'lg:grid-cols-4' : cards.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${cols}`}>
      {cards.map((c, i) => {
        const src = wixImage(c.img?.s)
        const price = c.body.find((b) => b.t === 'h5' && /^\$/.test(b.x || ''))
        const startAt = c.body.find((b) => b.t === 'p' && /^STARTING AT$/i.test(b.x || ''))
        // "POPULAR UPGRADES" lists labels and prices as separate lines: pair them back up
        const ui = c.body.findIndex((b) => /^POPULAR UPGRADES$/i.test(b.x || ''))
        let upgrades: [string, string][] = [], used = new Set<Block>()
        if (ui >= 0) {
          const rest = c.body.slice(ui + 1).filter((b) => b.t === 'p')
          const labels = rest.filter((b) => !/^\+\$/.test(b.x || '')), prices = rest.filter((b) => /^\+\$/.test(b.x || ''))
          if (labels.length === prices.length) { upgrades = labels.map((l, k) => [l.x!, prices[k].x!]); [c.body[ui], ...labels, ...prices].forEach((b) => used.add(b)) }
        }
        return (
          <article key={i} className={`card reveal ${light ? 'card-dark' : ''}`}>
            {src ? <div className="card-media"><img src={src} alt={c.img?.a && !/\.(jpe?g|png)$/i.test(c.img.a) ? c.img.a : plain(c.title.x || '')} loading="lazy" /></div> : null}
            <div className="p-6">
              <h3 className="font-display text-[19px] font-bold leading-snug tracking-tight"><Inline text={c.title.x || ''} /></h3>
              {startAt ? <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite/50">{startAt.x}</p> : null}
              {price ? <p className="font-display text-[30px] font-extrabold tracking-tight text-bronze-dark">{price.x}</p> : null}
              <div className="mt-3"><BlockList blocks={c.body.filter((b) => b !== price && b !== startAt && !used.has(b) && !(b.t === 'a' && upgrades.length))} light={light} /></div>
              {upgrades.length ? <div className="mt-5 rounded-2xl bg-ivory p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite/50">POPULAR UPGRADES</p><dl className="mt-2 space-y-1.5 text-[14px]">{upgrades.map(([l, v]) => <div key={l} className="flex justify-between gap-3"><dt>{l}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>)}</dl></div> : null}
              {upgrades.length ? c.body.filter((b) => b.t === 'a' && b.x).map((a, k) => <a key={k} href={href(a.h)} className="btn btn-outline mt-5">{a.x} <Arrow /></a>) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function ImageStrip({ imgs }: { imgs: Block[] }) {
  const srcs = [...new Map(imgs.map((b) => [wixImage(b.s), b])).entries()].filter(([s]) => s)
  if (!srcs.length) return null
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
      {srcs.slice(0, 8).map(([s, b], i) => (
        <div key={i} className={`overflow-hidden rounded-2xl bg-sand ${i === 0 && srcs.length > 4 ? 'md:col-span-2 md:row-span-2' : ''}`}>
          <img src={s!} alt={b.a && !/\.(jpe?g|png|heic)$/i.test(b.a) ? b.a : 'Ottawa Deck Pro project photo'} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-[1.04]" style={{ aspectRatio: i === 0 && srcs.length > 4 ? '1' : '4/3' }} />
        </div>
      ))}
    </div>
  )
}

/** Renders the sections of an existing page in order. Every word of the original copy is kept. */
export function Sections({ sections, fallbackPhotos }: { sections: Section[]; fallbackPhotos: Photo[] }) {
  let n = 0, photoI = 0
  const done = new Set<string>()
  return (
    <>
      {sections.map((s, i) => {
        if (s.kind === 'hero') return null
        if (s.kind === 'stats') { if (done.has('stats')) return null; done.add('stats'); return <StatsBand key={i} dark /> }
        if (s.kind === 'testimonials') {
          if (done.has('t')) return null; done.add('t')
          const heads = sections.filter((x) => x.kind === 'testimonials').map((x: any) => plain(x.heading?.x || '')).filter(Boolean)
          return <Testimonials key={i} heading={heads[0]} eyebrow={heads[1]} />
        }
        if (s.kind === 'contact' || s.kind === 'brands') return s.kind === 'brands' ? <Brands key={i} heading={plain(s.heading?.x || '')} /> : null
        if (s.kind === 'faq') return <FaqBlock key={i} heading={s.heading?.x} qa={s.qa} id={'faq-' + i} />
        // prose: skip blocks that would render empty (e.g. only photos we do not have locally)
        const hasText = s.heading || s.blocks.some((b) => b.t !== 'img' && (b.x || '').trim() && !(b.t === 'a' && /^Instant Quote!?$/i.test(b.x || ''))) || s.cards.length
        const hasImgs = s.imgs.some((b) => wixImage(b.s))
        if (!hasText && !(s.imgs.length >= 3 && hasImgs)) return null
        const idx = n++
        const dark = idx % 4 === 2
        const nonImg = s.blocks.filter((b) => b.t !== 'img')
        const ownImg = s.imgs.map((b) => wixImage(b.s)).find(Boolean)
        const galleryLike = s.imgs.length >= 3 && nonImg.filter((b) => b.t === 'p').length <= 1 && !s.cards.length
        const sidePhoto = !galleryLike && !s.cards.length && nonImg.length >= 2 ? (ownImg ? { src: ownImg, alt: s.imgs[0].a || '' } : idx % 2 === 0 && fallbackPhotos.length ? (() => { const p = fallbackPhotos[photoI++ % fallbackPhotos.length]; return { src: imgSrc(p.file), alt: p.alt } })() : null) : null
        const flip = idx % 2 === 1
        return (
          <section key={i} className={dark ? 'bg-charcoal text-ivory' : idx % 2 ? 'bg-white' : 'bg-ivory'}>
            <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
              <div className={sidePhoto ? `grid items-center gap-12 lg:grid-cols-2 lg:gap-20` : ''}>
                <div className={sidePhoto && flip ? 'lg:order-2' : ''}>
                  {s.eyebrow ? <Eyebrow light={dark}>{s.eyebrow}</Eyebrow> : null}
                  {s.heading ? <Heading b={{ ...s.heading, t: s.heading.t === 'h1' ? 'h1' : 'h2' }} className={`reveal mt-4 font-display font-bold leading-[1.05] tracking-tight ${isCaps(s.heading.x || '') ? 'text-[clamp(1.7rem,3.4vw,2.9rem)] uppercase' : 'text-[clamp(2rem,4vw,3.4rem)]'} ${sidePhoto ? '' : 'max-w-4xl'}`} /> : null}
                  {nonImg.length ? <div className={`reveal mt-6 ${sidePhoto ? '' : 'max-w-3xl'}`}><BlockList blocks={nonImg} light={dark} /></div> : null}
                </div>
                {sidePhoto ? <div className={`reveal overflow-hidden rounded-[28px] ${flip ? 'lg:order-1' : ''}`}><img src={sidePhoto.src} alt={/\.(jpe?g|png|heic)/i.test(sidePhoto.alt) ? 'Ottawa Deck Pro project photo' : sidePhoto.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" /></div> : null}
              </div>
              {s.cards.length ? <CardGrid cards={s.cards} light={dark} /> : null}
              {galleryLike ? <ImageStrip imgs={s.imgs} /> : null}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* Materials we install. Each brand shows its logo file if present (public/img/brand-<slug>.svg|webp|png), otherwise a clean wordmark. */
export const MATERIAL_BRANDS: { name: string; slug: string; note: string; style?: string }[] = [
  { name: 'Trex', slug: 'trex', note: 'Composite decking', style: 'font-extrabold tracking-[-0.02em]' },
  { name: 'TimberTech', slug: 'timbertech', note: 'Composite and PVC decking', style: 'font-semibold tracking-[-0.01em]' },
  { name: 'Fiberon', slug: 'fiberon', note: 'Composite decking', style: 'font-bold italic tracking-[-0.01em]' },
  { name: 'Deckorators', slug: 'deckorators', note: 'Decking and railings', style: 'font-semibold' },
  { name: 'TruNorth', slug: 'trunorth', note: 'Canadian composite decking', style: 'font-extrabold uppercase tracking-[0.04em]' },
  { name: 'Azek', slug: 'azek', note: 'Premium PVC decking', style: 'font-extrabold uppercase tracking-[0.12em]' },
  { name: 'Regal ideaRAIL', slug: 'regal-idearail', note: 'Canadian aluminum railings', style: 'font-semibold tracking-[-0.01em]' },
  { name: 'Envision', slug: 'envision', note: 'Composite decking', style: 'font-light uppercase tracking-[0.14em]' },
  { name: 'Simpson Strong-Tie', slug: 'simpson-strong-tie', note: 'Structural connectors', style: 'font-bold tracking-[-0.01em]' },
  { name: 'Peak Products', slug: 'peak-products', note: 'Canadian railings and decking', style: 'font-extrabold uppercase tracking-[0.02em]' },
  { name: 'RONA', slug: 'rona', note: 'Canadian building supplies', style: 'font-extrabold uppercase tracking-[0.06em]' },
  { name: 'MoistureShield', slug: 'moistureshield', note: 'Composite decking', style: 'font-semibold' },
  { name: 'Fortress', slug: 'fortress', note: 'Railings and framing', style: 'font-bold uppercase tracking-[0.1em]' },
  { name: 'FastenMaster', slug: 'fastenmaster', note: 'Cortex hidden fasteners', style: 'font-bold italic' },
  { name: 'Home Hardware', slug: 'home-hardware', note: 'Canadian building supplies', style: 'font-bold' },
  { name: 'CAMO', slug: 'camo', note: 'Edge deck fasteners', style: 'font-extrabold uppercase tracking-[0.04em]' },
  { name: "Lowe's", slug: 'lowes', note: 'Building supplies', style: 'font-bold' },
  { name: 'Dundalk LeisureCraft', slug: 'dundalk-leisurecraft', note: 'Canadian-made saunas', style: 'font-semibold' },
  { name: 'Harvia', slug: 'harvia', note: 'Sauna heaters', style: 'font-extrabold uppercase tracking-[0.06em]' },
  { name: 'The Home Depot', slug: 'home-depot', note: 'Lumber and supplies', style: 'font-bold uppercase tracking-[0.02em]' },
]
const brandLogo = (slug: string) => ['svg', 'webp', 'png'].map((x) => `brand-${slug}.${x}`).find((f) => { try { return require('fs').existsSync(require('path').join(process.cwd(), 'public/img', f)) } catch { return false } })
export function Brands({ heading }: { heading: string }) {
  const item = (b: (typeof MATERIAL_BRANDS)[number], k: string, hidden = false) => {
    const logo = brandLogo(b.slug)
    return (
      <li key={k} className="brand-item" aria-hidden={hidden || undefined} title={`${b.name}: ${b.note}`}>
        {logo ? <img src={imgSrc(logo)} alt={hidden ? '' : `${b.name} logo, ${b.note.toLowerCase()} installed by Ottawa Deck Pro`} loading="lazy" className="h-10 w-auto max-w-[170px] object-contain" /> : <span className={`font-display text-[26px] leading-none ${b.style || ''}`}>{b.name}</span>}
      </li>
    )
  }
  return (
    <section className="border-y border-graphite/10 bg-white" aria-label="Materials we install">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-5 pt-10 text-center lg:flex-row lg:justify-between lg:px-10 lg:text-left">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-graphite/60">{heading}</h2>
        <p className="text-[15px] text-graphite/55">Capped composite, PVC, and powder-coated aluminum and glass railing systems from established manufacturers.</p>
      </div>
      <div className="brand-marquee mt-8 pb-10">
        <ul className="brand-track">
          {MATERIAL_BRANDS.map((b) => item(b, 'a' + b.slug))}
          {MATERIAL_BRANDS.map((b) => item(b, 'b' + b.slug, true))}
          {MATERIAL_BRANDS.map((b) => item(b, 'c' + b.slug, true))}
        </ul>
      </div>
    </section>
  )
}

/* Photo-first band: a swipeable strip of real project photos (no text walls). */
export function PhotoBand({ cats, exclude = [], heading = 'Recent work across Ottawa', dark = false, count = 8 }: { cats: string[]; exclude?: string[]; heading?: string; dark?: boolean; count?: number }) {
  const all = Object.values(PHOTOS).filter((p) => !p.cats.includes('before-after') && !/^pkg/.test(p.file) && !exclude.includes(p.file))
  const seen = new Set<string>()
  const pick = [...all.filter((p) => p.cats.some((c) => cats.includes(c))), ...all].filter((p) => !seen.has(p.file) && seen.add(p.file)).slice(0, count)
  return (
    <section className={dark ? 'bg-charcoal text-ivory' : 'bg-ivory'}>
      <div className="mx-auto max-w-[1440px] px-5 pt-12 lg:px-10 lg:pt-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-tight">{heading}</h2>
          <div className="hidden gap-3 text-[14px] font-semibold sm:flex"><a href={href('/gallery')} className={dark ? 'text-bronze-light hover:underline' : 'text-bronze-dark hover:underline'}>All projects →</a><a href={BRAND.instagram} className={dark ? 'text-ivory/70 hover:underline' : 'text-graphite/60 hover:underline'} rel="noopener">Watch the builds ↗</a></div>
        </div>
      </div>
      <div className="photo-band mt-6 pb-12 lg:pb-14" data-drag>
        {pick.map((p, i) => (
          <figure key={p.file} className="photo-card">
            <img src={imgSrc(p.file)} alt={p.alt} loading="lazy" width={p.w} height={p.h} />
            <figcaption>{p.alt}</figcaption>
          </figure>
        ))}
        <a href={href('/gallery')} className="photo-card photo-more"><span>See all projects</span><Arrow /></a>
      </div>
    </section>
  )
}

/* ---------- trust signals (all facts verified on the live site, BBB and Yelp) ---------- */
export const GLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" /></svg>
)
const TIcon = ({ d }: { d: string }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
export const TRUST = {
  bbbUrl: 'https://www.bbb.org/ca/on/stittsville/profile/deck-builder/ottawa-deck-pro-0117-255816',
  yelpUrl: 'https://www.yelp.com/biz/ottawa-deck-pro-stittsville',
}
export function TrustBar() {
  const G = (settingsJson as any).googleRating
  const item = 'flex shrink-0 snap-start items-center gap-3 px-5 py-4 lg:shrink lg:px-5'
  return (
    <section aria-label="Why homeowners trust Ottawa Deck Pro" className="border-b border-graphite/10 bg-white">
      <div className="no-scrollbar mx-auto flex max-w-[1440px] snap-x overflow-x-auto divide-x divide-graphite/10 lg:grid lg:grid-cols-6 lg:overflow-visible">
        <a href={(settingsJson as any).googleReviewsUrl} target="_blank" rel="noopener" className={item + ' hover:bg-ivory'}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,.12)]"><GLogo size={22} /></span>
          <span><span className="flex items-center gap-1.5 font-display text-[18px] font-bold leading-none">{G.value}<span className="text-gold"><Stars size={13} /></span></span><span className="mt-1 block text-[12.5px] text-graphite/60">{G.count} Google reviews</span></span>
        </a>
        <a href={TRUST.bbbUrl} target="_blank" rel="noopener" className={item + ' hover:bg-ivory'}>
          <img src={imgSrc('bbb-accredited-ottawa-deck-pro.png')} alt="BBB Accredited Business" width="44" height="44" className="h-11 w-11 shrink-0 object-contain" loading="lazy" />
          <span><span className="block text-[14px] font-semibold leading-tight">BBB Accredited</span><span className="mt-0.5 block text-[12.5px] text-graphite/60">Better Business Bureau</span></span>
        </a>
        <div className={item}><span className="text-bronze-dark"><TIcon d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4" /></span><span><span className="block text-[14px] font-semibold leading-tight">WSIB covered</span><span className="mt-0.5 block text-[12.5px] text-graphite/60">Every employee and trade</span></span></div>
        <div className={item}><span className="text-bronze-dark"><TIcon d="M3 10l9-6 9 6v10H3zM9 20v-6h6v6" /></span><span><span className="block text-[14px] font-semibold leading-tight">$5M liability insured</span><span className="mt-0.5 block text-[12.5px] text-graphite/60">Your home is protected</span></span></div>
        <div className={item}><span className="text-bronze-dark"><TIcon d="M9 12l2 2 4-4M12 3a9 9 0 100 18 9 9 0 000-18z" /></span><span><span className="block text-[14px] font-semibold leading-tight">2-year workmanship warranty</span><span className="mt-0.5 block text-[12.5px] text-graphite/60">Plus manufacturer warranties</span></span></div>
        <div className={item}><span className="text-bronze-dark"><TIcon d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8zM21 20v-2a4 4 0 00-3-3.9M16 2.1a4 4 0 010 7.8" /></span><span><span className="block text-[14px] font-semibold leading-tight">50+ years combined</span><span className="mt-0.5 block text-[12.5px] text-graphite/60">Family-owned, Stittsville</span></span></div>
      </div>
    </section>
  )
}
export function FoundOn({ dark = false }: { dark?: boolean }) {
  const chip = `inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[14px] font-semibold transition ${dark ? 'border-ivory/15 text-ivory hover:bg-ivory/10' : 'border-graphite/12 bg-white text-graphite hover:border-graphite/30'}`
  return (
    <div className="mt-12 flex flex-col items-center gap-4 text-center">
      <p className={`text-[12px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-ivory/55' : 'text-graphite/50'}`}>Find Ottawa Deck Pro on</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <a href={(settingsJson as any).googleReviewsUrl} target="_blank" rel="noopener" className={chip}><GLogo size={18} />Google<span className="text-gold"><Stars size={11} /></span></a>
        <a href={TRUST.bbbUrl} target="_blank" rel="noopener" className={chip}><img src={imgSrc('bbb-accredited-ottawa-deck-pro.png')} alt="" width="20" height="20" className="h-5 w-5 object-contain" />BBB Accredited</a>
        <a href={TRUST.yelpUrl} target="_blank" rel="noopener" className={chip}><span className="grid h-5 w-5 place-items-center rounded bg-[#D32323] text-[11px] font-extrabold text-white" aria-hidden="true">y</span>Yelp</a>
        <a href={BRAND.instagram} target="_blank" rel="noopener" className={chip}><span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></svg></span>Instagram</a>
        <a href={BRAND.facebook} target="_blank" rel="noopener" className={chip}><span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877F2] text-[12px] font-extrabold text-white" aria-hidden="true">f</span>Facebook</a>
      </div>
    </div>
  )
}
export function ProcessSteps() {
  const steps: [string, string, string][] = [
    ['We review your request', 'Our team checks your details, photos and project type.', 'M9 12h6M9 16h6M9 8h2M6 3h9l4 4v14H6z'],
    ['We contact you within 1 business day', 'To ask a few questions and book a time that suits you.', 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z'],
    ['Free on-site consultation', 'We visit your home, measure the space and talk through options.', 'M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'],
    ['Clear plan and estimate', 'A straightforward proposal, with 3D design if you want it. No pressure.', 'M9 12l2 2 4-4M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z'],
  ]
  return (
    <section className="bg-white" aria-labelledby="process-h">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 id="process-h" className="reveal font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Ready to start <span className="text-bronze">your project?</span></h2>
          <p className="reveal max-w-lg text-[17px] leading-relaxed text-graphite/70 lg:justify-self-end">Fill out the form below. We get back to you within 1 business day to talk through your ideas and book a free on-site consultation.</p>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d, ic], i) => (
            <li key={t} className={`reveal rounded-[24px] p-7 ${i % 2 === 0 ? 'bg-sand' : 'border border-graphite/10 bg-white'}`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-charcoal text-bronze-light"><TIcon d={ic} /></span>
              <h3 className="mt-6 font-display text-[21px] font-bold leading-tight tracking-tight">{t}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-graphite/65">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center"><a href="#estimate" className="btn btn-dark">Book a free consultation <Arrow /></a></div>
      </div>
    </section>
  )
}

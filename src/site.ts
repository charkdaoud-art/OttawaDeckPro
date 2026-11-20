// Company facts and shared content. Everything here comes from the live site (ottawadeckpro.ca, crawled 2026-11-04)
// unless marked PROPOSED.

export const ORIGIN = 'https://www.ottawadeckpro.ca'

export const BRAND = {
  name: 'Ottawa Deck Pro',
  email: 'hello@ottawadeckpro.ca',
  phone: '613-639-1744',
  phoneHref: 'tel:6136391744',
  text: '343-338-1179',
  street: '6930 Fallowfield Road',
  city: 'Ottawa',
  region: 'ON',
  postal: 'K2S 1B8',
  hours: 'Mon to Sat, 8:00 AM to 6:00 PM',
  radius: 'Serving Ottawa West + 60 km radius.',
  instagram: 'https://www.instagram.com/ottawadeckpro/',
  facebook: 'https://www.facebook.com/ottawadeckpro/',
  zigbuild: 'https://ottawa-deck-pro.zigbuild.com/',
}

// Tracking IDs found on the live site (kept for production; not loaded in the preview).
// Paste form endpoints here before launch (e.g. a Formspree form URL). Empty = forms validate but send nothing.
export const FORMS = { estimate: 'https://formspree.io/f/xgakzgww', emailList: 'https://formspree.io/f/xkjrzdwg' }
export const TRACKING = { ga4: 'G-ZSY1FWD658', googleAds: 'AW-17039643222', metaPixel: '1187448019933365', gscVerification: 'WA3t71gzjW5ACyZbgLwVrLcvtUcoyK0A_ivaud61yYg' }

export const STATS = [
  { label: 'Decks built', value: '150,000+ sq ft' },
  { label: 'Backyard makeovers', value: '75+ projects' },
  { label: 'Railings installed', value: '25,000+ ft' },
  { label: 'Fences installed', value: '75,000+ linear ft' },
]

export const TESTIMONIALS = [
  { name: 'Jaclyn Epel', area: 'Manotick, ON', href: 'https://www.google.com/maps/contrib/105210104605609955778/reviews?hl=en',
    quote: 'Very happy we chose Ottawa Deck Pros. The deck feels sturdy, looks great, and you can tell they care about doing the job right. They were very timely, professional, and I will be recommending their services to everyone who requires deck work!' },
  { name: 'Erika Clarke', area: 'Stittsville, ON', href: 'https://www.google.com/maps/contrib/106555921287249128002/reviews?hl=en',
    quote: 'Outstanding work. They demolished my old deck and built a brand-new one that looks amazing. The new railing completely transformed the backyard. Professional, quick, and the quality speaks for itself. Highly recommend.' },
  { name: 'Elliott Hardy', area: 'Kanata, ON', href: 'https://www.google.com/maps/contrib/100399811199163204124/reviews?hl=en',
    quote: 'Our backyard looks completely different thanks to Ottawa Deck Pros. They removed our old deck and replaced it with something that looks modern, clean, and very well built. The attention to detail really shows and we couldn’t be happier with the outcome.' },
]

// Real Ottawa Deck Pro project photography (re-hosted from the live site). Captions describe what is visible only.
export type Photo = { file: string; alt: string; cats: string[]; w: number; h: number }
const P = (file: string, alt: string, cats: string[], w = 920, h = 690): Photo => ({ file, alt, cats, w, h })
export const PHOTOS: Record<string, Photo> = {
  hero: P('custom-composite-deck-contractor-ottawa.webp', 'Composite deck with hot tub, cedar-tone privacy wall and black aluminum railing in an Ottawa backyard', ['composite'], 1360, 907),
  raisedCedar: P('stittsville-backyard-deck-design.webp', 'Raised pressure-treated deck with black aluminum railing on a brick home', ['wood', 'railings']),
  lakeRailing: P('wood-deck-black-aluminum-railing-ottawa.webp', 'Wet wood deck with black aluminum railing overlooking a treed lot', ['wood', 'railings']),
  greyWater: P('grey-composite-deck-black-railing-waterfront-ottawa.webp', 'Grey composite deck with black railing overlooking the water', ['composite', 'railings']),
  pool: P('composite-pool-deck-white-aluminum-railing-ottawa.webp', 'Grey composite pool deck with white aluminum railing around an above-ground pool', ['composite', 'railings']),
  ptPlatform: P('pressure-treated-platform-deck-ottawa.webp', 'Freshly built pressure-treated platform deck with wraparound step', ['wood']),
  compositeLounge: P('ground-level-composite-deck-lounge-ottawa.webp', 'Ground-level composite deck with outdoor lounge furniture', ['composite']),
  ptRailing: P('pressure-treated-deck-black-picket-railing-ottawa.webp', 'Pressure-treated deck boards with black picket railing', ['wood', 'railings']),
  hazeldean: P('hazeldean-backyard-deck-project.webp', 'Second-storey pressure-treated deck with aluminum railing and posts', ['wood', 'railings']),
  ptStep: P('deck-stair-detail-black-railings.webp', 'Pressure-treated deck with a wide stepped edge against a brick wall', ['wood']),
  compositeGrill: P('ottawa-modern-deck-construction.webp', 'Composite deck with black picket railing and privacy screen', ['composite', 'railings']),
  octagon: P('large-family-deck-project-ottawa-deck-builders.webp', 'Ground-level deck with angled corners, black railing and wide stairs at dusk', ['composite', 'railings'], 920, 837),
  stoneStairs: P('aluminum-railing-stone-steps-glass-landing-ottawa.webp', 'Black aluminum railing on stone steps with a glass-railed landing', ['railings'], 920, 517),
  glassStairs: P('glass-stair-railing-second-storey-deck-ottawa.webp', 'Black aluminum stair railing with glass panels on a second-storey deck', ['railings']),
  porchRailing: P('black-picket-railing-stone-porch-ottawa.webp', 'Black picket railing on a stone front porch', ['railings']),
  frontRailing: P('ottawa-railing-posts-and-handrail.webp', 'Black aluminum railing on a modern front porch with landscaping', ['railings'], 920, 615),
  pictureFrame: P('pvc-deck-installation-barrhaven.webp', 'Composite deck boards with a contrasting picture-frame inlay', ['composite'], 690, 920),
  balcony: P('composite-balcony-deck-privacy-screen-ottawa.webp', 'Narrow composite balcony deck with black railing and privacy screen', ['composite', 'railings'], 690, 920),
  groundComposite: P('brown-composite-deck-planter-boxes-ottawa.webp', 'Ground-level brown composite deck with built-in planter boxes', ['composite'], 920, 656),
  multiLevel: P('durable-pvc-deck-ottawa.webp', 'Multi-level composite deck with diamond inlay and black railing', ['composite', 'railings'], 920, 689),
  build1: P('deck-framing-construction-ottawa.webp', 'Deck framing in progress on a bungalow', ['construction']),
  build2: P('large-deck-construction-ottawa.webp', 'Large deck under construction behind a two-storey home', ['construction']),
  longRailing: P('composite-deck-black-aluminum-railing-ottawa.webp', 'Long composite deck with black aluminum railing across the back of a house', ['composite', 'railings']),
  evening: P('composite-deck-evening-lighting-ottawa.webp', 'Composite deck with black railing lit at evening', ['composite', 'railings']),
  greyStairs: P('ottawa-aluminum-railing-installation.webp', 'Raised deck with black railing and stairs to the yard', ['composite', 'railings']),
  greyRaised: P('grey-composite-deck-skirting-stairs-ottawa.webp', 'Grey composite deck with black skirting, railing and stairs', ['composite', 'railings'], 920, 686),
  coveredPatio: P('composite-deck-covered-patio-cedar-fence-ottawa.webp', 'Composite deck beside a covered patio and cedar fence', ['composite']),
  portico1: P('timber-frame-garage-portico-construction-ottawa.webp', 'Timber-frame portico being built over a garage', ['structures']),
  portico2: P('timber-frame-entry-portico-stone-columns-ottawa.webp', 'Timber-frame front entry portico with stone columns', ['structures'], 920, 919),
  raisedStorage: P('raised-composite-deck-under-deck-storage-ottawa.webp', 'Raised composite deck with black aluminum picket railing, lit stairs and enclosed under-deck storage', ['composite', 'railings', 'structures'], 1050, 1400),
  underStorage: P('under-deck-storage-composite-skirting-ottawa.webp', 'Under-deck storage enclosure finished in composite skirting with a matching door', ['composite', 'structures'], 1050, 1400),
  glassGrey: P('grey-composite-deck-glass-railing-ottawa.webp', 'Grey composite deck with black-framed glass railing, stair lights and full skirting', ['composite', 'railings'], 1400, 939),
  stairDetail: P('composite-stairs-aluminum-railing-detail-ottawa.webp', 'Close-up of composite stair treads, risers and a black aluminum railing post', ['composite', 'railings'], 1226, 1400),
  elevatedPrivacy: P('elevated-composite-deck-privacy-screens-ottawa.webp', 'Elevated composite deck with black aluminum privacy screens above an interlock patio', ['composite', 'railings', 'structures'], 1050, 1400),
  privacyDeck: P('composite-deck-aluminum-privacy-screen-ottawa.webp', 'Composite deck with black aluminum privacy screen panels and picket railing', ['composite', 'railings'], 1050, 1400),
  privacyCorner: P('aluminum-privacy-screen-balcony-deck-ottawa.webp', 'Corner of black aluminum privacy screens on a composite balcony deck', ['composite', 'railings'], 1050, 1400),
  treetopDeck: P('elevated-composite-deck-aluminum-railing-ottawa.webp', 'Elevated composite deck among mature trees with privacy screen and aluminum railing', ['composite', 'railings'], 1050, 1400),
  smallComposite: P('small-composite-deck-step-lights-ottawa.webp', 'Compact composite deck with skirting, step lights and black aluminum railing', ['composite', 'railings'], 1024, 768),
  secondStoreyGlass: P('second-storey-composite-deck-glass-railing-ottawa.webp', 'Second-storey composite deck with black-framed glass railing', ['composite', 'railings'], 1138, 1400),
  afterCovered: P('composite-deck-covered-patio-after-ottawa.webp', 'Multi-level composite deck under a covered balcony with picture-frame border, lit stairs and lounge seating', ['composite', 'structures'], 1600, 900),
  beforeCovered: P('covered-patio-before-deck-ottawa.webp', 'Before: stamped concrete patio under the balcony', ['before-after'], 1600, 900),
  cedarWrap: P('cedar-wraparound-deck-staining-ottawa.webp', 'Cedar-stained wraparound deck with matching railing and stairs', ['wood', 'railings'], 920, 753),
  stairRailing: P('black-aluminum-railing-stone-entry-steps-ottawa.webp', 'Black aluminum railing on stone entry steps', ['railings']),
  frostedGlass: P('frosted-glass-railing-composite-deck-ottawa.webp', 'Composite deck with frosted glass railing panels', ['composite', 'railings']),
  townRailing: P('aluminum-glass-railing-townhouse-entry-ottawa.webp', 'Black aluminum railing with glass on a townhouse entry', ['railings'], 920, 517),
  cedarDeck: P('cedar-deck-cedar-railing-ottawa.webp', 'New cedar deck with cedar picket railing', ['wood', 'railings']),
  portico3: P('timber-frame-garage-portico-ottawa.webp', 'Timber-frame portico over a garage door', ['structures']),
  portico4: P('timber-frame-entry-portico-stairs-ottawa.webp', 'Timber-frame entry portico with stone and stairs', ['structures']),
  frontPorch: P('aluminum-railing-front-porch-ottawa.webp', 'Black aluminum railing on a front porch with garden', ['railings']),
  ironFence: P('carp-iron-fence-ottawa.webp', 'Black ornamental iron fence', ['fences'], 690, 920),
  pvcFence: P('durable-fence-installation-nepean.webp', 'Grey PVC privacy fence around a patio', ['fences']),
  chainlink: P('ottawa-kanata-chainlink-fence.webp', 'Black chain link fence along a building', ['fences'], 690, 920),
  whiteFence: P('backyard-fence-installation-kanata.webp', 'White PVC fence with gate in a new subdivision', ['fences']),
  before1: P('old-deck-before-replacement-ottawa.webp', 'Before: old deck in winter', ['before-after'], 745, 920),
  after1: P('new-deck-black-railing-after-ottawa.webp', 'After: new deck with black railing', ['before-after'], 690, 920),
  before2: P('old-deck-gazebo-before-ottawa.webp', 'Before: old deck with gazebo in winter', ['before-after'], 714, 920),
  after2: P('composite-deck-gazebo-after-ottawa.webp', 'After: new composite deck with gazebo', ['before-after'], 690, 920),
  // November 2026 project uploads
  luxuryCovered: P('luxury-composite-deck-covered-patio-ottawa.webp', 'Custom composite deck with picture-frame border, lit stairs and lounge furniture under a covered balcony in Ottawa', ['composite', 'structures'], 1920, 1080),
  loungeBalcony: P('composite-deck-outdoor-lounge-under-glass-balcony-ottawa.webp', 'Composite deck lounge area with full skirting beneath a glass-railed balcony', ['composite'], 1400, 788),
  wrapStairs: P('composite-deck-wraparound-stairs-led-step-lights-ottawa.webp', 'Wraparound composite stairs with LED riser lights and contrasting fascia', ['composite'], 1400, 1050),
  frameStairs: P('composite-deck-picture-frame-border-lit-stairs-ottawa.webp', 'Composite deck with picture-frame border and lit cascading stairs', ['composite'], 1400, 1050),
  riserLights: P('composite-deck-stair-riser-lights-ottawa.webp', 'Composite stair risers with recessed LED lights at dusk', ['composite'], 1400, 1050),
  brownStairs: P('brown-composite-deck-stairs-ottawa.webp', 'Brown composite deck stairs with mitred corners and step lights', ['composite'], 1050, 1400),
  whiteRailSide: P('grey-composite-deck-white-aluminum-railing-skirting-ottawa.webp', 'Grey composite deck with white aluminum railing, black balusters and composite skirting', ['composite', 'railings'], 1400, 1050),
  whiteRailRear: P('grey-composite-deck-white-railing-stairs-ottawa.webp', 'Raised grey composite deck with white aluminum railing and stairs to the yard', ['composite', 'railings'], 1400, 1050),
  whiteRailStairs: P('composite-deck-stairs-white-aluminum-railing-ottawa.webp', 'Composite stairs with white aluminum railing and black balusters', ['composite', 'railings'], 1050, 1400),
  whiteRailRaised: P('raised-composite-deck-skirting-white-railing-ottawa.webp', 'Raised composite deck with vertical composite skirting and white aluminum railing', ['composite', 'railings'], 1050, 1400),
  fenceDeck: P('ground-level-composite-deck-pvc-privacy-fence-ottawa.webp', 'Ground-level composite deck with steps beside a PVC privacy fence', ['composite', 'fences'], 1400, 1050),
  ptLarge: P('large-pressure-treated-ground-level-deck-step-lights-ottawa.webp', 'Large ground-level pressure-treated deck with step lights and a raised landing', ['wood'], 1400, 1050),
  ptGazebo: P('pressure-treated-deck-gazebo-black-balusters-ottawa.webp', 'Pressure-treated deck with gazebo, black balusters and wood skirting', ['wood', 'railings', 'structures'], 1400, 1050),
  litStairs: P('composite-stairs-led-lights-black-aluminum-railing-ottawa.webp', 'Composite stairs with LED step lights and black aluminum railing', ['composite', 'railings'], 1050, 1400),
  storeyEnclosure: P('second-storey-composite-deck-under-deck-enclosure-ottawa.webp', 'Second-storey composite deck with black aluminum railing, stairs and enclosed under-deck storage', ['composite', 'railings', 'structures'], 1400, 1050),
  screenBbq: P('composite-deck-black-privacy-screen-bbq-area-ottawa.webp', 'Elevated composite deck with horizontal black privacy screen and BBQ area', ['composite', 'railings'], 1400, 1050),
  screenClose: P('elevated-composite-deck-horizontal-privacy-screen-ottawa.webp', 'Composite deck with horizontal aluminum privacy screen and black railing', ['composite', 'railings'], 1400, 1050),
  blackRailCorner: P('grey-composite-deck-black-aluminum-railing-ottawa.webp', 'Grey composite deck with black aluminum railing and stair opening', ['composite', 'railings'], 1400, 1050),
  twoLevel: P('two-level-grey-composite-deck-step-lights-ottawa.webp', 'Two-level grey composite deck with riser lights and white railing', ['composite', 'railings'], 1400, 1050),
  ptBalcony: P('pressure-treated-balcony-deck-townhouse-ottawa.webp', 'Pressure-treated balcony deck on posts above a ground-level deck at a townhouse', ['wood', 'railings'], 1050, 1400),
}

export const WALKTHROUGHS = [
  { src: 'media/grey-composite-deck-white-railing-walkthrough-ottawa.mp4', preview: 'media/grey-composite-deck-white-railing-walkthrough-ottawa-preview.mp4', poster: 'grey-composite-deck-white-railing-walkthrough-ottawa.webp', title: 'Composite deck walkthrough', desc: 'Grey composite deck with white aluminum railing' },
  { src: 'media/under-deck-enclosure-composite-skirting-walkthrough-ottawa.mp4', preview: 'media/under-deck-enclosure-composite-skirting-walkthrough-ottawa-preview.mp4', poster: 'under-deck-enclosure-composite-skirting-walkthrough-ottawa.webp', title: 'Under-deck enclosure walkthrough', desc: 'Composite skirting and privacy screen detail' },
]

export const RENDERS = {
  pkg12x12: { file: 'deck-package-12x12-ottawa.webp', alt: '12 by 12 Starter Deck rendering' },
  pkg16x16: { file: 'deck-package-16x16-ottawa.webp', alt: '16 by 16 Entertainer Deck rendering' },
  pkg12x16: { file: 'deck-package-12x16-ottawa.webp', alt: '12 by 16 Starter Deck rendering' },
  pkg16x20: { file: 'deck-package-16x20-ottawa.webp', alt: '16 by 20 Family Deck rendering' },
}

export const GALLERY_FILTERS = [
  { id: 'all', label: 'All projects' },
  { id: 'composite', label: 'Composite decks' },
  { id: 'wood', label: 'Wood decks' },
  { id: 'railings', label: 'Railings' },
  { id: 'structures', label: 'Timber structures' },
  { id: 'fences', label: 'Fences' },
  { id: 'construction', label: 'In progress' },
]

export const AREAS = [
  ['arnprior', 'Arnprior'], ['barrhaven', 'Barrhaven'], ['bells-corners', 'Bells Corners'], ['carleton-place', 'Carleton Place'], ['carp', 'Carp'],
  ['cumberland', 'Cumberland'], ['dunrobin', 'Dunrobin'], ['findlay-creek', 'Findlay Creek'], ['gloucester', 'Gloucester'], ['greely', 'Greely'],
  ['kanata', 'Kanata'], ['manotick', 'Manotick'], ['metcalfe', 'Metcalfe'], ['nepean', 'Nepean'], ['orleans', 'Orleans'], ['osgoode', 'Osgoode'],
  ['riverside-south', 'Riverside South'], ['stittsville', 'Stittsville'], ['vanier', 'Vanier'], ['westboro', 'Westboro'],
] as const

export const NAV = [
  { label: 'Residential', href: '/decks', items: [
    { label: 'Custom Deck Construction', href: '/decks', desc: 'Composite, PVC, cedar and pressure-treated' },
    { label: 'Aluminum & Glass Railings', href: '/railings', desc: 'Picket, panoramic glass and hybrid' },
    { label: 'Backyard Makeovers', href: '/backyard-makeover', desc: 'Deck, railing and layout together' },
    { label: 'Deck Packages', href: '/deck-packages', desc: 'Four freestanding packages from $4,499' },
    { label: 'Fences', href: '/fences', desc: 'Iron, PVC and chain link' },
    { label: 'Deck Staining', href: '/staining', desc: 'Wash, sand and stain' },
    { label: 'Deck Repair', href: '/deck-repair-kanata', desc: 'Board replacement and structural repair' },
  ] },
  { label: 'Commercial', href: '/commercial-deck-construction', items: [
    { label: 'Commercial Deck Construction', href: '/commercial-deck-construction', desc: 'Condominiums, multi-unit and commercial' },
    { label: 'Request a Commercial Quote', href: '/commercial-deck-construction#commercial-quote', desc: 'Tell us about the property and scope' },
  ] },
  { label: 'Wellness', href: '/wellness', items: [
    { label: 'ODP Wellness', href: '/wellness', desc: 'Saunas, cold plunges, wellness spaces' },
    { label: 'Design your retreat', href: '/wellness/retreat-configurator', desc: 'Live 3D configurator with estimate' },
  ] },
  { label: 'Our Projects', href: '/gallery' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contacts' },
]

// Licensed stock photography (Unsplash License, US locations) used as commercial-division atmosphere.
// Alt text describes the scene only; these are not presented as Ottawa Deck Pro projects.
export const COMMERCIAL_STOCK = {
  rooftopNight: { src: 'commercial-rooftop-patio-deck-construction-ottawa.webp', alt: 'Rooftop patio deck with string lights, lounge seating and dining tables at night', source: 'stock', category: 'commercial' },
  condoRooftop: { src: 'condo-rooftop-amenity-deck-ottawa.webp', alt: 'Condominium rooftop amenity deck with lounge furniture and city skyline', source: 'stock', category: 'commercial' },
  multiUnitTerrace: { src: 'multi-unit-rooftop-terrace-deck-ottawa.webp', alt: 'Multi-unit building rooftop terrace with outdoor kitchen, dining set and planters', source: 'stock', category: 'commercial' },
}

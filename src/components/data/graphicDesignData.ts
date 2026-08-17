/* ===== Graphic design gallery data =====
   Exports live in `src/images/canva/`. Every entry here ships with real
   artwork — a piece only joins the gallery once it has been exported, so the
   grid never shows an empty tile.

   To add a piece:
     1. Export it from Canva as PNG and drop it in `src/images/canva/`.
        Keep the filename lowercase with dashes — no spaces or brackets.
     2. `import myPiece from '../../images/canva/my-piece.png'` at the top here.
     3. Add an entry with `image: myPiece`.
   Designs that ship as one set (a front/back pair, a two-up campaign post, a
   template run in two colourways) list every page in `slides`, cover first —
   the tile gets a page counter and the lightbox steps through the set. */

import rtcShirtFront from '../../images/canva/rtc-shirt-front.png'
import rtcShirtBack from '../../images/canva/rtc-shirt-back.png'
import ccseDeptShirt from '../../images/canva/ccse-dept-shirt.png'
import vsryCreativesLogo from '../../images/canva/vsry-creatives-logo.png'

import rtcBirthday01 from '../../images/canva/rtc-birthday-01.png'
import rtcBirthday02 from '../../images/canva/rtc-birthday-02.jpeg'
import birthdayMonique from '../../images/canva/birthday-monique.png'
import birthdayDominique from '../../images/canva/birthday-dominique.png'
import birthdayCes from '../../images/canva/birthday-ces.png'

import buenasBiryani01 from '../../images/canva/buenas-biryani-01.png'
import buenasBiryani02 from '../../images/canva/buenas-biryani-02.png'
import buenasSiomai from '../../images/canva/buenas-siomai.png'

import teambuildingCover from '../../images/canva/teambuilding-cover.png'
import teambuildingVenue from '../../images/canva/teambuilding-venue.png'
import tsinelasFestival from '../../images/canva/tsinelas-festival.png'
import laborDay from '../../images/canva/labor-day.png'
import qsVersus from '../../images/canva/qs-versus.png'

import inquisitiveWebsiteLaunch from '../../images/canva/inquisitive-website-launch.png'
import gvgWebsiteLaunch from '../../images/canva/gvg-website-launch.png'

export type GraphicCategory =
  | 'branding'
  | 'social'
  | 'print'
  | 'presentation'
  | 'technical'

export type GraphicWork = {
  title: string
  category: GraphicCategory
  /** null until an export is added — renders a placeholder tile. */
  image: string | null
  /**
   * Every page of a multi-page design, cover first. Two or more turns the tile
   * into a set the lightbox can page through; leave it out for a single page.
   */
  slides?: string[]
  alt: string
  /** Drives the tile's span in the masonry grid. */
  ratio: 'tall' | 'wide' | 'square'
  client: string
  year: string
  pages: number
  summary: string
  tools: string[]
  deliverables: string[]
}

export type GraphicCategoryFilter = {
  value: GraphicCategory | 'all'
  label: string
}

export type DesignService = {
  title: string
  body: string
  items: string[]
}

/* Only the categories that actually have work in them — a tab that filters down
   to nothing is just a dead end. `GraphicCategory` still carries print,
   presentation and technical; add the tab back here once a piece uses one. */
export const graphicCategories: GraphicCategoryFilter[] = [
  { value: 'all', label: 'All work' },
  { value: 'branding', label: 'Branding' },
  { value: 'social', label: 'Social media' },
]

export const graphicWorks: GraphicWork[] = [
  {
    title: 'Run The Code — Team 101 Shirt',
    category: 'branding',
    image: rtcShirtFront,
    slides: [rtcShirtFront, rtcShirtBack],
    alt: 'Front and back mockups of a black Team 101 sleeveless shirt for Run The Code',
    ratio: 'square',
    client: 'Run The Code',
    year: '2025',
    pages: 2,
    summary:
      'Front and back mockup pair for the Team 101 running shirt — small RTC chest mark on the front, the full "Run the code" wordmark across the back.',
    tools: ['Canva'],
    deliverables: ['Apparel mockup', 'Chest & back print'],
  },
  {
    title: 'CCSE Department Shirt Entry',
    category: 'branding',
    image: ccseDeptShirt,
    alt: 'Cream and maroon CCSE department shirt entry shown from the back with a detail crop',
    ratio: 'wide',
    client: 'CCSE',
    year: '2025',
    pages: 1,
    summary:
      'Competition entry sheet for the CCSE department shirt — cream body with maroon piping, back nameplate and a close crop of the print.',
    tools: ['Canva'],
    deliverables: ['Apparel design', 'Entry board'],
  },
  {
    title: 'VSRY — Visionaries Creatives Logo',
    category: 'branding',
    image: vsryCreativesLogo,
    alt: 'Three-dimensional VSRY monogram logo for the CCSESC Creatives Committee',
    ratio: 'square',
    client: 'CCSESC',
    year: '2025',
    pages: 1,
    summary:
      'Extruded VSRY monogram for the Visionaries, CCSESC Creatives Committee 2025 — stacked letterforms with a paintbrush and shutter-eye built into the mark.',
    tools: ['Canva'],
    deliverables: ['Logo mark', 'Committee identity'],
  },
  {
    title: 'Run The Code Birthday Posts',
    category: 'social',
    image: rtcBirthday01,
    slides: [rtcBirthday01, rtcBirthday02],
    alt: 'Two orange and black Run The Code birthday posts with cut-out runner portraits',
    ratio: 'tall',
    client: 'Run The Code',
    year: '2026',
    pages: 2,
    summary:
      'Birthday greetings for the running club — one template, cut-out member portrait over a chrome-and-halftone orange layout, the age set in the backdrop numeral.',
    tools: ['Canva'],
    deliverables: ['Feed posts', 'Greeting template'],
  },
  {
    title: "Buena's Chicken Biryani",
    category: 'social',
    image: buenasBiryani01,
    slides: [buenasBiryani01, buenasBiryani02],
    alt: "Two Buena's chicken biryani promo posts on a kraft paper background",
    ratio: 'tall',
    client: "Buena's",
    year: '2026',
    pages: 2,
    summary:
      'Two-up promo set for the chicken biryani — plated hero with the ₱220 price badge, then the packed-tray shot for order posts.',
    tools: ['Canva'],
    deliverables: ['Feed posts', 'Price badge'],
  },
  {
    title: "Buena's Big Siomai",
    category: 'social',
    image: buenasSiomai,
    alt: "Buena's big siomai promo post on banana leaf and onion background",
    ratio: 'tall',
    client: "Buena's",
    year: '2026',
    pages: 1,
    summary:
      'Menu post for the big siomai — banana-leaf and onion backdrop, brush script headline and a 3-for-₱35 price stamp.',
    tools: ['Canva'],
    deliverables: ['Feed post', 'Menu graphic'],
  },
  {
    title: 'Team Building 2026',
    category: 'social',
    image: teambuildingCover,
    slides: [teambuildingCover, teambuildingVenue],
    alt: 'Team building announcement cover and venue post with palm silhouettes and the Inquisitive mascot',
    ratio: 'square',
    client: 'Inquisitive',
    year: '2026',
    pages: 2,
    summary:
      'Announcement set for the 2026 company team building — palm-silhouette cover with the hard-hat mascot, then the venue reveal in the same frame.',
    tools: ['Canva'],
    deliverables: ['Event announcement', 'Venue post'],
  },
  {
    title: 'Birthday Greeting Series',
    category: 'social',
    image: birthdayMonique,
    slides: [birthdayMonique, birthdayDominique],
    alt: 'Two torn-paper birthday greeting posts in red and gold colourways',
    ratio: 'tall',
    client: 'Inquisitive',
    year: '2025',
    pages: 2,
    summary:
      'One greeting template run per celebrant — torn paper, polaroid portrait frame and balloons, recoloured red or gold so each post still reads as the same series.',
    tools: ['Canva'],
    deliverables: ['Greeting template', 'Colourway variants'],
  },
  {
    title: 'Team Supervisor Birthday Greeting',
    category: 'social',
    image: birthdayCes,
    alt: 'Teal and gold landscape birthday greeting with an ornate gold portrait frame',
    ratio: 'wide',
    client: 'Inquisitive',
    year: '2026',
    pages: 1,
    summary:
      'Landscape greeting for the QS team supervisor — ornate gold frame and script lettering against torn teal paper, sized for a cover-photo slot.',
    tools: ['Canva'],
    deliverables: ['Greeting post', 'Cover graphic'],
  },
  {
    title: '22nd Liliw Tsinelas Festival',
    category: 'social',
    image: tsinelasFestival,
    alt: 'Festive Mabuhay post for the 22nd Liliw Gat Tayaw Tsinelas Festival',
    ratio: 'tall',
    client: 'NQSTV',
    year: '2025',
    pages: 1,
    summary:
      'Mabuhay greeting for the 22nd Liliw Gat Tayaw Tsinelas Festival — buntings, confetti and the festival seal over the Gat Tayaw monument.',
    tools: ['Canva'],
    deliverables: ['Greeting post', 'Event graphic'],
  },
  {
    title: 'Labor Day Greeting',
    category: 'social',
    image: laborDay,
    alt: 'May 1st Labor Day post in halftone black and white on crumpled paper',
    ratio: 'tall',
    client: 'NQSTV',
    year: '2025',
    pages: 1,
    summary:
      'May 1st greeting in the NQSTV editorial template — halftone worker cut-out on crumpled paper, sage display type, branded header and footer bars.',
    tools: ['Canva'],
    deliverables: ['Greeting post', 'Template variant'],
  },
  {
    title: "Contractor's QS vs Client's QS",
    category: 'social',
    image: qsVersus,
    alt: 'Editorial post comparing a contractor quantity surveyor with a client quantity surveyor',
    ratio: 'tall',
    client: 'NQSTV',
    year: '2025',
    pages: 1,
    summary:
      'Explainer post opening the contractor-versus-client quantity surveyor topic — same crumpled-paper editorial system as the greeting posts, headline carrying the whole frame.',
    tools: ['Canva'],
    deliverables: ['Feed post', 'Topic cover'],
  },
  {
    title: 'Inquisitive Website Launch',
    category: 'social',
    image: inquisitiveWebsiteLaunch,
    alt: 'Website launch announcement showing the Inquisitive site on a laptop and phone',
    ratio: 'tall',
    client: 'NQSTV',
    year: '2025',
    pages: 1,
    summary:
      'Launch announcement for the Inquisitive site — desktop and mobile mockups on a teal-to-violet gradient with a Visit Us call to action.',
    tools: ['Canva'],
    deliverables: ['Announcement post', 'Device mockups'],
  },
  {
    title: 'GVG Variety Store Website',
    category: 'social',
    image: gvgWebsiteLaunch,
    alt: 'Launch post showing the GVG Variety Store site on a laptop and phone in red and white',
    ratio: 'tall',
    client: 'GVG Variety Store',
    year: '2025',
    pages: 1,
    summary:
      'Launch post for the GVG Variety Store storefront — red and white brand block with the site shown across laptop and phone.',
    tools: ['Canva'],
    deliverables: ['Announcement post', 'Device mockups'],
  },
]

export const designServices: DesignService[] = [
  {
    title: 'Brand & identity',
    body:
      'Nameplates, logo lockups, apparel and the small system around them — the colours, type and spacing rules that keep everything downstream consistent.',
    items: ['Logo lockups', 'Colour & type system', 'Apparel & merch'],
  },
  {
    title: 'Social & campaign',
    body:
      'Feed posts, greetings and launch announcements built as a set, so a month of content looks like it came from one place instead of twelve separate files.',
    items: ['Feed posts', 'Greeting templates', 'Launch announcements'],
  },
  {
    title: 'Decks & documents',
    body:
      'Pitch decks, flyers and technical guides. Layouts that put the hierarchy where the reader needs it and hold up at both screen and print size.',
    items: ['Pitch decks', 'Flyers', 'Illustrated guides'],
  },
]

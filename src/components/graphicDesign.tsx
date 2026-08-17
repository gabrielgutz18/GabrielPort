import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Files,
  LayoutGrid,
  PenTool,
  Shapes,
  Sparkles,
  X,
} from 'lucide-react'
import './css/graphicDesign.css'
import './css/reveal.css'
import Header from './header'
import Footer from './footer'
import SectionLink from './sectionLink'
import { useReveal } from '../hooks/useReveal'
import {
  designServices,
  graphicCategories,
  graphicWorks,
  type GraphicCategory,
  type GraphicWork,
} from './data/graphicDesignData'

type FilterValue = GraphicCategory | 'all'

/**
 * Stands in for a piece that hasn't been exported out of Canva yet
 * (`image: null` in graphicDesignData). Styled to read as an intentional empty
 * slot rather than a broken image.
 */
function WorkPlaceholder() {
  return (
    <div className="gd-placeholder" role="img" aria-label="Design coming soon">
      <div className="gd-placeholder-shimmer" aria-hidden="true" />
      <div className="gd-placeholder-body">
        <span className="gd-placeholder-icon">
          <Shapes aria-hidden="true" />
        </span>
        <span className="gd-placeholder-label">Coming soon</span>
      </div>
    </div>
  )
}

/** Cover art for a tile or the lightbox stage — image, first slide, or placeholder. */
function WorkArt({ work, className }: { work: GraphicWork; className: string }) {
  const src = work.image ?? work.slides?.[0] ?? null

  if (!src) {
    return <WorkPlaceholder />
  }

  return <img className={className} src={src} alt={work.alt} loading="lazy" />
}

/**
 * Full-screen detail view. Rendered through a portal so it escapes the gallery's
 * stacking context, and arrows step through the *filtered* list — what you see
 * in the grid is what you page through here.
 */
function WorkLightbox({
  works,
  index,
  onClose,
  onStep,
}: {
  works: GraphicWork[]
  index: number
  onClose: () => void
  onStep: (next: number) => void
}) {
  const work = works[index]
  /* Reset to the cover on every new design comes from the `key` the parent
     passes, which remounts this component — no resetting effect needed. */
  const [slide, setSlide] = useState(0)
  const slides = work.slides ?? []
  const hasSlides = slides.length > 1

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowRight') {
        onStep(index + 1)
      } else if (event.key === 'ArrowLeft') {
        onStep(index - 1)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [index, onClose, onStep])

  const stageSrc = hasSlides ? slides[slide] : work.image ?? slides[0] ?? null

  return createPortal(
    <div className="gd-lightbox" role="dialog" aria-modal="true" aria-label={work.title}>
      <button
        type="button"
        className="gd-lightbox-scrim"
        onClick={onClose}
        aria-label="Close design preview"
      />

      <div className="gd-lightbox-panel">
        <button type="button" className="gd-lightbox-close" onClick={onClose} aria-label="Close">
          <X aria-hidden="true" />
        </button>

        <div className="gd-lightbox-stage">
          {stageSrc ? (
            <img className="gd-lightbox-img" src={stageSrc} alt={work.alt} />
          ) : (
            <WorkPlaceholder />
          )}

          {hasSlides && (
            <div className="gd-lightbox-pager">
              <button
                type="button"
                onClick={() => setSlide((current) => (current - 1 + slides.length) % slides.length)}
                aria-label="Previous page"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <span>
                {slide + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => setSlide((current) => (current + 1) % slides.length)}
                aria-label="Next page"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="gd-lightbox-body">
          <p className="gd-lightbox-eyebrow">
            {work.client} · {work.year}
          </p>
          <h2 className="gd-lightbox-title">{work.title}</h2>
          <p className="gd-lightbox-summary">{work.summary}</p>

          <dl className="gd-lightbox-meta">
            <div>
              <dt>Pages</dt>
              <dd>
                {work.pages} {work.pages === 1 ? 'page' : 'pages'}
              </dd>
            </div>
            <div>
              <dt>Made with</dt>
              <dd>{work.tools.join(', ')}</dd>
            </div>
            <div>
              <dt>Deliverables</dt>
              <dd>{work.deliverables.join(', ')}</dd>
            </div>
          </dl>

          <div className="gd-lightbox-nav">
            <button type="button" onClick={() => onStep(index - 1)}>
              <ChevronLeft aria-hidden="true" />
              Previous
            </button>
            <span className="gd-lightbox-count">
              {index + 1} of {works.length}
            </span>
            <button type="button" onClick={() => onStep(index + 1)}>
              Next
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function GraphicDesign() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const { ref: galleryRef, revealClass: galleryReveal } = useReveal<HTMLElement>(0.08)
  const { ref: servicesRef, revealClass: servicesReveal } = useReveal<HTMLElement>(0.12)

  const visibleWorks =
    filter === 'all' ? graphicWorks : graphicWorks.filter((work) => work.category === filter)

  // Wraps in both directions so Next off the last piece lands back on the first.
  const step = useCallback(
    (next: number) => {
      const count = visibleWorks.length
      if (count === 0) {
        return
      }
      setOpenIndex(((next % count) + count) % count)
    },
    [visibleWorks.length],
  )

  const changeFilter = (value: FilterValue) => {
    // The lightbox indexes into the filtered list, so a filter change while it
    // is open would point at a different piece — close it instead.
    setOpenIndex(null)
    setFilter(value)
  }

  const countFor = (value: FilterValue) =>
    value === 'all'
      ? graphicWorks.length
      : graphicWorks.filter((work) => work.category === value).length

  return (
    <div className="app gd-page">
      <Header />

      <main className="gd-main">
        {/* ===== Hero ===== */}
        <section className="gd-hero" id="graphic-design">
          <div className="gd-hero-copy">
            <p className="gd-label">
              <PenTool className="gd-label-icon" aria-hidden="true" />
              Graphic Design
            </p>
            <h1 className="gd-hero-title">
              Layouts that carry the message — <span className="gd-hero-accent">not just</span>{' '}
              decorate it.
            </h1>
            <p className="gd-hero-text">
              Brand sets, social campaigns, pitch decks and technical guides, designed in Canva and
              built to stay consistent across every page in the set. Below is the gallery — filter
              it by the kind of work you need.
            </p>

            <div className="gd-hero-actions">
              <a className="gd-btn gd-btn--primary" href="#gd-gallery">
                Browse the gallery
                <ArrowRight className="gd-btn-icon" aria-hidden="true" />
              </a>
              <SectionLink className="gd-btn gd-btn--ghost" id="contact">
                Start a project
              </SectionLink>
            </div>
          </div>

          <dl className="gd-stats">
            <div className="gd-stat">
              <dt>Pieces</dt>
              <dd>{graphicWorks.length} in the gallery</dd>
            </div>
            <div className="gd-stat">
              <dt>Formats</dt>
              <dd>Social, print, deck, web</dd>
            </div>
            <div className="gd-stat">
              <dt>Tool</dt>
              <dd>Canva</dd>
            </div>
          </dl>
        </section>

        {/* ===== Gallery ===== */}
        <section className={`gd-section ${galleryReveal}`} id="gd-gallery" ref={galleryRef}>
          <header className="gd-section-head reveal-item">
            <p className="gd-label">
              <LayoutGrid className="gd-label-icon" aria-hidden="true" />
              Gallery
            </p>
            <h2 className="gd-section-title">Selected design work</h2>
            <p className="gd-section-text">
              Click any piece to open it full size, with the brief, the deliverables and the page
              count behind it.
            </p>
          </header>

          <div className="gd-filters reveal-item" role="tablist" aria-label="Filter designs by type">
            {graphicCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                role="tab"
                aria-selected={filter === category.value}
                className={`gd-filter${filter === category.value ? ' is-active' : ''}`}
                onClick={() => changeFilter(category.value)}
              >
                {category.label}
                <span className="gd-filter-count">{countFor(category.value)}</span>
              </button>
            ))}
          </div>

          {visibleWorks.length === 0 ? (
            <p className="gd-empty reveal-item">Nothing in this category yet.</p>
          ) : (
            <div className="gd-gallery">
              {visibleWorks.map((work, index) => (
                <figure
                  key={work.title}
                  className={`gd-tile gd-tile--${work.ratio} reveal-item reveal-delay-${
                    (index % 6) + 1
                  }`}
                >
                  {/* The button is the full-tile click target; the badge and caption
                      sit above it but let clicks through, so the markup stays valid
                      (figcaption as a direct child of figure) and keyboard-reachable. */}
                  <button
                    type="button"
                    className="gd-tile-btn"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`Open ${work.title}`}
                  >
                    <WorkArt work={work} className="gd-tile-img" />
                  </button>

                  {work.pages > 1 && (
                    <span className="gd-tile-pages">
                      <Files aria-hidden="true" />
                      {work.pages}
                    </span>
                  )}

                  <figcaption className="gd-tile-caption">
                    <div className="gd-tile-heading">
                      <h3>{work.title}</h3>
                      <span className="gd-chip">{work.client}</span>
                    </div>
                    <p className="gd-tile-summary">{work.summary}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* ===== What I make ===== */}
        <section className={`gd-section ${servicesReveal}`} id="gd-services" ref={servicesRef}>
          <header className="gd-section-head reveal-item">
            <p className="gd-label">
              <Sparkles className="gd-label-icon" aria-hidden="true" />
              What I make
            </p>
            <h2 className="gd-section-title">Three kinds of work, one system each</h2>
            <p className="gd-section-text">
              Whatever the format, the goal is the same — decide the rules once, then every page in
              the set follows them.
            </p>
          </header>

          <div className="gd-service-grid">
            {designServices.map((service, index) => (
              <article
                key={service.title}
                className={`gd-service-card reveal-item reveal-delay-${index + 1}`}
              >
                <span className="gd-service-icon">
                  <Copy aria-hidden="true" />
                </span>
                <h3 className="gd-service-title">{service.title}</h3>
                <p className="gd-service-body">{service.body}</p>
                <ul className="gd-service-list">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="gd-closing reveal-item reveal-delay-4">
            Need a deck, a campaign set or a brand refresh?{' '}
            <SectionLink id="contact">Send me a message</SectionLink> and tell me what it&apos;s for.
          </p>
        </section>
      </main>

      {openIndex !== null && visibleWorks[openIndex] && (
        <WorkLightbox
          key={openIndex}
          works={visibleWorks}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onStep={step}
        />
      )}

      <Footer />
    </div>
  )
}

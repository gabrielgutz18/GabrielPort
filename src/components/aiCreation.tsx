import { useState } from 'react'
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Layers,
  Play,
  Sparkles,
} from 'lucide-react'
import './css/aiCreation.css'
import './css/reveal.css'
import Header from './header'
import Footer from './footer'
import SectionLink from './sectionLink'
import { useReveal } from '../hooks/useReveal'
import { aiImages, aiVideos, latestClip, promptTechniques } from './data/aiCreationData'

/**
 * Shown wherever a piece hasn't been rendered yet (`video: null` / `image: null`
 * in aiCreationData). Styled to match the dark/glow theme so an unfinished slot
 * still reads as intentional rather than broken.
 */
function MediaPlaceholder({ kind }: { kind: 'video' | 'image' }) {
  const Icon = kind === 'video' ? Clapperboard : Camera

  return (
    <div className="ai-placeholder" role="img" aria-label={`${kind} coming soon`}>
      <div className="ai-placeholder-shimmer" aria-hidden="true" />
      <div className="ai-placeholder-body">
        <span className="ai-placeholder-icon">
          <Icon aria-hidden="true" />
        </span>
        <span className="ai-placeholder-label">Coming soon</span>
      </div>
    </div>
  )
}

/**
 * Frames from one generation set, stacked inside the tile. Clicking the image
 * steps forward; the arrows and dots are siblings of the stage (not children)
 * so the whole thing stays valid, focusable markup rather than nested buttons.
 */
function TileCarousel({
  slides,
  alt,
  title,
}: {
  slides: string[]
  alt: string
  title: string
}) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  // Wraps in both directions, so prev from the first frame lands on the last.
  const go = (next: number) => setIndex(((next % count) + count) % count)

  return (
    <div
      className="ai-carousel"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(index + 1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(index - 1)
        }
      }}
    >
      <button
        type="button"
        className="ai-carousel-stage"
        onClick={() => go(index + 1)}
        aria-label={`${title}: frame ${index + 1} of ${count}. Show next frame.`}
      >
        {slides.map((src, slide) => (
          <img
            key={src}
            className="ai-tile-img ai-carousel-slide"
            src={src}
            alt={slide === index ? alt : ''}
            aria-hidden={slide !== index}
            data-active={slide === index}
            loading="lazy"
            draggable={false}
          />
        ))}
      </button>

      <button
        type="button"
        className="ai-carousel-nav ai-carousel-nav--prev"
        onClick={() => go(index - 1)}
        aria-label={`${title}: previous frame`}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="ai-carousel-nav ai-carousel-nav--next"
        onClick={() => go(index + 1)}
        aria-label={`${title}: next frame`}
      >
        <ChevronRight aria-hidden="true" />
      </button>

      <span className="ai-carousel-count">
        <Layers aria-hidden="true" />
        {index + 1}/{count}
      </span>

      <div className="ai-carousel-dots">
        {slides.map((src, slide) => (
          <button
            key={src}
            type="button"
            className="ai-carousel-dot"
            data-active={slide === index}
            aria-current={slide === index}
            onClick={() => go(slide)}
            aria-label={`${title}: go to frame ${slide + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function AiCreation() {
  const { ref: latestRef, revealClass: latestReveal } = useReveal<HTMLElement>(0.12)
  const { ref: videosRef, revealClass: videosReveal } = useReveal<HTMLElement>(0.12)
  const { ref: galleryRef, revealClass: galleryReveal } = useReveal<HTMLElement>(0.1)
  const { ref: promptsRef, revealClass: promptsReveal } = useReveal<HTMLElement>(0.12)

  return (
    <div className="app ai-page">
      <Header />

      {/* Ambient light blooms — fixed so the glow follows the page as it scrolls. */}
      <div className="ai-glow-layer" aria-hidden="true">
        <span className="ai-glow ai-glow--one" />
        <span className="ai-glow ai-glow--two" />
        <span className="ai-glow ai-glow--three" />
        <span className="ai-grid" />
      </div>

      <main className="ai-main">
        {/* ===== Hero ===== */}
        <section className="ai-hero" id="ai-creation">
          <div className="ai-hero-copy">
            <p className="ai-label">
              <Sparkles className="ai-label-icon" aria-hidden="true" />
              AI Creation
            </p>
            <h1 className="ai-hero-title">
              Generated video and imagery, <span className="ai-hero-accent">directed</span> — not
              stumbled into.
            </h1>
            <p className="ai-hero-text">
              A showcase of the video and image work I create with generative models. The tools do
              the rendering; the result still comes down to how precisely the idea gets described.
              Below are the pieces, and the prompting approach behind them.
            </p>

            <div className="ai-hero-actions">
              <a className="ai-btn ai-btn--primary" href="#ai-gallery">
                View the gallery
                <ArrowRight className="ai-btn-icon" aria-hidden="true" />
              </a>
              <a className="ai-btn ai-btn--ghost" href="#ai-prompting">
                How I prompt
              </a>
            </div>
          </div>

          <dl className="ai-stats">
            <div className="ai-stat">
              <dt>Video</dt>
              <dd>Text &amp; image to motion</dd>
            </div>
            <div className="ai-stat">
              <dt>Imagery</dt>
              <dd>Concept, product, editorial</dd>
            </div>
            <div className="ai-stat">
              <dt>Method</dt>
              <dd>Detail, refine, reframe</dd>
            </div>
          </dl>
        </section>

        {/* ===== Latest clip — the newest piece, given the full width ===== */}
        <section
          className={`ai-section ai-latest ${latestReveal}`}
          id="ai-latest"
          ref={latestRef}
        >
          <header className="ai-section-head reveal-item">
            <p className="ai-label">
              <Film className="ai-label-icon" aria-hidden="true" />
              Recently created
            </p>
            <h2 className="ai-section-title">Latest short clip</h2>
            <p className="ai-section-text">
              The most recent piece off the bench, kept out of the grid so it can play at size.
            </p>
          </header>

          <article className="ai-latest-card reveal-item reveal-delay-1">
            {/* Player and poster share one row and fill the card between them;
                the credit wraps onto its own line underneath the video. */}
            <figure className="ai-latest-showcase">
              <div className="ai-media ai-media--video ai-latest-media">
                {latestClip.video ? (
                  <video
                    className="ai-video"
                    src={latestClip.video}
                    poster={latestClip.poster ?? undefined}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <MediaPlaceholder kind="video" />
                )}
                <span className="ai-chip ai-chip--duration">{latestClip.duration}</span>
              </div>

              {/* The poster sheet carries its own title and credits — it gets a
                  frame and nothing else on top of it. */}
              <div className="ai-latest-poster">
                <img
                  className="ai-latest-poster-art"
                  src={latestClip.keyArt}
                  alt={latestClip.keyArtAlt}
                  loading="lazy"
                />
              </div>

              <figcaption className="ai-latest-credit">
                <Sparkles className="ai-latest-credit-icon" aria-hidden="true" />
                Generated at {latestClip.generator}
              </figcaption>
            </figure>

            <div className="ai-latest-body">
              <div className="ai-latest-lede">
                <p className="ai-latest-dateline">
                  <span className="ai-latest-dot" aria-hidden="true" />
                  New · {latestClip.released}
                </p>

                <div className="ai-latest-heading">
                  <h3>{latestClip.title}</h3>
                  <span className="ai-chip">{latestClip.model}</span>
                </div>

                <p className="ai-latest-summary">{latestClip.summary}</p>

                <p className="ai-prompt-line">
                  <span className="ai-prompt-tag">Prompt</span>
                  {latestClip.prompt}
                </p>
              </div>

              <dl className="ai-latest-beats">
                {latestClip.beats.map((beat) => (
                  <div className="ai-latest-beat" key={beat.label}>
                    <dt>{beat.label}</dt>
                    <dd>{beat.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </section>

        {/* ===== Video showcase ===== */}
        <section
          className={`ai-section ai-videos ${videosReveal}`}
          id="ai-videos"
          ref={videosRef}
        >
          <header className="ai-section-head reveal-item">
            <p className="ai-label">
              <Play className="ai-label-icon" aria-hidden="true" />
              Video showcase
            </p>
            <h2 className="ai-section-title">Motion pieces</h2>
            <p className="ai-section-text">
              Short generated clips — camera moves, product loops and texture plates. Each one lists
              the prompt it came from.
            </p>
          </header>

          <div className="ai-video-grid">
            {aiVideos.map((item, index) => (
              <article
                key={item.title}
                className={`ai-video-card reveal-item reveal-delay-${index + 1}`}
              >
                <div
                  className={`ai-media ai-media--video${
                    item.orientation === 'portrait' ? ' ai-media--portrait' : ''
                  }`}
                >
                  {item.video ? (
                    <video
                      className="ai-video"
                      src={item.video}
                      poster={item.poster ?? undefined}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <MediaPlaceholder kind="video" />
                  )}
                  <span className="ai-chip ai-chip--duration">{item.duration}</span>
                </div>

                <div className="ai-video-body">
                  <div className="ai-video-heading">
                    <h3>{item.title}</h3>
                    <span className="ai-chip">{item.model}</span>
                  </div>
                  <p className="ai-video-summary">{item.summary}</p>
                  <p className="ai-prompt-line">
                    <span className="ai-prompt-tag">Prompt</span>
                    {item.prompt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== Image gallery ===== */}
        <section
          className={`ai-section ai-gallery-section ${galleryReveal}`}
          id="ai-gallery"
          ref={galleryRef}
        >
          <header className="ai-section-head reveal-item">
            <p className="ai-label">
              <Camera className="ai-label-icon" aria-hidden="true" />
              Image gallery
            </p>
            <h2 className="ai-section-title">Stills</h2>
            <p className="ai-section-text">
              Characters, concepts and one-off experiments. Hover a tile to read the prompt behind
              it — tiles marked with a frame count hold a whole set, so click through them.
            </p>
          </header>

          <div className="ai-gallery">
            {aiImages.map((item, index) => (
              <figure
                key={item.title}
                className={`ai-tile ai-tile--${item.ratio} reveal-item reveal-delay-${
                  (index % 6) + 1
                }`}
              >
                <div className="ai-media ai-media--image">
                  {item.slides && item.slides.length > 1 ? (
                    <TileCarousel slides={item.slides} alt={item.alt} title={item.title} />
                  ) : item.image ? (
                    <img className="ai-tile-img" src={item.image} alt={item.alt} loading="lazy" />
                  ) : (
                    <MediaPlaceholder kind="image" />
                  )}
                </div>

                <figcaption className="ai-tile-caption">
                  <div className="ai-tile-heading">
                    <h3>{item.title}</h3>
                    <span className="ai-chip">{item.model}</span>
                  </div>
                  <p className="ai-tile-prompt">{item.prompt}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ===== How I prompt ===== */}
        <section
          className={`ai-section ai-prompting ${promptsReveal}`}
          id="ai-prompting"
          ref={promptsRef}
        >
          <header className="ai-section-head reveal-item">
            <p className="ai-label">
              <Sparkles className="ai-label-icon" aria-hidden="true" />
              How I prompt
            </p>
            <h2 className="ai-section-title">Three habits that do most of the work</h2>
            <p className="ai-section-text">
              Generation quality tracks prompt quality almost one to one. This is the process I run
              before anything gets rendered.
            </p>
          </header>

          <div className="ai-prompt-grid">
            {promptTechniques.map((technique, index) => (
              <article
                key={technique.step}
                className={`ai-prompt-card reveal-item reveal-delay-${index + 1}`}
              >
                <span className="ai-prompt-step">{technique.step}</span>
                <h3 className="ai-prompt-title">{technique.title}</h3>
                <p className="ai-prompt-tagline">{technique.tagline}</p>
                <p className="ai-prompt-body">{technique.body}</p>

                <div className="ai-compare">
                  <div className="ai-compare-row ai-compare-row--weak">
                    <span className="ai-compare-tag">Instead of</span>
                    <p>{technique.weak}</p>
                  </div>
                  <div className="ai-compare-row ai-compare-row--strong">
                    <span className="ai-compare-tag">I write</span>
                    <p>{technique.strong}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="ai-closing reveal-item reveal-delay-4">
            Want something generated for your brand?{' '}
            <SectionLink id="contact">Send me a message</SectionLink> and we&apos;ll work out the
            look together.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

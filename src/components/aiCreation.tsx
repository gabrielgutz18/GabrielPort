import { ArrowRight, Camera, Clapperboard, Play, Sparkles } from 'lucide-react'
import './css/aiCreation.css'
import './css/reveal.css'
import Header from './header'
import Footer from './footer'
import SectionLink from './sectionLink'
import { useReveal } from '../hooks/useReveal'
import { aiImages, aiVideos, promptTechniques } from './data/aiCreationData'

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

export default function AiCreation() {
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
                <div className="ai-media ai-media--video">
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
              Portraits, concepts and product frames. Hover a tile to read the prompt that produced
              it.
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
                  {item.image ? (
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

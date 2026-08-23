import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Mail, X, ZoomIn } from 'lucide-react'
import './css/aboutme.css'
import './css/reveal.css'
import { useReveal } from '../hooks/useReveal'
import SectionLink from './sectionLink'
import {
  aboutSkills,
  builds,
  experience,
  facts,
  webinars,
  type Webinar,
} from './data/aboutmeData'
import { createCertificateZoom, type CertificateZoom } from './utils/certificateZoom'

/* Drift speed of the certificate row, in CSS pixels per second. A card is
   ~180px wide, so this reads as roughly six seconds per certificate — slow
   enough to take a title in without the row looking stalled. */
const CERT_SCROLL_SPEED = 26

/* Three copies of the row. The middle one is the real, tabbable set; the two
   flanking clones give a full row of runway on each side, so the loop point is
   never visible and a manual swipe in either direction has somewhere to go
   before the recentre catches it. */
const CERT_LOOP_COPIES = 3
const CERT_REAL_COPY = 1

/* How long the row has to sit still after a manual scroll before it is nudged
   back to the middle copy. Long enough not to fight momentum scrolling on a
   phone, short enough that the runway is restored before the reader swipes
   again. */
const CERT_SETTLE_MS = 180

/* Floor for the drag thumb. With thirteen certificates across a wide viewport
   the proportional width is still comfortable, but a narrow phone showing one
   card of thirteen would otherwise compute a thumb a few pixels wide. */
const CERT_THUMB_MIN_W = 28

/* Width of one copy of the row, measured rather than computed from the card
   token, so gap/padding/zoom changes cannot desynchronise the wrap. */
const certLoopWidth = (track: HTMLDivElement) => {
  const firstCard = track.children[0] as HTMLElement | undefined
  const firstRepeat = track.children[webinars.length] as HTMLElement | undefined

  if (!firstCard || !firstRepeat) {
    return 0
  }

  return firstRepeat.offsetLeft - firstCard.offsetLeft
}

const AboutMe = () => {
  const [activeCertificate, setActiveCertificate] = useState<CertificateZoom | null>(null)
  const [activeBuildTitle, setActiveBuildTitle] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const activeBuild = builds.find((build) => build.title === activeBuildTitle)
  const activeBuildImages = activeBuild?.images ?? []
  const { ref, revealClass } = useReveal<HTMLElement>()
  const certTrackRef = useRef<HTMLDivElement>(null)
  const certSettleRef = useRef(0)
  /* The row's true scroll position, carried at full precision in JS. See the
     loop below for why it cannot live in scrollLeft alone. */
  const certOffsetRef = useRef(0)
  const certDrivingRef = useRef(false)
  const [certHeld, setCertHeld] = useState(false)
  /* Starts true so the observer's job is to STOP the row once it is off screen,
     never to start it. Gating on a callback that has not arrived yet makes a
     late or missing one look exactly like a broken carousel; erring the other
     way costs a handful of frames before the observer corrects it. */
  const [certVisible, setCertVisible] = useState(true)

  /* The drag rail below the row. It deliberately does NOT mirror the track's
     native scroll geometry: the track is three copies wide, which is what made
     the native bar unusable (a third-width thumb that jumped on every
     recentre). This one is scaled to a single copy and wrapped, so it reads as
     one continuous loop no matter which copy the row is physically parked on. */
  const certRailRef = useRef<HTMLDivElement>(null)
  const certThumbRef = useRef<HTMLSpanElement>(null)
  const certThumbWrapRef = useRef<HTMLSpanElement>(null)
  const certMetricsRef = useRef({ loopWidth: 0, viewWidth: 0, railWidth: 0 })
  const certDragRef = useRef<{ pointerId: number; grab: number } | null>(null)

  /* Park on the middle copy so there is a full row of runway to the left from
     the first frame — otherwise scrolling back immediately hits scrollLeft 0. */
  useEffect(() => {
    const track = certTrackRef.current

    if (!track) {
      return
    }

    const recentre = () => {
      const loopWidth = certLoopWidth(track)

      if (loopWidth > 0) {
        track.scrollLeft = loopWidth * CERT_REAL_COPY
      }
    }

    recentre()
    window.addEventListener('resize', recentre)

    return () => {
      window.removeEventListener('resize', recentre)
    }
  }, [])

  /* Only animate a row someone can actually see. A rAF loop writing scrollLeft
     forever is real work on a page where this section is one of six. */
  useEffect(() => {
    const track = certTrackRef.current

    if (!track || !window.IntersectionObserver) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setCertVisible(entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(track)

    return () => {
      observer.disconnect()
    }
  }, [])

  /**
   * The loop.
   *
   * Drives the native scroll position rather than a transform, so the row stays
   * a real scroll container: swipe, trackpad and Tab-to-a-card all keep working
   * and the browser scrolls a focused card into view on its own. Wrapping is
   * invisible because the copy it jumps between is pixel-identical.
   *
   * The position is accumulated in certOffsetRef and *assigned* each frame,
   * never read back and incremented. A frame of drift at this speed is ~0.43px,
   * and the browser reports scrollLeft rounded to whole pixels at dpr 1 — so
   * `scrollLeft += 0.43` read the same integer back every frame and threw the
   * increment away, leaving the row completely motionless. Owning the float in
   * JS lets the sub-pixel remainder survive between frames and turn into a
   * whole pixel of movement once it has added up.
   *
   * Also depends on .certs-track NOT setting `scroll-behavior: smooth` — with
   * that on, every assignment below would animate and fight the next frame.
   */
  useEffect(() => {
    const track = certTrackRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* A modal open means the row is behind a scrim: the motion is invisible,
       the frames are wasted, and closing the zoom would drop the reader back on
       a row that had wandered somewhere else while they were reading. */
    const modalOpen = Boolean(activeCertificate || activeBuildTitle)

    if (!track || certHeld || !certVisible || modalOpen || prefersReducedMotion) {
      return
    }

    /* Pick up wherever the row actually sits. A hover, a swipe or the browser
       scrolling a focused card into view all move it while the loop is stopped,
       and resuming from a stale accumulator would snap it back. */
    certOffsetRef.current = track.scrollLeft
    certDrivingRef.current = true

    let frame = 0
    let previousTimestamp = 0

    const step = (timestamp: number) => {
      const loopWidth = certLoopWidth(track)

      if (previousTimestamp && loopWidth > 0) {
        certOffsetRef.current += (CERT_SCROLL_SPEED * (timestamp - previousTimestamp)) / 1000

        if (certOffsetRef.current >= loopWidth * (CERT_REAL_COPY + 1)) {
          certOffsetRef.current -= loopWidth
        }

        track.scrollLeft = certOffsetRef.current
      }

      previousTimestamp = timestamp
      frame = window.requestAnimationFrame(step)
    }

    frame = window.requestAnimationFrame(step)

    return () => {
      certDrivingRef.current = false
      window.cancelAnimationFrame(frame)
    }
  }, [activeBuildTitle, activeCertificate, certHeld, certVisible])

  /* Only manual scrolling needs this. The loop fires a scroll event on every
     frame and already handles its own wrap, so letting those through meant
     tearing down and rebuilding a timer sixty times a second for nothing. */
  const handleCertScroll = () => {
    /* Above the early return on purpose: the thumb has to follow the drift too,
       and that is exactly the case the guard below skips. */
    updateCertThumb()

    if (certDrivingRef.current) {
      return
    }

    window.clearTimeout(certSettleRef.current)

    certSettleRef.current = window.setTimeout(() => {
      const track = certTrackRef.current

      if (!track) {
        return
      }

      const loopWidth = certLoopWidth(track)

      if (loopWidth <= 0) {
        return
      }

      const offsetInCopy = ((track.scrollLeft % loopWidth) + loopWidth) % loopWidth

      track.scrollLeft = loopWidth * CERT_REAL_COPY + offsetInCopy
      certOffsetRef.current = track.scrollLeft
    }, CERT_SETTLE_MS)
  }

  useEffect(() => () => window.clearTimeout(certSettleRef.current), [])

  /* Layout reads are cached rather than taken per scroll event: the drift fires
     one scroll a frame, and interleaving offsetLeft reads with the thumb's
     style writes would thrash layout sixty times a second. */
  const measureCertRail = () => {
    const track = certTrackRef.current
    const rail = certRailRef.current

    if (!track || !rail) {
      return
    }

    certMetricsRef.current = {
      loopWidth: certLoopWidth(track),
      viewWidth: track.clientWidth,
      railWidth: rail.clientWidth,
    }
  }

  /* Thumb geometry is written straight to the DOM instead of through state.
     At one update per frame a re-render here would re-render the whole section,
     cards and all, for two numbers that only ever touch one element. */
  const updateCertThumb = () => {
    const track = certTrackRef.current
    const thumb = certThumbRef.current
    const wrapThumb = certThumbWrapRef.current

    if (!track || !thumb || !wrapThumb) {
      return
    }

    let { loopWidth, viewWidth, railWidth } = certMetricsRef.current

    /* First paint and post-resize frames can land before the measure effect,
       and a zero here would divide the thumb out of existence. */
    if (loopWidth <= 0 || railWidth <= 0) {
      measureCertRail()
      ;({ loopWidth, viewWidth, railWidth } = certMetricsRef.current)
    }

    if (loopWidth <= 0 || railWidth <= 0) {
      return
    }

    /* Modulo one copy: this is what keeps the thumb still while the row is
       recentred underneath it. The jump the native bar showed was the recentre
       becoming visible; against a single copy it cancels out exactly. */
    const offsetInCopy = ((track.scrollLeft % loopWidth) + loopWidth) % loopWidth
    const width = Math.max(CERT_THUMB_MIN_W, (viewWidth / loopWidth) * railWidth)
    const x = (offsetInCopy / loopWidth) * railWidth

    thumb.style.width = `${width}px`
    wrapThumb.style.width = `${width}px`
    thumb.style.transform = `translateX(${x}px)`
    /* The trailing copy. As the head runs off the right edge this brings the
       same thumb back in on the left, so a wrap looks continuous instead of a
       teleport. The rail clips whichever half is outside. */
    wrapThumb.style.transform = `translateX(${x - railWidth}px)`
  }

  useEffect(() => {
    measureCertRail()
    updateCertThumb()

    const remeasure = () => {
      measureCertRail()
      updateCertThumb()
    }

    window.addEventListener('resize', remeasure)

    return () => {
      window.removeEventListener('resize', remeasure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Dragging the rail scrolls the row. Every write lands inside the middle
     copy, which is why the drag can cross the loop point in either direction
     without ever hitting scrollLeft 0 or the end of the track. */
  const scrollCertToRailX = (clientX: number) => {
    const track = certTrackRef.current
    const rail = certRailRef.current
    const drag = certDragRef.current

    if (!track || !rail || !drag) {
      return
    }

    const { loopWidth, railWidth } = certMetricsRef.current

    if (loopWidth <= 0 || railWidth <= 0) {
      return
    }

    const railLeft = rail.getBoundingClientRect().left
    const raw = (clientX - railLeft - drag.grab) / railWidth
    const fraction = ((raw % 1) + 1) % 1

    track.scrollLeft = loopWidth * CERT_REAL_COPY + fraction * loopWidth
    certOffsetRef.current = track.scrollLeft
  }

  const handleCertRailPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = certRailRef.current

    if (!rail || event.button !== 0) {
      return
    }

    measureCertRail()

    const thumbRect = certThumbRef.current?.getBoundingClientRect()
    const wrapRect = certThumbWrapRef.current?.getBoundingClientRect()

    /* Grabbing the thumb keeps it under the finger; clicking bare rail centres
       it on the press instead of lurching by the grab offset. Either half of a
       wrapped thumb counts as the thumb. */
    const onThumb =
      (thumbRect && event.clientX >= thumbRect.left && event.clientX <= thumbRect.right) ||
      (wrapRect && event.clientX >= wrapRect.left && event.clientX <= wrapRect.right)

    let grab = (thumbRect?.width ?? 0) / 2

    if (onThumb) {
      const hit =
        thumbRect && event.clientX >= thumbRect.left && event.clientX <= thumbRect.right
          ? thumbRect
          : wrapRect

      if (hit) {
        grab = event.clientX - hit.left
      }
    }

    certDragRef.current = { pointerId: event.pointerId, grab }

    /* Capture keeps the drag alive when the pointer leaves a 6px rail, which it
       will on any real swipe. Not worth failing the drag over though: a browser
       that refuses the capture still tracks fine until the pointer exits. */
    try {
      rail.setPointerCapture(event.pointerId)
    } catch {
      /* no-op */
    }
    /* Same latch the row uses for hover and touch, so the drift does not fight
       the drag. */
    setCertHeld(true)
    scrollCertToRailX(event.clientX)
    updateCertThumb()
    event.preventDefault()
  }

  const handleCertRailPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (certDragRef.current?.pointerId !== event.pointerId) {
      return
    }

    scrollCertToRailX(event.clientX)
    updateCertThumb()
  }

  const endCertRailDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (certDragRef.current?.pointerId !== event.pointerId) {
      return
    }

    try {
      certRailRef.current?.releasePointerCapture(event.pointerId)
    } catch {
      /* no-op */
    }

    certDragRef.current = null
    setCertHeld(false)
  }


  useEffect(() => {
    if (!activeCertificate && !activeBuildTitle) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveCertificate(null)
        setActiveBuildTitle(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeCertificate, activeBuildTitle])

  /**
   * Auto-advance.
   *
   * A self-rescheduling timeout rather than setInterval, with activeImageIndex
   * in the deps on purpose: every change — including a manual arrow or dot
   * click — tears the timer down and starts a fresh one. The old interval kept
   * running through manual navigation, so tapping next a moment before a tick
   * fired advanced the carousel twice in a row, which is what made it look
   * broken. Pausing on hover/focus also lets a reader actually finish a caption.
   */
  useEffect(() => {
    if (!activeBuildTitle || activeBuildImages.length < 2 || carouselPaused) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeBuildImages.length)
    }, 4200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeBuildImages.length, activeBuildTitle, activeImageIndex, carouselPaused])

  const showPreviousImage = () => {
    if (activeBuildImages.length < 2) {
      return
    }

    setActiveImageIndex((currentIndex) => (
      currentIndex === 0 ? activeBuildImages.length - 1 : currentIndex - 1
    ))
  }

  const showNextImage = () => {
    if (activeBuildImages.length < 2) {
      return
    }

    setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeBuildImages.length)
  }

  const openBuild = (title: string) => {
    setActiveImageIndex(0)
    setCarouselPaused(false)
    setActiveBuildTitle(title)
  }

  const openCertificate = (webinar: Webinar) => {
    if (!webinar.image) {
      return
    }

    setActiveCertificate(createCertificateZoom(webinar.image, webinar.title))
  }

  return (

    <section
      ref={ref}
      className={`aboutme ${revealClass}`}
      id="aboutme"
      aria-labelledby="about-heading"
    >
      
      <p className="about-label reveal-item">Hello, Welcome!</p>

      <div className="about-layout">
        <div className="about-main reveal-item reveal-delay-1">
          <h1 className="about-title" id="about-heading">
            About me<span>.</span>
          </h1>

          <p className="about-intro">
            Computer Engineer specializing in web development, IT support, and systems engineering. Experienced in academic projects, freelance design work, Arduino systems, and internship-based web development and NAS setup.
          </p>

          <p className="about-intro">
            I leverage modern development tools, including AI-assisted workflows, to improve productivity and accelerate problem-solving while maintaining a strong focus on understanding core concepts and implementation.
          </p>

          <div className="badge-row" role="list" aria-label="Skills">
            {aboutSkills.map(({ label, Icon }) => (
              <span className="badge" role="listitem" key={label}>
                <Icon aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <hr className="about-divider" />

          <p className="section-title">College projects I've built</p>
          <ul className="build-list">
            {builds.map(({ title, description, hint, Icon, tone, href }) => (
              <li className={`build-item ${activeBuildTitle === title ? 'is-active' : ''}`} key={title}>
                <button
                  type="button"
                  className="build-card-button"
                  onClick={() => openBuild(title)}
                  aria-haspopup="dialog"
                  aria-expanded={activeBuildTitle === title}
                >
                  <div className={`build-icon build-icon-${tone}`}>
                    <Icon aria-hidden="true" />
                  </div>
                  <div className="build-text">
                    <strong>{title}</strong>
                    <span>{description}</span>
                    {hint && <span className="build-hint">{hint}</span>}
                  </div>
                </button>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="build-link"
                  >
                    Visit
                    <ExternalLink aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <aside
          className="about-side reveal-item reveal-delay-2"
          aria-label="Experience and activity"
        >
          <p className="section-title">Experience</p>
          <div className="timeline" role="list" aria-label="Experience timeline">
            {experience.map((item) => (
              <div className="tl-item" role="listitem" key={item.title}>
                <div className="tl-dot">
                  <span className={item.active ? 'active' : ''}></span>
                </div>
                <div className="tl-body">
                  <p className="tl-year">{item.year}</p>
                  <p className="tl-title">{item.title}</p>
                  <p className="tl-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="about-divider" />

          <p className="section-title">Outside the terminal</p>
          <div className="facts-grid" role="list" aria-label="Fun facts">
            {facts.map((fact) => (
              <div className="fact-card" role="listitem" key={fact.text}>
                {fact.image ? (
                  <img src={fact.image} alt={fact.text} className="fact-image" />
                ) : (
                  <div className="fact-image">{fact.image}</div>
                )}
                <p className="fact-text">{fact.text}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Certificates sit below the two columns rather than inside the aside.
          Nested in the sidebar they were a 288px scroll box inside a scrolling
          page — a wheel over it hijacked the page scroll, and twelve items were
          only ever three rows tall. Full width, one drifting row. */}
      <div className="about-certs reveal-item reveal-delay-3" role="group" aria-label="Certificates">
        <div className="certs-head">
          <p className="section-title">
            Certificates <span className="section-count">{webinars.length}</span>
          </p>
          <p className="certs-hint">Tap a card to enlarge</p>
        </div>

        <div
          className="certs-track"
          ref={certTrackRef}
          onScroll={handleCertScroll}
          onMouseEnter={() => setCertHeld(true)}
          onMouseLeave={() => setCertHeld(false)}
          onFocusCapture={() => setCertHeld(true)}
          onBlurCapture={() => setCertHeld(false)}
          onTouchStart={() => setCertHeld(true)}
          onTouchEnd={() => setCertHeld(false)}
        >
          {Array.from({ length: CERT_LOOP_COPIES }, (_, copyIndex) =>
            webinars.map((webinar) => {
              /* Only the middle copy is the real list. The clones exist to make
                 the wrap invisible, so they are hidden from assistive tech and
                 taken out of the tab order — otherwise the row would announce
                 thirty-six certificates and Tab through all of them. */
              const isClone = copyIndex !== CERT_REAL_COPY

              return (
                <button
                  type="button"
                  className="cert-card"
                  key={`${copyIndex}-${webinar.title}`}
                  onClick={() => openCertificate(webinar)}
                  aria-label={`Open ${webinar.title} certificate`}
                  aria-hidden={isClone || undefined}
                  tabIndex={isClone ? -1 : undefined}
                >
                  <span className="cert-card-thumb">
                    {webinar.image ? (
                      <img src={webinar.image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <ImageIcon aria-hidden="true" />
                    )}
                    <span className="cert-card-zoom" aria-hidden="true">
                      <ZoomIn />
                    </span>
                  </span>
                  <span className="cert-card-title">{webinar.title}</span>
                </button>
              )
            }),
          )}
        </div>

        {/* A pointer affordance, not a second way to read the list: the row is
            already reachable by Tab (the browser scrolls each focused card into
            view), so exposing a half-implemented scrollbar widget to assistive
            tech would add a control that duplicates working navigation. Hidden
            for the same reason the clones above are. */}
        <div
          className="certs-rail"
          ref={certRailRef}
          onPointerDown={handleCertRailPointerDown}
          onPointerMove={handleCertRailPointerMove}
          onPointerUp={endCertRailDrag}
          onPointerCancel={endCertRailDrag}
          aria-hidden="true"
        >
          <span className="certs-rail-thumb" ref={certThumbRef} />
          <span className="certs-rail-thumb" ref={certThumbWrapRef} />
        </div>
      </div>

      {/* Closes the section, so it sits after the certificates rather than
          mid-column. Full width also takes ~95px off the left column, which is
          most of what made the aside look like it stopped early. */}
      <div className="cta-bar reveal-item reveal-delay-4">
        <p>
          <strong>Currently open to opportunities</strong> where I can
          build useful systems and keep learning in the real world.
        </p>
        <SectionLink id="contact" className="cta-btn">
          <Mail aria-hidden="true" />
          Get in touch
        </SectionLink>
      </div>

      {activeCertificate && createPortal(
        <div
          className="certificate-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeCertificate.title}
          onClick={() => setActiveCertificate(null)}
        >
          <button
            type="button"
            className="certificate-close"
            onClick={() => setActiveCertificate(null)}
            aria-label="Close certificate preview"
          >
            <X aria-hidden="true" />
          </button>
          <div className="certificate-modal-panel" onClick={(event) => event.stopPropagation()}>
            <p>{activeCertificate.title}</p>
            <img src={activeCertificate.src} alt={activeCertificate.alt} />
          </div>
        </div>,
        document.body,
      )}

      {activeBuild && createPortal(
        <div
          className="build-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeBuild.title}
          onClick={() => setActiveBuildTitle(null)}
        >
          <button
            type="button"
            className="build-modal-close"
            onClick={() => setActiveBuildTitle(null)}
            aria-label={`Close ${activeBuild.title} preview`}
          >
            <X aria-hidden="true" />
          </button>
          <div className="build-modal-blank" onClick={(event) => event.stopPropagation()}>
            <div
              className="image-carousel"
              aria-label={`${activeBuild.title} image carousel`}
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              onFocusCapture={() => setCarouselPaused(true)}
              onBlurCapture={() => setCarouselPaused(false)}
            >
              <button
                type="button"
                className="carousel-control prev"
                onClick={showPreviousImage}
                aria-label="Previous image"
                disabled={activeBuildImages.length < 2}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <div className="images">
                {activeBuildImages.length > 0 ? (
                  <div className="carousel-track">
                    {activeBuildImages.map((image, imageIndex) => {
                      let offset = imageIndex - activeImageIndex
                      const halfwayPoint = activeBuildImages.length / 2

                      if (offset > halfwayPoint) {
                        offset -= activeBuildImages.length
                      } else if (offset < -halfwayPoint) {
                        offset += activeBuildImages.length
                      }

                      const slidePosition =
                        offset === 0 ? 'center' : offset === -1 ? 'before' : offset === 1 ? 'after' : 'hidden'

                      return (
                        <figure
                          className={`carousel-slide carousel-slide-${slidePosition}`}
                          key={`${image.src}-${image.caption}`}
                          aria-hidden={slidePosition !== 'center'}
                        >
                          <img src={image.src} alt={image.alt} />
                          <figcaption>{image.caption}</figcaption>
                        </figure>
                      )
                    })}
                  </div>
                ) : (
                  <div className="carousel-empty">
                    <ImageIcon aria-hidden="true" />
                    <span>Add project screenshots in aboutmeData.ts</span>
                  </div>
                )}

                {activeBuildImages.length > 1 && (
                  <span className="carousel-counter" aria-hidden="true">
                    {activeImageIndex + 1} / {activeBuildImages.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="carousel-control next"
                onClick={showNextImage}
                aria-label="Next image"
                disabled={activeBuildImages.length < 2}
              >
                <ChevronRight aria-hidden="true" />
              </button>

              {activeBuildImages.length > 1 && (
                <div className="carousel-dots">
                  {activeBuildImages.map((image, dotIndex) => (
                    <button
                      type="button"
                      key={`dot-${image.src}-${image.caption}`}
                      className={`carousel-dot ${dotIndex === activeImageIndex ? 'is-active' : ''}`}
                      onClick={() => setActiveImageIndex(dotIndex)}
                      aria-label={`Show image ${dotIndex + 1} of ${activeBuildImages.length}`}
                      aria-current={dotIndex === activeImageIndex}
                    >
                      {/* Fills over one auto-advance interval, so the wait is
                          visible instead of the jump feeling random. */}
                      <span className="carousel-dot-fill" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="build-modal-content">
              <p className="build-modal-label">Project details</p>
              <h2>{activeBuild.title}</h2>
              {activeBuild.position && (
                <p className="build-modal-position">
                  <span>Position/role</span>
                  {activeBuild.position}
                </p>
              )}
              <p>{activeBuild.details}</p>

              <div className="build-modal-notes">
                <div>
                  <span>Challenge</span>
                  <p>{activeBuild.challenge}</p>
                </div>
                <div>
                  <span>How I resolved it</span>
                  <p>{activeBuild.solution}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}

export default AboutMe

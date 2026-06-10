import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Award, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Mail, X, ZoomIn } from 'lucide-react'
import './css/aboutme.css'
import {
  aboutSkills,
  builds,
  experience,
  facts,
  stats,
  webinars,
  type Webinar,
} from './data/aboutmeData'
import { createCertificateZoom, type CertificateZoom } from './utils/certificateZoom'

const AboutMe = () => {
  const [activeCertificate, setActiveCertificate] = useState<CertificateZoom | null>(null)
  const [activeBuildTitle, setActiveBuildTitle] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeBuild = builds.find((build) => build.title === activeBuildTitle)
  const activeBuildImages = activeBuild?.images ?? []

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

  useEffect(() => {
    if (!activeBuildTitle || activeBuildImages.length < 2) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeBuildImages.length)
    }, 3600)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeBuildImages.length, activeBuildTitle])

  const showPreviousImage = () => {
    if (activeBuildImages.length === 0) {
      return
    }

    setActiveImageIndex((currentIndex) => (
      currentIndex === 0 ? activeBuildImages.length - 1 : currentIndex - 1
    ))
  }

  const showNextImage = () => {
    if (activeBuildImages.length === 0) {
      return
    }

    setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeBuildImages.length)
  }

  const openBuild = (title: string) => {
    setActiveImageIndex(0)
    setActiveBuildTitle(title)
  }

  const openCertificate = (webinar: Webinar) => {
    if (!webinar.image) {
      return
    }

    setActiveCertificate(createCertificateZoom(webinar.image, webinar.title))
  }

  return (
    <section className="aboutme" id="aboutme" aria-labelledby="about-heading">
      <p className="about-label">Hello, Welcome!</p>

      <div className="about-layout">
        <div className="about-main">
          <h1 className="about-title" id="about-heading">
            About me<span>.</span>
          </h1>

          <blockquote className="about-quote">
            "Building practical digital systems through web development, IT infrastructure, and embedded engineering projects."
          </blockquote>

          <p className="about-intro">
            "Computer Engineering student specializing in web development, IT support, and systems engineering. Experienced in academic projects, freelance design work, Arduino systems, and internship-based web development and NAS setup."
          </p>

          <p className="about-intro">
            <em>"I leverage modern development tools, including AI-assisted workflows, to improve productivity and accelerate problem-solving while maintaining a strong focus on understanding core concepts and implementation."</em>
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

          <div className="stat-grid" role="list" aria-label="Highlights">
            {stats.map((stat) => (
              <div className="stat-card" role="listitem" key={stat.label}>
                <div className="stat-num">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <p className="section-title">What I've built</p>
          <ul className="build-list">
            {builds.map(({ title, description, Icon, tone, href }) => (
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

          <div className="cta-bar">
            <p>
              <strong>Currently open to opportunities</strong> where I can
              build useful systems and keep learning in the real world.
            </p>
            <a href="#contact" className="cta-btn">
              <Mail aria-hidden="true" />
              Get in touch
            </a>
          </div>
        </div>

        <aside className="about-side" aria-label="Experience and activity">
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

          <p className="section-title">Certificates</p>
          <div className="webinar-list" role="list" aria-label="Webinars attended">
            {webinars.map((webinar) => (
              <div className="webinar-card" role="listitem" key={webinar.title}>
                <div className="webinar-media">
                  {webinar.image ? (
                    <button
                      type="button"
                      className="certificate-trigger"
                      onClick={() => openCertificate(webinar)}
                      aria-label={`Open ${webinar.title} certificate`}
                    >
                      <img src={webinar.image} alt={`${webinar.title} certificate`} />
                      <span className="certificate-zoom-icon" aria-hidden="true">
                        <ZoomIn />
                      </span>
                    </button>
                  ) : (
                    <ImageIcon aria-hidden="true" />
                  )}
                </div>
                <div className="webinar-text">
                  <Award aria-hidden="true" />
                  <div>
                    <p>{webinar.title}</p>
                    <span>{webinar.description}</span>
                  </div>
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
            <div className="image-carousel" aria-label={`${activeBuild.title} image carousel`}>
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
                  (activeBuildImages.length === 1 ? [0] : [-1, 0, 1]).map((offset) => {
                    const imageIndex = (
                      activeImageIndex + offset + activeBuildImages.length
                    ) % activeBuildImages.length
                    const image = activeBuildImages[imageIndex]
                    const position = offset === 0 ? 'center' : 'side'

                    return (
                      <figure className={`carousel-slide carousel-slide-${position}`} key={`${image.caption}-${offset}`}>
                        <img src={image.src} alt={image.alt} />
                        <figcaption>{image.caption}</figcaption>
                      </figure>
                    )
                  })
                ) : (
                  <div className="carousel-empty">
                    <ImageIcon aria-hidden="true" />
                    <span>Add project screenshots in aboutmeData.ts</span>
                  </div>
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
            </div>

            <div className="build-modal-content">
              <p className="build-modal-label">Project details</p>
              <h2>{activeBuild.title}</h2>
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

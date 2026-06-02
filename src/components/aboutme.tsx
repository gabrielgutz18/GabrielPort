import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Award, ExternalLink, ImageIcon, Mail, X, ZoomIn } from 'lucide-react'
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

  useEffect(() => {
    if (!activeCertificate) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveCertificate(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeCertificate])

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
              <li className="build-item" key={title}>
                <div className={`build-icon build-icon-${tone}`}>
                  <Icon aria-hidden="true" />
                </div>
                <div className="build-text">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
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
    </section>
  )
}

export default AboutMe

import './css/footer.css'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn } from 'lucide-react'
import logoIcon from '../assets/GW.svg'
import qrDonation from '../images/GOQR.png'

function Footer() {
  const year = new Date().getFullYear()
  const [qrZoomed, setQrZoomed] = useState(false)

  useEffect(() => {
    if (!qrZoomed) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQrZoomed(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [qrZoomed])

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a className="footer-logo" href="#home">
            <img className="footer-logo-icon" src={logoIcon} alt="" />
            <span className="footer-logo-text">Gabriel.</span>
          </a>
          <p className="footer-tagline">
            Computer Engineer &amp; web developer building clean, user-friendly experiences.
          </p>

          <ul className="footer-social" aria-label="Social links">
            <li>
              <a
                href="https://github.com/gabrielgutz18"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/gutierrez-gabriel-luigi-m-84587233b/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="mailto:cpe.gutierrez.gabrielluigi@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.24-8 5-8-5V6l8 5 8-5v2.24Z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <h3 className="footer-heading">Explore</h3>
          <a href="#home">Home</a>
          <a href="#aboutme">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#feedback">Feedback</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-donate">
          <h3 className="footer-heading">Support my work</h3>
          <p className="footer-donate-message">
            If my work has helped or inspired you, a small donation goes a long way. It helps
            me keep learning, building, and sharing projects like this one. Thank you for being
            part of the journey! :D
          </p>
          <div className="footer-donate-body">
            <button
              type="button"
              className="footer-qr"
              onClick={() => setQrZoomed(true)}
              aria-label="Zoom in on donation QR code"
            >
              <img src={qrDonation} alt="Donation QR code" />
              <span className="footer-qr-zoom" aria-hidden="true">
                <ZoomIn />
              </span>
            </button>
            <span className="footer-qr-hint">Tap the QR to zoom in and scan</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">&copy; {year} Gabriel Luigi Gutierrez. All rights reserved.</p>
      </div>

      {qrZoomed &&
        createPortal(
          <div
            className="qr-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Donation QR code"
            onClick={() => setQrZoomed(false)}
          >
            <button
              type="button"
              className="qr-modal-close"
              onClick={() => setQrZoomed(false)}
              aria-label="Close QR preview"
            >
              <X aria-hidden="true" />
            </button>
            <div className="qr-modal-panel" onClick={(event) => event.stopPropagation()}>
              <img src={qrDonation} alt="Donation QR code" />
              <p>Scan to send a donation — thank you for the support! :D</p>
            </div>
          </div>,
          document.body,
        )}
    </footer>
  )
}

export default Footer

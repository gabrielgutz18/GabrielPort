import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './css/header.css'
import iconHead from '../assets/GW.svg'


function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const closeMenu = () => setMenuOpen(false)

  // On the home page the section links are plain in-page anchors. From any other
  // route they need to point back at "/" first, otherwise the hash resolves
  // against the current route and scrolls nowhere.
  const isHome = pathname === '/'
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <header className={`site-header${menuOpen ? ' nav-open' : ''}`}>
      <Link className="site-logo" to="/" onClick={closeMenu}>
        <img className="site-logo-icon" src={iconHead} alt="" />
        <span className="site-logo-text">Gabriel.</span>
      </Link>

      <nav id="primary-navigation" className="site-nav" aria-label="Main navigation">
        <a href={sectionHref('home')} onClick={closeMenu}>Home</a>
        <a href={sectionHref('aboutme')} onClick={closeMenu}>About</a>
        <a href={sectionHref('skills')} onClick={closeMenu}>My Skills</a>
        <a href={sectionHref('projects')} onClick={closeMenu}>Projects</a>
        <a href={sectionHref('contact')} onClick={closeMenu}>Contact</a>
        <Link to="/web-solutions" onClick={closeMenu}>Web Solutions</Link>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="header-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header

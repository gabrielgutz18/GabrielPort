import { useState } from 'react'
import { Link } from 'react-router-dom'
import './css/header.css'
import iconHead from '../assets/GW.svg'
import SectionLink from './sectionLink'


function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header${menuOpen ? ' nav-open' : ''}`}>
      <Link className="site-logo" to="/" onClick={closeMenu}>
        <img className="site-logo-icon" src={iconHead} alt="" />
        <span className="site-logo-text">Gabriel.</span>
      </Link>

      <nav id="primary-navigation" className="site-nav" aria-label="Main navigation">
        <SectionLink id="home" onClick={closeMenu}>Home</SectionLink>
        <SectionLink id="aboutme" onClick={closeMenu}>About</SectionLink>
        <SectionLink id="skills" onClick={closeMenu}>My Skills</SectionLink>
        <SectionLink id="projects" onClick={closeMenu}>Projects</SectionLink>
        <SectionLink id="contact" onClick={closeMenu}>Contact</SectionLink>
        <Link to="/web-solutions" onClick={closeMenu}>Web Solutions</Link>
      </nav>

      <div className="header-actions">
        <Link className="header-cta" to="/ai-creation" onClick={closeMenu}>
          AI Creation
        </Link>

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

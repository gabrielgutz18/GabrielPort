import { useState } from 'react'
import './css/header.css'
import iconHead from '../assets/GW.svg'


function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header${menuOpen ? ' nav-open' : ''}`}>
      <a className="site-logo" href={import.meta.env.BASE_URL}>
        <img className="site-logo-icon" src={iconHead} alt="" />
        <span className="site-logo-text">Gabriel.</span>
      </a>

      <nav id="primary-navigation" className="site-nav" aria-label="Main navigation">
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#aboutme" onClick={closeMenu}>About</a>
        <a href="#skills" onClick={closeMenu}>My Skills</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>

      <div className="header-actions">
        <div className="header-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." aria-label="Search site" />
        </div>

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

import './css/header.css'
import iconHead from '../assets/GW.svg'

function Header() {
  return (
    <header className="site-header">
      <a className="site-logo" href={import.meta.env.BASE_URL}>
        <img className="site-logo-icon" src={iconHead} alt="" />
        <span className="site-logo-text">Gabriel.</span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#aboutme">About</a>
        <a href="#skills">My Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
      
      <div className="header-actions">
        <div className="header-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." aria-label="Search site" />
        </div>

        <button type="button" className="header-menu-btn" aria-label="Open navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header

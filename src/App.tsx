import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import heroImage from './images/myself1.png'
import Skill from './components/skill' 
import PixelBlast from './components/PixelBlast'
import Aboutme from './components/aboutme'
import Projects from './components/projects'
import gitimg from './assets/github-svgrepo-com.svg'
import linkedinimg from './assets/linkedin-svgrepo-com.svg'
import resumeFile from './assets/myResume2.pdf'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Feedback from './components/feedback'
import { Contact2 } from './components/contact2'
import SectionLink from './components/sectionLink'

function App() {
  return (
    <div className="app">
      <Header/>

      <section className="hero" id="home">
        <div className="hero-pixel-background" aria-hidden="true">
          <PixelBlast
              className="pixel-blast"
              style={{}}
              variant="square"
              pixelSize={2}
              color="#1f1e1e"
              patternScale={4.5}
              patternDensity={1.2}
              enableRipples
              rippleSpeed={0.3}
              rippleThickness={0.1}
              rippleIntensityScale={1}
              speed={1.5}
              transparent
              edgeFade={0.15}
          />
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="hero-status-dot" aria-hidden="true"></span>
              Available for new projects
            </p>

            <h1 className="hero-title">Gabriel Luigi Gutierrez</h1>

            <p className="hero-role">Computer Engineer &amp; Web Developer</p>

            <p className="hero-lede">
              I build clean, responsive, and user-friendly web experiences —
              from the first wireframe to the deployed product.
            </p>

            <div className="hero-actions">
              <SectionLink className="hero-btn hero-btn--primary" id="contact">
                <span>Contact me</span>
                <ArrowRight className="hero-btn-icon" aria-hidden="true" />
              </SectionLink>

              <a
                className="hero-btn hero-btn--ghost"
                href={resumeFile}
                target="_blank"
                rel="noreferrer"
              >
                <span>View resume</span>
              </a>

              <span className="hero-actions-divider" aria-hidden="true"></span>

              <a
                className="hero-icon-btn"
                href="https://github.com/gabrielgutz18"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <img src={gitimg} alt="" />
              </a>
              <a
                className="hero-icon-btn"
                href="https://www.linkedin.com/in/gutierrez-gabriel-luigi-m-84587233b/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                <img src={linkedinimg} alt="" />
              </a>
            </div>
          </div>

          <figure className="hero-portrait">
            <img
              src={heroImage}
              alt="Gabriel Luigi Gutierrez"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>

        <SectionLink className="hero-scroll" id="aboutme">
          <ArrowDown className="hero-scroll-icon" aria-hidden="true" />
          <span>Scroll to explore</span>
        </SectionLink>
      </section>

      <Aboutme/>
      <Projects/>
      <Skill/>
      <Feedback />
      <div id="contact" className="dark bg-background text-foreground">
        <Contact2 />
      </div>
      <Footer />
    </div>
  )
}

export default App

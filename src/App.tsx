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
import { Typewriter } from 'react-simple-typewriter'


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
      
          <div className="hero-image">
            <img src={heroImage} alt="Gabriel" />
            <div className="text-content-hero">
              <h1>Welcome to My Portfolio</h1>
              <h2 className="subtitle">I'm Gabriel, a passionate developer.</h2>
              <p>
                <Typewriter
                  words={['Computer Engineer with a growing passion for web development, focused on creating clean and user-friendly web experiences.']}
                  cursor
                  cursorStyle="|"
                  typeSpeed={20}
                  deleteSpeed={30}
                  delaySpeed={1000}
                />
              </p>
              <div className="hero-actions">
                <a className="contact-button" href="#contact">Contact Me</a>
                <a className="gitimg" href="https://github.com/gabrielgutz18" aria-label="GitHub">
                  <img src={gitimg} alt="" />
                  <span>Github</span>
                </a>
                <a className="linkedinimg" href="https://www.linkedin.com/in/gutierrez-gabriel-luigi-m-84587233b/" aria-label="LinkedIn">
                  <img src={linkedinimg} alt="" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
      </section>

      <Aboutme/>
      <Skill/>
      <Projects/>
      <Footer/>
    </div>
  )
}

export default App

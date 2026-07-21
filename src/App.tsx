import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import heroImage from './images/myself1.png'
import heroImage2 from './images/memyself.png'
import Skill from './components/skill' 
import PixelBlast from './components/PixelBlast'
import Aboutme from './components/aboutme'
import Projects from './components/projects'
import gitimg from './assets/github-svgrepo-com.svg'
import linkedinimg from './assets/linkedin-svgrepo-com.svg'
import resumeFile from './assets/myResume.pdf'
import { Typewriter } from 'react-simple-typewriter'
import Feedback from './components/feedback'
import { Contact2 } from './components/contact2'

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
                <a className="resume-button" href={resumeFile} target="_blank" rel="noreferrer">
                  <span>View Resume</span>
                </a>
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

            <div className="hero-visuals">
              <figure className="hero-visual hero-visual--showcase">
                <img src={heroImage2} alt="Gabriel2" />
              </figure>
              <figure className="hero-visual hero-visual--portrait">
                <img src={heroImage} alt="Gabriel" />
              </figure>
            </div>
          </div>
      </section>

      <Aboutme/>
      <Skill/>
      <Projects/>
      <Feedback />
      <div id="contact" className="dark bg-background text-foreground">
        <Contact2 />
      </div>
      <Footer />
      

    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Award,
  Code2,
  Cpu,
  ExternalLink,
  GitBranch,
  Globe2,
  ImageIcon,
  Mail,
  Network,
  Palette,
  Server,
  X,
  ZoomIn,
} from 'lucide-react'
import './aboutme.css'
import { createCertificateZoom, type CertificateZoom } from './backend/cert_click'
import cert1 from '../images/Cert/Cisco_cert.jpg'
import cert2 from '../images/Cert/AIVA.jpg'
import cert3 from '../images/Cert/cpe.jpg'
import cert4 from '../images/Cert/Cert_gutierrez_20251217_094037_0000.png'
import cert5 from '../images/Cert/Customer.jpg'
import cert6 from '../images/Cert/Gutierrez Cert.jpg'
import cert7 from '../images/Cert/IOT.jpg'
import cert8 from '../images/Cert/PLC.jpg'
import cert9 from '../images/Cert/PCB.png'
import cert10 from '../images/Cert/ccna.png'
import cert11 from '../images/Cert/sddt.png'
import cert12 from '../images/Cert/serverless.png'



const skills = [
  { label: 'Web dev', Icon: Globe2 },
  { label: 'NAS / Servers', Icon: Server },
  { label: 'Drone AI', Icon: Cpu },
  { label: 'Networking', Icon: Network },
  { label: 'Design', Icon: Palette },
  { label: 'Python / JS', Icon: Code2 },
  { label: 'Git / GitHub', Icon: GitBranch },
  { label: 'IT Support', Icon: Network },
  { label: 'Graphics designing', Icon: Palette },
]

const stats = [
  { value: '99', label: 'Lighthouse performance score' },
  { value: '4TB + 500GB', label: 'NAS storage configured, TailScale VPN deployed' },
  { value: '1', label: 'Live company website deployed' },
]

const builds = [
  {
    title: 'nqstv.net - Live company website',
    description:
      'Full-stack deployment via GitHub Pages, custom domain, EmailJS, Crisp chat, and a 99% Lighthouse score.',
    Icon: Globe2,
    tone: 'neutral',
    href: 'https://nqstv.net',
  },
  {
    title: 'Search-and-rescue drone system',
    description:
      'YOLOv8 AI detection, thermal camera, LiDAR obstacle avoidance, GPS accuracy, and RTH fail-safe.',
    Icon: Cpu,
    tone: 'cool',
  },
  {
    title: 'TrueNAS server + remote access',
    description:
      'ZFS RAID-1 storage, Tailscale VPN, and a 2.5G NIC upgrade for faster transfer speeds.',
    Icon: Server,
    tone: 'warm',
  },
]

const experience = [
  {
    year: '2026',
    title: 'IT Intern - NQSTV, Liliw Laguna',
    description:
      "Deployed the company's live website, configured a TrueNAS NAS server with remote Tailscale VPN access, and handled IT infrastructure including networking and hardware maintenance.",
    active: true,
  },
  {
    year: '2024 - 2026',
    title: 'Thesis - Search-and-Rescue Drone System',
    description:
      'Designed a multi-function drone integrating YOLOv8 AI for real-time detection, thermal imaging, LiDAR obstacle avoidance, GPS tracking, speech broadcast, and RTH fail-safe.',
  },
  {
    year: '2022 - Present',
    title: 'Computer Engineering - PLSP',
    description:
      'Studying CpE with a focus on embedded systems, networking, and software development. Built Arduino projects, and developed hardware-software integrated systems.',
  },
]

const webinars = [
  {
    title: 'Introdction to IoT and Digital Transformation',
    description: 'offered by DICT-ITU Initiative, Completion: 27 Sept 2025',
    image: cert1,
  },
  {
    title: 'AI-Powered VA: Future-Proof Your Skills.',
    description: 'offered by DICT Region V, Given on 18th day of September 2025',
    image: cert2,
  },
  {
    title: 'Auditing Artificial Intelligenc: Risk, Opportunities, and leading Practices',
    description: 'Offered by ISACA, Given on 25th day of September 2025',
    image: cert3,
  },
  {
    title: 'Infosession: Stardust and Stride: Gaining hadns-on experience and insights into building modern, Ai-powered Applications',
    description: 'Prepared by Google Developer Group on Campus-Cebu Technological University, Given on 20th day of September 2025',
    image: cert4,
  },
  {
    title: 'Apply Ai: Analyze Customer Reviews',
    description: 'Offered by Networking Acaddemy, Completion: 27th day of September 2025',
    image: cert5,
  },
  {
    title: 'Building Web Solutions using Gemini and Firebase Studio',
    description: 'Prepared by Google Developer Group on Campus-Cebu Technological University, Given on 19th day of September 2025',
    image: cert6,
  },
  {
    title: 'Internet of Things in Smart Cities',
    description: 'Prepared by DICT X, Session held on 13th day of September 2025.',
    image: cert7 ,
  },
  {
    title: 'Fundamentals of Programmable logic Controllers',
    description: 'Prepared by China-ASEAN Industry-Education Integration Specialized Technical Skills Training Program, Held on 25th day of September 2025',
    image: cert8,
  },
  {
    title: 'PCB Design Course',
    description: 'Offered by Simplilearn SkillUP, Completion: 3rd Day of December 2025',
    image: cert9
  },
  {
    title: 'learn CCNA 200-301 Network Fundamentals Online',
    description: 'offered by Simplilearn SkillUP, Completion: 16th Day of January 2025',
    image: cert10
  },
  {
    title: 'Software Development and Design Thinking',
    description: 'Organized by the ICT literacy and Competency Development Bureau of DICT Region X, Session Held: September 29, 2025',
    image: cert11,
  },
  {
    title: 'Serverless Architecture for enhance Public Service delivery: Use Cases for Givernment Agency',
    description: 'Organized by DICT, CamarinesNorte Provincial Office, Region V: Given this of 30th day of September 2025',
    image: cert12
  },
  
]

const facts = [
  { emoji: '☕', text: 'Fueled by coffee - always one cup too many' },
  { emoji: '🌙', text: 'Loves Coding and Studying Midnight' },
  { emoji: '🎨', text: 'Edits graphics and social media contents' },
  { emoji: '🏃', text: 'Loves Doing Daily Runs, For a Stronger Health' },
  { emoji: '🎮', text: 'Gamer - strategy and immersive worlds' },
  { emoji: '🎵', text: 'Music Enthusiast - from lo-fi beats to rock classics' },
 
]

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

  const openCertificate = (webinar: (typeof webinars)[number]) => {
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
            {skills.map(({ label, Icon }) => (
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
                <div className="fact-emoji">{fact.emoji}</div>
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

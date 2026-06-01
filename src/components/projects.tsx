import './css/projects.css'
import { useEffect, useRef, useState } from 'react'



const project = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.28 }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={`project ${isVisible ? 'project-visible' : ''}`}
      id="projects"
      ref={sectionRef}
    >
      <div className="project-card">
        <div className="project-header center-text">
          <p className="project-label">Projects</p>
          <div className="project-heading-row">
            <h1 className="project-title" id="project-heading">My Projects</h1>
            <p className="project-intro">A collection of projects that showcase my skills and experience in software development, AI, and computer engineering.</p>
          </div>
        </div>
      </div>
    </section>
      
    
  )
}

export default project

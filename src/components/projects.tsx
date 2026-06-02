import './css/projects.css'
import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { projects } from './data/projectData'

const Projects = () => {
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
      <div className="project-panel">
        <div className="project-header center-text">
          <p className="project-label">Projects</p>
          <div className="project-heading-row">
            <h1 className="project-title" id="project-heading">My Projects</h1>
            <p className="project-intro">A collection of projects that showcase my skills and experience in software development, AI, and computer engineering.</p>
          </div>

          <div className="project-divider" aria-hidden="true">
            <h1>Websites</h1>
          </div>

          <div className="project-grid" aria-label="Project list">
            {projects.map((projectItem) => (
              <article className="project-item-card" key={projectItem.name}>
                <div className="project-image-wrap">
                  {projectItem.image ? (
                    <img
                      src={projectItem.image}
                      alt={`${projectItem.name} website preview`}
                      className="project-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-image-placeholder" aria-hidden="true">
                      {projectItem.name}
                    </div>
                  )}
                </div>

                <div className="project-item-content">
                  <div className="project-text">
                    <h2 className="project-name">{projectItem.name}</h2>
                    <p className="project-description">{projectItem.description}</p>
                  </div>
                  {projectItem.link && (
                    <a
                      href={projectItem.link}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live ${projectItem.name}`}
                    >
                      View live
                      <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects

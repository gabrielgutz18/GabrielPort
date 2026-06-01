import './css/projects.css'
import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'


const projectsamp = [
  {
    name: 'NQSTV Website',
    image: 'https://scontent.fcgy1-1.fna.fbcdn.net/v/t39.30808-6/702214433_1587577416708296_7799185318262289996_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHMeLbpuCkQbS9tmSUUutpjzEKwpxQNzInMQrCnFA3MiaI_TQA4Gvg8wVkwF6NmsOkaMxNtf7MVjFVormvDGHOp&_nc_ohc=DRqP0rvbxMUQ7kNvwGUVs66&_nc_oc=Adp0b2rkqQWgmJeXl7zAMHyRHjTZ7inJqVtgO60ndUvWpCWMocbaDemU3K7DxcaadHCwiPhWszx--urID_ipGMMJ&_nc_zt=23&_nc_ht=scontent.fcgy1-1.fna&_nc_gid=aPifmGJszG3T-eC5XqFDog&_nc_ss=7b2a8&oh=00_Af_TYq_svOmPBiZCR59gEhdU6_-3WgFjfWyI70JEvq4TiQ&oe=6A236878',
    link: 'https://nqstv.net',
  },
]

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

          <div className="project-grid" aria-label="Project list">
            {projectsamp.map((projectItem) => (
              <article className="project-item-card" key={projectItem.name}>
                <div className="project-image-wrap">
                  <img
                    src={projectItem.image}
                    alt={`${projectItem.name} website preview`}
                    className="project-image"
                    loading="lazy"
                  />
                </div>

                <div className="project-item-content">
                  <h2 className="project-name">{projectItem.name}</h2>
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

import './css/projects.css'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImageIcon,
  X,
} from 'lucide-react'
import {
  projects,
  type Project,
  type ProjectImage,
  type ProjectStatus,
} from './data/projectData'

type FilterValue = 'all' | ProjectStatus

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'finished', label: 'Finished' },
  { value: 'in-progress', label: 'In Progress' },
]

/* Keeps the stage from going extreme on very tall or very wide screenshots,
   so the modal layout stays stable whatever gets added to projectData. */
const MIN_STAGE_RATIO = 0.72
const MAX_STAGE_RATIO = 2.4

/* --- Image carousel used inside the project detail modal --- */
const ProjectCarousel = ({ images }: { images: ProjectImage[] }) => {
  const [index, setIndex] = useState(0)
  /* Natural width/height per image, so the stage matches the shape of the
     screenshot instead of forcing every one into the same box. */
  const [ratios, setRatios] = useState<Record<number, number>>({})
  const hasMultiple = images.length > 1

  const measure = (image: HTMLImageElement | null, imageIndex: number) => {
    if (!image?.naturalWidth || !image.naturalHeight) {
      return
    }

    const ratio = Math.min(
      Math.max(image.naturalWidth / image.naturalHeight, MIN_STAGE_RATIO),
      MAX_STAGE_RATIO
    )

    setRatios((current) =>
      current[imageIndex] ? current : { ...current, [imageIndex]: ratio }
    )
  }

  if (images.length === 0) {
    return (
      <div className="pc-empty">
        <ImageIcon aria-hidden="true" />
        <span>No preview images yet</span>
      </div>
    )
  }

  const active = images[index]

  const goPrev = () =>
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  const goNext = () => setIndex((current) => (current + 1) % images.length)

  return (
    <div className="pc" aria-roledescription="carousel">
      <div
        className="pc-stage"
        style={{ '--pc-ratio': ratios[index] ?? '' } as CSSProperties}
      >
        <img
          src={active.src}
          alt={active.alt}
          /* Cached images can finish loading before onLoad is attached, so
             measure from the ref too. */
          ref={(node) => {
            if (node?.complete) {
              measure(node, index)
            }
          }}
          onLoad={(event) => measure(event.currentTarget, index)}
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              className="pc-arrow pc-arrow-prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pc-arrow pc-arrow-next"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="pc-footer">
        <p className="pc-caption">{active.caption}</p>
        {hasMultiple && (
          <div className="pc-dots" role="tablist" aria-label="Choose image">
            {images.map((image, dotIndex) => (
              <button
                type="button"
                key={image.src + dotIndex}
                className={`pc-dot ${dotIndex === index ? 'is-active' : ''}`}
                onClick={() => setIndex(dotIndex)}
                aria-label={`Go to image ${dotIndex + 1}`}
                aria-selected={dotIndex === index}
                role="tab"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Projects = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeName, setActiveName] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')
  const activeProject = projects.find((item) => item.name === activeName) ?? null

  const visibleProjects =
    filter === 'all'
      ? projects
      : projects.filter((item) => item.status === filter)

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

  useEffect(() => {
    if (!activeProject) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveName(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeProject])

  return (
    <section
      className={`project ${isVisible ? 'project-visible' : ''}`}
      id="projects"
      ref={sectionRef}
    >
      <div className="project-panel">
        <div className="project-header">
          <p className="project-label">Projects</p>
          <div className="project-heading-row">
            <h1 className="project-title" id="project-heading">
              Website Projects I&apos;ve built
            </h1>
            <p className="project-intro">
              A collection of website projects that showcase my skills and
              experience. Select a project to see the details, challenges, and
              how I solved them.
            </p>
          </div>
        </div>

        <div className="project-tabs" role="tablist" aria-label="Filter projects">
          {filters.map((tab) => {
            const count =
              tab.value === 'all'
                ? projects.length
                : projects.filter((item) => item.status === tab.value).length

            return (
              <button
                type="button"
                key={tab.value}
                role="tab"
                aria-selected={filter === tab.value}
                className={`project-tab ${filter === tab.value ? 'is-active' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
                <span className="project-tab-count">{count}</span>
              </button>
            )
          })}
        </div>

        <ul className="project-list" aria-label="Project list">
          {visibleProjects.map((projectItem: Project) => (
            <li className="project-row" key={projectItem.name}>
              <button
                type="button"
                className="project-row-btn"
                onClick={() => setActiveName(projectItem.name)}
                aria-haspopup="dialog"
              >
                <span className="project-row-head">
                  <span className="project-row-name">{projectItem.name}</span>
                  <span className="project-row-date">{projectItem.date}</span>
                </span>

                <span className="project-row-summary">{projectItem.summary}</span>

                <span className="project-row-tags">
                  <span
                    className={`project-status project-status-${projectItem.status}`}
                  >
                    {projectItem.status === 'finished' ? 'Finished' : 'In progress'}
                  </span>
                  {projectItem.tags.map((tag) => (
                    <span className="project-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </span>

                <span className="project-row-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </button>
            </li>
          ))}

          {visibleProjects.length === 0 && (
            <li className="project-empty-row">
              No projects in this category yet.
            </li>
          )}
        </ul>
      </div>

      {activeProject &&
        createPortal(
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={activeProject.name}
            onClick={() => setActiveName(null)}
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setActiveName(null)}
              aria-label={`Close ${activeProject.name}`}
            >
              <X aria-hidden="true" />
            </button>

            <div
              className="project-modal-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="project-modal-media">
                {/* Keyed by project so opening a different one remounts the
                    carousel back to the first image. Resetting via an effect
                    instead would leave one render showing a stale index — out
                    of bounds if the new project has fewer images. */}
                <ProjectCarousel
                  key={activeProject.name}
                  images={activeProject.images}
                />
              </div>

              <div className="project-modal-body">
                <p className="project-modal-kicker">Project details</p>
                <h2 className="project-modal-title">{activeProject.name}</h2>

                <div className="project-modal-meta">
                  <span>{activeProject.date}</span>
                  {activeProject.role && <span>{activeProject.role}</span>}
                </div>

                <p className="project-modal-desc">{activeProject.details}</p>

                <div className="project-modal-notes">
                  {activeProject.challenge && (
                    <div className="project-note">
                      <span>Challenge</span>
                      <p>{activeProject.challenge}</p>
                    </div>
                  )}
                  <div className="project-note">
                    <span>Solution</span>
                    <p>{activeProject.solution}</p>
                  </div>
                </div>

                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    className="project-modal-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit live site
                    <ExternalLink aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

export default Projects

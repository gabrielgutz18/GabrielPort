import './css/feedback.css'
import './css/reveal.css'
import { useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { type FeedbackEntry } from './data/feedbackData'
import { fetchFeedback, submitFeedback } from '../lib/feedback'
import { useReveal } from '../hooks/useReveal'

const MAX_STARS = 5

const formatDate = (iso: string) => {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return iso
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/* Read-only row of stars used when displaying a feedback entry. */
const StarsDisplay = ({ rating }: { rating: number }) => (
  <span className="fb-stars-display" aria-label={`${rating} out of ${MAX_STARS} stars`}>
    {Array.from({ length: MAX_STARS }, (_, index) => (
      <Star
        key={index}
        className={`fb-star ${index < rating ? 'is-filled' : ''}`}
        aria-hidden="true"
      />
    ))}
  </span>
)

const Feedback = () => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([])
  const [name, setName] = useState('')
  const [source, setSource] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [error, setError] = useState('')
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load the existing reviews once on mount. A failed fetch just leaves the list
  // empty — the form still works, so it is not worth blocking the section on.
  useEffect(() => {
    let active = true
    fetchFeedback()
      .then((data) => {
        if (active) {
          setEntries(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load feedback:', err)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const averageRating = useMemo(() => {
    if (entries.length === 0) {
      return 0
    }
    const total = entries.reduce((sum, entry) => sum + entry.rating, 0)
    return Math.round((total / entries.length) * 10) / 10
  }, [entries])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (submitting) {
      return
    }
    if (rating === 0) {
      setError('Please pick a star rating.')
      return
    }
    if (!name.trim() || !comment.trim()) {
      setError('Please add your name and a short comment.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const saved = await submitFeedback({
        name: name.trim(),
        source: source.trim() || 'Visitor',
        rating,
        comment: comment.trim(),
      })

      // Newest first, using the row the database returned (real id + date).
      setEntries((current) => [saved, ...current])
      setJustAddedId(saved.id)

      setName('')
      setSource('')
      setComment('')
      setRating(0)
      setHover(0)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      setError('Something went wrong sending your feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const activeStars = hover || rating
  const { ref, revealClass } = useReveal<HTMLElement>()

  return (
    <section ref={ref} className={`feedback ${revealClass}`} id="feedback">
      <div className="fb-panel">
        <header className="fb-header reveal-item">
          <p className="fb-label">Feedback</p>
          <h2 className="fb-title">Rate my work</h2>
          <p className="fb-intro">
            Have you worked with me on a project or experienced my performance as a teammate? I’d appreciate your honest feedback about our collaboration, project experience, and how I contributed to the team. Leave a quick rating and share your thoughts — your feedback helps me continue improving as a developer.
          </p>
        </header>

        <div className="fb-layout">
          {/* --- Rating form --- */}
          <form
            className="fb-form reveal-item reveal-delay-1"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="fb-rating-field">
              <span className="fb-field-label">Your rating</span>
              <div
                className="fb-stars-input"
                role="radiogroup"
                aria-label="Star rating"
                onMouseLeave={() => setHover(0)}
              >
                {Array.from({ length: MAX_STARS }, (_, index) => {
                  const value = index + 1
                  return (
                    <button
                      type="button"
                      key={value}
                      className={`fb-star-btn ${value <= activeStars ? 'is-active' : ''}`}
                      onClick={() => {
                        setRating(value)
                        setError('')
                      }}
                      onMouseEnter={() => setHover(value)}
                      aria-label={`${value} star${value > 1 ? 's' : ''}`}
                      aria-pressed={value === rating}
                    >
                      <Star aria-hidden="true" />
                    </button>
                  )
                })}
                <span className="fb-rating-hint">
                  {activeStars > 0 ? `${activeStars}/${MAX_STARS}` : 'Tap a star'}
                </span>
              </div>
            </div>

            <label className="fb-field">
              <span className="fb-field-label">Name</span>
              <input
                type="text"
                className="fb-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                maxLength={60}
              />
            </label>

            <label className="fb-field">
              <span className="fb-field-label">Website or your work</span>
              <input
                type="text"
                className="fb-input"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder="e.g. yoursite.com or Freelance Designer"
                maxLength={80}
              />
            </label>

            <label className="fb-field">
              <span className="fb-field-label">Comment</span>
              <textarea
                className="fb-input fb-textarea"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share a few words about my work..."
                rows={4}
                maxLength={400}
              />
            </label>

            {error && <p className="fb-error">{error}</p>}

            <button type="submit" className="fb-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit feedback'}
            </button>
          </form>

          {/* --- Live feedback list --- */}
          <div className="fb-results reveal-item reveal-delay-2" aria-live="polite">
            <div className="fb-results-head">
              {/* An average of "0.0" out of no reviews reads as a bad score
                  rather than "nothing yet", so the score only appears once
                  there is something to average. */}
              {entries.length > 0 ? (
                <div className="fb-avg">
                  <span className="fb-avg-value">{averageRating.toFixed(1)}</span>
                  <StarsDisplay rating={Math.round(averageRating)} />
                </div>
              ) : (
                <span className="fb-avg-placeholder">
                  {loading ? 'Loading reviews…' : 'No rating yet'}
                </span>
              )}
              <span className="fb-count">
                {loading
                  ? '—'
                  : `${entries.length} ${entries.length === 1 ? 'review' : 'reviews'}`}
              </span>
            </div>

            <div className="fb-list">
              {loading ? (
                /* Skeleton keeps the column at its settled height so the
                   section does not jump when the fetch resolves. */
                <ul className="fb-skeleton-list" aria-hidden="true">
                  {[0, 1, 2].map((row) => (
                    <li className="fb-card fb-card--skeleton" key={row}>
                      <div className="fb-card-top">
                        <span className="fb-skeleton fb-skeleton--avatar" />
                        <div className="fb-card-id">
                          <span className="fb-skeleton fb-skeleton--line" />
                          <span className="fb-skeleton fb-skeleton--line is-short" />
                        </div>
                      </div>
                      <span className="fb-skeleton fb-skeleton--line" />
                      <span className="fb-skeleton fb-skeleton--line is-short" />
                    </li>
                  ))}
                </ul>
              ) : entries.length === 0 ? (
                <div className="fb-empty">
                  <span className="fb-empty-icon" aria-hidden="true">
                    <Star />
                  </span>
                  <p className="fb-empty-title">No reviews yet</p>
                  <p className="fb-empty-text">
                    Be the first to leave one — your rating shows up here as soon as
                    you submit it.
                  </p>
                </div>
              ) : (
                /* Track is animated with a GPU-composited CSS transform (not JS
                    scrollTop), so it stays smooth. Two full copies back-to-back
                    make the -50% loop seamless; the second is hidden from a11y.
                    Duration scales with the number of reviews for constant speed;
                    `key` restarts the animation from the top when one is added. */
                <ul
                  className="fb-list-track"
                  key={entries.length}
                  style={{ animationDuration: `${entries.length * 5}s` }}
                >
                  {[0, 1].map((copy) =>
                    entries.map((entry) => (
                      <li
                        key={`${entry.id}-${copy}`}
                        className={`fb-card ${
                          copy === 0 && entry.id === justAddedId ? 'is-new' : ''
                        }`}
                        aria-hidden={copy === 1 ? true : undefined}
                      >
                        <div className="fb-card-top">
                          <span className="fb-avatar" aria-hidden="true">
                            {initials(entry.name) || '?'}
                          </span>
                          <div className="fb-card-id">
                            <span className="fb-card-name">{entry.name}</span>
                            <span className="fb-card-source">{entry.source}</span>
                          </div>
                          <StarsDisplay rating={entry.rating} />
                        </div>
                        <p className="fb-card-comment">{entry.comment}</p>
                        <span className="fb-card-date">{formatDate(entry.date)}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feedback

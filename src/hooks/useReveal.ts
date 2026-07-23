import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-triggered reveal. Returns a ref for the section and the class names to
 * put on it — children marked `.reveal-item` fade up once the section scrolls
 * into view (see css/reveal.css).
 *
 * Reveals once and then stops observing; sections that have already been seen
 * stay visible.
 */
// Reduced motion, or a browser without the observer: start revealed so the
// content is never left hidden. Resolved up front rather than in the effect,
// which would mean a synchronous setState and a cascading render.
const startsRevealed = () =>
  typeof window === 'undefined' ||
  typeof IntersectionObserver === 'undefined' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(startsRevealed)

  useEffect(() => {
    const node = ref.current
    if (!node || revealed) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, revealed])

  return { ref, revealClass: revealed ? 'reveal reveal-visible' : 'reveal' }
}

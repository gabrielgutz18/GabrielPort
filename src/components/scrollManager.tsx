import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Owns scroll position across navigation.
 *
 * - Hash on the page you are already on: animates to that section. This is the
 *   navbar/footer case, and the only one that should be smooth.
 * - Hash on arrival from another route: jumps to the section, waiting for it to
 *   render. The browser's own hash handling runs while the document is parsed,
 *   when #root is still empty, so "/#contact" would otherwise land at the top.
 * - Without a hash: resets to the top. React Router keeps the current offset
 *   when the route changes, which drops you into the middle of the new page.
 * - On back/forward: jumps, matching what the browser would have restored.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const previousPathname = useRef<string | null>(null)

  useLayoutEffect(() => {
    // First render is an arrival, not an in-page jump, however we got here.
    const isSamePage = previousPathname.current === pathname
    previousPathname.current = pathname

    if (!hash) {
      if (navigationType !== 'POP') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      return
    }

    // "instant", not "auto": auto defers to the CSS scroll-behavior, which is
    // smooth site-wide — and smooth-scrolling the full page height on arrival
    // is a long, janky ride while the sections below are still mounting.
    const behavior =
      isSamePage && navigationType === 'PUSH' && !prefersReducedMotion() ? 'smooth' : 'instant'

    const id = decodeURIComponent(hash.slice(1))

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (!target) {
        return false
      }

      // scroll-margin-top on the sections keeps the fixed header off the title.
      target.scrollIntoView({ behavior, block: 'start' })
      return true
    }

    let frameId = 0
    let attempts = 0

    // The section may mount a frame or two after this effect runs.
    const attempt = () => {
      if (scrollToTarget() || attempts > 60) {
        return
      }

      attempts += 1
      frameId = requestAnimationFrame(attempt)
    }

    frameId = requestAnimationFrame(attempt)

    // Images above the target settle late and push it down, so correct the
    // position once everything has finished loading. Only worth doing on
    // arrival — mid-page clicks happen long after load, and re-firing this
    // would cut an in-flight smooth scroll short.
    const onLoad = () => scrollToTarget()
    if (behavior === 'instant') {
      window.addEventListener('load', onLoad)
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('load', onLoad)
    }
    // `key` changes on every navigation, so re-clicking the section you are
    // already on still re-runs this.
  }, [pathname, hash, key, navigationType])

  return null
}

export default ScrollManager

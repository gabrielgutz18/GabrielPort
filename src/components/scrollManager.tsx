import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Owns scroll position across navigation.
 *
 * - With a hash: scrolls to that element, waiting for it to render. The
 *   browser's own hash handling runs while the document is parsed, when #root
 *   is still empty, so arriving at "/#contact" would otherwise land at the top.
 * - Without a hash: resets to the top. React Router keeps the current offset
 *   when the route changes, which drops you into the middle of the new page.
 * - On back/forward: leaves scroll alone so the browser can restore it.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    // "instant", not "auto": auto defers to the CSS scroll-behavior, which is
    // smooth site-wide — and smooth-scrolling the full page height on arrival
    // is a long, janky ride. In-page nav clicks still animate as before.
    if (!hash) {
      if (navigationType !== 'POP') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      return
    }

    const id = decodeURIComponent(hash.slice(1))

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (!target) {
        return false
      }

      target.scrollIntoView({ behavior: 'instant', block: 'start' })
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
    // position once everything has finished loading.
    const onLoad = () => scrollToTarget()
    window.addEventListener('load', onLoad)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('load', onLoad)
    }
  }, [pathname, hash, navigationType])

  return null
}

export default ScrollManager

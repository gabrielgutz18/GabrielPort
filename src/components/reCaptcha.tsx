import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState, type Ref } from 'react'

// The slice of Google's reCAPTCHA v2 API this component uses.
type Grecaptcha = {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string
      theme?: 'dark' | 'light'
      size?: 'normal' | 'compact'
      callback?: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
    },
  ) => number
  reset: (widgetId?: number) => void
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
    onRecaptchaLoad?: () => void
  }
}

// render=explicit stops the script from scanning the page for .g-recaptcha
// elements on its own; `onload` fires once grecaptcha.render is callable.
const SCRIPT_URL =
  'https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad'

// The checkbox widget is a fixed 304px wide. On the narrowest phones the form
// column is smaller than that, so fall back to the compact (tall) variant.
const NORMAL_WIDGET_WIDTH = 304

// One script tag per page, however many times the widget mounts.
let scriptPromise: Promise<Grecaptcha> | null = null

function loadRecaptcha(): Promise<Grecaptcha> {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      window.onRecaptchaLoad = () => resolve(window.grecaptcha as Grecaptcha)
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onerror = () => {
        // Let a later mount try again instead of caching the failure.
        scriptPromise = null
        reject(new Error('Failed to load reCAPTCHA'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export type ReCaptchaHandle = {
  /** Clears the checkbox. A token is single-use, so call after every submit. */
  reset: () => void
}

type ReCaptchaProps = {
  siteKey: string
  /** Receives the token once solved, and null when it expires or errors. */
  onChange: (token: string | null) => void
  ref?: Ref<ReCaptchaHandle>
}

const ReCaptcha = ({ siteKey, onChange, ref }: ReCaptchaProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  // Google holds on to the callbacks from the first render; route them through
  // an effect event so they always reach the latest onChange.
  const emit = useEffectEvent((token: string | null) => onChange(token))

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current !== null) {
        window.grecaptcha?.reset(widgetId.current)
      }
    },
  }))

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let cancelled = false
    // Render into a fresh child each time: grecaptcha refuses to render twice
    // into the same element, which StrictMode's mount → unmount → mount does.
    const slot = document.createElement('div')
    container.appendChild(slot)

    const mount = () => {
      loadRecaptcha()
        .then((grecaptcha) => {
          if (cancelled) {
            return
          }
          widgetId.current = grecaptcha.render(slot, {
            sitekey: siteKey,
            theme: 'dark',
            size: container.offsetWidth < NORMAL_WIDGET_WIDTH ? 'compact' : 'normal',
            callback: (token) => emit(token),
            'expired-callback': () => emit(null),
            'error-callback': () => emit(null),
          })
        })
        .catch((err) => {
          console.error(err)
          if (!cancelled) {
            setLoadFailed(true)
          }
        })
    }

    // The feedback section sits far down the page. Google's script is a few
    // hundred KB, so hold off until the form is about to scroll into view
    // rather than charging every visitor for it on first load.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          mount()
        }
      },
      { rootMargin: '400px' },
    )
    observer.observe(container)

    return () => {
      cancelled = true
      observer.disconnect()
      widgetId.current = null
      slot.remove()
    }
  }, [siteKey])

  return (
    <div className="fb-captcha" ref={containerRef}>
      {loadFailed && (
        <p className="fb-error">
          Couldn’t load the captcha. Check your connection or turn off content
          blockers for this site, then reload.
        </p>
      )}
    </div>
  )
}

export default ReCaptcha

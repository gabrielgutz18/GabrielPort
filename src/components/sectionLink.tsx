import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  id: string
  children: ReactNode
}

/**
 * Link to a section of the home page from anywhere in the site.
 *
 * Routing it through <Link> instead of a bare <a href="#id"> keeps React Router
 * in sync with the URL, which is what lets ScrollManager animate the scroll.
 * From another route the target is "/#id" so the hash resolves against home,
 * and the router applies the basename instead of hard-reloading the app.
 */
function SectionLink({ id, children, onClick, ...rest }: SectionLinkProps) {
  const { pathname, hash } = useLocation()
  const isHome = pathname === '/'

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    // Navigating to the location you are already at gives ScrollManager nothing
    // to react to, so clicking the current section's link has to scroll by hand.
    if (isHome && hash === `#${id}`) {
      event.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Link to={isHome ? { hash: `#${id}` } : `/#${id}`} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}

export default SectionLink

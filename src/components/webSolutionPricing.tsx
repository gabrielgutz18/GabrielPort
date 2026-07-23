import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import './css/webSolutionPricing.css'
import Header from './header'
import Footer from './footer'
import SectionLink from './sectionLink'
import { Background } from './pricingBg'

// NOTE: prices below are placeholders — swap in your real rates.
// `subject` is what lands in the contact form's Subject field when the plan's
// CTA is clicked — see contactHref() below.
const plans = [
  {
    name: 'Basic Website Portfolio',
    subject: 'Portfolio Website — Request a meeting',
    price: 'Request a Meeting',
    cadence: 'quoted per project',
    summary: 'A Portfolio, focused page to introduce a brand, product, or service.',
    features: [
      'Project proposal first, then a quote',
      'One-page responsive design',
      'Contact / inquiry form',
      'Basic SEO setup',
      'Deployment to Vercel or your host',
      '1 round of revisions',
    ],
  },
  {
    name: 'Business Website',
    subject: 'Business Website — Request a meeting',
    price: 'Request a Meeting',
    cadence: 'quoted per project',
    summary: 'A complete multi-page site for small businesses ready to grow online.',
    features: [
      'Project proposal first, then a quote',
      'Up to 4 custom pages',
      'Mobile-first responsive layouts',
      'Content management handover',
      'Performance & accessibility pass',
      '3 rounds of revisions',  
    ],
    featured: true,
  },
  {
    name: 'Custom Web App',
    subject: 'Custom Web App — Request a meeting',
    price: "Request a Meeting",
    cadence: 'quoted per project',
    summary:
      'Built entirely around your requirements. We start with a discovery call to map out your workflow, then scope and quote a solution — dashboards, booking systems, internal tools — that fits how your business actually runs.',
    features: [
      'Project proposal first, then a quote',
      'Scoping & requirements workshop',
      'Database and API integration',
      'User authentication',
      'Admin dashboard',
      'Ongoing support options',
    ],
  },
]

// Carries the chosen plan to the home page's contact form, which reads the
// `subject` param and seeds its Subject field with it. Query goes before the
// hash so the browser still scrolls to #contact on arrival.
const contactHref = (subject: string) =>
  `/?subject=${encodeURIComponent(subject)}#contact`

export default function WebSolutionPricing() {
  return (
    <div className="app">
      <Header />

      <main className="websolutions" id="WebSolutions">
        <Background />

        <div className="ws-panel">
          <header className="ws-header">
            <p className="ws-label">Web Solutions</p>
            <h1 className="ws-title">Websites built to fit what you actually need</h1>
            <p className="ws-subtitle">
              Pick the package that matches your stage. Every project includes clean,
              responsive code, a handover walkthrough, and a site you can keep growing.
            </p>
          </header>

          <div className="ws-grid">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`ws-card${plan.featured ? ' ws-card--featured' : ''}`}
              >
                {plan.featured && <span className="ws-badge">Most popular</span>}
                <h2 className="ws-card-name">{plan.name}</h2>
                <p className="ws-card-cadence">{plan.cadence}</p>
                <p className="ws-card-price">{plan.price}</p>
                <p className="ws-card-summary">{plan.summary}</p>

                <ul className="ws-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check className="ws-check" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Plain anchor, not <Link>: the browser needs to load "/" and
                    scroll to the hash, which client-side routing won't do. */}
                <Link className="ws-cta" to={contactHref(plan.subject)}>
                  Get started
                </Link>
              </article>
            ))}
          </div>

          <p className="ws-note">
            Need something in between? <SectionLink id="contact">Send me a message</SectionLink> and
            we&apos;ll scope it together.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

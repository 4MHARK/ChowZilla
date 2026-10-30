import { ArrowUp, Utensils } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { CONTACT_EMAIL } from '../config'

const Footer = () => {
  const { pathname } = useLocation()
  const homeHashLink = (hash: string, label: string) => pathname === '/'
    ? <a href={`#${hash}`}>{label}</a>
    : <Link to={`/#${hash}`}>{label}</Link>

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <Link className="brand footer-brand" to="/" aria-label="ChowZilla home" onClick={() => { if (pathname === '/') scrollToTop() }}>
            <span className="brand-mark"><Utensils size={20} strokeWidth={2.5} /></span>
            <span>Chow<span className="brand-accent">Zilla</span></span>
          </Link>
          <p>Good food, made easier to find.</p>
          <a className="footer-contact" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="footer-links-column">
          <h3>Explore</h3>
          {homeHashLink('featured-restaurants', 'Restaurants')}
          {homeHashLink('how-it-works', 'How it works')}
          {homeHashLink('faqs', 'FAQs')}
        </div>
        <div className="footer-links-column">
          <h3>Join ChowZilla</h3>
          <Link to="/vendors">Vendors</Link>
          <Link to="/riders">Riders</Link>
        </div>
        <button className="footer-back-top" type="button" onClick={scrollToTop}>
          <ArrowUp size={14} aria-hidden="true" />
          Back to top
        </button>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ChowZilla</span>
        <span>Made for good food days.</span>
      </div>
    </footer>
  )
}

export default Footer

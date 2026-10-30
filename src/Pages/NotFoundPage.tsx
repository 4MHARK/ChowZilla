import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import SkipLink from '../Components/SkipLink'
import usePageMeta from '../hooks/usePageMeta'

const NotFoundPage = () => {
  usePageMeta(
    'Page not found — ChowZilla',
    'The page you were looking for does not exist. Head back to ChowZilla and find something delicious.',
  )

  return (
    <div className="landing-page">
      <SkipLink />
      <Navbar page="notfound" />
      <main className="not-found-main" id="main-content" tabIndex={-1}>
        <span className="section-kicker">404 — A MISSING PLATE</span>
        <h1>This plate is empty.</h1>
        <p>The page you’re looking for doesn’t exist or has moved. Let’s get you back to the good stuff.</p>
        <h2 className="sr-only">Where to go next</h2>
        <div className="not-found-actions">
          <Link className="not-found-primary" to="/">Back to home</Link>
          <Link className="not-found-secondary" to="/vendors">Partner with us</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage

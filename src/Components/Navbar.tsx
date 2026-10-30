import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from 'react'
import { Menu, Utensils, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

type NavbarPage = 'customer' | 'vendor' | 'rider' | 'notfound'

type HashAwareLinkProps = {
  href: string
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const HashAwareLink = ({ href, className, children, onClick }: HashAwareLinkProps) => {
  if (href.startsWith('#')) {
    return <a href={href} className={className} onClick={onClick}>{children}</a>
  }
  return <Link to={href} className={className} onClick={onClick}>{children}</Link>
}

const Navbar = ({ page = 'customer' }: { page?: NavbarPage }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const isCustomerPage = page === 'customer'
  const isPartnerPage = page === 'vendor' || page === 'rider'
  const orderHref = isCustomerPage ? '#order' : '/#order'
  const howHref = isCustomerPage ? '#how-it-works' : isPartnerPage ? '#partner-steps' : '/#how-it-works'
  const startHref = isPartnerPage ? '#partner-interest' : '/auth?mode=signup'
  const closeMenu = () => setMenuOpen(false)
  const handleBrandClick = () => {
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia('(min-width: 961px)')
    const closeOnDesktop = () => {
      if (desktopBreakpoint.matches) setMenuOpen(false)
    }
    desktopBreakpoint.addEventListener('change', closeOnDesktop)
    return () => desktopBreakpoint.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" to="/" aria-label="ChowZilla home" onClick={handleBrandClick}>
        <span className="brand-mark"><Utensils size={21} strokeWidth={2.5} /></span>
        <span>Chow<span className="brand-accent">Zilla</span></span>
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        <HashAwareLink href={orderHref}>Order food</HashAwareLink>
        <HashAwareLink href={howHref}>How it works</HashAwareLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} to="/vendors">Vendors</NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} to="/riders">Rider</NavLink>
      </nav>

      <div className="header-actions">
        <Link className="sign-in-link" to="/auth?mode=signin">Sign in</Link>
        <HashAwareLink className="header-cta" href={startHref}>Get started</HashAwareLink>
      </div>

      <ThemeToggle />
      <button className="mobile-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls={menuOpen ? 'mobile-navigation' : undefined} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
          <HashAwareLink href={orderHref} onClick={closeMenu}>Order food</HashAwareLink>
          <HashAwareLink href={howHref} onClick={closeMenu}>How it works</HashAwareLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} to="/vendors" onClick={closeMenu}>Vendors</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} to="/riders" onClick={closeMenu}>Rider</NavLink>
          <Link to="/auth?mode=signin" onClick={closeMenu}>Sign in</Link>
          <HashAwareLink className="mobile-nav-cta" href={startHref} onClick={closeMenu}>Get started</HashAwareLink>
        </nav>
      )}
    </header>
  )
}

export default Navbar

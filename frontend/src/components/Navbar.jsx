import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// Actual navbar component for non-landing pages
const Navbar = () => {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(true)
  const lastScrollYRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (Math.abs(currentScrollY - lastScrollYRef.current) > 5) {
            if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
              setShowNavbar(false)
            } else {
              setShowNavbar(true)
            }
            lastScrollYRef.current = currentScrollY
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't render on landing page (it has its own navbar)
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-deep-purple/30 border-b border-gold/20 shadow-lg transition-transform duration-300 will-change-transform ${
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 lg:px-8 lg:py-4 w-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3">
            <img src="/images/logo.png" alt="Krushnalaya" className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] lg:w-12 lg:h-12" />
            <span className="font-mystical text-base text-gold lg:text-xl">Krushnalaya</span>
          </Link>
          
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link to="/#home" className="text-gray-300 hover:text-gold transition-colors text-xs font-medium lg:text-base">Home</Link>
            <Link to="/#services" className="text-gray-300 hover:text-gold transition-colors text-xs font-medium lg:text-base">Services</Link>
            <Link to="/#book" className="text-gray-300 hover:text-gold transition-colors text-xs font-medium lg:text-base">Book</Link>
            <Link to="/#contact" className="text-gray-300 hover:text-gold transition-colors text-xs font-medium lg:text-base">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
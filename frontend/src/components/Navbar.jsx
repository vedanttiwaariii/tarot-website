import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNavbar, setShowNavbar] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollYRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          setScrolled(currentScrollY > 50)
          
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const isLandingPage = location.pathname === '/'

  return (
    <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    } ${
      scrolled 
        ? 'backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border-b border-gold/30 shadow-lg shadow-gold/10' 
        : 'backdrop-blur-md bg-gradient-to-br from-deep-purple/20 to-midnight-blue/10 border-b border-gold/20'
    }`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault()
                scrollToSection('home')
              }
            }}
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="/images/logo.png" 
                alt="Krushnalaya" 
                className="w-12 h-12 rounded-full transition-all duration-300 group-hover:scale-110 relative z-10 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              />
            </div>
            <span className="font-mystical text-2xl text-gold group-hover:text-aqua transition-colors duration-300">
              Krushnalaya
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <NavLink 
              onClick={() => isLandingPage ? scrollToSection('home') : null}
              to={isLandingPage ? '#home' : '/#home'}
              label="Home"
              icon="🏠"
            />
            <NavLink 
              onClick={() => isLandingPage ? scrollToSection('services') : null}
              to={isLandingPage ? '#services' : '/#services'}
              label="Services"
              icon="✨"
            />
            <NavLink 
              onClick={() => isLandingPage ? scrollToSection('book') : null}
              to={isLandingPage ? '#book' : '/#book'}
              label="Book"
              icon="📅"
            />
            <NavLink 
              onClick={() => isLandingPage ? scrollToSection('contact') : null}
              to={isLandingPage ? '#contact' : '/#contact'}
              label="Contact"
              icon="💬"
            />
            
            {/* Manage Booking Button */}
            <button
              onClick={() => navigate('/manage-booking')}
              className="ml-4 px-5 py-2.5 bg-gradient-to-r from-gold/20 to-aqua/20 border border-gold/40 text-gold font-semibold rounded-full hover:from-gold/30 hover:to-aqua/30 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 text-sm flex items-center gap-2 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">🔍</span>
              <span>Manage Booking</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ to, label, icon, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === '/' && location.hash === to.replace('/', '')
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2.5 font-medium text-sm group overflow-hidden rounded-xl transition-all duration-300 ${
        isActive ? 'text-gold' : 'text-gray-300'
      }`}
    >
      {/* Glass background on hover */}
      <span className="absolute inset-0 bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
      
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        <span className="text-base group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="group-hover:text-gold transition-colors duration-300">{label}</span>
      </span>
      
      {/* Bottom glow */}
      <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 ${
        isActive ? 'w-full left-0' : 'w-0 group-hover:w-full group-hover:left-0'
      }`}></span>
    </Link>
  )
}

export default Navbar
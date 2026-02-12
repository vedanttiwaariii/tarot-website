import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ShinyText from './ShinyText'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navItems = [
    { name: 'Home', path: '#home' },
    { name: 'Services', path: '#services' },
    { name: 'About', path: '#about' },
    { name: 'Book Appointment', path: '#book' },
    { name: 'Contact', path: '#contact' },
    { name: 'Manage Booking', path: '/manage-booking', isRoute: true }
  ]

  const whatsappNumber = "+919893578135"

  const scrollToSection = (sectionId) => {
    if (sectionId.startsWith('#')) {
      const element = document.querySelector(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="bg-cosmic-blue/95 backdrop-blur-md border-b border-gold/20 fixed top-0 z-50 w-full"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 max-w-7xl mx-auto">
          {/* Left spacer for mobile */}
          <div className="w-8 md:hidden"></div>
          
          {/* Centered Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-aqua rounded-full animate-glow"></div>
              <ShinyText
                text="KRUSHNALAYA"
                speed={3}
                color="#FFD700"
                shineColor="#FFFFFF"
                spread={120}
                direction="left"
                className="font-mystical text-xl font-semibold whitespace-nowrap"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="transition-colors duration-300 text-white hover:text-gold"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    if (isHomePage) {
                      scrollToSection(item.path)
                    } else {
                      window.location.href = '/' + item.path
                    }
                  }}
                  className="transition-colors duration-300 text-white hover:text-gold"
                >
                  {item.name}
                </button>
              )
            ))}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              WhatsApp Now
            </a>
          </div>

          {/* Mobile Menu Button - Hidden on mobile, replaced by bottom nav */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden text-white hover:text-gold transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Hidden, replaced by bottom nav */}
        {false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gold/20"
          >
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 transition-colors duration-300 text-white hover:text-gold"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    if (isHomePage) {
                      scrollToSection(item.path)
                    } else {
                      window.location.href = '/' + item.path
                    }
                    setIsOpen(false)
                  }}
                  className="block py-2 transition-colors duration-300 text-white hover:text-gold text-left"
                >
                  {item.name}
                </button>
              )
            ))}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm mt-4 inline-block"
            >
              WhatsApp Now
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const MobileBottomNav = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.querySelector(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = '/' + sectionId
    }
  }

  const moreItems = [
    { name: 'About', path: '#about', isRoute: false },
    { name: 'Contact', path: '#contact', isRoute: false },
    { name: 'Manage Booking', path: '/manage-booking', isRoute: true }
  ]

  return (
    <>
      {/* Bottom Navigation - Mobile and Tablet */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="mx-4 mb-4 md:mx-6 md:mb-6">
          <div className="bg-cosmic-blue/80 backdrop-blur-md border border-gold/20 rounded-2xl px-4 py-3 md:px-6 md:py-4">
            <div className="flex justify-around items-center max-w-md mx-auto md:max-w-lg">
              <button
                onClick={() => isHomePage ? scrollToSection('#home') : window.location.href = '/'}
                className="flex flex-col items-center space-y-1 text-white hover:text-gold transition-colors p-2 md:p-3"
              >
                <div className="text-xl md:text-2xl">🏠</div>
                <span className="text-xs md:text-sm">Home</span>
              </button>

              {/* Services */}
              <button
                onClick={() => scrollToSection('#services')}
                className="flex flex-col items-center space-y-1 text-white hover:text-gold transition-colors p-2 md:p-3"
              >
                <div className="text-xl md:text-2xl">🔮</div>
                <span className="text-xs md:text-sm">Services</span>
              </button>

              {/* Book */}
              <button
                onClick={() => scrollToSection('#book')}
                className="flex flex-col items-center space-y-1 text-white hover:text-gold transition-colors p-2 md:p-3"
              >
                <div className="text-xl md:text-2xl">📅</div>
                <span className="text-xs md:text-sm">Book</span>
              </button>

              {/* WhatsApp */}
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-1 text-white hover:text-gold transition-colors p-2 md:p-3"
              >
                <div className="text-xl md:text-2xl">💬</div>
                <span className="text-xs md:text-sm">WhatsApp</span>
              </a>

              {/* More */}
              <button
                onClick={() => setShowMoreSheet(true)}
                className="flex flex-col items-center space-y-1 text-white hover:text-gold transition-colors p-2 md:p-3"
              >
                <div className="text-xl md:text-2xl">⋯</div>
                <span className="text-xs md:text-sm">More</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* More Bottom Sheet */}
      <AnimatePresence>
        {showMoreSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreSheet(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
            >
              <div className="bg-cosmic-blue/95 backdrop-blur-md border-t border-gold/20 rounded-t-3xl p-6 mx-4 md:mx-8 max-w-md md:max-w-lg mx-auto">
                <div className="w-12 h-1 bg-gold/50 rounded-full mx-auto mb-6"></div>
                
                <h3 className="text-gold font-semibold text-lg mb-4 text-center">More Options</h3>
                
                <div className="space-y-4">
                  {moreItems.map((item) => (
                    item.isRoute ? (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setShowMoreSheet(false)}
                        className="block w-full text-left p-4 text-white hover:text-gold hover:bg-deep-purple/20 rounded-lg transition-colors"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        key={item.name}
                        onClick={() => {
                          scrollToSection(item.path)
                          setShowMoreSheet(false)
                        }}
                        className="block w-full text-left p-4 text-white hover:text-gold hover:bg-deep-purple/20 rounded-lg transition-colors"
                      >
                        {item.name}
                      </button>
                    )
                  ))}
                </div>
                
                <button
                  onClick={() => setShowMoreSheet(false)}
                  className="w-full mt-6 p-4 bg-deep-purple/30 text-white rounded-lg hover:bg-deep-purple/50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileBottomNav
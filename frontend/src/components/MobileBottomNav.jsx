import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

const MobileBottomNav = () => {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)
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

  const navItems = [
    { name: t('navHome'), icon: '🏠', action: () => isHomePage ? scrollToSection('#home') : window.location.href = '/', isExternal: false },
    { name: t('navBook'), icon: '📅', action: () => scrollToSection('#book'), isExternal: false },
    { name: t('navManageBooking'), icon: '📋', action: '/manage-booking', isRoute: true },
    { name: 'WhatsApp', icon: '💬', action: 'https://wa.me/919893578135', isExternal: true }
  ]

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="mx-4 mb-3 md:mx-6 md:mb-4">
        <div className="bg-cosmic-blue/80 backdrop-blur-md border border-gold/20 rounded-2xl px-1 py-2 md:px-2 md:py-2.5 overflow-hidden">
          <div 
            className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {navItems.map((item) => {
              if (item.isExternal) {
                return (
                  <a
                    key={item.name}
                    href={item.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center space-y-0.5 text-white hover:text-gold transition-colors p-1.5 md:p-2 min-w-[60px] md:min-w-[68px] flex-shrink-0"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="text-lg md:text-xl">{item.icon}</div>
                    <span className="text-[10px] md:text-xs whitespace-nowrap">{item.name}</span>
                  </a>
                )
              }
              
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    to={item.action}
                    className="flex flex-col items-center justify-center space-y-0.5 text-white hover:text-gold transition-colors p-1.5 md:p-2 min-w-[60px] md:min-w-[68px] flex-shrink-0"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="text-lg md:text-xl">{item.icon}</div>
                    <span className="text-[10px] md:text-xs whitespace-nowrap">{item.name}</span>
                  </Link>
                )
              }
              
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center space-y-0.5 text-white hover:text-gold transition-colors p-1.5 md:p-2 min-w-[60px] md:min-w-[68px] flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="text-lg md:text-xl">{item.icon}</div>
                  <span className="text-[10px] md:text-xs whitespace-nowrap">{item.name}</span>
                </button>
              )
            })}
            
            {/* Language Switcher */}
            <div className="flex items-center justify-center p-1.5 md:p-2 min-w-[60px] md:min-w-[68px] flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MobileBottomNav
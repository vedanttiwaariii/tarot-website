import { useState, useEffect } from 'react'

const BottomNav = () => {
  const [activeSection, setActiveSection] = useState('home')

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'services', icon: '✨', label: 'Services' },
    { id: 'book', icon: '📅', label: 'Book' },
    { id: 'contact', icon: '💬', label: 'Contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'book', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-deep-purple/90 border-t border-gold/20 pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-all duration-300 ${
              activeSection === item.id
                ? 'text-gold scale-110'
                : 'text-gray-400'
            }`}
          >
            <span className={`text-2xl mb-1 ${activeSection === item.id ? 'drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav

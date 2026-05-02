import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('lang')
    
    if (savedLang) {
      setLanguage(savedLang)
      setShowModal(false)
    } else {
      const browserLang = navigator.language || navigator.userLanguage
      const detectedLang = browserLang.startsWith('hi') ? 'hi' : 'en'
      setLanguage(detectedLang)
      setShowModal(true)
    }
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('lang', lang)
    setShowModal(false)
    document.documentElement.lang = lang
  }

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, showModal, setShowModal }}>
      {children}
    </LanguageContext.Provider>
  )
}

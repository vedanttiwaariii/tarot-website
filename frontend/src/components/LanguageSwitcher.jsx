import { useLanguage } from '../context/LanguageContext'

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage()

  return (
    <button
      onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
      className="relative px-4 py-2 backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/40 rounded-full hover:border-gold/60 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <div className="relative z-10 flex items-center gap-2">
        <span className="text-gold font-semibold text-sm group-hover:scale-110 transition-transform duration-300">
          {language === 'en' ? 'EN' : 'हिं'}
        </span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="text-gray-400 font-medium text-sm group-hover:text-gold transition-colors duration-300">
          {language === 'en' ? 'हिं' : 'EN'}
        </span>
      </div>
    </button>
  )
}

export default LanguageSwitcher

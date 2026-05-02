import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const LanguageModal = () => {
  const { showModal, changeLanguage, t } = useLanguage()

  if (!showModal) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cosmic-blue/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border border-gold/30 rounded-3xl p-8 shadow-2xl shadow-gold/20"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gold/20 rounded-full blur-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-aqua/20 border-2 border-gold/40 flex items-center justify-center shadow-lg shadow-gold/30">
                <span className="text-4xl">🌏</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-mystical text-3xl text-gold text-center mb-2">
              {t('langModalTitle')}
            </h2>
            <p className="text-aqua text-center text-lg mb-8">
              {t('langModalSubtitle')}
            </p>

            {/* Language Options */}
            <div className="space-y-4">
              <button
                onClick={() => changeLanguage('en')}
                className="w-full group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border-2 border-gold/40 rounded-2xl p-5 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🇬🇧</span>
                    <span className="text-white font-semibold text-xl">English</span>
                  </div>
                  <span className="text-gold text-2xl group-hover:scale-110 transition-transform duration-300">→</span>
                </div>
              </button>

              <button
                onClick={() => changeLanguage('hi')}
                className="w-full group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border-2 border-gold/40 rounded-2xl p-5 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🇮🇳</span>
                    <span className="text-white font-semibold text-xl">हिन्दी</span>
                  </div>
                  <span className="text-gold text-2xl group-hover:scale-110 transition-transform duration-300">→</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageModal

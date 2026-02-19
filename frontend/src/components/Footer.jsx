import { useLocation } from 'react-router-dom'

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+919893578135"

  return (
    <footer className="bg-cosmic-blue border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/images/logo.png" alt="Krushnalaya" className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              <span className="font-mystical text-xl font-semibold text-gradient">
                Krushnalaya
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover your spiritual path through ancient wisdom and modern healing practices. 
              Professional Tarot Reading, Reiki Healing, and Water Divination services.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-aqua transition-colors"
              >
                WhatsApp
              </a>
              <a href="mailto:rajshreepandetiwari@gmail.com" className="text-gold hover:text-aqua transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2026 Krushnalaya. All rights reserved. | Designed with ✨ for spiritual seekers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { useLocation } from 'react-router-dom'

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+919893578135"

  return (
    <footer className="bg-cosmic-blue border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
        <div className="max-w-2xl mx-auto lg:max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3 lg:space-x-3 lg:mb-4">
              <img src="/images/logo.png" alt="Krushnalaya" className="w-7 h-7 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] lg:w-10 lg:h-10" />
              <span className="font-mystical text-lg font-semibold text-gradient lg:text-2xl">
                Krushnalaya
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3 lg:text-base lg:mb-5">
              Discover your spiritual path through ancient wisdom and modern healing practices.
            </p>
            <div className="flex justify-center space-x-4 text-sm lg:space-x-6 lg:text-base">
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

        <div className="border-t border-gold/20 mt-6 pt-6 text-center lg:mt-8 lg:pt-8">
          <p className="text-gray-300 text-xs lg:text-sm">
            © 2026 Krushnalaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
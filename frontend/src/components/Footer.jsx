const Footer = () => {
  const whatsappNumber = "+919893578135"

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-cosmic-blue border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-aqua rounded-full animate-glow"></div>
              <span className="font-mystical text-xl font-semibold text-gradient">
                Krushnalaya
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover your spiritual path through ancient wisdom and modern healing practices. 
              Professional Tarot Reading, Reiki Healing, and Water Divination services.
            </p>
            <div className="flex space-x-4">
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

          <div>
            <h3 className="font-semibold text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="text-gray-300 hover:text-gold transition-colors">Home</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="text-gray-300 hover:text-gold transition-colors">Services</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="text-gray-300 hover:text-gold transition-colors">About</a></li>
              <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollToSection('#book'); }} className="text-gray-300 hover:text-gold transition-colors">Book Appointment</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="text-gray-300 hover:text-gold transition-colors">Contact</a></li>
              <li><a href="/disclaimer" className="text-gray-300 hover:text-gold transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Tarot Reading</li>
              <li className="text-gray-300">Reiki Healing</li>
              <li className="text-gray-300">Water Divination</li>
              <li className="text-gray-300">Spiritual Guidance</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Krushnalaya. All rights reserved. | Designed with ✨ for spiritual seekers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
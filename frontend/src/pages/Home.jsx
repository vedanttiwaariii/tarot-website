import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-deep-purple/20 to-midnight-blue/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-mystical text-4xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl">
              When life feels uncertain, clarity begins within.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Through Tarot Reading, Reiki Healing, and Jal Jyotishi, we help you understand what's blocking you — and how to move forward with confidence.
            </p>
            <Link to="/book" className="btn-primary text-lg px-12 py-4">
              Begin Your Guidance Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-12"></div>
            <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-8">
              A Sacred Space for Guidance & Healing
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>
                Mystic Guidance is a spiritual practice rooted in ancient wisdom and mindful healing.
              </p>
              <p>
                We combine intuitive tarot insights, energy-based Reiki healing, and traditional Jal Jyotishi to help individuals find clarity during moments of confusion, emotional imbalance, and life transition.
              </p>
              <p>
                Our sessions are not about predicting fate — they are about understanding energy, intention, and direction.
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-12"></div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-12">
              What We Offer
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Tarot Reading",
                icon: "🔮",
                description: "Gain clarity about relationships, career, decisions, and emotional patterns through intuitive tarot guidance."
              },
              {
                title: "Reiki Healing",
                icon: "🙏",
                description: "Release emotional blocks, restore energy flow, and bring balance to mind and body."
              },
              {
                title: "Jal Jyotishi",
                icon: "💧",
                description: "An ancient water-divination practice offering deep spiritual insight and energetic purification."
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-deep-purple/20 to-midnight-blue/20 backdrop-blur-sm border border-gold/20 rounded-xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-mystical text-xl font-bold text-gold mb-4">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How This Helps You Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-deep-purple/10 to-midnight-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-12">
              Guidance for Real-Life Questions
            </h2>
            <div className="text-left max-w-2xl mx-auto">
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Feeling stuck or confused about decisions
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Emotional heaviness or anxiety
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Relationship uncertainty
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Career or financial crossroads
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Lack of peace or direction
                </li>
              </ul>
            </div>
            <p className="text-lg text-gray-300 mt-12 italic">
              Our sessions help you understand why things feel blocked — and how to move forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Snapshot Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-12">
              Services Snapshot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="text-gray-300 text-lg">
                <span className="text-gold">•</span> Tarot Reading (30–60 minutes)
              </div>
              <div className="text-gray-300 text-lg">
                <span className="text-gold">•</span> Reiki Healing (Energy balancing)
              </div>
              <div className="text-gray-300 text-lg">
                <span className="text-gold">•</span> Jal Jyotishi (Traditional water guidance)
              </div>
              <div className="text-gray-300 text-lg">
                <span className="text-gold">•</span> Online & In-person sessions available
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-deep-purple/10 to-midnight-blue/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "⭐", text: "10+ years of spiritual practice" },
              { icon: "🌟", text: "500+ guidance sessions conducted" },
              { icon: "🔮", text: "Ancient and modern healing integration" },
              { icon: "🤝", text: "Confidential and judgment-free space" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <p className="text-gray-300">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-12">
              Ready to receive guidance meant for you?
            </h2>
            <Link to="/book" className="btn-primary text-lg px-12 py-4 mb-8 inline-block">
              Book Your Session
            </Link>
            <p className="text-gray-400">
              Prefer instant assistance?{' '}
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aqua hover:text-gold transition-colors underline"
              >
                Chat with us on WhatsApp.
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
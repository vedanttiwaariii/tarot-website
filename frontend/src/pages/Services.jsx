import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'

const Services = () => {
  const services = [
    {
      title: "Tarot Reading",
      description: "Unlock the mysteries of your future with ancient tarot wisdom. Our comprehensive tarot readings provide deep insights into your life's journey, relationships, career, and spiritual path.",
      icon: "🔮",
      price: "$75",
      features: [
        "30-minute detailed session",
        "Professional card interpretation",
        "Written summary provided",
        "Follow-up guidance included",
        "Past, present, future insights",
        "Relationship & career guidance"
      ]
    },
    {
      title: "Reiki Healing",
      description: "Restore balance and harmony through universal life energy. Experience deep relaxation and healing as we work to align your chakras and clear energy blockages.",
      icon: "🙏",
      price: "$90",
      features: [
        "60-minute healing session",
        "Full body energy cleansing",
        "Chakra balancing & alignment",
        "Stress relief techniques",
        "Emotional healing support",
        "Personalized aftercare advice"
      ]
    },
    {
      title: "Water Divination (Jal Jyotishi)",
      description: "Ancient water divination techniques passed down through generations. Discover hidden truths and receive spiritual guidance through the sacred element of water.",
      icon: "💧",
      price: "$65",
      features: [
        "Traditional Jal Jyotishi methods",
        "Personal spiritual guidance",
        "Energy cleansing rituals",
        "Life path clarity",
        "Ancestral wisdom connection",
        "Sacred water blessings"
      ]
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-mystical text-5xl md:text-6xl font-bold text-gradient mb-6">
            Sacred Services
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Discover our range of spiritual services designed to guide you on your journey of 
            self-discovery, healing, and enlightenment. Each service is tailored to meet your 
            unique spiritual needs.
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>

        {/* Service Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card-mystical mb-20"
        >
          <h2 className="font-mystical text-3xl font-bold text-center text-gradient mb-8">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-semibold text-gold mb-2">1. Book</h3>
              <p className="text-gray-300 text-sm">Schedule your session online or via WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-gold mb-2">2. Prepare</h3>
              <p className="text-gray-300 text-sm">Receive preparation guidelines and set intentions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-gold mb-2">3. Experience</h3>
              <p className="text-gray-300 text-sm">Enjoy your personalized spiritual session</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-semibold text-gold mb-2">4. Integrate</h3>
              <p className="text-gray-300 text-sm">Receive guidance for integrating insights</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-mystical text-3xl md:text-4xl font-bold text-gradient mb-8">
            Ready to Begin Your Spiritual Journey?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn-primary text-lg px-12 py-4">
              Book Your Session
            </Link>
            <a
              href="https://wa.me/+1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-12 py-4"
            >
              WhatsApp Now
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Services
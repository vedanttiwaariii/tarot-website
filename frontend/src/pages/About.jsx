import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const About = () => {
  const qualifications = [
    "Certified Tarot Reader with 10+ years experience",
    "Reiki Master Teacher (Usui & Karuna)",
    "Traditional Jal Jyotishi practitioner",
    "Certified Crystal Healing Therapist",
    "Meditation & Mindfulness Instructor"
  ]

  const values = [
    {
      title: "Authenticity",
      description: "Genuine spiritual guidance rooted in ancient wisdom",
      icon: "🌟"
    },
    {
      title: "Compassion",
      description: "Caring support for your spiritual journey",
      icon: "💖"
    },
    {
      title: "Integrity",
      description: "Honest and ethical spiritual practices",
      icon: "⚖️"
    },
    {
      title: "Empowerment",
      description: "Helping you discover your inner strength",
      icon: "💪"
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
            About the Practice
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Welcome to a sacred space where ancient wisdom meets modern healing. 
            Discover the journey that led to this spiritual practice.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-mystical"
          >
            <h2 className="font-mystical text-3xl font-bold text-gradient mb-6">My Journey</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                My spiritual journey began over a decade ago when I first encountered the mystical 
                world of tarot cards. What started as curiosity evolved into a deep calling to help 
                others navigate their spiritual paths.
              </p>
              <p>
                Through years of study and practice, I've mastered multiple healing modalities, 
                including traditional Reiki healing and the ancient art of Jal Jyotishi (water divination) 
                passed down through generations of spiritual practitioners.
              </p>
              <p>
                Today, I combine these sacred practices to offer comprehensive spiritual guidance, 
                helping individuals find clarity, healing, and purpose in their lives.
              </p>
            </div>
          </motion.div>

          {/* Qualifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-mystical"
          >
            <h2 className="font-mystical text-3xl font-bold text-gradient mb-6">Qualifications</h2>
            <ul className="space-y-3">
              {qualifications.map((qualification, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-gold mr-3 mt-1">✨</span>
                  {qualification}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
              <p className="text-gold font-semibold mb-2">Continuous Learning</p>
              <p className="text-gray-300 text-sm">
                I regularly attend workshops and retreats to deepen my practice and 
                stay connected with the evolving world of spiritual healing.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="font-mystical text-4xl font-bold text-center text-gradient mb-12">
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-mystical text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-gold mb-3">{value.title}</h3>
                <p className="text-gray-300 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card-mystical mb-20"
        >
          <h2 className="font-mystical text-3xl font-bold text-center text-gradient mb-6">
            My Philosophy
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-300 mb-6">
              "Every soul carries within it the wisdom it seeks. My role is not to provide all the answers, 
              but to help you discover the profound truths that already exist within you."
            </p>
            <p className="text-gray-300">
              I believe that spiritual healing is a collaborative journey. Through compassionate guidance 
              and ancient wisdom, we work together to unlock your inner potential and create positive 
              transformation in your life.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-mystical text-4xl font-bold text-gradient mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Take the first step towards spiritual enlightenment and personal transformation.
          </p>
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
              WhatsApp Chat
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
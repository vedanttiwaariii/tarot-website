import { motion } from 'framer-motion'
import ShinyText from '../components/ShinyText'

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-blue via-deep-purple to-midnight-blue py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-mystical text-5xl md:text-6xl font-bold text-gradient mb-6">
            Disclaimer
          </h1>
          <p className="text-xl text-gray-300">
            Important information about our services at{' '}
            <ShinyText
              text="Krushnalaya"
              speed={3}
              color="#FFD700"
              shineColor="#FFFFFF"
              spread={120}
              direction="left"
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-mystical"
        >
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">General Information</h2>
              <p>
                The services offered at Krushnalaya, including Tarot Reading, Reiki Healing, and Jal Jyotishi (Water Divination), 
                are provided for guidance, insight, and traditional practices. These services are intended to support your personal 
                journey of self-discovery and spiritual growth.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Not Professional Advice</h2>
              <p>
                Our services are not a substitute for professional advice of any kind, including but not limited to medical, 
                psychological, legal, financial, engineering, or other professional consultation. If you require professional 
                advice, please consult with qualified professionals in the relevant field.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Individual Results</h2>
              <p>
                Results and experiences may vary significantly from person to person. Each individual's journey is unique, 
                and what works for one person may not work for another. We make no claims about specific outcomes or results 
                from our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Personal Responsibility</h2>
              <p>
                All decisions and actions taken based on the guidance, insights, or information received through our services 
                are entirely your responsibility. You are encouraged to use your own judgment and discretion when making 
                important life decisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Traditional Practices</h2>
              <p>
                Our services are based on traditional spiritual and cultural practices that have been passed down through 
                generations. These practices are offered with respect for their cultural heritage and are intended to provide 
                insight and guidance within their traditional context.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Limitation of Liability</h2>
              <p>
                By using our services, you acknowledge that you understand and accept the nature of the services provided. 
                Krushnalaya and its practitioners shall not be held liable for any decisions, actions, or outcomes resulting 
                from the use of our services.
              </p>
            </div>

            <div className="bg-gold/10 border border-gold/20 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gold mb-3">Agreement</h3>
              <p>
                By booking and using our services, you acknowledge that you have read, understood, and agree to this disclaimer. 
                You confirm that you are seeking our services for guidance and insight, and that you will make your own informed 
                decisions based on the information provided.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/"
            className="btn-primary text-lg px-8 py-3"
          >
            Return to Home
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default Disclaimer
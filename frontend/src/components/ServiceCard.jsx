import { motion } from 'framer-motion'
import { useState } from 'react'

const ServiceCard = ({ title, description, icon, price, features }) => {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="card-mystical h-full"
    >
      <div className="text-center mb-4 md:mb-6">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4 animate-float">{icon}</div>
        <h3 className="font-mystical text-xl md:text-2xl font-semibold text-gold mb-2">{title}</h3>
        <div className="text-2xl md:text-3xl font-bold text-gradient mb-3 md:mb-4">{price}</div>
        
        {/* Mobile: Short intro + View details */}
        <div className="md:hidden">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {description.split('.')[0]}.
          </p>
          {!showDetails && (
            <button 
              onClick={() => setShowDetails(true)}
              className="text-gold text-sm hover:text-yellow-300 transition-colors"
            >
              View details →
            </button>
          )}
        </div>
        
        {/* Desktop: Full description */}
        <p className="hidden md:block text-gray-300 mb-4">{description}</p>
      </div>
      
      {/* Mobile: Expandable features */}
      <div className="md:hidden">
        <ul className="space-y-2">
          {features.slice(0, showDetails ? features.length : 3).map((feature, index) => (
            <li key={index} className="flex items-start text-gray-300 text-sm leading-relaxed">
              <span className="text-gold mr-2 mt-0.5 text-xs">✨</span>
              {feature}
            </li>
          ))}
        </ul>
        {showDetails && features.length > 3 && (
          <button 
            onClick={() => setShowDetails(false)}
            className="text-gold text-sm hover:text-yellow-300 transition-colors mt-3"
          >
            Show less ←
          </button>
        )}
      </div>
      
      {/* Desktop: All features */}
      <ul className="hidden md:block space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <span className="text-gold mr-2">✨</span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default ServiceCard
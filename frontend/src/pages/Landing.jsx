import { motion, AnimatePresence } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'
import ShinyText from '../components/ShinyText'
import PriceDisplay from '../components/PriceDisplay'
import { lazy, Suspense, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import axios from 'axios'
import BookingForm from '../components/booking/BookingForm'
import { usePricing } from '../hooks/usePricing'

const Threads = lazy(() => import('../components/Threads'))


const Landing = () => {
  const pricing = usePricing()
  const [content, setContent] = useState({
    'hero-title': 'Krushnalaya',
    'hero-tagline': 'KNOW · HEAL · GROW',
    'hero-description': 'When life feels uncertain, clarity begins within. Discover your direction through spiritual guidance.',
    'about-journey': 'The seeds were always within me. Through years of study in tarot, energy healing, and ancient wisdom traditions, I discovered that true knowledge comes from quiet moments of connection. When this journey led me to understand myself, I felt called to help others discover their inner clarity.'
  })
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [allCardsExpanded, setAllCardsExpanded] = useState(false)
  const [expandedCards, setExpandedCards] = useState({ tarot: false, reiki: false, jal: false })
  const [isBooking, setIsBooking] = useState(false)
  const [lockedPricing, setLockedPricing] = useState(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content')
        setContent(prev => ({ ...prev, ...response.data.data }))
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services')
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setServicesLoading(false)
      }
    }
    fetchContent()
    fetchServices()
  }, [])

  // Smart polling - only when NOT booking
  useEffect(() => {
    if (isBooking) return // Don't poll during booking

    const checkForUpdates = async () => {
      try {
        const [pricingRes, contentRes] = await Promise.all([
          axios.get('/api/pricing'),
          axios.get('/api/content')
        ])
        
        // Check if pricing changed
        if (pricingRes.data?.data && Array.isArray(pricingRes.data.data)) {
          const newPricing = {}
          pricingRes.data.data.forEach(item => {
            newPricing[item.serviceId] = item.price
          })
          
          const currentPricing = {
            tarot: pricing.tarot?.price,
            reiki: pricing.reiki?.price,
            'water-divination': pricing['water-divination']?.price
          }
          
          if (JSON.stringify(newPricing) !== JSON.stringify(currentPricing)) {
            setUpdateAvailable(true)
          }
        }
      } catch (error) {
        console.error('Error checking updates:', error)
      }
    }

    const interval = setInterval(checkForUpdates, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [isBooking, pricing])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleBookingStart = () => {
    setIsBooking(true)
    setLockedPricing(pricing)
  }

  const handleBookingComplete = () => {
    setIsBooking(false)
    setLockedPricing(null)
    if (updateAvailable) {
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [contactSubmitMessage, setContactSubmitMessage] = useState('')
  const { 
    register: registerContact, 
    handleSubmit: handleContactSubmit, 
    formState: { errors: contactErrors }, 
    reset: resetContact 
  } = useForm({
    mode: 'onSubmit'
  })

  // Mobile contact form state (separate instance)
  const [isMobileContactSubmitting, setIsMobileContactSubmitting] = useState(false)
  const [mobileContactSubmitMessage, setMobileContactSubmitMessage] = useState('')
  const { 
    register: registerMobileContact, 
    handleSubmit: handleMobileContactSubmit, 
    formState: { errors: mobileContactErrors }, 
    reset: resetMobileContact 
  } = useForm({
    mode: 'onSubmit'
  })

  const getServiceIcon = (serviceType) => {
    const icons = {
      'tarot': '🔮',
      'reiki': '🙏',
      'water-divination': '💧'
    }
    return icons[serviceType] || '✨'
  }

  const getServiceImage = (serviceType) => {
    const images = {
      'tarot': { bg: '/images/tarot.png', icon: '/images/tarot sti.png' },
      'reiki': { bg: '/images/reikei.png', icon: '/images/reiki sti.png' },
      'water-divination': { bg: '/images/water.png', icon: '/images/jal sti.png' }
    }
    return images[serviceType] || { bg: '', icon: '' }
  }

  const bookingServices = [
    { value: 'tarot', label: 'Tarot Reading - ₹1,100', duration: '30 min' },
    { value: 'reiki', label: 'Reiki Healing - ₹1,551', duration: '60 min' },
    { value: 'water-divination', label: 'Water Divination - ₹21,000', duration: '45 min' },
    { value: 'spiritual-consultation', label: 'Spiritual Consultation - ₹2,500', duration: '90 min' },
    { value: 'group-session', label: 'Group Session - ₹800/person', duration: '60 min' }
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ]

  const qualifications = [
    "Certified Tarot Reader with 10+ years experience",
    "Reiki Master Teacher (Usui & Karuna)",
    "Traditional Jal Jyotishi water detection specialist",
    "Certified Crystal Healing Therapist",
    "Meditation & Mindfulness Instructor",
    "MCom (Master of Commerce)",
    "LLB (Bachelor of Laws)",
    "PGDCA (Post Graduate Diploma in Computer Applications)"
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

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      details: ["rajshreepandetiwari@gmail.com", "Response within 24 hours"],
      action: "mailto:rajshreepandetiwari@gmail.com"
    },
    {
      icon: "💬",
      title: "WhatsApp",
      details: ["Instant messaging", "Quick consultations"],
      action: "https://wa.me/919893578135"
    }
  ]

  const onMobileContactSubmit = async (data) => {
    console.log('Mobile contact form submitted with data:', data)
    setIsMobileContactSubmitting(true)
    setMobileContactSubmitMessage('')
    
    try {
      const response = await api.post('/api/contact', data)
      console.log('Contact response:', response.data)
      setMobileContactSubmitMessage('Your message has been sent successfully! We will get back to you within 24 hours.')
      resetMobileContact()
    } catch (error) {
      console.error('Contact error:', error)
      if (error.response?.data?.message) {
        setMobileContactSubmitMessage(error.response.data.message)
      } else {
        setMobileContactSubmitMessage('There was an error sending your message. Please try again or contact us directly.')
      }
    } finally {
      setIsMobileContactSubmitting(false)
    }
  }

  const onContactSubmit = async (data) => {
    setIsContactSubmitting(true)
    setContactSubmitMessage('')
    
    try {
      const response = await api.post('/api/contact', data)
      setContactSubmitMessage('Your message has been sent successfully! We will get back to you within 24 hours.')
      resetContact()
    } catch (error) {
      console.error('Contact error:', error)
      if (error.response?.data?.message) {
        setContactSubmitMessage(error.response.data.message)
      } else {
        setContactSubmitMessage('There was an error sending your message. Please try again or contact us directly.')
      }
    } finally {
      setIsContactSubmitting(false)
    }
  }

  const handleServiceSelect = (service) => {
    // Scroll to booking section
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative pb-20" style={{ overscrollBehavior: 'none' }}>
      {/* Update Notification */}
      {updateAvailable && !isBooking && (
        <div className="fixed top-4 right-4 bg-gold text-cosmic-blue px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-pulse">
          <span className="text-sm font-semibold">New updates available!</span>
          <button
            onClick={handleRefresh}
            className="bg-cosmic-blue text-gold px-3 py-1 rounded text-xs font-bold hover:bg-deep-purple transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Threads Background */}
      <div className="fixed inset-0 -z-10" style={{ paddingBottom: '100px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue via-deep-purple to-midnight-blue" style={{ height: 'calc(100% + 150px)' }}></div>
        <Suspense fallback={null}>
          <Threads
            color={[1, 0.843, 0]}
            amplitude={1.2}
            distance={0.5}
            enableMouseInteraction={true}
          />
        </Suspense>
      </div>
      
      {/* HOME SECTION */}
      <section id="home" className="relative py-4 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center py-8 px-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/20 to-aqua/20 border-2 border-gold/40 flex items-center justify-center shadow-lg shadow-gold/30 overflow-hidden">
            <img src="/images/logo.png" alt="Krushnalaya" className="w-full h-full object-cover" />
          </div>
          
          <h1 className="font-mystical text-[2rem] font-bold text-gold mb-1">
            {content['hero-title']}
          </h1>
          
          <p className="text-aqua text-xs font-semibold tracking-[0.3em] mb-3">
            {content['hero-tagline']}
          </p>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            {content['hero-description']}
          </p>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-4 px-4">
        <div className="px-4 py-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="font-mystical text-[1.8rem] font-bold text-gold mb-2">
              Services
            </h2>
          </motion.div>

          {/* All Sessions Include Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-3 shadow-lg shadow-gold/10 mb-6"
          >
            <div className="flex items-center justify-around text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gold">✓</span>
                <span className="text-gray-300">Guidance</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gold">✓</span>
                <span className="text-gray-300">Follow-up</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gold">✓</span>
                <span className="text-gray-300">Support</span>
              </div>
            </div>
          </motion.div>

          {/* Service Cards - Full Width Stacked */}
          {servicesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No services available</div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => {
                const images = getServiceImage(service.serviceType)
                const expandKey = service.serviceType === 'water-divination' ? 'jal' : service.serviceType
                const isExpanded = expandedCards[expandKey]

                return (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border border-gold/30 p-4 shadow-lg shadow-gold/10 overflow-hidden relative ${
                      isExpanded ? 'rounded-3xl shadow-xl shadow-gold/20 bg-deep-purple/50' : 'rounded-2xl'
                    }`}
                  >
                    <div className="absolute inset-0 opacity-25 bg-center bg-cover" style={{ backgroundImage: `url(${images.bg})` }}></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={images.icon} alt={service.title} className="w-8 h-8 object-contain" />
                          <div>
                            <h3 className="text-white font-bold text-base leading-tight">{service.title}</h3>
                          </div>
                        </div>
                        <PriceDisplay serviceId={service.serviceType} pricing={pricing} />
                      </div>
                      
                      {!isExpanded ? (
                        <div>
                          <p className="text-gray-300 text-xs mb-2 leading-relaxed">{service.shortDescription}</p>
                          <div className="space-y-1 mb-3">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs">
                                <span className="text-gold mt-0.5">✓</span>
                                <span className="text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setExpandedCards(prev => ({ ...prev, [expandKey]: true }))}
                            className="w-full text-gold text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                          >
                            <span>View Details</span>
                            <span>▼</span>
                          </button>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                          <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                            {service.fullDescription}
                          </p>
                          <div className="space-y-1.5 mb-4">
                            {service.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs">
                                <span className="text-gold mt-0.5">✓</span>
                                <span className="text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleServiceSelect(service.serviceType)}
                            className="w-full py-2 border border-gold/40 text-gold font-medium rounded-full hover:bg-gold/10 transition-all duration-300 text-xs mb-2"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => setExpandedCards(prev => ({ ...prev, [expandKey]: false }))}
                            className="w-full text-gold text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                          >
                            <span>Show Less</span>
                            <span className="rotate-180">▼</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT MY JOURNEY SECTION */}
      <section className="px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="font-mystical text-[1.8rem] font-bold text-gold mb-2">
            About My Journey
          </h2>
        </motion.div>

        <div className="space-y-4">
          {/* Journey Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-5 shadow-lg shadow-gold/10"
          >
            <p className="text-gray-300 text-sm leading-relaxed text-center">
              {content['about-journey']}
            </p>
          </motion.div>

          {/* Qualifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-5 shadow-lg shadow-gold/10"
          >
            <h3 className="text-gold font-semibold text-sm mb-3 text-center">Qualifications</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <span className="text-gold mt-0.5">✓</span>
                <span className="text-gray-300">Certified Tarot Reader (10+ years)</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-gold mt-0.5">✓</span>
                <span className="text-gray-300">Reiki Master Teacher</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-gold mt-0.5">✓</span>
                <span className="text-gray-300">Traditional Jal Jyotishi Specialist</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-gold mt-0.5">✓</span>
                <span className="text-gray-300">Crystal Healing Therapist</span>
              </div>
            </div>
          </motion.div>

          {/* Core Values Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-5 shadow-lg shadow-gold/10"
          >
            <h3 className="text-gold font-semibold text-sm mb-4 text-center">Core Values</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xl mb-1">✨</div>
                <div className="text-white font-semibold text-xs mb-0.5">Authenticity</div>
                <div className="text-gray-400 text-[10px]">Genuine guidance</div>
              </div>
              <div className="text-center">
                <div className="text-xl mb-1">💖</div>
                <div className="text-white font-semibold text-xs mb-0.5">Compassion</div>
                <div className="text-gray-400 text-[10px]">Caring support</div>
              </div>
              <div className="text-center">
                <div className="text-xl mb-1">⚖️</div>
                <div className="text-white font-semibold text-xs mb-0.5">Integrity</div>
                <div className="text-gray-400 text-[10px]">Honest practices</div>
              </div>
              <div className="text-center">
                <div className="text-xl mb-1">💪</div>
                <div className="text-white font-semibold text-xs mb-0.5">Empowerment</div>
                <div className="text-gray-400 text-[10px]">Inner strength</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOOK APPOINTMENT SECTION */}
      <section id="book" className="py-4 px-4">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="font-mystical text-[1.8rem] font-bold text-gold mb-2">
              Book Session
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-5 shadow-lg shadow-gold/10"
            onFocus={handleBookingStart}
          >
            <BookingForm 
              onSuccess={handleBookingComplete}
              pricing={lockedPricing || pricing}
            />
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-4 px-4">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="font-mystical text-[1.8rem] font-bold text-gold mb-2">
              Contact
            </h2>
          </motion.div>

          {/* Contact Cards */}
          <div className="space-y-3 mb-6">
            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-4 shadow-lg shadow-gold/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">WhatsApp</h3>
                    <p className="text-gray-400 text-xs">Instant messaging</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/919893578135"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#f5d000] to-[#18c2a4] text-deep-purple font-semibold rounded-full text-xs shadow-md"
                >
                  Chat
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-4 shadow-lg shadow-gold/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Email</h3>
                    <p className="text-gray-400 text-xs">24-hour response</p>
                  </div>
                </div>
                <a
                  href="mailto:rajshreepandetiwari@gmail.com"
                  className="px-4 py-2 bg-gradient-to-r from-[#f5d000] to-[#18c2a4] text-deep-purple font-semibold rounded-full text-xs shadow-md"
                >
                  Email
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-gradient-to-br from-deep-purple/30 to-midnight-blue/20 border border-gold/30 rounded-2xl p-5 shadow-lg shadow-gold/10"
          >
            <h3 className="font-mystical text-base text-gold mb-4 text-center">Send Message</h3>
            <form onSubmit={handleMobileContactSubmit(onMobileContactSubmit)} className="space-y-3">
              <div>
                <input
                  type="text"
                  autoComplete="name"
                  {...registerMobileContact('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-xs"
                  placeholder="Name"
                />
                {mobileContactErrors.name && <p className="text-red-400 text-xs mt-1">{mobileContactErrors.name.message}</p>}
              </div>

              <div>
                <input
                  type="email"
                  autoComplete="email"
                  {...registerMobileContact('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email'
                    }
                  })}
                  className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-xs"
                  placeholder="Email"
                />
                {mobileContactErrors.email && <p className="text-red-400 text-xs mt-1">{mobileContactErrors.email.message}</p>}
              </div>

              <div>
                <select
                  autoComplete="off"
                  {...registerMobileContact('subject', { required: 'Please select a subject' })}
                  className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all appearance-none text-xs"
                >
                  <option value="" className="bg-cosmic-blue text-gray-400">Subject...</option>
                  <option value="general-inquiry" className="bg-cosmic-blue text-white">General Inquiry</option>
                  <option value="booking-question" className="bg-cosmic-blue text-white">Booking Question</option>
                  <option value="service-information" className="bg-cosmic-blue text-white">Service Info</option>
                  <option value="other" className="bg-cosmic-blue text-white">Other</option>
                </select>
                {mobileContactErrors.subject && <p className="text-red-400 text-xs mt-1">{mobileContactErrors.subject.message}</p>}
              </div>

              <div>
                <textarea
                  autoComplete="off"
                  {...registerMobileContact('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 25,
                      message: 'Message must be at least 25 characters'
                    }
                  })}
                  rows="4"
                  className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none text-xs"
                  placeholder="Your message (minimum 25 characters)..."
                ></textarea>
                {mobileContactErrors.message && <p className="text-red-400 text-xs mt-1">{mobileContactErrors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isMobileContactSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-[#f5d000] to-[#18c2a4] text-deep-purple font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-xs"
              >
                {isMobileContactSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {mobileContactSubmitMessage && (
                <div className={`text-center p-3 rounded-xl text-xs ${
                  mobileContactSubmitMessage.includes('successfully') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {mobileContactSubmitMessage}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Landing
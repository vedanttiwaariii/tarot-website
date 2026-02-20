import { motion, AnimatePresence } from 'framer-motion'
import ServiceCard from '../components/ServiceCard'
import ShinyText from '../components/ShinyText'
import Threads from '../components/Threads'
import BookingWizard from '../components/BookingWizard'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'


const Landing = () => {
  // Booking form state - FIXED: Removed mode configuration that was causing issues
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showExistingBookingModal, setShowExistingBookingModal] = useState(false)
  const [existingBookingData, setExistingBookingData] = useState(null)
  
  // FIXED: Simplified form initialization - no complex validation modes
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch, 
    setValue 
  } = useForm({
    mode: 'onSubmit', // Only validate on submit, not during typing
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      sessionType: '',
      message: '',
      accessCode: ''
    }
  })

  // Check Razorpay script availability
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayReady(true)
      } else {
        setTimeout(checkRazorpay, 100)
      }
    }
    checkRazorpay()
  }, [])

  // Global expansion state for all mobile cards
  const [allCardsExpanded, setAllCardsExpanded] = useState(false)
  const [aboutCardsExpanded, setAboutCardsExpanded] = useState(false)
  const [expandedCards, setExpandedCards] = useState({ tarot: false, reiki: false, jal: false })
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const [bookedSlots, setBookedSlots] = useState([])
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [razorpayReady, setRazorpayReady] = useState(false)

  // Watch the selected date to filter time slots
  const selectedDate = watch('date')

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate)
    } else {
      setBookedSlots([])
    }
  }, [selectedDate])

  const fetchBookedSlots = async (date) => {
    setFetchingSlots(true)
    try {
      const response = await api.get(`/api/bookings/available-slots/${date}`)
      setBookedSlots(response.data.data.bookedSlots || [])
    } catch (error) {
      console.error('Error fetching booked slots:', error)
      setBookedSlots([])
    } finally {
      setFetchingSlots(false)
    }
  }

  // Filter time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    const allTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
    
    if (!selectedDate) return allTimeSlots
    
    const today = new Date()
    const selected = new Date(selectedDate)
    
    // If selected date is today, filter out past time slots
    let filteredSlots = allTimeSlots
    if (selected.toDateString() === today.toDateString()) {
      const currentHour = today.getHours()
      const currentMinute = today.getMinutes()
      
      filteredSlots = allTimeSlots.filter(timeSlot => {
        const [time, period] = timeSlot.split(' ')
        const [hours, minutes] = time.split(':').map(Number)
        let hour24 = hours
        if (period === 'PM' && hours !== 12) hour24 += 12
        if (period === 'AM' && hours === 12) hour24 = 0
        
        const slotTime = hour24 * 60 + minutes
        const currentTime = currentHour * 60 + currentMinute
        
        return slotTime > currentTime
      })
    }
    
    // Filter out booked slots
    return filteredSlots.filter(slot => !bookedSlots.includes(slot))
  }, [selectedDate, bookedSlots])

  // Contact form state
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

  const services = [
    {
      title: "Tarot Reading",
      description: "Unlock the mysteries of your future with ancient tarot wisdom. Our comprehensive tarot readings provide deep insights into your life's journey, relationships, career, and spiritual path.",
      icon: "🔮",
      price: "₹1,100",
      features: [
        "30-minute detailed session",
        "Professional card interpretation",
        "Follow-up guidance included",
        "Past, present, future insights",
        "Relationship & career guidance"
      ]
    },
    {
      title: "Reiki Healing",
      description: "Restore balance and harmony through universal life energy. Experience deep relaxation and healing as we work to align your chakras and clear energy blockages.",
      icon: "🙏",
      price: "₹1,551",
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
      description: "Locate underground water sources for wells and borewells using traditional coconut-based detection methods. Our experienced practitioner walks your land to identify optimal drilling locations, helping reduce costs and failure risks before excavation begins.",
      icon: "💧",
      price: "₹21,000",
      features: [
        "Traditional coconut detection method",
        "On-site land assessment",
        "Optimal drilling location marking",
        "Cost-effective pre-drilling guidance",
        "Suitable for homes, farms & businesses",
        "Risk reduction consultation"
      ]
    }
  ]

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

  const onBookingSubmit = async (data) => {
    if (!disclaimerAccepted) {
      setShowDisclaimerModal(true)
      return
    }
    
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      console.log('Starting booking process...')
      console.log('Form data:', data)
      
      // Check if access code is provided (skip payment)
      if (data.accessCode && data.accessCode.trim()) {
        console.log('Access code provided, skipping payment')
        const response = await api.post('/api/bookings', data)
        setSubmitMessage(
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Booking Confirmed!</div>
            <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-4">
              <div className="text-gold font-bold text-xl mb-1">Your Booking Number</div>
              <div className="font-mono text-2xl text-white">{response.data.data.bookingNumber}</div>
            </div>
            <div className="text-sm text-gray-300">Access code applied. No payment required.</div>
          </div>
        )
        reset()
        setDisclaimerAccepted(false)
        return
      }

      console.log('No access code, proceeding with payment flow')
      // Create booking first
      const bookingResponse = await api.post('/api/bookings', data)
      console.log('Booking response:', bookingResponse.data)
      const bookingData = bookingResponse.data
      
      // Check if payment is required
      if (bookingData.requiresPayment) {
        console.log('Payment required, opening Razorpay')
        const booking = bookingData.data

        // Create Razorpay order
        const orderResponse = await api.post('/api/payments/create-order', {
          service: data.service,
          bookingId: booking.id
        })

        const { orderId, amount, keyId } = orderResponse.data.data

        // Check Razorpay availability
        if (!window.Razorpay) {
          console.error('Razorpay not available')
          setSubmitMessage('Payment system not ready. Please refresh and try again.')
          return
        }

        console.log('Razorpay available, creating options:', {
          key: keyId,
          amount: amount,
          currency: 'INR',
          order_id: orderId
        })

        // Initialize Razorpay payment
        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'Krushnalaya',
          description: `${data.service.replace('-', ' ')} booking`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // Verify payment
              await api.post('/api/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking.id
              })

              setSubmitMessage(
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Payment Successful!</div>
                  <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-4">
                    <div className="text-gold font-bold text-xl mb-1">Your Booking Number</div>
                    <div className="font-mono text-2xl text-white">{booking.bookingNumber}</div>
                  </div>
                  <div className="text-sm text-gray-300">Payment completed. Booking confirmed!</div>
                </div>
              )
              reset()
              setDisclaimerAccepted(false)
            } catch (error) {
              setSubmitMessage('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: data.name,
            email: data.email,
            contact: `+91${data.phone}`
          },
          theme: {
            color: '#FFD700'
          },
          modal: {
            ondismiss: function() {
              setSubmitMessage('Payment cancelled.')
            }
          }
        }

        try {
          console.log('Creating Razorpay instance...')
          const rzp = new window.Razorpay(options)
          console.log('Razorpay instance created, opening checkout...')
          rzp.open()
          console.log('Razorpay checkout opened')
        } catch (error) {
          console.error('Razorpay error:', error)
          setSubmitMessage(`Payment system error: ${error.message}`)
        }
        
      } else {
        // Access code booking - already confirmed
        const booking = bookingData.data
        setSubmitMessage(
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Booking Confirmed!</div>
            <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-4">
              <div className="text-gold font-bold text-xl mb-1">Your Booking Number</div>
              <div className="font-mono text-2xl text-white">{booking.bookingNumber}</div>
            </div>
            <div className="text-sm text-gray-300">Access code applied. No payment required.</div>
          </div>
        )
        reset()
        setDisclaimerAccepted(false)
      }
      
    } catch (error) {
      console.error('Booking error:', error)
      console.error('Error response:', error.response?.data)
      if (error.response?.status === 409 && error.response?.data?.message === 'existing_booking') {
        setExistingBookingData(error.response.data.existingBooking)
        setShowExistingBookingModal(true)
      } else if (error.response?.data?.message) {
        setSubmitMessage(error.response.data.message)
      } else {
        setSubmitMessage('There was an error processing your request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleServiceSelect = (serviceValue) => {
    // Set the service in the form and scroll to booking section
    setValue('service', serviceValue)
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' })
  }

  const handleContinueBooking = async () => {
    setIsSubmitting(true)
    setShowExistingBookingModal(false)
    
    try {
      const formData = watch() // Get current form data
      const dataWithDuplicate = { ...formData, allowDuplicate: true }
      
      const response = await api.post('/api/bookings', dataWithDuplicate)
      setSubmitMessage(
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Additional Booking Confirmed!</div>
          <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-4">
            <div className="text-gold font-bold text-xl mb-1">Your Booking Number</div>
            <div className="font-mono text-2xl text-white">{response.data.data.bookingNumber}</div>
          </div>
          <div className="text-sm text-gray-300">Please save this number for your records. You now have multiple bookings.</div>
        </div>
      )
      reset()
    } catch (error) {
      console.error('Continue booking error:', error)
      if (error.response?.data?.message) {
        setSubmitMessage(error.response.data.message)
      } else {
        setSubmitMessage('There was an error booking your appointment. Please try again or contact us directly.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="min-h-screen relative pb-20" style={{ overscrollBehavior: 'none' }}>
      {/* Threads Background */}
      <div className="fixed inset-0 -z-10" style={{ paddingBottom: '100px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue via-deep-purple to-midnight-blue" style={{ height: 'calc(100% + 150px)' }}></div>
        <Threads
          color={[1, 0.843, 0]} // Gold color
          amplitude={1.2}
          distance={0.5}
          enableMouseInteraction={true}
        />
      </div>
      
      {/* HOME SECTION */}
      <section id="home" className="relative py-4 md:py-12 lg:pt-24 px-4">
        {/* Mobile Hero - Compact Design */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center py-8 px-4"
          >
            {/* Logo */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/20 to-aqua/20 border-2 border-gold/40 flex items-center justify-center shadow-lg shadow-gold/30 overflow-hidden">
              <img src="/images/logo.png" alt="Krushnalaya" className="w-full h-full object-cover" />
            </div>
            
            {/* Brand Name */}
            <h1 className="font-mystical text-[2rem] font-bold text-gold mb-1">
              Krushnalaya
            </h1>
            
            {/* Tagline */}
            <p className="text-aqua text-xs font-semibold tracking-[0.3em] mb-3">
              KNOW · HEAL · GROW
            </p>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
              When life feels uncertain, clarity begins within. Discover your direction through spiritual guidance.
            </p>
            

          </motion.div>
        </div>

        {/* Desktop Hero - Unchanged */}
        <section className="hidden md:block relative py-6 md:py-8 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <h1 className="font-mystical text-[2.8rem] md:text-[4.25rem] font-bold mb-8 text-white drop-shadow-2xl text-center">
                When life feels uncertain, clarity begins within.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed text-center">
                Through Tarot Reading, Reiki Healing, and Jal Jyotishi, we help you understand what's blocking you — and how to move forward with confidence.
              </p>
              <div className="flex justify-center">
                <a href="#book" className="btn-primary text-lg px-8 sm:px-12 py-4">
                  <span className="hidden sm:inline">Begin Your Guidance Journey</span>
                  <span className="sm:hidden">Begin Your Journey</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Desktop Who We Are Section - Unchanged */}
        <section className="hidden md:block py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="font-mystical text-[2.1rem] md:text-[2.8rem] font-bold text-gradient mb-8">
                A Sacred Space for Guidance & Healing
              </h2>
            </motion.div>
            
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
              >
                <ShinyText
                  text="Krushnalaya"
                  speed={3}
                  color="#FFD700"
                  shineColor="#FFFFFF"
                  spread={120}
                  direction="left"
                />{' '}is where ancient wisdom meets compassionate guidance.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="w-12 h-0.5 bg-gradient-to-r from-gold to-aqua rounded-full mx-auto"
              />
              
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                viewport={{ once: true }}
              >
                When life feels overwhelming or unclear, we create space for you to reconnect with your inner knowing and find the direction you seek.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                viewport={{ once: true }}
                className="w-12 h-0.5 bg-gradient-to-r from-gold to-aqua rounded-full mx-auto"
              />
              
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                viewport={{ once: true }}
              >
                Every session is an invitation to pause, breathe, and discover the clarity that already lives within you.
              </motion.p>
            </div>
          </div>
        </section>


      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-4 md:py-10 px-4 sm:px-6 lg:px-8">
        {/* Mobile Services */}
        <div className="md:hidden px-4 py-6">
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
          <div className="space-y-4">
            {/* Tarot Reading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border border-gold/30 p-4 shadow-lg shadow-gold/10 overflow-hidden ${
                expandedCards.tarot ? 'rounded-3xl shadow-xl shadow-gold/20 bg-deep-purple/50' : 'rounded-2xl'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">🔮</span>
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">Tarot Reading</h3>
                  </div>
                </div>
                <div className="text-[#18c2a4] font-bold text-lg leading-none">₹1,100</div>
              </div>
              
              {!expandedCards.tarot ? (
                <div>
                  <p className="text-gray-300 text-xs mb-2 leading-relaxed">Personalized guidance for clarity</p>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">30-minute session</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Custom card spread</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Love & career insights</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, tarot: true }))}
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
                    Personalized guidance for clarity, direction, and confident decisions.
                  </p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Custom card spread based on concern</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Deep intuitive interpretation</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Love, career & life insights</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Follow-up clarification support</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Past, present, future guidance</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Recorded session notes</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleServiceSelect('tarot')}
                    className="w-full py-2 border border-gold/40 text-gold font-medium rounded-full hover:bg-gold/10 transition-all duration-300 text-xs mb-2"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, tarot: false }))}
                    className="w-full text-gold text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                  >
                    <span>Show Less</span>
                    <span className="rotate-180">▼</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Reiki Healing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border border-gold/30 p-4 shadow-lg shadow-gold/10 overflow-hidden ${
                expandedCards.reiki ? 'rounded-3xl shadow-xl shadow-gold/20 bg-deep-purple/50' : 'rounded-2xl'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">✨</span>
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">Reiki Healing</h3>
                  </div>
                </div>
                <div className="text-[#18c2a4] font-bold text-lg leading-none">₹1,551</div>
              </div>
              
              {!expandedCards.reiki ? (
                <div>
                  <p className="text-gray-300 text-xs mb-2 leading-relaxed">Structured 21-day healing journey</p>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">21-day healing journey</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Daily energy sessions</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Complete package ₹2100</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, reiki: true }))}
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
                    A structured 21-day healing journey for deep energetic reset.
                  </p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Daily energy healing sessions</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Chakra balancing & emotional release</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">21-session set (most recommended)</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Complete package ₹2100</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Stress & anxiety relief</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Physical & emotional healing</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleServiceSelect('reiki')}
                    className="w-full py-2 border border-gold/40 text-gold font-medium rounded-full hover:bg-gold/10 transition-all duration-300 text-xs mb-2"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, reiki: false }))}
                    className="w-full text-gold text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                  >
                    <span>Show Less</span>
                    <span className="rotate-180">▼</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Jal Jyotish */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-deep-purple/40 to-midnight-blue/30 border border-gold/30 p-4 shadow-lg shadow-gold/10 overflow-hidden ${
                expandedCards.jal ? 'rounded-3xl shadow-xl shadow-gold/20 bg-deep-purple/50' : 'rounded-2xl'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">💧</span>
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">Jal Jyotish</h3>
                  </div>
                </div>
                <div className="text-[#18c2a4] font-bold text-lg leading-none">₹21,000</div>
              </div>
              
              {!expandedCards.jal ? (
                <div>
                  <p className="text-gray-300 text-xs mb-2 leading-relaxed">Strategic water source assessment</p>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Traditional water detection</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Land assessment</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Drilling location guidance</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, jal: true }))}
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
                    Strategic water source assessment using traditional methods.
                  </p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Land & directional evaluation</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Energetic field analysis</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Recommended drilling location</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Cost-risk optimization insight</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Depth estimation guidance</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="text-gold mt-0.5">✓</span>
                      <span className="text-gray-300">Post-drilling consultation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleServiceSelect('water-divination')}
                    className="w-full py-2 border border-gold/40 text-gold font-medium rounded-full hover:bg-gold/10 transition-all duration-300 text-xs mb-2"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, jal: false }))}
                    className="w-full text-gold text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
                  >
                    <span>Show Less</span>
                    <span className="rotate-180">▼</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Desktop Services - Keep existing */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-mystical text-[3.5rem] md:text-[4.25rem] font-bold text-gradient mb-6">
              Sacred Services
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Discover our range of spiritual services at <ShinyText
                text="Krushnalaya"
                speed={3}
                color="#FFD700"
                shineColor="#FFFFFF"
                spread={120}
                direction="left"
              />{' '}designed to guide you on your journey of 
              self-discovery, healing, and enlightenment.
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-deep-purple/30 to-midnight-blue/30 backdrop-blur-lg border border-gold/30 rounded-3xl p-8 text-white"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h2 className="font-mystical text-[2.1rem] font-bold text-gold mb-4">{service.title}</h2>
                  <div className="text-2xl font-bold text-aqua mb-6">{service.price}</div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-8 text-center">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-gray-300">
                      <span className="text-gold mr-3 mt-1 flex-shrink-0">✨</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center pt-4">
                  <button
                    onClick={() => handleServiceSelect(service.title === 'Tarot Reading' ? 'tarot' : service.title === 'Reiki Healing' ? 'reiki' : 'water-divination')}
                    className="btn-primary px-8 py-3"
                  >
                    Book {service.title}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile/Portrait Horizontal Swipable Cards */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 -mx-4 scrollbar-hide">
              {[...services, ...services, ...services].map((service, index) => {
                const cardKey = `${service.title}-${index}`
                
                return (
                  <motion.div
                    key={cardKey}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                    className="flex-none w-[85vw] snap-center bg-gradient-to-br from-deep-purple/30 to-midnight-blue/30 backdrop-blur-lg border border-gold/30 rounded-2xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">{service.icon}</div>
                        <h2 className="font-mystical text-[1.4rem] font-bold text-gold mb-3">{service.title}</h2>
                        <div className="text-xl font-bold text-aqua mb-4">{service.price}</div>
                      </div>
                      
                      <p className="text-gray-300 text-base leading-relaxed mb-6 text-center">
                        {service.description}
                      </p>
                      
                      {/* Expandable Content */}
                      <motion.div
                        initial={false}
                        animate={{ height: allCardsExpanded ? 'auto' : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start text-gray-300">
                              <span className="text-gold mr-3 mt-1 flex-shrink-0">✨</span>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-center mb-4">
                          <button
                            onClick={() => handleServiceSelect(service.title === 'Tarot Reading' ? 'tarot' : service.title === 'Reiki Healing' ? 'reiki' : 'water-divination')}
                            className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
                          >
                            Book Now
                          </button>
                        </div>
                      </motion.div>
                      
                      {/* Expand/Collapse Button */}
                      <div className="text-center">
                        <button
                          onClick={() => setAllCardsExpanded(!allCardsExpanded)}
                          className="text-gold hover:text-white transition-colors duration-300 flex items-center justify-center mx-auto"
                        >
                          <span className="mr-2">{allCardsExpanded ? 'Show Less' : 'Show More'}</span>
                          <div className={`transition-transform duration-300 ${allCardsExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT MY JOURNEY SECTION - Mobile Only */}
      <section className="md:hidden px-4 py-8">
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
              The seeds were always within me. Through years of study in tarot, energy healing, and ancient wisdom traditions, I discovered that true knowledge comes from quiet moments of connection.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed text-center mt-3">
              When this journey led me to understand myself, I felt called to help others discover their inner clarity.
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
      <section id="book" className="py-4 md:py-10 px-4 sm:px-6 lg:px-8">
        {/* Mobile Booking Form - Wizard */}
        <div className="md:hidden px-4 py-6">
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
          >
            <form onSubmit={handleSubmit(onBookingSubmit)}>
              <BookingWizard
                onSubmit={onBookingSubmit}
                isSubmitting={isSubmitting}
                submitMessage={submitMessage}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                availableTimeSlots={availableTimeSlots}
                selectedDate={selectedDate}
                disclaimerAccepted={disclaimerAccepted}
                setDisclaimerAccepted={setDisclaimerAccepted}
                reset={reset}
              />
            </form>
          </motion.div>
        </div>

        {/* Desktop Booking - Keep existing */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-mystical text-[3.5rem] md:text-[4.25rem] font-bold text-gradient mb-6">
              Book Your Session
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take the first step on your spiritual journey. Choose your preferred service and 
              schedule a time that works for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-mystical"
          >
            <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FIXED: Removed refs, register handles everything */}
                <div>
                  <label htmlFor="name" className="block text-gold font-semibold mb-2">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gold font-semibold mb-2">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      +91
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone number must be exactly 10 digits'
                        }
                      })}
                      className="w-full pl-12 pr-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                      }}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gold font-semibold mb-2">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="service" className="block text-gold font-semibold mb-2">Select Service *</label>
                <select
                  id="service"
                  autoComplete="off"
                  {...register('service', { required: 'Please select a service' })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_1rem_center] pr-12"
                >
                  <option value="" className="bg-cosmic-blue text-gray-400">Choose a service...</option>
                  {bookingServices.map((service) => (
                    <option key={service.value} value={service.value} className="bg-cosmic-blue text-white">
                      {service.label} ({service.duration})
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-red-400 text-sm mt-1">{errors.service.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-gold font-semibold mb-2">Preferred Date *</label>
                  <input
                    id="date"
                    type="date"
                    autoComplete="off"
                    {...register('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                  />
                  {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label htmlFor="time" className="block text-gold font-semibold mb-2">Preferred Time *</label>
                  <select
                    id="time"
                    autoComplete="off"
                    {...register('time', { required: 'Please select a time' })}
                    disabled={!selectedDate}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_1rem_center] pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-cosmic-blue text-gray-400">
                      {!selectedDate ? 'Please select a date first' : 'Choose a time...'}
                    </option>
                    {selectedDate && availableTimeSlots.map((time) => (
                      <option key={time} value={time} className="bg-cosmic-blue text-white">
                        {time}
                      </option>
                    ))}
                  </select>
                  {availableTimeSlots.length === 0 && selectedDate && (
                    <p className="text-yellow-400 text-sm mt-1">
                      No time slots available for this date. Please select a different date.
                    </p>
                  )}
                  {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-gold font-semibold mb-2">Message (Optional)</label>
                <textarea
                  id="message"
                  autoComplete="off"
                  {...register('message')}
                  rows="4"
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your intentions for this session or any specific questions you have..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Session Type *</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="in-person"
                      autoComplete="off"
                      {...register('sessionType', { required: 'Please select session type' })}
                      className="mr-2 text-gold focus:ring-gold"
                    />
                    <span className="text-white">In-Person</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      autoComplete="off"
                      {...register('sessionType', { required: 'Please select session type' })}
                      className="mr-2 text-gold focus:ring-gold"
                    />
                    <span className="text-white">Online (Video Call)</span>
                  </label>
                </div>
                {errors.sessionType && <p className="text-red-400 text-sm mt-1">{errors.sessionType.message}</p>}
              </div>

              <div>
                <label htmlFor="accessCode" className="block text-gold font-semibold mb-2">Access Code (Optional)</label>
                <input
                  id="accessCode"
                  type="text"
                  autoComplete="off"
                  {...register('accessCode')}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter access code (if provided)"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Have an access code? Enter it here for special booking privileges.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="disclaimer"
                  autoComplete="off"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 text-gold focus:ring-gold"
                />
                <label htmlFor="disclaimer" className="text-white text-sm">
                  I have read and agree to the{' '}
                  <a href="/disclaimer" target="_blank" className="text-gold hover:text-aqua underline">
                    Disclaimer
                  </a>
                  .
                </label>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || (!razorpayReady && !watch('accessCode'))}
                  className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Book Appointment'}
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  {watch('accessCode') ? 'Special booking with access code' : 'Standard booking process'}
                </p>
              </div>

              {submitMessage && (
                <div className={`text-center p-4 rounded-lg ${
                  typeof submitMessage === 'object' || (typeof submitMessage === 'string' && submitMessage.includes('successfully')) 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-300 mb-4">
              Prefer to book directly? Contact us via WhatsApp for immediate assistance.
            </p>
            <a
              href="https://wa.me/919893578135"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-3"
            >
              WhatsApp Booking
            </a>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-4 md:py-10 px-4 sm:px-6 lg:px-8">
        {/* Mobile Contact */}
        <div className="md:hidden px-4 py-6">
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

        {/* Desktop Contact - Keep existing */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-mystical text-[3.5rem] md:text-[4.25rem] font-bold text-gradient mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to begin your spiritual journey? We're here to answer your questions 
              and help you find the perfect service for your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-mystical text-[2.1rem] font-bold text-gradient mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="card-mystical"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{info.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gold mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-300 text-sm">
                            {info.action && idx === 0 ? (
                              <a 
                                href={info.action}
                                className="hover:text-gold transition-colors"
                                target={info.action.startsWith('http') ? '_blank' : undefined}
                                rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="space-y-4"
              >
                <h3 className="font-mystical text-[1.4rem] font-bold text-gradient mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://wa.me/919893578135"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center"
                  >
                    WhatsApp Chat
                  </a>
                  <a
                    href="#book"
                    className="btn-secondary text-center"
                  >
                    Book Appointment
                  </a>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-mystical"
            >
              <h2 className="font-mystical text-[2.1rem] font-bold text-gradient mb-6">
                Send a Message
              </h2>
              
              <form onSubmit={handleContactSubmit(onContactSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      {...registerContact('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                    {contactErrors.name && <p className="text-red-400 text-sm mt-1">{contactErrors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gold font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      {...registerContact('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    {contactErrors.email && <p className="text-red-400 text-sm mt-1">{contactErrors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gold font-semibold mb-2">Phone</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      {...registerContact('phone', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone number must be exactly 10 digits'
                        }
                      })}
                      className="w-full pl-12 pr-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                      }}
                    />
                  </div>
                  {contactErrors.phone && <p className="text-red-400 text-sm mt-1">{contactErrors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-gold font-semibold mb-2">Subject *</label>
                  <select
                    {...registerContact('subject', { required: 'Please select a subject' })}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[right_1rem_center] pr-12"
                  >
                    <option value="" className="bg-cosmic-blue text-gray-400">Choose a subject...</option>
                    <option value="general-inquiry" className="bg-cosmic-blue text-white">General Inquiry</option>
                    <option value="booking-question" className="bg-cosmic-blue text-white">Booking Question</option>
                    <option value="service-information" className="bg-cosmic-blue text-white">Service Information</option>
                    <option value="pricing" className="bg-cosmic-blue text-white">Pricing</option>
                    <option value="partnership" className="bg-cosmic-blue text-white">Partnership/Collaboration</option>
                    <option value="feedback" className="bg-cosmic-blue text-white">Feedback</option>
                    <option value="other" className="bg-cosmic-blue text-white">Other</option>
                  </select>
                  {contactErrors.subject && <p className="text-red-400 text-sm mt-1">{contactErrors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-gold font-semibold mb-2">Message *</label>
                  <textarea
                    {...registerContact('message', { required: 'Message is required' })}
                    rows="5"
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                  {contactErrors.message && <p className="text-red-400 text-sm mt-1">{contactErrors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContactSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {contactSubmitMessage && (
                  <div className={`text-center p-4 rounded-lg ${
                    contactSubmitMessage.includes('successfully') 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {contactSubmitMessage}
                  </div>
                )}
              </form>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <h2 className="font-mystical text-[2.8rem] font-bold text-center text-gradient mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I prepare for my session?",
                  answer: "Come with an open mind and specific questions you'd like guidance on. We'll send preparation guidelines after booking."
                },
                {
                  question: "Are online sessions as effective?",
                  answer: "Yes! Energy transcends physical boundaries. Online sessions are just as powerful and insightful as in-person meetings."
                },
                {
                  question: "What if I need to reschedule?",
                  answer: "Please give us 24 hours notice for rescheduling. We understand life happens and are flexible with our clients."
                },
                {
                  question: "Do you offer group sessions?",
                  answer: "Yes! We offer group healing circles and spiritual workshops. Contact us for upcoming events and private group bookings."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-mystical"
                >
                  <h3 className="font-semibold text-gold mb-3">{faq.question}</h3>
                  <p className="text-gray-300 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-deep-purple/90 to-midnight-blue/90 backdrop-blur-sm border border-gold/30 rounded-xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="font-mystical text-[1.4rem] font-bold text-gold mb-4">Disclaimer Required</h3>
              <p className="text-gray-300 mb-6">
                Please check the "I have read and agree to the Disclaimer" box to proceed with your booking.
              </p>
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Existing Booking Modal */}
      {showExistingBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-deep-purple/90 to-midnight-blue/90 backdrop-blur-sm border border-gold/30 rounded-xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="font-mystical text-[1.4rem] font-bold text-gold mb-4">Existing Booking Found</h3>
              <p className="text-gray-300 mb-6">
                You already have a booking scheduled for:
              </p>
              <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-6">
                <div className="text-gold font-bold mb-2">Booking #{existingBookingData?.bookingNumber}</div>
                <div className="text-white">
                  <div>Date: {existingBookingData?.date ? (() => {
                    const date = new Date(existingBookingData.date)
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear().toString().slice(-2)
                    return `${day}/${month}/${year}`
                  })() : 'N/A'}</div>
                  <div>Time: {existingBookingData?.time}</div>
                  <div>Service: {existingBookingData?.service}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Please contact us if you need to reschedule or book an additional session.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinueBooking}
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Booking...' : 'Continue Booking'}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExistingBookingModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Close
                  </button>
                  <a
                    href="https://wa.me/919893578135"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 text-center"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Landing
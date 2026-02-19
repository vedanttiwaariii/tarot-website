import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const contactInfo = [
    {
      icon: "📞",
      title: "Phone",
      details: ["+1 (555) 123-4567", "Available 9 AM - 7 PM"],
      action: "tel:+15551234567"
    },
    {
      icon: "📧",
      title: "Email",
      details: ["info@mysticguidance.com", "Response within 24 hours"],
      action: "mailto:info@mysticguidance.com"
    },
    {
      icon: "💬",
      title: "WhatsApp",
      details: ["Instant messaging", "Quick consultations"],
      action: "https://wa.me/+1234567890"
    },
    {
      icon: "📍",
      title: "Location",
      details: ["123 Spiritual Way", "Mystic City, MC 12345"],
      action: null
    }
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const response = await axios.post('/api/contact', data)
      setSubmitMessage('Your message has been sent successfully! We will get back to you within 24 hours.')
      reset()
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 
                          error.response?.data?.message || 
                          'There was an error sending your message. Please try again or contact us directly.'
      setSubmitMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to begin your spiritual journey? We're here to answer your questions 
            and help you find the perfect service for your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-mystical text-3xl font-bold text-gradient mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4"
            >
              <h3 className="font-mystical text-2xl font-bold text-gradient mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/+1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center"
                >
                  WhatsApp Chat
                </a>
                <a
                  href="/book"
                  className="btn-secondary text-center"
                >
                  Book Appointment
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-mystical"
          >
            <h2 className="font-mystical text-3xl font-bold text-gradient mb-6">
              Send a Message
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-gold font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Your phone number (optional)"
                />
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Subject *</label>
                <select
                  {...register('subject', { required: 'Please select a subject' })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                >
                  <option value="">Choose a subject...</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="booking-question">Booking Question</option>
                  <option value="service-information">Service Information</option>
                  <option value="pricing">Pricing</option>
                  <option value="partnership">Partnership/Collaboration</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Message *</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows="5"
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div className={`text-center p-4 rounded-lg ${
                  submitMessage.includes('successfully') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="font-mystical text-4xl font-bold text-center text-gradient mb-12">
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
    </div>
  )
}

export default Contact
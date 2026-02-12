import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import api from '../api/axios'

const BookAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const services = [
    { value: 'tarot', label: 'Tarot Reading - $75', duration: '30 min' },
    { value: 'reiki', label: 'Reiki Healing - $90', duration: '60 min' },
    { value: 'water-divination', label: 'Water Divination - $65', duration: '45 min' },
    { value: 'spiritual-consultation', label: 'Spiritual Consultation - $120', duration: '90 min' },
    { value: 'group-session', label: 'Group Session - $45/person', duration: '60 min' }
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const response = await api.post('/api/bookings', data)

      setSubmitMessage('Your appointment has been booked successfully! You will receive a confirmation email shortly.')
      reset()
    } catch (error) {
      setSubmitMessage('There was an error booking your appointment. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-mystical text-5xl md:text-6xl font-bold text-gradient mb-6">
            Book Your Session
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take the first step on your spiritual journey. Choose your preferred service and 
            schedule a time that works for you.
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-mystical"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gold font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gold font-semibold mb-2">Email Address *</label>
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
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-gold font-semibold mb-2">Select Service *</label>
              <select
                {...register('service', { required: 'Please select a service' })}
                className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
              >
                <option value="">Choose a service...</option>
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label} ({service.duration})
                  </option>
                ))}
              </select>
              {errors.service && <p className="text-red-400 text-sm mt-1">{errors.service.message}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gold font-semibold mb-2">Preferred Date *</label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2">Preferred Time *</label>
                <select
                  {...register('time', { required: 'Please select a time' })}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                >
                  <option value="">Choose a time...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gold font-semibold mb-2">Message (Optional)</label>
              <textarea
                {...register('message')}
                rows="4"
                className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your intentions for this session or any specific questions you have..."
              ></textarea>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-gold font-semibold mb-2">Session Type *</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="in-person"
                    {...register('sessionType', { required: 'Please select session type' })}
                    className="mr-2 text-gold focus:ring-gold"
                  />
                  <span className="text-white">In-Person</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="online"
                    {...register('sessionType', { required: 'Please select session type' })}
                    className="mr-2 text-gold focus:ring-gold"
                  />
                  <span className="text-white">Online (Video Call)</span>
                </label>
              </div>
              {errors.sessionType && <p className="text-red-400 text-sm mt-1">{errors.sessionType.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>

            {/* Submit Message */}
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

        {/* Alternative Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            Prefer to book directly? Contact us via WhatsApp for immediate assistance.
          </p>
          <a
            href="https://wa.me/+1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg px-8 py-3"
          >
            WhatsApp Booking
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default BookAppointment
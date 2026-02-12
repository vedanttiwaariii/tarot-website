import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const ManageBooking = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false)
  const [rescheduleMessage, setRescheduleMessage] = useState('')

  const { register: registerLookup, handleSubmit: handleLookupSubmit, formState: { errors: lookupErrors } } = useForm()
  const { register: registerReschedule, handleSubmit: handleRescheduleSubmit, formState: { errors: rescheduleErrors }, watch, reset: resetReschedule } = useForm()

  const selectedDate = watch('date')

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return timeSlots
    
    const today = new Date()
    const selected = new Date(selectedDate)
    
    if (selected.toDateString() === today.toDateString()) {
      const currentHour = today.getHours()
      const currentMinute = today.getMinutes()
      
      return timeSlots.filter(timeSlot => {
        const [timeStr, period] = timeSlot.split(' ')
        const [hours, minutes] = timeStr.split(':').map(Number)
        let hour24 = hours
        if (period === 'PM' && hours !== 12) hour24 += 12
        if (period === 'AM' && hours === 12) hour24 = 0
        
        const slotTime = hour24 * 60 + minutes
        const currentTime = currentHour * 60 + currentMinute
        
        return slotTime > currentTime
      })
    }
    
    return timeSlots
  }, [selectedDate])

  const onLookupSubmit = async (data) => {
    setLoading(true)
    setError('')
    setBookings([])
    
    try {
      const response = await axios.get('/api/bookings/lookup', { params: data })
      setBookings(response.data.data)
      if (response.data.data.length === 0) {
        setError('No bookings found with the provided information')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error finding bookings')
    } finally {
      setLoading(false)
    }
  }

  const canReschedule = (booking) => {
    const bookingDateTime = new Date(booking.date)
    const [timeStr, period] = booking.time.split(' ')
    const [hours, minutes] = timeStr.split(':').map(Number)
    let hour24 = hours
    if (period === 'PM' && hours !== 12) hour24 += 12
    if (period === 'AM' && hours === 12) hour24 = 0
    
    bookingDateTime.setHours(hour24, minutes, 0, 0)
    
    const now = new Date()
    const timeDiff = bookingDateTime.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    return hoursDiff >= 12 && booking.status !== 'cancelled' && booking.status !== 'completed'
  }

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking)
    setShowRescheduleModal(true)
    setRescheduleMessage('')
    resetReschedule()
  }

  const onRescheduleSubmit = async (data) => {
    setRescheduleSubmitting(true)
    setRescheduleMessage('')
    
    try {
      await axios.put(`/api/bookings/reschedule/${selectedBooking._id}`, data)
      setRescheduleMessage('Booking rescheduled successfully!')
      setShowRescheduleModal(false)
      
      // Update only the specific booking in the list
      setBookings(prev => prev.map(booking => 
        booking._id === selectedBooking._id 
          ? { ...booking, date: new Date(data.date), time: data.time }
          : booking
      ))
    } catch (error) {
      setRescheduleMessage(error.response?.data?.message || 'Error rescheduling booking')
    } finally {
      setRescheduleSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const time = date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
    return `${day}/${month}/${year} ${time}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-cosmic-blue py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-mystical text-4xl font-bold text-gradient mb-4">
            Manage Your Booking
          </h1>
          <p className="text-gray-300">
            Find and reschedule your appointments (at least 12 hours in advance)
          </p>
        </motion.div>

        {/* Lookup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-mystical mb-8"
        >
          <h2 className="text-2xl font-bold text-gold mb-6">Find Your Booking</h2>
          
          <form onSubmit={handleLookupSubmit(onLookupSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gold font-semibold mb-2">Booking Number</label>
                <input
                  type="text"
                  {...registerLookup('bookingNumber')}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter your booking number"
                />
              </div>
              
              <div>
                <label className="block text-gold font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  {...registerLookup('email')}
                  className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Provide either your booking number or email address to find your bookings
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Find Bookings'}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg p-4 mb-8"
          >
            {error}
          </motion.div>
        )}

        {rescheduleMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg p-4 mb-8"
          >
            {rescheduleMessage}
          </motion.div>
        )}

        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-mystical"
          >
            <h2 className="text-2xl font-bold text-gold mb-6">Your Bookings</h2>
            
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-deep-purple/20 border border-gold/20 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-aqua font-mono text-lg font-bold">
                        #{booking.bookingNumber}
                      </h3>
                      <p className="text-white font-semibold">{booking.name}</p>
                    </div>
                    <span className={`capitalize font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gold font-semibold">Service</p>
                      <p className="text-gray-300 capitalize">{booking.service.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gold font-semibold">Date & Time</p>
                      <p className="text-gray-300">{formatDate(booking.date)} at {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-gold font-semibold">Session Type</p>
                      <p className="text-gray-300 capitalize">{booking.sessionType.replace('-', ' ')}</p>
                    </div>
                  </div>
                  
                  {booking.message && (
                    <div className="mb-4">
                      <p className="text-gold font-semibold">Message</p>
                      <p className="text-gray-300">{booking.message}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-gold font-semibold">Booking Details</p>
                    <p className="text-gray-400 text-sm">Booked on: {formatDateTime(booking.createdAt)}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    {canReschedule(booking) ? (
                      <button
                        onClick={() => openRescheduleModal(booking)}
                        className="btn-primary text-sm"
                      >
                        Reschedule
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {booking.status === 'cancelled' ? 'Cancelled' :
                         booking.status === 'completed' ? 'Completed' :
                         'Cannot reschedule (less than 12 hours)'}
                      </span>
                    )}
                    
                    <a
                      href="https://wa.me/+1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-cosmic-blue border border-gold/20 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gold">Reschedule Booking</h3>
                <button 
                  onClick={() => setShowRescheduleModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-deep-purple/20 rounded-lg">
                <p className="text-gold font-semibold">Current Booking:</p>
                <p className="text-white">#{selectedBooking.bookingNumber}</p>
                <p className="text-gray-300">Appointment booked for: {formatDate(selectedBooking.date)} at {selectedBooking.time}</p>
                <p className="text-gray-400 text-sm">Booked on: {formatDateTime(selectedBooking.createdAt)}</p>
              </div>
              
              <form onSubmit={handleRescheduleSubmit(onRescheduleSubmit)} className="space-y-4">
                <div>
                  <label className="block text-gold font-semibold mb-2">New Date *</label>
                  <input
                    type="date"
                    {...registerReschedule('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                  />
                  {rescheduleErrors.date && <p className="text-red-400 text-sm mt-1">{rescheduleErrors.date.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">New Time *</label>
                  <select
                    {...registerReschedule('time', { required: 'Time is required' })}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                  >
                    <option value="">Choose a time...</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {availableTimeSlots.length === 0 && selectedDate && (
                    <p className="text-yellow-400 text-sm mt-1">
                      No time slots available for today. Please select a future date.
                    </p>
                  )}
                  {rescheduleErrors.time && <p className="text-red-400 text-sm mt-1">{rescheduleErrors.time.message}</p>}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rescheduleSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rescheduleSubmitting ? 'Rescheduling...' : 'Reschedule'}
                  </button>
                </div>
                
                {rescheduleMessage && (
                  <div className={`text-center p-3 rounded ${
                    rescheduleMessage.includes('successfully') 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {rescheduleMessage}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageBooking
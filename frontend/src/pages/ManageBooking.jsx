import { useState, useMemo, useEffect } from 'react'
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
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const { register: registerLookup, handleSubmit: handleLookupSubmit, formState: { errors: lookupErrors } } = useForm()
  const { register: registerReschedule, handleSubmit: handleRescheduleSubmit, formState: { errors: rescheduleErrors }, watch, reset: resetReschedule } = useForm()

  const selectedDate = watch('date')

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      return
    }

    const fetchSlots = async () => {
      setLoadingSlots(true)
      try {
        const res = await axios.get(`/api/bookings/available-slots/${selectedDate}`)
        setAvailableSlots(res.data.data?.availableSlots || [])
      } catch (err) {
        console.error('Slot fetch error:', err)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
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
    <div className="min-h-screen bg-cosmic-blue py-6 px-3 pb-24 lg:pt-24 lg:py-8 lg:px-4 lg:pb-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="font-mystical text-2xl md:text-4xl font-bold text-gradient mb-2 md:mb-4">
            Manage Your Booking
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Find and reschedule your appointments (at least 12 hours in advance)
          </p>
        </motion.div>

        {/* Lookup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-mystical mb-6 md:mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gold mb-4 md:mb-6">Find Your Booking</h2>
          
          <form onSubmit={handleLookupSubmit(onLookupSubmit)} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gold font-semibold mb-1.5 md:mb-2 text-sm md:text-base">Booking Number</label>
                <input
                  type="text"
                  {...registerLookup('bookingNumber')}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white text-sm md:text-base placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter booking number"
                />
              </div>
              
              <div>
                <label className="block text-gold font-semibold mb-1.5 md:mb-2 text-sm md:text-base">Email Address</label>
                <input
                  type="email"
                  {...registerLookup('email')}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white text-sm md:text-base placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <p className="text-gray-400 text-xs md:text-sm">
              Provide either your booking number or email address
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
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
            className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg p-3 md:p-4 mb-6 md:mb-8 text-sm md:text-base"
          >
            {error}
          </motion.div>
        )}

        {rescheduleMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg p-3 md:p-4 mb-6 md:mb-8 text-sm md:text-base"
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
            <h2 className="text-xl md:text-2xl font-bold text-gold mb-4 md:mb-6">Your Bookings</h2>
            
            <div className="space-y-3 md:space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4 md:p-6"
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div>
                      <h3 className="text-aqua font-mono text-base md:text-lg font-bold">
                        #{booking.bookingNumber}
                      </h3>
                      <p className="text-white font-semibold text-sm md:text-base">{booking.name}</p>
                    </div>
                    <span className={`capitalize font-semibold text-xs md:text-sm ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <p className="text-gold font-semibold text-xs md:text-sm">Service</p>
                      <p className="text-gray-300 capitalize text-sm md:text-base">{booking.service.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gold font-semibold text-xs md:text-sm">Date & Time</p>
                      <p className="text-gray-300 text-sm md:text-base">{formatDate(booking.date)} at {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-gold font-semibold text-xs md:text-sm">Session Type</p>
                      <p className="text-gray-300 capitalize text-sm md:text-base">{booking.sessionType.replace('-', ' ')}</p>
                    </div>
                  </div>
                  
                  {booking.message && (
                    <div className="mb-3 md:mb-4">
                      <p className="text-gold font-semibold text-xs md:text-sm">Message</p>
                      <p className="text-gray-300 text-sm md:text-base">{booking.message}</p>
                    </div>
                  )}
                  
                  <div className="mb-3 md:mb-4">
                    <p className="text-gold font-semibold text-xs md:text-sm">Booking Details</p>
                    <p className="text-gray-400 text-xs md:text-sm">Booked on: {formatDateTime(booking.createdAt)}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    {canReschedule(booking) ? (
                      <button
                        onClick={() => openRescheduleModal(booking)}
                        className="btn-primary text-xs md:text-sm w-full sm:w-auto"
                      >
                        Reschedule
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs md:text-sm">
                        {booking.status === 'cancelled' ? 'Cancelled' :
                         booking.status === 'completed' ? 'Completed' :
                         'Cannot reschedule (less than 12 hours)'}
                      </span>
                    )}
                    
                    <a
                      href="https://wa.me/919893578135"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs md:text-sm w-full sm:w-auto text-center"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-cosmic-blue border border-gold/20 rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gold">Reschedule Booking</h3>
                <button 
                  onClick={() => setShowRescheduleModal(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-3 md:mb-4 p-2.5 md:p-3 bg-deep-purple/20 rounded-lg">
                <p className="text-gold font-semibold text-sm md:text-base">Current Booking:</p>
                <p className="text-white text-sm md:text-base">#{selectedBooking.bookingNumber}</p>
                <p className="text-gray-300 text-xs md:text-sm">Appointment: {formatDate(selectedBooking.date)} at {selectedBooking.time}</p>
                <p className="text-gray-400 text-xs">Booked on: {formatDateTime(selectedBooking.createdAt)}</p>
              </div>
              
              <form onSubmit={handleRescheduleSubmit(onRescheduleSubmit)} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-gold font-semibold mb-1.5 md:mb-2 text-sm md:text-base">New Date *</label>
                  <input
                    type="date"
                    {...registerReschedule('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white text-sm md:text-base focus:border-gold focus:outline-none"
                  />
                  {rescheduleErrors.date && <p className="text-red-400 text-xs md:text-sm mt-1">{rescheduleErrors.date.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-1.5 md:mb-2 text-sm md:text-base">New Time *</label>
                  <select
                    {...registerReschedule('time', { required: 'Time is required' })}
                    disabled={!selectedDate || loadingSlots}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white text-sm md:text-base focus:border-gold focus:outline-none disabled:opacity-50"
                  >
                    <option value="">
                      {!selectedDate ? 'Select date first' : loadingSlots ? 'Loading...' : 'Choose a time...'}
                    </option>
                    {availableSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {availableSlots.length === 0 && selectedDate && !loadingSlots && (
                    <p className="text-yellow-400 text-xs md:text-sm mt-1">
                      No time slots available for this date.
                    </p>
                  )}
                  {rescheduleErrors.time && <p className="text-red-400 text-xs md:text-sm mt-1">{rescheduleErrors.time.message}</p>}
                </div>
                
                <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(false)}
                    className="btn-secondary flex-1 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rescheduleSubmitting}
                    className="btn-primary flex-1 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rescheduleSubmitting ? 'Rescheduling...' : 'Reschedule'}
                  </button>
                </div>
                
                {rescheduleMessage && (
                  <div className={`text-center p-2.5 md:p-3 rounded text-xs md:text-sm ${
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
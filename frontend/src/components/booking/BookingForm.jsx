import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import { handlePaymentFlow } from '../../utils/razorpayHandler'
import { usePricing } from '../../hooks/usePricing'

const BookingForm = ({ onSuccess, pricing }) => {
  const dynamicPricing = pricing || usePricing()
  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [bookingDetails, setBookingDetails] = useState(null)
  const [existingBooking, setExistingBooking] = useState(null)

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      sessionType: '',
      message: ''
    }
  })

  const selectedDate = watch('date')
  const selectedService = watch('service')

  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setLoadingSlots(true)
      setSlots([])
      try {
        const res = await api.get(`/api/bookings/available-slots/${selectedDate}`)
        const availableSlots = res.data.data?.availableSlots || []
        setSlots(availableSlots)
      } catch (err) {
        console.error('Slot fetch error:', err)
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate])

  const onSubmit = async (data) => {
    setSubmitting(true)
    setMessage('')
    try {
      const res = await api.post('/api/bookings', data)
      
      if (res.data.requiresPayment) {
        // Payment required - initiate Razorpay
        await handlePaymentFlow({
          service: data.service,
          bookingId: res.data.data.id,
          customerDetails: {
            name: data.name,
            email: data.email,
            phone: data.phone
          },
          onSuccess: (paymentData) => {
            setBookingDetails({
              bookingNumber: res.data.data.bookingNumber,
              name: data.name,
              service: data.service,
              date: data.date,
              time: data.time,
              sessionType: data.sessionType,
              paymentId: paymentData.paymentId
            })
            setMessage('Payment successful! Booking confirmed.')
            reset()
            setStep(1)
          },
          onFailure: (error) => {
            setMessage(error.description || 'Payment failed. Please try again.')
          }
        })
      } else {
        // No payment required (access code used)
        setBookingDetails({
          bookingNumber: res.data.data.bookingNumber,
          name: data.name,
          service: data.service,
          date: data.date,
          time: data.time,
          sessionType: data.sessionType
        })
        setMessage('Booking confirmed!')
        reset()
        setStep(1)
      }
    } catch (err) {
      // Handle duplicate booking
      if (err.response?.status === 409 && err.response?.data?.message === 'existing_booking') {
        setExistingBooking(err.response.data.existingBooking)
      } else {
        setMessage(err.response?.data?.message || 'Booking failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDuplicateBooking = async () => {
    setSubmitting(true)
    setExistingBooking(null)
    
    const data = watch()
    try {
      const res = await api.post('/api/bookings', { ...data, allowDuplicate: true })
      
      if (res.data.requiresPayment) {
        await handlePaymentFlow({
          service: data.service,
          bookingId: res.data.data.id,
          customerDetails: {
            name: data.name,
            email: data.email,
            phone: data.phone
          },
          onSuccess: (paymentData) => {
            setBookingDetails({
              bookingNumber: res.data.data.bookingNumber,
              name: data.name,
              service: data.service,
              date: data.date,
              time: data.time,
              sessionType: data.sessionType,
              paymentId: paymentData.paymentId
            })
            setMessage('Payment successful! Booking confirmed.')
            reset()
            setStep(1)
          },
          onFailure: (error) => {
            setMessage(error.description || 'Payment failed. Please try again.')
          }
        })
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (existingBooking) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-gold text-lg font-bold mb-2">Existing Booking Found</h3>
          <p className="text-white text-sm mb-4">You already have an upcoming appointment</p>
        </div>
        
        <div className="bg-cosmic-blue/50 border border-gold/30 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Booking Number:</span>
            <span className="text-gold font-bold">{existingBooking.bookingNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Service:</span>
            <span className="text-white">{existingBooking.service}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date:</span>
            <span className="text-white">{new Date(existingBooking.date).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time:</span>
            <span className="text-white">{existingBooking.time}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm text-center">Do you want to proceed with a new booking?</p>

        <div className="flex gap-2">
          <button
            onClick={() => setExistingBooking(null)}
            className="flex-1 py-2.5 border border-gold/30 text-white rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleDuplicateBooking}
            disabled={submitting}
            className="flex-1 py-3 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Proceed Anyway'}
          </button>
        </div>
      </div>
    )
  }

  if (bookingDetails) {
    const copyDetails = () => {
      const text = `Booking Confirmed!

Booking Number: ${bookingDetails.bookingNumber}
Name: ${bookingDetails.name}
Service: ${bookingDetails.service}
Date: ${new Date(bookingDetails.date).toLocaleDateString('en-GB')}
Time: ${bookingDetails.time}
Session Type: ${bookingDetails.sessionType}${bookingDetails.paymentId ? `\nPayment ID: ${bookingDetails.paymentId}` : ''}`
      
      navigator.clipboard.writeText(text).then(() => {
        setMessage('Details copied to clipboard!')
        setTimeout(() => setMessage(''), 2000)
      })
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-gold text-lg font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-white text-sm mb-4">Your appointment has been successfully booked.</p>
        </div>
        
        <div className="bg-cosmic-blue/50 border border-gold/30 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Booking Number:</span>
            <span className="text-gold font-bold">{bookingDetails.bookingNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Name:</span>
            <span className="text-white">{bookingDetails.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Service:</span>
            <span className="text-white">{bookingDetails.service}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date:</span>
            <span className="text-white">{new Date(bookingDetails.date).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time:</span>
            <span className="text-white">{bookingDetails.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Session Type:</span>
            <span className="text-white">{bookingDetails.sessionType}</span>
          </div>
          {bookingDetails.paymentId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment ID:</span>
              <span className="text-white text-xs">{bookingDetails.paymentId}</span>
            </div>
          )}
        </div>

        <button
          onClick={copyDetails}
          className="w-full py-2.5 border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition-colors"
        >
          📋 Copy Details
        </button>

        <button
          onClick={() => setBookingDetails(null)}
          className="w-full py-3 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl"
        >
          Book Another Appointment
        </button>

        {message && (
          <div className="text-center text-green-400 text-xs">
            {message}
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            reset()
            setStep(1)
            setMessage('')
          }}
          className="text-gray-400 hover:text-gold text-xs transition-colors lg:text-sm"
        >
          Reset Form
        </button>
      </div>

      {step === 1 && (
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
          <div className="lg:col-span-2">
            <input
              type="text"
              {...register('name', { required: 'Name required' })}
              placeholder="Name *"
              className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm lg:px-4 lg:py-3 lg:text-base"
            />
            {errors.name && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm lg:text-base">+91</span>
              <input
                type="tel"
                {...register('phone', { 
                  required: 'Phone required',
                  pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
                })}
                placeholder="Phone *"
                maxLength="10"
                className="w-full pl-12 pr-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm lg:px-4 lg:py-3 lg:text-base lg:pl-14"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <input
              type="email"
              {...register('email', { 
                required: 'Email required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              placeholder="Email *"
              className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm lg:px-4 lg:py-3 lg:text-base"
            />
            {errors.email && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl lg:py-4 lg:text-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
          <div className="lg:col-span-2">
            <select
              {...register('service', { required: 'Service required' })}
              className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm lg:px-4 lg:py-3 lg:text-base"
            >
              <option value="">Select Service *</option>
              <option value="tarot">Tarot Reading - ₹{dynamicPricing.tarot?.price || 1100}</option>
              <option value="reiki">Reiki Healing - ₹{dynamicPricing.reiki?.price || 1551}</option>
              <option value="water-divination">Water Divination - ₹{dynamicPricing['water-divination']?.price || 21000}</option>
            </select>
            {errors.service && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.service.message}</p>}
          </div>

          <div>
            <input
              type="date"
              {...register('date', { required: 'Date required' })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm lg:px-4 lg:py-3 lg:text-base"
            />
            {errors.date && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <select
              {...register('time', { required: 'Time required' })}
              disabled={!selectedDate || loadingSlots}
              className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm disabled:opacity-50 lg:px-4 lg:py-3 lg:text-base"
            >
              <option value="">
                {!selectedDate ? 'Select date first' : loadingSlots ? 'Loading...' : 'Select Time *'}
              </option>
              {slots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-400 text-xs lg:text-sm mt-1">{errors.time.message}</p>}
          </div>

          <div className="flex gap-2 lg:col-span-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 border border-gold/30 text-white rounded-xl lg:py-3 lg:text-base"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl lg:py-4 lg:text-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <>
          <div className="space-y-3 lg:space-y-4">
            <label className="flex items-center p-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl lg:p-4">
              <input
                type="radio"
                value="in-person"
                {...register('sessionType', { required: 'Session type required' })}
                className="mr-2 lg:mr-3"
              />
              <span className="text-white text-sm lg:text-base">In-Person</span>
            </label>
            {selectedService !== 'water-divination' && (
              <label className="flex items-center p-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl lg:p-4">
                <input
                  type="radio"
                  value="online"
                  {...register('sessionType', { required: 'Session type required' })}
                  className="mr-2 lg:mr-3"
                />
                <span className="text-white text-sm lg:text-base">Online</span>
              </label>
            )}
            {errors.sessionType && <p className="text-red-400 text-xs lg:text-sm">{errors.sessionType.message}</p>}
          </div>

          <textarea
            {...register('message')}
            rows="3"
            placeholder="Message (Optional)"
            className="w-full px-3 py-2.5 bg-cosmic-blue/50 border border-gold/30 rounded-xl text-white text-sm resize-none lg:px-4 lg:py-3 lg:text-base lg:rows-4"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 border border-gold/30 text-white rounded-xl lg:py-3 lg:text-base"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl disabled:opacity-50 lg:py-4 lg:text-lg"
            >
              {submitting ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`p-3 rounded-xl text-xs text-center lg:text-sm lg:p-4 ${
          message.includes('confirmed') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}
    </form>
  )
}

export default BookingForm

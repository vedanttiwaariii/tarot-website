import express from 'express'
import rateLimit from 'express-rate-limit'
import Booking from '../models/Booking.js'
import AccessCode from '../models/AccessCode.js'
import { validate, bookingSchema } from '../middleware/validation.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for booking routes
const bookingRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // increased limit
  message: {
    success: false,
    message: "Too many booking attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Generate unique booking number
const generateBookingNumber = () => {
  const prefix = 'KR'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Get service price in paise
const getServicePrice = (service) => {
  const prices = {
    'tarot': 110000, // ₹1,100
    'reiki': 155100, // ₹1,551
    'water-divination': 2100000, // ₹21,000
    'spiritual-consultation': 250000, // ₹2,500
    'group-session': 80000 // ₹800
  }
  return prices[service] || 0
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
router.post('/', bookingRateLimit, validate(bookingSchema), async (req, res, next) => {
  try {
    const { name, email, phone, service, date, time, sessionType, message, allowDuplicate, accessCode } = req.body

    let finalAmount = 0
    let paymentStatus = 'pending'
    let accessCodeUsed = null

    // Validate access code if provided
    if (accessCode) {
      const foundAccessCode = await AccessCode.findOne({ 
        code: accessCode.toUpperCase() 
      })

      if (!foundAccessCode) {
        return res.status(400).json({
          success: false,
          message: 'Invalid access code'
        })
      }

      const validation = foundAccessCode.isValid(email)
      
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.reason
        })
      }

      // Access code is valid - skip payment
      finalAmount = 0
      paymentStatus = 'SKIPPED_MANUAL'
      accessCodeUsed = foundAccessCode.code
    }

    // Check for existing future bookings with same email or phone (unless explicitly allowed)
    if (!allowDuplicate) {
      const now = new Date()
      const existingUserBooking = await Booking.findOne({
        $or: [{ email }, { phone }],
        date: { $gte: now },
        status: { $ne: 'cancelled' }
      })

      if (existingUserBooking) {
        return res.status(409).json({
          success: false,
          message: 'existing_booking',
          existingBooking: {
            bookingNumber: existingUserBooking.bookingNumber,
            date: existingUserBooking.date,
            time: existingUserBooking.time,
            service: existingUserBooking.service
          }
        })
      }
    }

    // Check if time slot is already booked
    const existingBooking = await Booking.findOne({ 
      date: new Date(date), 
      time,
      status: { $ne: 'cancelled' }
    })

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose a different time.'
      })
    }

    // Create new booking
    const bookingNumber = generateBookingNumber()
    const booking = await Booking.create({
      bookingNumber,
      name,
      email,
      phone,
      service,
      date: new Date(date),
      time,
      sessionType,
      message,
      status: accessCode ? 'confirmed' : 'pending', // Only confirm if access code used
      paymentStatus: accessCode ? 'SKIPPED_MANUAL' : 'pending',
      finalAmount: accessCode ? 0 : getServicePrice(service),
      accessCodeUsed
    })

    // If no access code, return booking for payment processing
    if (!accessCode) {
      return res.status(201).json({
        success: true,
        message: 'Booking created, payment required',
        requiresPayment: true,
        data: {
          id: booking._id,
          bookingNumber: booking.bookingNumber,
          name: booking.name,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          sessionType: booking.sessionType,
          status: booking.status,
          amount: getServicePrice(service)
        }
      })
    }

    // Increment access code usage count only after successful booking
    if (accessCode) {
      const foundAccessCode = await AccessCode.findOne({ 
        code: accessCode.toUpperCase() 
      })
      if (foundAccessCode) {
        foundAccessCode.usedCount += 1
        await foundAccessCode.save()
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        name: booking.name,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        sessionType: booking.sessionType,
        status: booking.status
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Get all bookings (Admin only - for future use)
// @route   GET /api/bookings
// @access  Private (Admin)
router.get('/', authenticateAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, service, date } = req.query
    
    // Build filter object
    const filter = {}
    if (status) filter.status = status
    if (service) filter.service = service
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      filter.date = { $gte: startDate, $lt: endDate }
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')

    const total = await Booking.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Get available time slots for a specific date
// @route   GET /api/bookings/available-slots/:date
// @access  Public
router.get('/available-slots/:date', async (req, res, next) => {
  try {
    const { date } = req.params
    const requestedDate = new Date(date)

    // Check if date is valid and not in the past
    if (isNaN(requestedDate.getTime()) || requestedDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date or date is in the past'
      })
    }

    // Get all booked time slots for the date
    const bookedSlots = await Booking.find({
      date: requestedDate,
      status: { $ne: 'cancelled' }
    }).select('time')

    const bookedTimes = bookedSlots.map(booking => booking.time)
    const allTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot))

    res.status(200).json({
      success: true,
      data: {
        date: requestedDate,
        availableSlots,
        bookedSlots: bookedTimes
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Get booking by booking number or email (Public)
// @route   GET /api/bookings/lookup
// @access  Public
router.get('/lookup', async (req, res, next) => {
  try {
    const { bookingNumber, email } = req.query
    
    if (!bookingNumber && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking number or email'
      })
    }

    const query = {}
    if (bookingNumber) query.bookingNumber = bookingNumber
    if (email) query.email = email

    const bookings = await Booking.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: bookings
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Reschedule booking (Public)
// @route   PUT /api/bookings/reschedule/:id
// @access  Public
router.put('/reschedule/:id', async (req, res, next) => {
  try {
    const { date, time } = req.body
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Date and time are required'
      })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Check if booking can be rescheduled (12 hours before)
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

    if (hoursDiff < 12) {
      return res.status(400).json({
        success: false,
        message: 'Bookings can only be rescheduled at least 12 hours in advance'
      })
    }

    // Check if new time slot is available
    const existingBooking = await Booking.findOne({
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' },
      _id: { $ne: req.params.id }
    })

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose a different time.'
      })
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { date: new Date(date), time },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: updatedBooking
    })

  } catch (error) {
    next(error)
  }
})
// @desc    Cancel all active bookings (Admin only)
// @route   PUT /api/bookings/cancel-all
// @access  Private (Admin)
router.put('/cancel-all', authenticateAdmin, async (req, res, next) => {
  try {
    const result = await Booking.updateMany(
      { 
        status: { $nin: ['cancelled', 'completed'] },
        date: { $gte: new Date() } // Only cancel future bookings
      },
      { status: 'cancelled' }
    )

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} bookings cancelled successfully`,
      data: {
        cancelledCount: result.modifiedCount
      }
    })

  } catch (error) {
    next(error)
  }
})

// @desc    Delete all cancelled bookings (Admin only)
// @route   DELETE /api/bookings/delete-cancelled
// @access  Private (Admin)
router.delete('/delete-cancelled', authenticateAdmin, async (req, res, next) => {
  try {
    const result = await Booking.deleteMany({ status: 'cancelled' })

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} cancelled bookings deleted permanently`,
      data: {
        deletedCount: result.deletedCount
      }
    })

  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/bookings/:id
// @access  Private (Admin)
router.put('/:id', async (req, res, next) => {
  try {
    const { status, name, email, phone, service, date, time, sessionType, message } = req.body
    
    // If only status is being updated
    if (status && Object.keys(req.body).length === 1) {
      if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        })
      }

      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      )

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      })
    }
    
    // Full booking update
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone) updateData.phone = phone
    if (service) updateData.service = service
    if (date) updateData.date = new Date(date)
    if (time) updateData.time = time
    if (sessionType) updateData.sessionType = sessionType
    if (message !== undefined) updateData.message = message

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    })

  } catch (error) {
    next(error)
  }
})

export default router
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    sparse: true // Allow existing records without bookingNumber
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service selection is required'],
    enum: [
      'tarot',
      'reiki', 
      'water-divination',
      'spiritual-consultation'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0)
      },
      message: 'Date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    enum: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
  },
  sessionType: {
    type: String,
    required: [true, 'Session type is required'],
    enum: ['in-person', 'online']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'skipped'],
    default: 'pending'
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  accessCodeUsed: {
    type: String,
    trim: true,
    uppercase: true
  },
  paymentId: {
    type: String,
    trim: true
  },
  orderId: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date
  },
  failureReason: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Create compound index to prevent double booking (only for active bookings)
bookingSchema.index(
  { date: 1, time: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
  }
)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
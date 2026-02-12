import mongoose from 'mongoose'

const accessCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Access code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [6, 'Access code must be at least 6 characters'],
    maxlength: [20, 'Access code cannot exceed 20 characters']
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  maxUses: {
    type: Number,
    required: [true, 'Max uses is required'],
    min: [1, 'Max uses must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  allowedUser: {
    type: String,
    trim: true,
    lowercase: true
  },
  createdBy: {
    type: String,
    default: 'admin'
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
accessCodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Check if code is valid
accessCodeSchema.methods.isValid = function(userIdentifier = null) {
  const now = new Date()
  
  // Check status
  if (this.status !== 'active') {
    return { valid: false, reason: 'Access code is disabled' }
  }
  
  // Check expiry
  if (this.expiresAt < now) {
    return { valid: false, reason: 'Access code has expired' }
  }
  
  // Check usage limit
  if (this.usedCount >= this.maxUses) {
    return { valid: false, reason: 'Access code usage limit reached' }
  }
  
  // Check allowed user (if specified)
  if (this.allowedUser && userIdentifier) {
    if (this.allowedUser !== userIdentifier.toLowerCase()) {
      return { valid: false, reason: 'Access code not valid for this user' }
    }
  }
  
  return { valid: true }
}

const AccessCode = mongoose.model('AccessCode', accessCodeSchema)

export default AccessCode
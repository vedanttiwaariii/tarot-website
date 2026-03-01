import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    unique: true,
    enum: ['tarot', 'reiki', 'water-divination']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  fullDescription: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '45-60 minutes'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Service = mongoose.model('Service', serviceSchema)

export default Service

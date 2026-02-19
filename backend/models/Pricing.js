import mongoose from 'mongoose'

const pricingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    unique: true,
    enum: ['tarot', 'reiki', 'water-divination', 'spiritual-consultation']
  },
  basePrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  saleActive: {
    type: Boolean,
    default: false
  },
  saleLabel: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

pricingSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  if (this.saleActive && this.discount > 0) {
    this.currentPrice = Math.round(this.basePrice * (1 - this.discount / 100))
  } else {
    this.currentPrice = this.basePrice
  }
  next()
})

const Pricing = mongoose.model('Pricing', pricingSchema)

export default Pricing

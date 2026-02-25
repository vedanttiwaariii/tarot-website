import mongoose from 'mongoose';

const servicePricingSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    enum: ['tarot', 'reiki', 'water-divination']
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  originalPrice: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specialEvent: {
    type: String,
    default: null
  },
  validUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const ServicePricing = mongoose.model('ServicePricing', servicePricingSchema);
export default ServicePricing;

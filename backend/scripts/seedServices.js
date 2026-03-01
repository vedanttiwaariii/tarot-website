import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Service from '../models/Service.js'

const services = [
  {
    serviceType: 'tarot',
    title: 'Tarot Reading',
    shortDescription: 'Gain clarity and insight into your life\'s questions through the ancient wisdom of tarot cards',
    fullDescription: 'Experience profound insights through personalized tarot readings. Our experienced readers connect with your energy to provide guidance on love, career, spirituality, and life decisions.',
    features: [
      'Personalized card interpretation',
      'Guidance on life decisions',
      'Clarity on relationships and career',
      'Spiritual insights and direction'
    ],
    duration: '45-60 minutes',
    displayOrder: 1,
    isActive: true
  },
  {
    serviceType: 'reiki',
    title: 'Reiki Healing',
    shortDescription: 'Experience deep relaxation and energy healing through the gentle power of Reiki',
    fullDescription: 'Reiki is a Japanese healing technique that promotes relaxation, reduces stress, and facilitates healing by channeling universal life energy. Experience balance and harmony in body, mind, and spirit.',
    features: [
      'Energy balancing and alignment',
      'Stress and anxiety relief',
      'Physical and emotional healing',
      'Chakra cleansing and activation'
    ],
    duration: '60 minutes',
    displayOrder: 2,
    isActive: true
  },
  {
    serviceType: 'water-divination',
    title: 'Water Divination',
    shortDescription: 'Discover hidden truths and receive divine messages through the sacred practice of water scrying',
    fullDescription: 'Water divination is an ancient mystical practice that uses water as a medium to receive spiritual messages and insights. Through focused meditation and intuitive connection, receive guidance from the spiritual realm.',
    features: [
      'Ancient divination technique',
      'Spiritual message channeling',
      'Deep intuitive insights',
      'Connection with higher consciousness'
    ],
    duration: '45 minutes',
    displayOrder: 3,
    isActive: true
  }
]

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('📦 Connected to MongoDB')

    await Service.deleteMany({})
    console.log('🗑️  Cleared existing services')

    await Service.insertMany(services)
    console.log('✅ Services seeded successfully')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedServices()

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Content from '../models/Content.js';
import ServicePricing from '../models/ServicePricing.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Seed Service Pricing
    const pricingData = [
      {
        serviceId: 'tarot',
        name: 'Tarot Reading',
        price: 1100,
        currency: 'INR'
      },
      {
        serviceId: 'reiki',
        name: 'Reiki Healing',
        price: 1551,
        currency: 'INR'
      },
      {
        serviceId: 'water-divination',
        name: 'Water Divination (Jal Jyotishi)',
        price: 21000,
        currency: 'INR'
      }
    ];

    for (const pricing of pricingData) {
      await ServicePricing.findOneAndUpdate(
        { serviceId: pricing.serviceId },
        pricing,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Pricing data seeded');

    // Seed Content Sections
    const contentData = [
      {
        sectionId: 'hero-title',
        type: 'text',
        content: 'Krushnalaya'
      },
      {
        sectionId: 'hero-tagline',
        type: 'text',
        content: 'KNOW · HEAL · GROW'
      },
      {
        sectionId: 'hero-description',
        type: 'text',
        content: 'When life feels uncertain, clarity begins within. Discover your direction through spiritual guidance.'
      },
      {
        sectionId: 'service-tarot',
        type: 'object',
        content: {
          title: 'Tarot Reading',
          description: 'Personalized guidance for clarity, direction, and confident decisions.',
          features: [
            'Custom card spread based on concern',
            'Deep intuitive interpretation',
            'Love, career & life insights',
            'Follow-up clarification support',
            'Past, present, future guidance',
            'Recorded session notes'
          ]
        }
      },
      {
        sectionId: 'service-reiki',
        type: 'object',
        content: {
          title: 'Reiki Healing',
          description: 'A structured 21-day healing journey for deep energetic reset.',
          features: [
            'Daily energy healing sessions',
            'Chakra balancing & emotional release',
            '21-session set (most recommended)',
            'Complete package ₹2100',
            'Stress & anxiety relief',
            'Physical & emotional healing'
          ]
        }
      },
      {
        sectionId: 'service-jal',
        type: 'object',
        content: {
          title: 'Jal Jyotish',
          description: 'Strategic water source assessment using traditional methods.',
          features: [
            'Land & directional evaluation',
            'Energetic field analysis',
            'Recommended drilling location',
            'Cost-risk optimization insight',
            'Depth estimation guidance',
            'Post-drilling consultation'
          ]
        }
      },
      {
        sectionId: 'about-journey',
        type: 'text',
        content: 'The seeds were always within me. Through years of study in tarot, energy healing, and ancient wisdom traditions, I discovered that true knowledge comes from quiet moments of connection. When this journey led me to understand myself, I felt called to help others discover their inner clarity.'
      },
      {
        sectionId: 'about-qualifications',
        type: 'list',
        content: [
          'Certified Tarot Reader (10+ years)',
          'Reiki Master Teacher',
          'Traditional Jal Jyotishi Specialist',
          'Crystal Healing Therapist'
        ]
      }
    ];

    for (const content of contentData) {
      await Content.findOneAndUpdate(
        { sectionId: content.sectionId },
        content,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Content data seeded');

    console.log('🎉 Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

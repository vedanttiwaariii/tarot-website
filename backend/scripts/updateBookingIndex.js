import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const updateBookingIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const db = mongoose.connection.db
    const collection = db.collection('bookings')

    // Drop the old index if it exists
    try {
      await collection.dropIndex({ date: 1, time: 1 })
      console.log('Dropped old index: { date: 1, time: 1 }')
    } catch (error) {
      console.log('Old index not found or already dropped')
    }

    // Create new index with partial filter
    await collection.createIndex(
      { date: 1, time: 1 },
      { 
        unique: true,
        partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
        name: 'date_time_active_unique'
      }
    )
    console.log('Created new index: { date: 1, time: 1 } with partial filter for active bookings')

    console.log('Index update completed successfully!')
    
  } catch (error) {
    console.error('Error updating index:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    process.exit(0)
  }
}

updateBookingIndex()
import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import dotenv from 'dotenv'

dotenv.config()

const migratePaymentStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Update COMPLETED to completed
    const completedResult = await Booking.updateMany(
      { paymentStatus: 'COMPLETED' },
      { $set: { paymentStatus: 'completed' } }
    )
    console.log(`✅ Updated ${completedResult.modifiedCount} bookings: COMPLETED → completed`)

    // Update FAILED to failed
    const failedResult = await Booking.updateMany(
      { paymentStatus: 'FAILED' },
      { $set: { paymentStatus: 'failed' } }
    )
    console.log(`✅ Updated ${failedResult.modifiedCount} bookings: FAILED → failed`)

    // Update PENDING to pending
    const pendingResult = await Booking.updateMany(
      { paymentStatus: 'PENDING' },
      { $set: { paymentStatus: 'pending' } }
    )
    console.log(`✅ Updated ${pendingResult.modifiedCount} bookings: PENDING → pending`)

    // Update SKIPPED_MANUAL to skipped
    const skippedResult = await Booking.updateMany(
      { paymentStatus: 'SKIPPED_MANUAL' },
      { $set: { paymentStatus: 'skipped' } }
    )
    console.log(`✅ Updated ${skippedResult.modifiedCount} bookings: SKIPPED_MANUAL → skipped`)

    console.log('\n✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migratePaymentStatus()

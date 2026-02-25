import ServicePricing from '../models/ServicePricing.js';

// Check and reset expired special events
export const resetExpiredSpecialEvents = async () => {
  try {
    const now = new Date();
    
    // Find all services with expired special events
    const expiredServices = await ServicePricing.find({
      specialEvent: { $ne: null },
      validUntil: { $lte: now }
    });

    if (expiredServices.length === 0) {
      return;
    }

    // Reset each expired service
    for (const service of expiredServices) {
      if (service.originalPrice) {
        service.price = service.originalPrice;
      }
      service.originalPrice = null;
      service.specialEvent = null;
      service.validUntil = null;
      await service.save();
      
      console.log(`✅ Reset expired special event for ${service.name}`);
    }

    console.log(`🔄 Reset ${expiredServices.length} expired special events`);
  } catch (error) {
    console.error('❌ Error resetting expired special events:', error);
  }
};

// Run every 5 minutes
export const startSpecialEventCron = () => {
  // Run immediately on startup
  resetExpiredSpecialEvents();
  
  // Then run every 5 minutes
  setInterval(resetExpiredSpecialEvents, 5 * 60 * 1000);
  
  console.log('⏰ Special event cron job started (runs every 5 minutes)');
};

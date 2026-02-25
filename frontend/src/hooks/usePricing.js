import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePricing = () => {
  const [pricing, setPricing] = useState({
    tarot: { price: 1100, originalPrice: null, specialEvent: null },
    reiki: { price: 1551, originalPrice: null, specialEvent: null },
    'water-divination': { price: 21000, originalPrice: null, specialEvent: null }
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get('/api/pricing');
        const pricingData = {};
        response.data.data.forEach(item => {
          pricingData[item.serviceId] = {
            price: item.price,
            originalPrice: item.originalPrice,
            specialEvent: item.specialEvent
          };
        });
        setPricing(prev => ({ ...prev, ...pricingData }));
      } catch (error) {
        console.error('Error fetching pricing:', error);
      }
    };

    fetchPricing();
  }, []);

  return pricing;
};

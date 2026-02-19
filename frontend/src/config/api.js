// API Configuration
// File: frontend/src/config/api.js

export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API_URL || 'https://your-domain.com'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Booking endpoints
  BOOKINGS: '/api/bookings',
  AVAILABLE_SLOTS: '/api/bookings/available-slots',
  
  // Payment endpoints
  CREATE_ORDER: '/api/payments/create-order',
  VERIFY_PAYMENT: '/api/payments/verify',
  PAYMENT_FAILURE: '/api/payments/failure',
  PAYMENT_CONFIG: '/api/payments/config',
  
  // Contact endpoints
  CONTACT: '/api/contact',
  
  // Auth endpoints
  AUTH_VERIFY: '/api/auth/verify',
  
  // Health check
  HEALTH: '/api/health'
}

// Create full URL
export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

// Default fetch options
export const defaultFetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
}

// API helper function
export const apiCall = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint)
  const config = {
    ...defaultFetchOptions,
    ...options,
  }
  
  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}
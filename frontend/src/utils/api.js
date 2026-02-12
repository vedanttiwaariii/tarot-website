import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// API functions
export const bookingAPI = {
  create: (data) => api.post('/api/bookings', data),
  getAvailableSlots: (date) => api.get(`/api/bookings/available-slots/${date}`),
}

export const contactAPI = {
  create: (data) => api.post('/api/contact', data),
}

export const healthAPI = {
  check: () => api.get('/api/health'),
}

export default api
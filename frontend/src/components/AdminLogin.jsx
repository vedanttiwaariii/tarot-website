import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const AdminLogin = ({ onLoginSuccess }) => {
  const [adminKey, setAdminKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        adminKey
      })

      const { token } = response.data.data
      
      // Store token in localStorage
      localStorage.setItem('adminToken', token)
      
      // Set default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      onLoginSuccess()
      
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cosmic-blue flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mystical w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-mystical text-3xl font-bold text-gradient mb-2">
            Admin Login
          </h1>
          <p className="text-gray-300">Enter your admin key to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gold font-semibold mb-2">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-3 bg-cosmic-blue/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
              placeholder="Enter admin key"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminLogin
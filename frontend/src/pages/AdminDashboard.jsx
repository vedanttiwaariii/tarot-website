import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import AdminLogin from '../components/AdminLogin'

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [error, setError] = useState('')
  const [messagesError, setMessagesError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormSubmitting, setAddFormSubmitting] = useState(false)
  const [addFormMessage, setAddFormMessage] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [editFormSubmitting, setEditFormSubmitting] = useState(false)
  const [editFormMessage, setEditFormMessage] = useState('')
  const [showCancelled, setShowCancelled] = useState(false)
  const { register: registerAdd, handleSubmit: handleAddSubmit, formState: { errors: addErrors }, reset: resetAdd } = useForm()
  const { register: registerEdit, handleSubmit: handleEditSubmit, formState: { errors: editErrors }, reset: resetEdit, setValue } = useForm()

  const bookingServices = [
    { value: 'tarot', label: 'Tarot Reading - ₹1,100', duration: '30 min' },
    { value: 'reiki', label: 'Reiki Healing - ₹1,551', duration: '60 min' },
    { value: 'water-divination', label: 'Water Divination - ₹21,000', duration: '45 min' },
    { value: 'spiritual-consultation', label: 'Spiritual Consultation - ₹2,500', duration: '90 min' },
    { value: 'group-session', label: 'Group Session - ₹800/person', duration: '60 min' }
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ]

  const [activeTab, setActiveTab] = useState('bookings')
  const [generatedCode, setGeneratedCode] = useState('')

  const onAddBooking = async (data) => {
    setAddFormSubmitting(true)
    setAddFormMessage('')
    
    try {
      const response = await axios.post('/api/bookings', { ...data, source: 'admin' })
      setAddFormMessage(`Booking created successfully! Booking Number: ${response.data.data.bookingNumber}`)
      resetAdd()
      setShowAddForm(false)
      fetchBookings()
    } catch (error) {
      setAddFormMessage(error.response?.data?.message || 'Error creating booking')
    } finally {
      setAddFormSubmitting(false)
    }
  }

  const onEditBooking = async (data) => {
    setEditFormSubmitting(true)
    setEditFormMessage('')
    
    try {
      await axios.put(`/api/bookings/${editingBooking._id}`, data)
      setEditFormMessage('Booking updated successfully!')
      setShowEditForm(false)
      setEditingBooking(null)
      fetchBookings()
    } catch (error) {
      setEditFormMessage(error.response?.data?.message || 'Error updating booking')
    } finally {
      setEditFormSubmitting(false)
    }
  }

  const openEditForm = (booking) => {
    setEditingBooking(booking)
    setValue('name', booking.name)
    setValue('phone', booking.phone)
    setValue('email', booking.email)
    setValue('service', booking.service)
    setValue('date', new Date(booking.date).toISOString().split('T')[0])
    setValue('time', booking.time)
    setValue('sessionType', booking.sessionType)
    setValue('message', booking.message || '')
    setShowEditForm(true)
    setEditFormMessage('')
  }

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await updateBookingStatus(bookingId, 'cancelled')
    }
  }

  const cancelAllBookings = async () => {
    const activeBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed')
    if (activeBookings.length === 0) {
      alert('No active bookings to cancel')
      return
    }
    
    if (window.confirm(`Are you sure you want to cancel all ${activeBookings.length} active bookings? This action cannot be undone.`)) {
      try {
        await axios.put('/api/bookings/cancel-all')
        fetchBookings()
        alert('All active bookings have been cancelled successfully')
      } catch (error) {
        console.error('Error cancelling all bookings:', error)
        alert('Error cancelling bookings. Please try again.')
      }
    }
  }

  const deleteCancelledBookings = async () => {
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled')
    if (cancelledBookings.length === 0) {
      alert('No cancelled bookings to delete')
      return
    }
    
    if (window.confirm(`Are you sure you want to permanently delete all ${cancelledBookings.length} cancelled bookings? This action cannot be undone.`)) {
      try {
        await axios.delete('/api/bookings/delete-cancelled')
        fetchBookings()
        alert('All cancelled bookings have been deleted permanently')
      } catch (error) {
        console.error('Error deleting cancelled bookings:', error)
        alert('Error deleting bookings. Please try again.')
      }
    }
  }

  const filteredBookings = showCancelled ? bookings : bookings.filter(b => b.status !== 'cancelled')

  const generateSingleUseCode = async () => {
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const response = await axios.post('/api/access-codes', {
        code,
        expiresAt: tomorrow.toISOString(),
        maxUses: 1
      })
      
      setGeneratedCode(code)
    } catch (error) {
      console.error('Error generating access code:', error)
      alert('Error generating access code')
    }
  }

  useEffect(() => {
    checkAuthStatus()
    fetchBookings()
    fetchMessages()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      setIsCheckingAuth(false)
      return
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await axios.get('/api/auth/verify')
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('adminToken')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    fetchBookings()
    fetchMessages()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/bookings')
      setBookings(response.data.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    const originalBookings = [...bookings]
    
    // Optimistic update
    setBookings(prev => prev.map(booking => 
      booking._id === bookingId ? { ...booking, status: newStatus } : booking
    ))

    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus })
    } catch (error) {
      // Revert on error
      setBookings(originalBookings)
      console.error('Error updating booking status:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true)
      const response = await axios.get('/api/contact')
      setMessages(response.data.data)
      setMessagesError('')
    } catch (err) {
      setMessagesError('Failed to fetch messages')
      console.error('Error fetching messages:', err)
    } finally {
      setMessagesLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const time = date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
    return `${day}/${month}/${year} ${time}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-cosmic-blue py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-mystical text-4xl font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-300">Manage bookings and messages</p>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'bg-gold text-cosmic-blue'
                : 'bg-deep-purple/20 text-gold hover:bg-deep-purple/40'
            }`}
          >
            Bookings ({bookings.filter(b => b.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'bg-gold text-cosmic-blue'
                : 'bg-deep-purple/20 text-gold hover:bg-deep-purple/40'
            }`}
          >
            Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('access-codes')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'access-codes'
                ? 'bg-gold text-cosmic-blue'
                : 'bg-deep-purple/20 text-gold hover:bg-deep-purple/40'
            }`}
          >
            Access Codes
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-mystical overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold">Bookings ({filteredBookings.length})</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCancelled(!showCancelled)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    showCancelled ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {showCancelled ? 'Hide Cancelled' : 'Show Cancelled'}
                </button>
                <button 
                  onClick={cancelAllBookings}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Cancel All
                </button>
                <button 
                  onClick={deleteCancelledBookings}
                  className="px-3 py-1 text-sm bg-red-800 text-white rounded hover:bg-red-900 transition-colors"
                >
                  Delete Cancelled
                </button>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary text-sm"
                >
                  Add Booking
                </button>
                <button 
                  onClick={fetchBookings}
                  className="btn-secondary text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-gray-400">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={fetchBookings} className="btn-primary">Retry</button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No bookings found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="pb-3 text-gold font-semibold">Booking #</th>
                        <th className="pb-3 text-gold font-semibold">Name</th>
                        <th className="pb-3 text-gold font-semibold">Service</th>
                        <th className="pb-3 text-gold font-semibold">Date</th>
                        <th className="pb-3 text-gold font-semibold">Time</th>
                        <th className="pb-3 text-gold font-semibold">Session Type</th>
                        <th className="pb-3 text-gold font-semibold">Status</th>
                        <th className="pb-3 text-gold font-semibold">Created</th>
                        <th className="pb-3 text-gold font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, index) => (
                        <tr
                          key={booking._id}
                          className="border-b border-gray-700/30 hover:bg-deep-purple/10 transition-colors"
                        >
                          <td className="py-3 text-aqua font-mono text-sm">{booking.bookingNumber}</td>
                          <td className="py-3 text-white">{booking.name}</td>
                          <td className="py-3 text-gray-300 capitalize">{booking.service.replace('-', ' ')}</td>
                          <td className="py-3 text-gray-300">{formatDate(booking.date)}</td>
                          <td className="py-3 text-gray-300">{booking.time}</td>
                          <td className="py-3 text-gray-300 capitalize">{booking.sessionType.replace('-', ' ')}</td>
                          <td className={`py-3 capitalize font-semibold ${getStatusColor(booking.status)}`}>
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className="bg-cosmic-blue/50 border border-gold/30 rounded px-2 py-1 text-sm text-white focus:border-gold focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">{formatDateTime(booking.createdAt)}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditForm(booking)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => cancelBooking(booking._id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Cards */}
                <div className="lg:hidden space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{booking.name}</h3>
                          <p className="text-aqua font-mono text-sm">{booking.bookingNumber}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)} bg-cosmic-blue/30`}>
                          {booking.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gold font-semibold">Service:</span>
                          <p className="text-gray-300 capitalize">{booking.service.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gold font-semibold">Session:</span>
                          <p className="text-gray-300 capitalize">{booking.sessionType.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gold font-semibold">Date:</span>
                          <p className="text-gray-300">{formatDate(booking.date)}</p>
                        </div>
                        <div>
                          <span className="text-gold font-semibold">Time:</span>
                          <p className="text-gray-300">{booking.time}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <label className="block text-gold font-semibold text-sm mb-2">Status:</label>
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          className="w-full bg-cosmic-blue/50 border border-gold/30 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openEditForm(booking)}
                          className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="flex-1 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700/30">
                        Created: {formatDateTime(booking.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-mystical overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold">Messages ({messages.length})</h2>
              <button 
                onClick={fetchMessages}
                className="btn-secondary text-sm"
              >
                Refresh
              </button>
            </div>

            {messagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-gray-400">Loading messages...</p>
              </div>
            ) : messagesError ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">{messagesError}</p>
                <button onClick={fetchMessages} className="btn-primary">Retry</button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No messages found</p>
              </div>
            ) : (
              <>
                {/* Desktop Layout */}
                <div className="hidden lg:block space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message._id}
                      className="bg-deep-purple/20 border border-gold/20 rounded-lg p-6 hover:bg-deep-purple/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{message.name}</h3>
                          <p className="text-gray-400 text-sm">{message.email}</p>
                          {message.phone && <p className="text-gray-400 text-sm">{message.phone}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-semibold capitalize">{message.subject.replace('-', ' ')}</p>
                          <p className="text-gray-400 text-sm">{formatDateTime(message.createdAt)}</p>
                        </div>
                      </div>
                      <div className="bg-cosmic-blue/30 rounded-lg p-4">
                        <p className="text-gray-300 leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile/Tablet Cards */}
                <div className="lg:hidden space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{message.name}</h3>
                          <p className="text-gray-400 text-sm">{message.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-semibold text-sm capitalize">{message.subject.replace('-', ' ')}</p>
                        </div>
                      </div>
                      
                      {message.phone && (
                        <div>
                          <span className="text-gold font-semibold text-sm">Phone:</span>
                          <p className="text-gray-300 text-sm">{message.phone}</p>
                        </div>
                      )}
                      
                      <div className="bg-cosmic-blue/30 rounded-lg p-3">
                        <p className="text-gray-300 text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700/30">
                        Received: {formatDateTime(message.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
        {/* Access Codes Tab */}
        {activeTab === 'access-codes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-mystical"
          >
            <h2 className="text-2xl font-bold text-gold mb-6">Access Code Management</h2>
            
            <div className="mb-6">
              <button
                onClick={generateSingleUseCode}
                className="btn-primary"
              >
                Generate Single-Use Code
              </button>
            </div>
            
            {generatedCode && (
              <div className="bg-gold/20 border border-gold/50 rounded-lg p-4 mb-6">
                <div className="text-gold font-bold text-lg mb-2">Generated Access Code:</div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-mono text-2xl text-white">{generatedCode}</div>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                    className="px-3 py-1 bg-gold text-cosmic-blue rounded text-sm hover:bg-gold/80 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-sm text-gray-300">Single use • Expires in 24 hours</div>
              </div>
            )}
            
            <p className="text-gray-300">Generate access codes for clients to skip payment process.</p>
          </motion.div>
        )}

        {/* Edit Booking Modal */}
        {showEditForm && editingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-cosmic-blue border border-gold/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gold">Edit Booking</h3>
                <button 
                  onClick={() => { setShowEditForm(false); setEditFormMessage(''); }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit(onEditBooking)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      {...registerEdit('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                    />
                    {editErrors.name && <p className="text-red-400 text-sm mt-1">{editErrors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gold font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      {...registerEdit('phone', { required: 'Phone is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                    />
                    {editErrors.phone && <p className="text-red-400 text-sm mt-1">{editErrors.phone.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    {...registerEdit('email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                  />
                  {editErrors.email && <p className="text-red-400 text-sm mt-1">{editErrors.email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Service *</label>
                  <select
                    {...registerEdit('service', { required: 'Service is required' })}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                  >
                    <option value="">Select service...</option>
                    {bookingServices.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  {editErrors.service && <p className="text-red-400 text-sm mt-1">{editErrors.service.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold font-semibold mb-2">Date *</label>
                    <input
                      type="date"
                      {...registerEdit('date', { required: 'Date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                    />
                    {editErrors.date && <p className="text-red-400 text-sm mt-1">{editErrors.date.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gold font-semibold mb-2">Time *</label>
                    <select
                      {...registerEdit('time', { required: 'Time is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {editErrors.time && <p className="text-red-400 text-sm mt-1">{editErrors.time.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Session Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="in-person"
                        {...registerEdit('sessionType', { required: 'Session type is required' })}
                        className="mr-2 text-gold focus:ring-gold"
                      />
                      <span className="text-white">In-Person</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="online"
                        {...registerEdit('sessionType', { required: 'Session type is required' })}
                        className="mr-2 text-gold focus:ring-gold"
                      />
                      <span className="text-white">Online</span>
                    </label>
                  </div>
                  {editErrors.sessionType && <p className="text-red-400 text-sm mt-1">{editErrors.sessionType.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Message</label>
                  <textarea
                    {...registerEdit('message')}
                    rows="3"
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none resize-none"
                    placeholder="Optional message or notes..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowEditForm(false); setEditFormMessage(''); }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editFormSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editFormSubmitting ? 'Updating...' : 'Update Booking'}
                  </button>
                </div>
                
                {editFormMessage && (
                  <div className={`text-center p-3 rounded ${
                    editFormMessage.includes('successfully') 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {editFormMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Add Booking Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-cosmic-blue border border-gold/20 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gold">Add New Booking</h3>
                <button 
                  onClick={() => { setShowAddForm(false); setAddFormMessage(''); }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit(onAddBooking)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      {...registerAdd('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                      placeholder="Client name"
                    />
                    {addErrors.name && <p className="text-red-400 text-sm mt-1">{addErrors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gold font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      {...registerAdd('phone', { required: 'Phone is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                      placeholder="Phone number"
                    />
                    {addErrors.phone && <p className="text-red-400 text-sm mt-1">{addErrors.phone.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    {...registerAdd('email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                    placeholder="Email address"
                  />
                  {addErrors.email && <p className="text-red-400 text-sm mt-1">{addErrors.email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Service *</label>
                  <select
                    {...registerAdd('service', { required: 'Service is required' })}
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                  >
                    <option value="">Select service...</option>
                    {bookingServices.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  {addErrors.service && <p className="text-red-400 text-sm mt-1">{addErrors.service.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold font-semibold mb-2">Date *</label>
                    <input
                      type="date"
                      {...registerAdd('date', { required: 'Date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                    />
                    {addErrors.date && <p className="text-red-400 text-sm mt-1">{addErrors.date.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gold font-semibold mb-2">Time *</label>
                    <select
                      {...registerAdd('time', { required: 'Time is required' })}
                      className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white focus:border-gold focus:outline-none"
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {addErrors.time && <p className="text-red-400 text-sm mt-1">{addErrors.time.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Session Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="in-person"
                        {...registerAdd('sessionType', { required: 'Session type is required' })}
                        className="mr-2 text-gold focus:ring-gold"
                      />
                      <span className="text-white">In-Person</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="online"
                        {...registerAdd('sessionType', { required: 'Session type is required' })}
                        className="mr-2 text-gold focus:ring-gold"
                      />
                      <span className="text-white">Online</span>
                    </label>
                  </div>
                  {addErrors.sessionType && <p className="text-red-400 text-sm mt-1">{addErrors.sessionType.message}</p>}
                </div>
                
                <div>
                  <label className="block text-gold font-semibold mb-2">Message</label>
                  <textarea
                    {...registerAdd('message')}
                    rows="3"
                    className="w-full px-3 py-2 bg-cosmic-blue/50 border border-gold/30 rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none resize-none"
                    placeholder="Optional message or notes..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setAddFormMessage(''); }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addFormSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addFormSubmitting ? 'Creating...' : 'Create Booking'}
                  </button>
                </div>
                
                {addFormMessage && (
                  <div className={`text-center p-3 rounded ${
                    addFormMessage.includes('successfully') 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {addFormMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard
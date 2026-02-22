import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import AdminLogin from '../components/AdminLogin'

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')
  const [filterStatus, setFilterStatus] = useState('active')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

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
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/contact')
      setMessages(response.data.data)
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    const updatedBookings = bookings.map(b => 
      b._id === bookingId ? { ...b, status: newStatus } : b
    )
    setBookings(updatedBookings)
    const updatedSelected = updatedBookings.find(b => b._id === bookingId)
    setSelectedBooking(updatedSelected)
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus })
    } catch (error) {
      console.error('Error updating booking:', error)
      fetchBookings()
    }
  }

  const deleteBooking = async (bookingId) => {
    if (!confirm('Permanently delete this booking? This cannot be undone.')) return
    setSelectedBooking(null)
    try {
      await axios.delete(`/api/bookings/${bookingId}`)
      setBookings(prev => prev.filter(b => b._id !== bookingId))
    } catch (error) {
      console.error('Error deleting booking:', error)
      fetchBookings()
    }
  }

  const restoreBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'pending' })
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'pending' } : b))
    } catch (error) {
      console.error('Error restoring booking:', error)
      fetchBookings()
    }
  }

  const handleLongPress = (bookingId) => {
    setSelectionMode(true)
    setSelectedIds([bookingId])
  }

  const toggleSelection = (bookingId) => {
    setSelectedIds(prev => 
      prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]
    )
  }

  const exitSelectionMode = () => {
    setSelectionMode(false)
    setSelectedIds([])
  }

  const bulkUpdateStatus = async (status) => {
    if (!confirm(`Update ${selectedIds.length} bookings to ${status}?`)) return
    try {
      await Promise.all(selectedIds.map(id => axios.put(`/api/bookings/${id}`, { status })))
      setBookings(prev => prev.map(b => selectedIds.includes(b._id) ? { ...b, status } : b))
      exitSelectionMode()
    } catch (error) {
      console.error('Error updating bookings:', error)
      fetchBookings()
    }
  }

  const bulkDelete = async () => {
    if (!confirm(`Permanently delete ${selectedIds.length} bookings? This cannot be undone.`)) return
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`/api/bookings/${id}`)))
      setBookings(prev => prev.filter(b => !selectedIds.includes(b._id)))
      exitSelectionMode()
    } catch (error) {
      console.error('Error deleting bookings:', error)
      fetchBookings()
    }
  }

  const bulkRestore = async () => {
    if (!confirm(`Restore ${selectedIds.length} bookings?`)) return
    try {
      await Promise.all(selectedIds.map(id => axios.put(`/api/bookings/${id}`, { status: 'pending' })))
      setBookings(prev => prev.map(b => selectedIds.includes(b._id) ? { ...b, status: 'pending' } : b))
      exitSelectionMode()
    } catch (error) {
      console.error('Error restoring bookings:', error)
      fetchBookings()
    }
  }

  const deleteCancelledPermanently = async () => {
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length
    if (cancelledCount === 0) {
      alert('No cancelled bookings to delete')
      return
    }
    if (!confirm(`Delete all ${cancelledCount} cancelled bookings permanently?`)) return
    try {
      await axios.delete('/api/bookings/delete-cancelled')
      setBookings(prev => prev.filter(b => b.status !== 'cancelled'))
    } catch (error) {
      console.error('Error deleting cancelled bookings:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-500',
      pending: 'bg-yellow-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getPaymentColor = (status) => {
    const colors = {
      completed: 'text-green-400',
      pending: 'text-yellow-400',
      failed: 'text-red-400',
      skipped: 'text-blue-400'
    }
    return colors[status] || 'text-gray-400'
  }

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return b.status === 'pending' || b.status === 'confirmed'
    if (filterStatus === 'failed') return b.paymentStatus === 'failed'
    if (filterStatus === 'cancelled') return b.status === 'cancelled'
    if (filterStatus === 'completed') return b.status === 'completed'
    return true
  })

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-cosmic-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-cosmic-blue">
      {/* Header */}
      <div className="bg-deep-purple/30 border-b border-gold/20 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gold">Admin</h1>
            <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-deep-purple/20 border-b border-gold/10 sticky top-[57px] z-30">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'bg-gold/20 text-gold border-b-2 border-gold'
                : 'text-gray-400'
            }`}
          >
            Bookings
            <span className="ml-1 text-xs">({bookings.filter(b => b.status !== 'cancelled').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'bg-gold/20 text-gold border-b-2 border-gold'
                : 'text-gray-400'
            }`}
          >
            Messages
            <span className="ml-1 text-xs">({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="p-4 space-y-4">
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-gold text-cosmic-blue' : 'bg-deep-purple/30 text-gray-300'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === 'active' ? 'bg-gold text-cosmic-blue' : 'bg-deep-purple/30 text-gray-300'
              }`}
            >
              Active ({bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === 'failed' ? 'bg-red-500 text-white' : 'bg-deep-purple/30 text-gray-300'
              }`}
            >
              Failed ({bookings.filter(b => b.paymentStatus === 'failed').length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === 'completed' ? 'bg-blue-500 text-white' : 'bg-deep-purple/30 text-gray-300'
              }`}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === 'cancelled' ? 'bg-gray-500 text-white' : 'bg-deep-purple/30 text-gray-300'
              }`}
            >
              Deleted ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>

          {/* Delete Permanently Button for Cancelled Tab */}
          {filterStatus === 'cancelled' && bookings.filter(b => b.status === 'cancelled').length > 0 && (
            <button
              onClick={deleteCancelledPermanently}
              className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700"
            >
              Delete All Permanently ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          )}

          {/* Booking Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No bookings found</div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => {
                const isSelected = selectedIds.includes(booking._id)
                let pressTimer
                
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-deep-purple/20 border rounded-lg p-4 active:bg-deep-purple/30 relative ${
                      isSelected ? 'border-gold' : 'border-gold/20'
                    }`}
                    onTouchStart={() => {
                      pressTimer = setTimeout(() => handleLongPress(booking._id), 500)
                    }}
                    onTouchEnd={() => clearTimeout(pressTimer)}
                    onTouchMove={() => clearTimeout(pressTimer)}
                    onClick={() => {
                      if (selectionMode) {
                        toggleSelection(booking._id)
                      } else {
                        setSelectedBooking(booking)
                      }
                    }}
                  >
                    {selectionMode && (
                      <div className="absolute top-2 left-2">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-gold border-gold' : 'border-gray-400'
                        }`}>
                          {isSelected && <span className="text-cosmic-blue text-sm">✓</span>}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <div className={`flex-1 ${selectionMode ? 'ml-8' : ''}`}>
                        <h3 className="text-white font-semibold">{booking.name}</h3>
                        <p className="text-xs text-aqua font-mono">{booking.bookingNumber}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)} mt-1.5`}></div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                      <span className="capitalize">{booking.service.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{formatDate(booking.date)}</span>
                      <span>•</span>
                      <span>{booking.time}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`capitalize font-semibold ${getStatusColor(booking.status).replace('bg-', 'text-')}`}>
                        {booking.status}
                      </span>
                      <span className="text-gray-400">{booking.sessionType}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No messages</div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4 active:bg-deep-purple/30"
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{message.name}</h3>
                    <p className="text-xs text-gray-400">{message.email}</p>
                  </div>
                  <span className="text-xs text-gold capitalize">{message.subject.replace('-', ' ')}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                <p className="text-xs text-gray-500 mt-2">{formatDateTime(message.createdAt)}</p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-deep-purple border-t border-gold/20 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">{selectedIds.length} selected</span>
            <button onClick={exitSelectionMode} className="text-gray-400 text-sm">Cancel</button>
          </div>
          {filterStatus === 'cancelled' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={bulkRestore}
                className="py-2 bg-green-600 text-white rounded text-sm font-semibold active:bg-green-700"
              >
                Restore
              </button>
              <button
                onClick={bulkDelete}
                className="py-2 bg-red-600 text-white rounded text-sm font-semibold active:bg-red-700"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => bulkUpdateStatus('confirmed')}
                className="py-2 bg-green-600 text-white rounded text-sm font-semibold active:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => bulkUpdateStatus('completed')}
                className="py-2 bg-blue-600 text-white rounded text-sm font-semibold active:bg-blue-700"
              >
                Complete
              </button>
              <button
                onClick={() => bulkUpdateStatus('cancelled')}
                className="py-2 bg-yellow-600 text-white rounded text-sm font-semibold active:bg-yellow-700"
              >
                Cancel
              </button>
              <button
                onClick={bulkDelete}
                className="py-2 bg-red-600 text-white rounded text-sm font-semibold active:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-cosmic-blue w-full sm:max-w-lg sm:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-deep-purple/50 backdrop-blur-sm border-b border-gold/20 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-gold uppercase">Booking Number</label>
                <p className="text-white font-mono">{selectedBooking.bookingNumber}</p>
              </div>

              <div>
                <label className="text-xs text-gold uppercase">Name</label>
                <p className="text-white">{selectedBooking.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gold uppercase">Email</label>
                  <p className="text-white text-sm break-all">{selectedBooking.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gold uppercase">Phone</label>
                  <p className="text-white text-sm">{selectedBooking.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gold uppercase">Service</label>
                <p className="text-white capitalize">{selectedBooking.service.replace('-', ' ')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gold uppercase">Date</label>
                  <p className="text-white">{formatDate(selectedBooking.date)}</p>
                </div>
                <div>
                  <label className="text-xs text-gold uppercase">Time</label>
                  <p className="text-white">{selectedBooking.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gold uppercase">Session Type</label>
                  <p className="text-white capitalize">{selectedBooking.sessionType}</p>
                </div>
                <div>
                  <label className="text-xs text-gold uppercase">Payment</label>
                  <p className={`capitalize font-semibold ${getPaymentColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <label className="text-xs text-gold uppercase">Message</label>
                  <p className="text-white text-sm">{selectedBooking.message}</p>
                </div>
              )}

              <div>
                <label className="text-xs text-gold uppercase mb-2 block">Status</label>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => updateBookingStatus(selectedBooking._id, e.target.value)}
                  className="w-full px-3 py-2 bg-deep-purple/30 border border-gold/30 rounded text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-4 space-y-2">
                {selectedBooking.status === 'cancelled' ? (
                  <>
                    <button
                      onClick={() => restoreBooking(selectedBooking._id)}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold active:bg-green-700"
                    >
                      Restore Booking
                    </button>
                    <button
                      onClick={() => deleteBooking(selectedBooking._id)}
                      className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700"
                    >
                      Delete Permanently
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => deleteBooking(selectedBooking._id)}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                Created: {formatDateTime(selectedBooking.createdAt)}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-cosmic-blue w-full sm:max-w-lg sm:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-deep-purple/50 backdrop-blur-sm border-b border-gold/20 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gold">Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-gold uppercase">Name</label>
                <p className="text-white">{selectedMessage.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gold uppercase">Email</label>
                  <p className="text-white text-sm break-all">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-xs text-gold uppercase">Phone</label>
                    <p className="text-white text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gold uppercase">Subject</label>
                <p className="text-white capitalize">{selectedMessage.subject.replace('-', ' ')}</p>
              </div>

              <div>
                <label className="text-xs text-gold uppercase">Message</label>
                <p className="text-white leading-relaxed">{selectedMessage.message}</p>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                Received: {formatDateTime(selectedMessage.createdAt)}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

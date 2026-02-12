import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const AccessCodeManagement = () => {
  const [accessCodes, setAccessCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    expiresAt: '',
    maxUses: 1,
    allowedUser: ''
  })

  useEffect(() => {
    fetchAccessCodes()
  }, [])

  const fetchAccessCodes = async () => {
    try {
      const response = await axios.get('/api/access-codes')
      setAccessCodes(response.data.data)
    } catch (error) {
      console.error('Error fetching access codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCode = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/access-codes', formData)
      setFormData({ code: '', expiresAt: '', maxUses: 1, allowedUser: '' })
      setShowCreateForm(false)
      fetchAccessCodes()
    } catch (error) {
      console.error('Error creating access code:', error)
      alert(error.response?.data?.message || 'Error creating access code')
    }
  }

  const toggleCodeStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
      await axios.put(`/api/access-codes/${id}`, { status: newStatus })
      fetchAccessCodes()
    } catch (error) {
      console.error('Error updating access code:', error)
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code: result })
  }

  if (loading) return <div className="text-white">Loading access codes...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gold">Access Code Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Create New Code'}
        </button>
      </div>

      <div className="card-mystical">
        <h3 className="text-xl font-semibold text-gold mb-4">Access Codes</h3>
        <p className="text-gray-300">Access code management coming soon...</p>
      </div>
    </div>
  )\n}\n\nexport default AccessCodeManagement
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const ServiceManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/services/admin/all')
      setServices(response.data.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service._id)
    setFormData({
      title: service.title,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      features: service.features.join('\n'),
      duration: service.duration,
      isActive: service.isActive
    })
  }

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim())
      }
      
      await axios.put(`/api/services/${services.find(s => s._id === editingService).serviceType}`, updateData)
      
      setServices(prev => prev.map(s => 
        s._id === editingService ? { ...s, ...updateData, features: updateData.features } : s
      ))
      
      setEditingService(null)
      alert('Service updated successfully!')
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Failed to update service')
    }
  }

  const handleCancel = () => {
    setEditingService(null)
    setFormData({})
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        Manage service content displayed on the website
      </div>

      {services.map((service) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4"
        >
          {editingService === service._id ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gold uppercase block mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gold uppercase block mb-1">Short Description (max 200 chars)</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  maxLength={200}
                  rows={2}
                  className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{formData.shortDescription?.length || 0}/200</div>
              </div>

              <div>
                <label className="text-xs text-gold uppercase block mb-1">Full Description</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gold uppercase block mb-1">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gold uppercase block mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45-60 minutes"
                  className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`active-${service._id}`}
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor={`active-${service._id}`} className="text-sm text-white">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-gold text-cosmic-blue rounded font-semibold active:bg-gold/80"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 bg-gray-600 text-white rounded font-semibold active:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                  <p className="text-xs text-aqua capitalize">{service.serviceType.replace('-', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleEdit(service)}
                    className="px-3 py-1 bg-gold/20 text-gold rounded text-sm font-semibold active:bg-gold/30"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">{service.shortDescription}</p>

              <div className="mb-3">
                <p className="text-xs text-gold uppercase mb-1">Full Description</p>
                <p className="text-sm text-gray-400">{service.fullDescription}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gold uppercase mb-1">Features</p>
                <ul className="space-y-1">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-gray-500">
                Duration: {service.duration}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default ServiceManager

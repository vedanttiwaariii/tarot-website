import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const ContentManager = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pricing, setPricing] = useState([])
  const [content, setContent] = useState({})
  const [editMode, setEditMode] = useState({})
  const [specialEventMode, setSpecialEventMode] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pricingRes, contentRes] = await Promise.all([
        axios.get('/api/pricing'),
        axios.get('/api/content')
      ])
      setPricing(pricingRes.data.data)
      setContent(contentRes.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  const updatePricing = async (serviceId, newPrice) => {
    try {
      setSaving(true)
      await axios.put(`/api/pricing/${serviceId}`, { price: newPrice })
      setMessage('Price updated successfully')
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating price:', error)
      setMessage('Error updating price')
    } finally {
      setSaving(false)
    }
  }

  const updateContent = async (sectionId, newContent, type = 'text') => {
    try {
      setSaving(true)
      await axios.put(`/api/content/${sectionId}`, { content: newContent, type })
      setMessage('Content updated successfully')
      fetchData()
      setEditMode({ ...editMode, [sectionId]: false })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating content:', error)
      setMessage('Error updating content')
    } finally {
      setSaving(false)
    }
  }

  const applySpecialEvent = async (serviceId) => {
    const eventName = document.getElementById(`event-${serviceId}`).value
    const discount = parseFloat(document.getElementById(`discount-${serviceId}`).value)

    if (!eventName || !discount) {
      setMessage('Please fill event name and discount')
      return
    }

    const service = pricing.find(p => p.serviceId === serviceId)
    const originalPrice = service.originalPrice || service.price
    const newPrice = Math.round(originalPrice * (1 - discount / 100))

    try {
      setSaving(true)
      await axios.post('/api/pricing/special-event', {
        serviceId,
        price: newPrice,
        specialEvent: eventName
      })
      setMessage('Special event applied successfully')
      fetchData()
      setSpecialEventMode({ ...specialEventMode, [serviceId]: false })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error applying special event:', error)
      setMessage('Error applying special event')
    } finally {
      setSaving(false)
    }
  }

  const removeSpecialEvent = async (serviceId) => {
    try {
      setSaving(true)
      await axios.delete(`/api/pricing/special-event/${serviceId}`)
      setMessage('Special event removed successfully')
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error removing special event:', error)
      setMessage('Error removing special event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm text-center ${
          message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
        }`}>
          {message}
        </div>
      )}

      {/* Pricing Section */}
      <div>
        <h3 className="text-gold font-semibold text-lg mb-4">Service Pricing</h3>
        <div className="space-y-3">
          {pricing.map((service) => {
            const hasSpecialEvent = service.specialEvent && service.originalPrice
            const originalPrice = service.originalPrice || service.price
            const discountPercent = hasSpecialEvent ? Math.round((1 - service.price / originalPrice) * 100) : 0

            return (
              <motion.div
                key={service.serviceId}
                className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{service.name}</h4>
                  {hasSpecialEvent && (
                    <span className="text-xs bg-gold text-cosmic-blue px-2 py-1 rounded font-semibold">
                      {service.specialEvent}
                    </span>
                  )}
                </div>

                {/* Current Price Display */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-400 text-sm">Price:</span>
                  {hasSpecialEvent ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-sm">₹{originalPrice}</span>
                      <span className="text-aqua font-semibold text-lg">₹{service.price}</span>
                      <span className="text-green-400 text-xs">({discountPercent}% OFF)</span>
                    </div>
                  ) : (
                    <span className="text-aqua font-semibold">₹{service.price}</span>
                  )}
                </div>

                {/* Edit Regular Price */}
                {editMode[service.serviceId] ? (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      defaultValue={service.price}
                      className="w-32 px-2 py-1 bg-cosmic-blue border border-gold/30 rounded text-white text-sm"
                      id={`price-${service.serviceId}`}
                    />
                    <button
                      onClick={() => {
                        const newPrice = document.getElementById(`price-${service.serviceId}`).value
                        updatePricing(service.serviceId, parseFloat(newPrice))
                      }}
                      disabled={saving}
                      className="px-3 py-1 bg-gold text-cosmic-blue rounded text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode({ ...editMode, [service.serviceId]: false })}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode({ ...editMode, [service.serviceId]: true })}
                    className="text-gold text-xs hover:underline mb-3"
                  >
                    Edit Base Price
                  </button>
                )}

                {/* Special Event Section */}
                {specialEventMode[service.serviceId] ? (
                  <div className="border-t border-gold/20 pt-3 space-y-2">
                    <h5 className="text-white text-sm font-semibold mb-2">Special Event Pricing</h5>
                    <input
                      type="text"
                      placeholder="Event name (e.g., Diwali Sale)"
                      defaultValue={service.specialEvent || ''}
                      className="w-full px-2 py-1 bg-cosmic-blue border border-gold/30 rounded text-white text-sm"
                      id={`event-${service.serviceId}`}
                    />
                    <input
                      type="number"
                      placeholder="Discount %"
                      defaultValue={discountPercent || ''}
                      className="w-full px-2 py-1 bg-cosmic-blue border border-gold/30 rounded text-white text-sm"
                      id={`discount-${service.serviceId}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => applySpecialEvent(service.serviceId)}
                        disabled={saving}
                        className="px-3 py-1 bg-gold text-cosmic-blue rounded text-xs font-semibold"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => setSpecialEventMode({ ...specialEventMode, [service.serviceId]: false })}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gold/20 pt-3 flex gap-2">
                    {hasSpecialEvent ? (
                      <>
                        <button
                          onClick={() => setSpecialEventMode({ ...specialEventMode, [service.serviceId]: true })}
                          className="text-gold text-xs hover:underline"
                        >
                          Edit Special Event
                        </button>
                        <button
                          onClick={() => removeSpecialEvent(service.serviceId)}
                          disabled={saving}
                          className="text-red-400 text-xs hover:underline"
                        >
                          Remove Sale
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSpecialEventMode({ ...specialEventMode, [service.serviceId]: true })}
                        className="text-gold text-xs hover:underline"
                      >
                        + Add Special Event
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div>
        <h3 className="text-gold font-semibold text-lg mb-4">Content Sections</h3>
        <div className="space-y-3">
          <ContentEditCard
            title="Hero Title"
            sectionId="hero-title"
            content={content['hero-title']}
            editMode={editMode}
            setEditMode={setEditMode}
            updateContent={updateContent}
            saving={saving}
          />
          <ContentEditCard
            title="Hero Tagline"
            sectionId="hero-tagline"
            content={content['hero-tagline']}
            editMode={editMode}
            setEditMode={setEditMode}
            updateContent={updateContent}
            saving={saving}
          />
          <ContentEditCard
            title="Hero Description"
            sectionId="hero-description"
            content={content['hero-description']}
            editMode={editMode}
            setEditMode={setEditMode}
            updateContent={updateContent}
            saving={saving}
            multiline
          />
          <ContentEditCard
            title="About Journey"
            sectionId="about-journey"
            content={content['about-journey']}
            editMode={editMode}
            setEditMode={setEditMode}
            updateContent={updateContent}
            saving={saving}
            multiline
          />
        </div>
      </div>
    </div>
  )
}

const ContentEditCard = ({ title, sectionId, content, editMode, setEditMode, updateContent, saving, multiline }) => {
  return (
    <motion.div className="bg-deep-purple/20 border border-gold/20 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      {editMode[sectionId] ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              defaultValue={content}
              className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white text-sm"
              rows="4"
              id={`content-${sectionId}`}
            />
          ) : (
            <input
              type="text"
              defaultValue={content}
              className="w-full px-3 py-2 bg-cosmic-blue border border-gold/30 rounded text-white text-sm"
              id={`content-${sectionId}`}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newContent = document.getElementById(`content-${sectionId}`).value
                updateContent(sectionId, newContent)
              }}
              disabled={saving}
              className="px-3 py-1 bg-gold text-cosmic-blue rounded text-xs font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode({ ...editMode, [sectionId]: false })}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-300 text-sm mb-2">{content}</p>
          <button
            onClick={() => setEditMode({ ...editMode, [sectionId]: true })}
            className="text-gold text-xs hover:underline"
          >
            Edit
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default ContentManager

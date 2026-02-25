const PriceDisplay = ({ serviceId, pricing }) => {
  const service = pricing[serviceId]
  
  if (!service) return <span className="text-[#18c2a4] font-bold text-lg">Loading...</span>

  const hasSpecialEvent = service.specialEvent && service.originalPrice
  const discountPercent = hasSpecialEvent ? Math.round((1 - service.price / service.originalPrice) * 100) : 0

  return (
    <div className="flex flex-col items-end gap-1">
      {hasSpecialEvent && (
        <span className="text-xs bg-gold text-cosmic-blue px-2 py-0.5 rounded font-semibold animate-pulse">
          {service.specialEvent}
        </span>
      )}
      <div className="flex items-center gap-2">
        {hasSpecialEvent && (
          <span className="text-gray-400 line-through text-sm">₹{service.originalPrice}</span>
        )}
        <span className="text-[#18c2a4] font-bold text-lg">₹{service.price}</span>
      </div>
      {hasSpecialEvent && (
        <span className="text-green-400 text-xs">Save {discountPercent}%</span>
      )}
    </div>
  )
}

export default PriceDisplay

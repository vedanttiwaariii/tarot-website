const PriceDisplay = ({ serviceId, pricing }) => {
  const service = pricing[serviceId]
  
  if (!service) return <span className="text-[#18c2a4] font-bold text-base lg:text-xl">Loading...</span>

  const hasSpecialEvent = service.specialEvent && service.originalPrice
  const discountPercent = hasSpecialEvent ? Math.round((1 - service.price / service.originalPrice) * 100) : 0

  return (
    <div className="flex items-center gap-3 lg:gap-4">
      {hasSpecialEvent && (
        <span className="text-xs lg:text-sm bg-gold text-cosmic-blue px-2 py-1 rounded-full font-semibold animate-pulse">
          {service.specialEvent}
        </span>
      )}
      <div className="flex items-center gap-2">
        {hasSpecialEvent && (
          <span className="text-gray-400 line-through text-sm lg:text-base">₹{service.originalPrice}</span>
        )}
        <span className="text-[#18c2a4] font-bold text-base lg:text-xl">₹{service.price}</span>
      </div>
      {hasSpecialEvent && (
        <span className="text-green-400 text-xs lg:text-sm font-semibold">-{discountPercent}%</span>
      )}
    </div>
  )
}

export default PriceDisplay

const WhatsAppFloat = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+919893578135"

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-3xl">💬</span>
    </a>
  )
}

export default WhatsAppFloat

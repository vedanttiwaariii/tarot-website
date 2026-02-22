import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BookingWizard = ({ onSubmit, isSubmitting, submitMessage, register, errors, watch, setValue, availableTimeSlots, selectedDate, disclaimerAccepted, setDisclaimerAccepted, reset, wizardStep, setWizardStep }) => {
  const totalSteps = 8

  // Reset wizard step when form is reset
  const handleReset = () => {
    reset()
    setWizardStep(1)
  }

  const steps = [
    { id: 1, field: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your full name', autoComplete: 'name' },
    { id: 2, field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit number', autoComplete: 'tel' },
    { id: 3, field: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', autoComplete: 'email' },
    { id: 4, field: 'service', label: 'Select Service', type: 'select' },
    { id: 5, field: 'date', label: 'Preferred Date', type: 'date' },
    { id: 6, field: 'time', label: 'Preferred Time', type: 'select-time' },
    { id: 7, field: 'sessionType', label: 'Session Type', type: 'radio' },
    { id: 8, field: 'message', label: 'Message (Optional)', type: 'textarea' }
  ]

  const bookingServices = [
    { value: 'tarot', label: 'Tarot Reading - ₹1,100' },
    { value: 'reiki', label: 'Reiki Healing - ₹1,551' },
    { value: 'water-divination', label: 'Water Divination - ₹21,000' },
    { value: 'spiritual-consultation', label: 'Spiritual Consultation - ₹2,500' },
    { value: 'group-session', label: 'Group Session - ₹800/person' }
  ]

  const nextStep = () => {
    setWizardStep(wizardStep + 1)
  }

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    }
  }

  const renderStep = () => {
    const step = steps[wizardStep - 1]

    switch (step.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={step.type}
            autoComplete={step.autoComplete}
            {...register(step.field, { required: `${step.label} is required` })}
            className="w-full px-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            placeholder={step.placeholder}
          />
        )

      case 'tel':
        return (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              +91
            </div>
            <input
              type="tel"
              autoComplete={step.autoComplete}
              {...register(step.field, { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Must be 10 digits'
                }
              })}
              className="w-full pl-12 pr-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder={step.placeholder}
              maxLength="10"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
              }}
            />
          </div>
        )

      case 'select':
        return (
          <select
            {...register(step.field, { required: 'Please select a service' })}
            className="w-full px-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all appearance-none"
          >
            <option value="" className="bg-cosmic-blue">Choose a service...</option>
            {bookingServices.map((service) => (
              <option key={service.value} value={service.value} className="bg-cosmic-blue">
                {service.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            {...register(step.field, { required: 'Date is required' })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
        )

      case 'select-time':
        return (
          <select
            {...register(step.field, { required: 'Please select a time' })}
            onChange={(e) => {
              setValue(step.field, e.target.value, { shouldValidate: true })
            }}
            disabled={!selectedDate}
            className="w-full px-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all appearance-none disabled:opacity-50"
          >
            <option value="" className="bg-cosmic-blue">
              {!selectedDate ? 'Select date first' : 'Choose time...'}
            </option>
            {selectedDate && availableTimeSlots.map((time) => (
              <option key={time} value={time} className="bg-cosmic-blue">
                {time}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-3">
            <label className="flex items-center p-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl cursor-pointer hover:border-gold transition-all">
              <input
                type="radio"
                value="in-person"
                {...register(step.field, { required: 'Please select session type' })}
                className="mr-3 w-4 h-4 text-gold focus:ring-gold"
              />
              <span className="text-white text-sm">In-Person Session</span>
            </label>
            <label className="flex items-center p-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl cursor-pointer hover:border-gold transition-all">
              <input
                type="radio"
                value="online"
                {...register(step.field, { required: 'Please select session type' })}
                className="mr-3 w-4 h-4 text-gold focus:ring-gold"
              />
              <span className="text-white text-sm">Online (Video Call)</span>
            </label>
          </div>
        )

      case 'textarea':
        return (
          <textarea
            {...register(step.field)}
            rows="4"
            className="w-full px-4 py-3 bg-cosmic-blue/50 border-2 border-gold/30 rounded-xl text-white text-sm placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
            placeholder="Any specific questions or intentions..."
          ></textarea>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gold text-xs font-medium">Step {wizardStep} of {totalSteps}</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-400 hover:text-gold text-xs transition-colors"
          >
            Reset Form
          </button>
        </div>
        <div className="w-full h-1.5 bg-cosmic-blue/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-aqua"
            initial={{ width: 0 }}
            animate={{ width: `${(wizardStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div>
        <h3 className="text-gold text-base font-semibold mb-3">{steps[wizardStep - 1].label}</h3>
        {renderStep()}
        {errors[steps[wizardStep - 1].field] && (
          <p className="text-red-400 text-xs mt-1.5">{errors[steps[wizardStep - 1].field].message}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 flex gap-2">
        {wizardStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-2.5 bg-cosmic-blue/50 border-2 border-gold/30 text-white font-semibold rounded-xl hover:border-gold transition-all text-sm"
          >
            Back
          </button>
        )}
        {wizardStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 py-2.5 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
          >
            Next
          </button>
        ) : (
          <div className="flex-1 space-y-2">
            <label className="flex items-start space-x-2 text-white text-xs">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                className="mt-0.5 text-gold focus:ring-gold"
              />
              <span>
                I agree to the{' '}
                <a href="/disclaimer" target="_blank" className="text-gold underline">
                  Disclaimer
                </a>
              </span>
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !disclaimerAccepted}
              className="w-full py-2.5 bg-gradient-to-r from-gold to-aqua text-deep-purple font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Processing...' : 'Book Appointment'}
            </button>
          </div>
        )}
      </div>

      {submitMessage && (
        <div className={`mt-3 text-center p-3 rounded-xl text-xs ${
          typeof submitMessage === 'object' || (typeof submitMessage === 'string' && submitMessage.includes('successfully')) 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {submitMessage}
        </div>
      )}
    </div>
  )
}

export default BookingWizard

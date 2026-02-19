import Joi from 'joi'

// Booking validation schema
export const bookingSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits'
    }),
  
  service: Joi.string()
    .valid('tarot', 'reiki', 'water-divination', 'spiritual-consultation')
    .required(),
  
  date: Joi.date()
    .required(),
  
  time: Joi.string()
    .valid('9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM')
    .required(),
  
  sessionType: Joi.string()
    .valid('in-person', 'online')
    .required(),
  
  message: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(''),
  
  accessCode: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(20)
    .uppercase()
    .optional()
    .allow(''),
  
  allowDuplicate: Joi.boolean().optional(),
  source: Joi.string().valid('admin').optional()
})

// Contact validation schema
export const contactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),
  
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits'
    }),
  
  subject: Joi.string()
    .valid('general-inquiry', 'booking-question', 'service-information', 'pricing', 'partnership', 'feedback', 'other')
    .required(),
  
  message: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Message should be at least 10 characters long'
    })
})

// Access code validation schema
export const accessCodeSchema = Joi.object({
  code: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(20)
    .uppercase()
    .required(),
  
  expiresAt: Joi.date()
    .required(),
  
  maxUses: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .required(),
  
  allowedUser: Joi.string()
    .email()
    .lowercase()
    .optional()
    .allow('')
})

// Access code validation request schema
export const validateAccessCodeSchema = Joi.object({
  code: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(20)
    .uppercase()
    .required(),
  
  userIdentifier: Joi.string()
    .email()
    .lowercase()
    .optional()
})

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }
    
    req.body = value
    next()
  }
}
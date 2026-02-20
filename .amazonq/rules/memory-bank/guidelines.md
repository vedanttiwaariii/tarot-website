# Development Guidelines - Krushnalaya

## Code Quality Standards

### Module System
- **ES Modules**: Use ES6 module syntax (`import`/`export`) throughout the codebase
- All JavaScript files use `"type": "module"` in package.json
- Import statements at the top of files, grouped by: external dependencies, internal modules, styles
- Named exports preferred for utilities, default exports for components and models

### Code Formatting
- **Indentation**: 2 spaces (consistent across frontend and backend)
- **Semicolons**: Backend uses semicolons, frontend omits them (follow existing pattern per directory)
- **Quotes**: Single quotes for JavaScript strings, double quotes for JSX attributes
- **Line Length**: Keep lines under 100 characters where practical
- **Trailing Commas**: Use in multi-line objects and arrays

### Naming Conventions
- **Variables/Functions**: camelCase (`handlePayment`, `bookingData`, `isValid`)
- **Components**: PascalCase (`PaymentButton`, `BookingWizard`, `AdminDashboard`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`RAZORPAY_KEY_ID`, `MAX_RETRIES`)
- **Files**: Match component/module name (PaymentButton.jsx, bookings.js)
- **CSS Classes**: kebab-case for custom classes, Tailwind utilities as-is
- **Database Models**: PascalCase singular (`Booking`, `Contact`, `AccessCode`)
- **Routes**: kebab-case (`/api/access-codes`, `/api/bookings`)

### Documentation Standards
- **Comments**: Use sparingly, prefer self-documenting code
- **JSDoc**: Use for complex functions and API endpoints
- **Route Documentation**: Include @desc, @route, @access comments for all API endpoints
- **Inline Comments**: Explain "why" not "what", use for complex logic only
- **TODO Comments**: Format as `// TODO: description` for future improvements

## Structural Conventions

### React Component Structure
```javascript
// 1. Imports (external, internal, styles)
import { useState, useEffect } from 'react'
import { handlePaymentFlow } from '../utils/razorpayHandler'
import './Component.css'

// 2. Component definition with destructured props
const ComponentName = ({ prop1, prop2, ...rest }) => {
  // 3. State declarations
  const [state, setState] = useState(initialValue)
  
  // 4. Refs
  const ref = useRef(null)
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    }
  }, [dependencies])
  
  // 6. Event handlers
  const handleEvent = async () => {
    // Handler logic
  }
  
  // 7. Render
  return (
    <div {...rest}>
      {/* JSX */}
    </div>
  )
}

// 8. Export
export default ComponentName
```

### Express Route Structure
```javascript
// 1. Imports
import express from 'express'
import Model from '../models/Model.js'
import { middleware } from '../middleware/middleware.js'

// 2. Router initialization
const router = express.Router()

// 3. Middleware definitions (validators, rate limiters)
const validateInput = [
  body('field').notEmpty().withMessage('Field is required')
]

// 4. Route handlers with documentation
// @desc    Description
// @route   METHOD /api/path
// @access  Public/Private
router.method('/path', middleware, async (req, res, next) => {
  try {
    // Route logic
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

// 5. Export
export default router
```

### Mongoose Model Structure
```javascript
// 1. Import
import mongoose from 'mongoose'

// 2. Schema definition
const schemaName = new mongoose.Schema({
  field: {
    type: String,
    required: [true, 'Error message'],
    trim: true,
    // Additional validators
  }
})

// 3. Middleware (pre/post hooks)
schemaName.pre('save', function(next) {
  // Pre-save logic
  next()
})

// 4. Indexes
schemaName.index({ field: 1 })

// 5. Model creation and export
const Model = mongoose.model('Model', schemaName)
export default Model
```

## Practices Followed Throughout Codebase

### Security Practices
- **Environment Variables**: All sensitive data in .env files, never committed
- **Input Validation**: Express Validator on all API endpoints with custom error messages
- **Sanitization**: XSS protection via custom middleware, NoSQL injection prevention with mongo-sanitize
- **Rate Limiting**: Applied to all API routes (100 req/15min general, 10 req/15min payments)
- **CORS**: Whitelist-based with environment-specific configuration
- **Authentication**: JWT tokens for admin routes, bcrypt for password hashing
- **Payment Security**: HMAC SHA256 signature verification for all Razorpay callbacks
- **Helmet**: Security headers configured with CSP directives

### Error Handling Patterns
- **Try-Catch**: Wrap all async operations in try-catch blocks
- **Next Middleware**: Pass errors to next(error) for centralized error handling
- **Validation Errors**: Return 400 with detailed validation error array
- **Not Found**: Return 404 with descriptive message
- **Server Errors**: Return 500 with generic message (detailed in development only)
- **Payment Errors**: Update booking status to 'failed' and log detailed error information
- **Graceful Degradation**: Fallback values for missing configuration

### State Management
- **React State**: useState for component-local state
- **Form State**: React Hook Form for all forms with validation
- **Loading States**: Boolean flags for async operations (loading, error, success)
- **Error States**: String messages for user-friendly error display
- **Refs**: useRef for DOM access and animation frame IDs

### API Communication
- **Axios**: Centralized API client with base URL configuration
- **Error Handling**: Catch and display user-friendly error messages
- **Loading Indicators**: Show loading state during API calls
- **Response Format**: Consistent { success, message, data } structure
- **Status Codes**: Standard HTTP status codes (200, 400, 404, 500)

### Database Patterns
- **Validation**: Schema-level validation with custom error messages
- **Indexes**: Compound indexes for query optimization and uniqueness constraints
- **Timestamps**: createdAt and updatedAt fields on all models
- **Enums**: Strict enum validation for status fields
- **Sparse Indexes**: For optional unique fields (bookingNumber)
- **Partial Indexes**: For conditional uniqueness (date/time for active bookings only)

## Semantic Patterns Overview

### Payment Flow Pattern
```javascript
// 1. Create booking (optional)
const booking = await Booking.create(bookingData)

// 2. Create Razorpay order
const order = await razorpay.orders.create({
  amount: priceInPaise,
  currency: 'INR',
  receipt: `receipt_${bookingId}`,
  notes: { service, bookingId }
})

// 3. Open Razorpay modal (frontend)
const options = {
  key: RAZORPAY_KEY_ID,
  order_id: order.id,
  handler: async (response) => {
    // 4. Verify signature (backend)
    await verifyPayment(response)
  }
}

// 5. Update booking status
booking.paymentStatus = 'completed'
booking.paymentId = razorpay_payment_id
await booking.save()
```

### Form Validation Pattern
```javascript
// React Hook Form with validation
const { register, handleSubmit, formState: { errors } } = useForm()

const onSubmit = async (data) => {
  try {
    const response = await api.post('/endpoint', data)
    // Handle success
  } catch (error) {
    // Handle error
  }
}

// Backend validation
const validateInput = [
  body('field')
    .notEmpty().withMessage('Required')
    .isLength({ min: 2, max: 100 }).withMessage('Length constraint')
    .trim()
]

router.post('/endpoint', validateInput, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  // Process valid data
})
```

### Authentication Pattern
```javascript
// Middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Not authorized' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Usage
router.get('/admin/bookings', protect, async (req, res) => {
  // Protected route logic
})
```

### WebGL Animation Pattern (Threads Component)
```javascript
// 1. Setup renderer and program
const renderer = new Renderer({ alpha: true })
const program = new Program(gl, {
  vertex: vertexShader,
  fragment: fragmentShader,
  uniforms: { /* initial values */ }
})

// 2. Animation loop
function update(t) {
  program.uniforms.iTime.value = t * 0.001
  renderer.render({ scene: mesh })
  animationFrameId.current = requestAnimationFrame(update)
}

// 3. Cleanup
return () => {
  cancelAnimationFrame(animationFrameId.current)
  gl.getExtension('WEBGL_lose_context')?.loseContext()
}
```

### Tailwind Configuration Pattern
```javascript
// Extend theme with custom values
theme: {
  extend: {
    colors: {
      'custom-name': '#HEX'
    },
    animation: {
      'custom-animation': 'keyframeName duration easing infinite'
    },
    keyframes: {
      keyframeName: {
        '0%, 100%': { /* styles */ },
        '50%': { /* styles */ }
      }
    }
  }
}
```

## Internal API Usage Patterns

### Booking Creation with Payment
```javascript
// Frontend
const createBookingWithPayment = async (formData) => {
  // 1. Create booking
  const bookingResponse = await axios.post('/api/bookings', formData)
  const { bookingId } = bookingResponse.data.data
  
  // 2. Initiate payment
  await handlePaymentFlow({
    service: formData.service,
    bookingId,
    customerDetails: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    },
    onSuccess: (data) => {
      // Navigate to success page
    },
    onFailure: (error) => {
      // Show error message
    }
  })
}
```

### Admin Dashboard Data Fetching
```javascript
// With authentication
const fetchBookings = async () => {
  const token = localStorage.getItem('adminToken')
  const response = await axios.get('/api/bookings', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}
```

### Access Code Validation
```javascript
// Check if access code is valid before payment
const validateAccessCode = async (code) => {
  const response = await axios.post('/api/access-codes/validate', { code })
  if (response.data.valid) {
    // Skip payment, mark booking as completed
    booking.paymentStatus = 'skipped'
    booking.accessCodeUsed = code
  }
}
```

## Frequently Used Code Idioms

### Async Error Handling
```javascript
// Always wrap async operations
try {
  const result = await asyncOperation()
  // Success handling
} catch (error) {
  console.error('Operation failed:', error)
  // Error handling
} finally {
  // Cleanup (optional)
}
```

### Conditional Rendering (React)
```javascript
// Short-circuit evaluation
{loading && <Spinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}

// Ternary for either/or
{isLoggedIn ? <Dashboard /> : <Login />}
```

### Environment-Based Configuration
```javascript
// Backend
const config = {
  development: { /* dev settings */ },
  production: { /* prod settings */ }
}[process.env.NODE_ENV || 'development']

// Frontend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
```

### Mongoose Query Patterns
```javascript
// Find with conditions
const bookings = await Booking.find({ 
  status: { $in: ['pending', 'confirmed'] },
  date: { $gte: new Date() }
}).sort({ date: 1, time: 1 })

// Update with validation
const updated = await Booking.findByIdAndUpdate(
  id,
  { status: 'completed' },
  { new: true, runValidators: true }
)
```

### Rate Limiter Configuration
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
})
```

## Popular Annotations and Patterns

### Route Documentation
```javascript
// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
```

### Validation Chains
```javascript
body('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email')
  .normalizeEmail()
```

### Mongoose Schema Validators
```javascript
field: {
  type: String,
  required: [true, 'Field is required'],
  trim: true,
  lowercase: true,
  enum: ['option1', 'option2'],
  match: [/regex/, 'Invalid format'],
  validate: {
    validator: function(value) { return /* condition */ },
    message: 'Validation failed'
  }
}
```

### React Props Destructuring with Defaults
```javascript
const Component = ({ 
  color = [1, 0.843, 0], 
  amplitude = 1, 
  distance = 0,
  enableMouseInteraction = false,
  ...rest 
}) => {
  // Component logic
}
```

### Cleanup Pattern (useEffect)
```javascript
useEffect(() => {
  // Setup
  const subscription = subscribe()
  
  // Cleanup function
  return () => {
    subscription.unsubscribe()
    cancelAnimationFrame(animationId)
    removeEventListener('event', handler)
  }
}, [dependencies])
```

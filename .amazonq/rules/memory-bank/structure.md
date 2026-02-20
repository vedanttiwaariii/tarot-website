# Project Structure - Krushnalaya

## Directory Organization

```
tarot-website/
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── images/             # Static image assets
│   ├── src/
│   │   ├── api/                # API client modules
│   │   ├── components/         # Reusable React components
│   │   ├── config/             # Frontend configuration
│   │   ├── pages/              # Page-level components
│   │   ├── utils/              # Utility functions (payment handlers, etc.)
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Frontend environment variables
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite build configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── postcss.config.js       # PostCSS configuration
│
├── backend/                     # Node.js/Express backend
│   ├── config/
│   │   └── database.js         # MongoDB connection configuration
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validation.js       # Request validation middleware
│   ├── models/
│   │   ├── Booking.js          # Booking schema and model
│   │   ├── Contact.js          # Contact message schema
│   │   ├── AccessCode.js       # Access code schema
│   │   └── Pricing.js          # Service pricing schema
│   ├── routes/
│   │   ├── bookings.js         # Booking CRUD endpoints
│   │   ├── payments.js         # Razorpay payment endpoints
│   │   ├── contact.js          # Contact form endpoints
│   │   ├── auth.js             # Admin authentication
│   │   ├── accessCodes.js      # Access code management
│   │   └── pricing.js          # Pricing management
│   ├── scripts/
│   │   ├── migratePaymentStatus.js    # Database migration scripts
│   │   └── updateBookingIndex.js      # Index update utilities
│   ├── .env                    # Backend environment variables
│   ├── server.js               # Express server entry point
│   └── package.json            # Backend dependencies
│
├── .amazonq/
│   └── rules/
│       ├── memory-bank/        # Project documentation
│       └── confirmation.md     # Rule configurations
│
├── README.md                   # Project documentation
├── setup.bat / setup.sh        # Automated setup scripts
├── razorpay-test.html          # Payment testing tool
├── debug-razorpay.html         # Payment debugging interface
└── package.json                # Root workspace configuration
```

## Core Components and Relationships

### Frontend Architecture

**Component Hierarchy**
- **App.jsx**: Root component with routing configuration
- **Pages**: Landing, AdminDashboard, service-specific pages
- **Components**: Navbar, Footer, PaymentButton, Threads (testimonials), booking forms
- **Utils**: razorpayHandler.js for payment flow orchestration

**Data Flow**
1. User interaction → Component state
2. Form submission → API call via axios
3. Backend response → State update → UI update
4. Payment flow → Razorpay modal → Verification → Confirmation

### Backend Architecture

**Layered Structure**
- **Routes Layer**: HTTP endpoint definitions and request routing
- **Middleware Layer**: Authentication, validation, error handling, rate limiting
- **Model Layer**: Mongoose schemas and database operations
- **Config Layer**: Database connection and environment setup

**Request Flow**
1. HTTP Request → Rate Limiter → CORS Check
2. Route Handler → Validation Middleware
3. Authentication (if required) → Business Logic
4. Database Operation → Response Formatting
5. Error Handler (if error) → JSON Response

### Database Schema Relationships

**Booking Model**
- Core entity with service type, date, time, client details
- References: None (standalone)
- Payment status tracking (pending, completed, failed)

**Contact Model**
- Standalone message storage
- No relationships

**AccessCode Model**
- Reusable codes for payment bypass
- Tracks usage count and validity

**Pricing Model**
- Service pricing configuration
- Referenced by booking creation logic

## Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular React components with single responsibility
- **Custom Hooks**: Reusable logic extraction (form handling, API calls)
- **Configuration-Based Routing**: Centralized route definitions in App.jsx
- **Utility Functions**: Separated business logic (payment handling) from components

### Backend Patterns
- **RESTful API Design**: Resource-based endpoints with standard HTTP methods
- **Middleware Chain**: Composable request processing pipeline
- **Model-View-Controller (MVC)**: Separation of data, business logic, and presentation
- **Environment-Based Configuration**: .env files for different deployment environments

### Security Patterns
- **Defense in Depth**: Multiple security layers (rate limiting, validation, sanitization, authentication)
- **Signature Verification**: Cryptographic verification of payment callbacks
- **Input Sanitization**: XSS and NoSQL injection prevention
- **CORS Whitelisting**: Restricted cross-origin access

### Integration Patterns
- **Webhook Handling**: Asynchronous payment status updates from Razorpay
- **Order-Payment-Verification Flow**: Three-step payment process with server-side verification
- **Graceful Degradation**: Fallback mechanisms for payment failures

## Technology Integration

### Frontend-Backend Communication
- **API Client**: Axios with base URL configuration
- **Error Handling**: Centralized error response processing
- **Authentication**: JWT tokens in request headers for admin routes

### Payment Integration
- **Razorpay SDK**: Client-side payment modal
- **Server-Side Verification**: HMAC signature validation
- **Webhook Processing**: Asynchronous payment confirmation

### Database Integration
- **Mongoose ODM**: Schema-based MongoDB interaction
- **Connection Pooling**: Efficient database connection management
- **Index Optimization**: Performance-optimized queries

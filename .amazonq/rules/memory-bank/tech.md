# Technology Stack - Krushnalaya

## Programming Languages

### Frontend
- **JavaScript (ES6+)**: Modern JavaScript with ES modules
- **JSX**: React component syntax
- **CSS**: Tailwind utility classes with custom styles

### Backend
- **JavaScript (ES6+)**: Node.js with ES module syntax (`"type": "module"`)
- **JSON**: Configuration and data exchange

## Core Technologies

### Frontend Stack
- **React 18.2.0**: UI library with hooks and functional components
- **Vite 4.4.5**: Build tool and development server
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **Framer Motion 10.16.4**: Animation library for smooth transitions
- **React Router DOM 6.8.1**: Client-side routing
- **React Hook Form 7.45.4**: Form state management and validation
- **Axios 1.5.0**: HTTP client for API requests
- **OGL 1.0.11**: WebGL library for visual effects

### Backend Stack
- **Node.js**: Runtime environment (>=16.0.0)
- **Express 4.18.2**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose 8.0.3**: MongoDB ODM with schema validation
- **Razorpay 2.9.2**: Payment gateway SDK
- **JWT (jsonwebtoken 9.0.2)**: Authentication tokens
- **bcryptjs 2.4.3**: Password hashing

### Security & Middleware
- **Helmet 7.1.0**: Security headers
- **CORS 2.8.5**: Cross-origin resource sharing
- **Express Rate Limit 7.1.5**: Request rate limiting
- **Express Validator 7.0.1**: Input validation
- **Express Mongo Sanitize 2.2.0**: NoSQL injection prevention
- **Joi 17.11.0**: Schema validation

### Development Tools
- **Nodemon 3.0.2**: Auto-restart development server
- **ESLint 8.45.0**: JavaScript linting
- **PostCSS 8.4.24**: CSS processing
- **Autoprefixer 10.4.14**: CSS vendor prefixing
- **Concurrently 8.2.2**: Run multiple npm scripts

## Build Systems and Configuration

### Frontend Build (Vite)
```javascript
// vite.config.js
- React plugin for JSX transformation
- Development server on port 5173
- Hot Module Replacement (HMR)
- Production build optimization
```

### CSS Processing (Tailwind + PostCSS)
```javascript
// tailwind.config.js
- Content paths for purging unused styles
- Custom theme extensions (colors, animations)
- Plugin configuration

// postcss.config.js
- Tailwind CSS processing
- Autoprefixer for browser compatibility
```

### Backend Server (Express)
```javascript
// server.js
- ES module syntax
- Middleware chain configuration
- Route mounting
- Error handling
- Database connection
```

## Dependencies Overview

### Frontend Dependencies
```json
{
  "axios": "^1.5.0",           // HTTP client
  "framer-motion": "^10.16.4", // Animations
  "ogl": "^1.0.11",            // WebGL effects
  "react": "^18.2.0",          // UI library
  "react-dom": "^18.2.0",      // React DOM renderer
  "react-hook-form": "^7.45.4", // Form handling
  "react-router-dom": "^6.8.1"  // Routing
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",                    // Web framework
  "razorpay": "^2.9.2",                    // Payment gateway
  "mongoose": "^8.0.3",                    // MongoDB ODM
  "express-validator": "^7.0.1",           // Validation
  "express-rate-limit": "^7.1.5",          // Rate limiting
  "cors": "^2.8.5",                        // CORS handling
  "helmet": "^7.1.0",                      // Security headers
  "bcryptjs": "^2.4.3",                    // Password hashing
  "jsonwebtoken": "^9.0.2",                // JWT auth
  "dotenv": "^16.3.1",                     // Environment variables
  "express-mongo-sanitize": "^2.2.0",      // NoSQL injection prevention
  "joi": "^17.11.0",                       // Schema validation
  "nodemailer": "^7.0.13"                  // Email sending
}
```

## Development Commands

### Root Level (Workspace)
```bash
npm run install-all    # Install all dependencies (root, frontend, backend)
npm run dev            # Run both frontend and backend concurrently
npm run dev:frontend   # Run frontend only
npm run dev:backend    # Run backend only
npm run build          # Build frontend for production
npm start              # Start production backend server
npm run setup          # Run automated setup script
```

### Frontend Commands
```bash
cd frontend
npm run dev            # Start Vite dev server (http://localhost:5173)
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

### Backend Commands
```bash
cd backend
npm start              # Start production server
npm run dev            # Start with nodemon (auto-restart)
npm test               # Run tests (Jest)
```

## Environment Configuration

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx
REACT_APP_NAME=Krushnalaya
```

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tarot-website
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
ADMIN_KEY=xxxxx
JWT_SECRET=xxxxx
```

## Development Server Ports
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000 (Express server)
- **MongoDB**: mongodb://127.0.0.1:27017

## Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Node.js Version Requirements
- **Minimum**: Node.js 16.0.0
- **Recommended**: Node.js 18.x or 20.x LTS

## Database
- **MongoDB**: Local instance or MongoDB Atlas
- **Connection**: Mongoose with connection pooling
- **Schema Validation**: Mongoose schemas with built-in validation

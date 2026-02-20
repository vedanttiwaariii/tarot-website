import dotenv from "dotenv";
dotenv.config();

import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/database.js";
import bookingRoutes from "./routes/bookings.js";
import contactRoutes from "./routes/contact.js";
import accessCodeRoutes from "./routes/accessCodes.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import pricingRoutes from "./routes/pricing.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// ⚠️ CRITICAL: Webhook route needs raw body - MUST be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// XSS protection - using built-in express sanitization instead of deprecated xss-clean
app.use((req, res, next) => {
  // Basic XSS protection by sanitizing common XSS patterns
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
    }
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        obj[key] = sanitize(obj[key])
      }
    }
    return obj
  }
  
  if (req.body) req.body = sanitize(req.body)
  if (req.query) req.query = sanitize(req.query)
  if (req.params) req.params = sanitize(req.params)
  
  next()
})

// NoSQL injection protection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/api/health'
  }
});
app.use('/api', limiter);

// CORS - Production security
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5173',
  'https://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In production, block unknown origins
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('Not allowed by CORS'));
      }
      
      // In development, allow all origins
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
  })
);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/access-codes", accessCodeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/pricing", pricingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Tarot Website API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
if (process.env.USE_HTTPS === 'true') {
  try {
    const httpsOptions = {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`🔮 HTTPS Server running on port ${PORT}`);
      console.log(`🔒 URL: https://localhost:${PORT}`);
      console.log(`✨ Environment: ${process.env.NODE_ENV}`);
      console.log(`💳 Razorpay Key ID loaded: ${process.env.RAZORPAY_KEY_ID ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('❌ HTTPS setup failed:', error.message);
    console.log('💡 Run: cd backend && generate-cert.bat');
    process.exit(1);
  }
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔮 Server running on port ${PORT}`);
    console.log(`✨ Environment: ${process.env.NODE_ENV}`);
    console.log(`🔒 Security: Enhanced`);
    console.log(`🔑 Admin Key loaded: ${process.env.ADMIN_KEY ? 'Yes' : 'No'}`);
    console.log(`🔐 JWT Secret loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
    console.log(`💳 Razorpay Key ID loaded: ${process.env.RAZORPAY_KEY_ID ? 'Yes' : 'No'}`);
    console.log(`🔐 Razorpay Secret loaded: ${process.env.RAZORPAY_KEY_SECRET ? 'Yes' : 'No'}`);
  });
}

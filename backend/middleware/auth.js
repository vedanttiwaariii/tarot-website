import jwt from 'jsonwebtoken'

// JWT-based authentication middleware
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    })
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      })
    }
    
    req.user = decoded
    next()
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

// Rate limiting for admin routes
export const adminRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
}
/**
 * Production-safe Logger Utility
 * 
 * Usage:
 * - Replace console.log() with logger.log()
 * - Replace console.error() with logger.error()
 * - Replace console.warn() with logger.warn()
 * 
 * In production, only errors are logged.
 * In development, all logs are shown.
 */

const isDevelopment = process.env.NODE_ENV !== 'production'

const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Log errors (always logged, can be sent to monitoring service)
   */
  error: (...args) => {
    console.error(...args)
    
    // In production, send to error monitoring service (Sentry, LogRocket, etc.)
    if (!isDevelopment) {
      // TODO: Send to error monitoring service
      // Example: Sentry.captureException(args[0])
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },

  /**
   * Log success messages with emoji (only in development)
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('✅', ...args)
    }
  }
}

export default logger

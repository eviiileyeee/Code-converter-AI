// File: middleware/errorHandler.js
const { logger } = require('../utils/logger');
const { CustomError } = require('../utils/errors');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path });
  
  // Determine if this is a known error type
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.errorCode || 'ERR_UNKNOWN'
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      code: 'ERR_VALIDATION'
    });
  }
  
  // Handle Gemini API rate limits
  if (err.response && err.response.status === 429) {
    return res.status(429).json({
      status: 'error',
      message: 'API rate limit exceeded. Please try again later.',
      code: 'ERR_RATE_LIMIT'
    });
  }
  
  // Default server error
  const statusCode = err.statusCode || 500;
  
  return res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message || 'Internal server error',
    code: 'ERR_SERVER'
  });
};

module.exports = {
  errorHandler
};
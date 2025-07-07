const rateLimit = require('express-rate-limit');

// Rate limiter for code conversion - 20 requests per day
const codeConversionRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded. You can only make 20 code conversion requests per day.',
      remainingTime: 'Please try again tomorrow.',
      limit: 20,
      remaining: 0,
      windowMs: '24 hours'
    });
  }
});

// Middleware to add remaining request count to successful responses
const addRateLimitInfo = (req, res, next) => {
  // Store the original json method
  const originalJson = res.json;
  
  // Override the json method to add rate limit info
  res.json = function(data) {
    if (data && typeof data === 'object') {
      // Get rate limit info from response headers
      const remaining = res.getHeader('X-RateLimit-Remaining');
      const limit = res.getHeader('X-RateLimit-Limit');
      const resetTime = res.getHeader('X-RateLimit-Reset');
      
      // Add rate limit info to response body
      data.rateLimit = {
        remaining: remaining !== undefined ? parseInt(remaining) : 20,
        limit: limit !== undefined ? parseInt(limit) : 20,
        resetTime: resetTime ? new Date(parseInt(resetTime) * 1000).toISOString() : null
      };
    }
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  codeConversionRateLimit,
  addRateLimitInfo
}; 
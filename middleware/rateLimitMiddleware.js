const rateLimit = require('express-rate-limit');

// Rate limiter for code conversion - 3 requests per day
const codeConversionRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  max: 20, // limit each IP to 3 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded. You can only make 3 code conversion requests per day.',
      remainingTime: 'Please try again tomorrow.',
      limit: 3,
      remaining: 0,
      windowMs: '24 hours'
    });
  },
  // Add custom headers to include remaining count in successful responses
  skip: (req, res) => {
    // This will be called after the rate limit check passes
    // We'll add custom headers in the next middleware
    return false;
  }
});

// Middleware to add remaining request count to successful responses
const addRateLimitInfo = (req, res, next) => {
  // Get rate limit info from headers
  const remaining = res.getHeader('X-RateLimit-Remaining');
  const limit = res.getHeader('X-RateLimit-Limit');
  const resetTime = res.getHeader('X-RateLimit-Reset');
  
  // Add custom headers with rate limit info
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Reset', resetTime);
  
  // Add rate limit info to response body for successful requests
  const originalJson = res.json;
  res.json = function(data) {
    if (data && typeof data === 'object') {
      data.rateLimit = {
        remaining: parseInt(remaining) || 0,
        limit: parseInt(limit) || 3,
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
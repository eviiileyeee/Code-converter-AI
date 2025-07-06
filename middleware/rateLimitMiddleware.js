const rateLimit = require('express-rate-limit');

// Rate limiter for code conversion - 20 requests per day
const codeConversionRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  max: 3, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Rate limit exceeded. You can only make 20 code conversion requests per day.',
    remainingTime: 'Please try again tomorrow.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded. You can only make 20 code conversion requests per day.',
      remainingTime: 'Please try again tomorrow.',
      limit: 20,
      windowMs: '24 hours'
    });
  }
});

module.exports = {
  codeConversionRateLimit
}; 
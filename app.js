const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const codeRoutes = require('./routes/codeRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT =  4000;

// Security middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Simple development logging
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable CORS
app.use(cors());

// Routes
app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'code-converter-api' });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;

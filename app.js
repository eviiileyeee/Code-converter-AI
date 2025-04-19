const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const codeRoutes = require('./routes/codeRoutes');


const app = express();
const port = process.env.PORT ;

// Security middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes


app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;

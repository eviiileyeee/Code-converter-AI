// server/models/RateLimit.js
const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  resetAt: { type: Date, required: true },
});

module.exports = mongoose.model("RateLimit", rateLimitSchema);

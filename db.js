// server/db.js
const mongoose = require('mongoose');
require("dotenv").config();
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB from server");
  }
};

module.exports = connectDB;

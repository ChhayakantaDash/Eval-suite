const mongoose = require('mongoose');

let isConnected = false; // track connection globally

const connectDB = async () => {
  if (isConnected) return; // reuse existing connection

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error; // re-throw to fail serverless function if DB is down
  }
};

module.exports = connectDB;

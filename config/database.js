// config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ai-persona-chat"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit process in serverless environment
    if (process.env.VERCEL) {
      console.error("Running on Vercel - not exiting process");
      return false;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

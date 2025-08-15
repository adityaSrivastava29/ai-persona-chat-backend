// config/database.js
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return true;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI (partial):", mongoUri.substring(0, 20) + "...");

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;

    // Don't exit process in serverless environment
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.error("Running on Vercel - not exiting process");
      return false;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

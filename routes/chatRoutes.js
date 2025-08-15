// routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const mongoose = require("mongoose");

// Debug route to test API access
router.get("/test", (req, res) => {
  res.json({
    message: "API routes are working",
    timestamp: new Date().toISOString(),
    mongoStatus:
      require("mongoose").connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Database connection test route
router.get("/db-test", async (req, res) => {
  try {
    const connectDB = require("../config/database");

    console.log("Testing database connection...");
    console.log("Current connection state:", mongoose.connection.readyState);
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("Environment variables check:");
    console.log("- VERCEL:", !!process.env.VERCEL);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    
    // Show partial URI for debugging (without credentials)
    if (process.env.MONGODB_URI) {
      const uri = process.env.MONGODB_URI;
      const maskedUri = uri.substring(0, 20) + "***" + uri.substring(uri.lastIndexOf('@'));
      console.log("- MONGODB_URI (masked):", maskedUri);
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("Attempting to connect to database...");
      const result = await connectDB();
      console.log("Connection result:", result);
    }

    // Try to perform a simple operation
    const Persona = require("../models/Persona");
    const count = await Persona.countDocuments();

    res.json({
      status: "success",
      message: "Database connection test successful",
      mongoStatus:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      connectionState: mongoose.connection.readyState,
      personaCount: count,
      mongoUri: process.env.MONGODB_URI ? "set" : "missing",
      environment: process.env.VERCEL ? 'vercel' : 'local',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection test failed",
      error: error.message,
      mongoStatus:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      connectionState: mongoose.connection.readyState,
      mongoUri: process.env.MONGODB_URI ? "set" : "missing",
      environment: process.env.VERCEL ? 'vercel' : 'local',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }
});

// API: Get all personas
router.get("/personas", chatController.getAllPersonas);

// API: Get chat for hardcoded persona
router.post("/chat/:persona", chatController.chatWithPersona);

// API: Custom persona chat (creates new persona)
router.post("/custom-chat", chatController.customPersonaChat);

// API: Continue chat with existing custom persona
router.post("/custom-persona-chat", chatController.continueCustomPersonaChat);

// API: Get chat history for a persona
router.get("/chat-history/:personaId", chatController.getChatHistory);

module.exports = router;

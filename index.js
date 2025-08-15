const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://ai-persona-custom-chat-app-demo1-2cue6xzl9.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "AI Persona Chat Backend is running", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongoStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "API is working", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongoStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB (don't wait for it to prevent function timeout)
connectDB().catch(err => {
  console.error("Database connection failed:", err);
});

// Use modular routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api", chatRoutes);

// Export the app for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 0;
  const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`AI Persona Chat Backend running on port ${actualPort}`);
  });
}

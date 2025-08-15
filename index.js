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
    mongoStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.VERCEL ? 'vercel' : 'local'
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "API is working", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongoStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.VERCEL ? 'vercel' : 'local',
    mongoUri: process.env.MONGODB_URI ? 'set' : 'missing',
    openaiKey: process.env.OPENAI_API_KEY ? 'set' : 'missing'
  });
});

// Initialize database connection immediately (for serverless)
let dbInitialized = false;
const initializeDB = async () => {
  if (!dbInitialized) {
    console.log('Initializing database connection...');
    try {
      await connectDB();
      dbInitialized = true;
      console.log('Database initialization completed');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
};

// Initialize DB on first load
initializeDB();

// Connect to MongoDB (ensure connection for each request in serverless)
const ensureDBConnection = async (req, res, next) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    next(); // Continue anyway, let the route handlers deal with it
  }
};

// Use the middleware for API routes only
app.use('/api', ensureDBConnection);

// Use modular routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api", chatRoutes);

// Export the app for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`AI Persona Chat Backend running on port ${PORT}`);
  });
}

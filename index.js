const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "AI Persona Chat Backend is running", 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    message: "API is working", 
    status: "healthy",
    timestamp: new Date().toISOString()
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

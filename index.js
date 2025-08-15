const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/database");

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use modular routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api", chatRoutes);

// Export the app for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 0;
  const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`AI Persona Chat Backend running on port ${actualPort}`);
  });
}

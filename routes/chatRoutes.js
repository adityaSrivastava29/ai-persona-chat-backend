// routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Debug route to test API access
router.get("/test", (req, res) => {
  res.json({ 
    message: "API routes are working", 
    timestamp: new Date().toISOString(),
    mongoStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
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

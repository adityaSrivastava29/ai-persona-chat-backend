// controllers/chatController.js

const mongoose = require("mongoose");
const Persona = require("../models/Persona");
const ChatHistory = require("../models/ChatHistory");
const { getChatCompletion } = require("../services/openaiService");
const hardcodedPersonas = require("../personas/hardcoded");

// Initialize hardcoded personas in database
const initializeHardcodedPersonas = async () => {
  try {
    for (const [key, persona] of Object.entries(hardcodedPersonas)) {
      const existingPersona = await Persona.findOne({
        name: persona.name,
        isHardcoded: true,
      });
      if (!existingPersona) {
        await Persona.create({
          name: persona.name,
          systemPrompt: persona.systemPrompt,
          isHardcoded: true,
        });
        console.log(`Initialized hardcoded persona: ${persona.name}`);
      }
    }
  } catch (error) {
    console.error("Error initializing hardcoded personas:", error);
  }
};

// Call initialization
initializeHardcodedPersonas();

exports.chatWithPersona = async (req, res) => {
  try {
    const { persona } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build query conditions
    let queryConditions = [];

    // Always check by name for hardcoded personas
    queryConditions.push({
      name: { $regex: new RegExp(persona, "i") },
      isHardcoded: true,
    });

    // Only check by _id if persona is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(persona)) {
      queryConditions.push({ _id: persona });
    }

    // Find persona in database
    let personaDoc = await Persona.findOne({
      $or: queryConditions,
    });

    if (!personaDoc) {
      return res.status(404).json({ error: "Persona not found" });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ personaId: personaDoc._id });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        personaId: personaDoc._id,
        messages: [],
      });
    }

    // Get AI response
    const aiResponse = await getChatCompletion(
      personaDoc.systemPrompt,
      message,
      chatHistory.messages.slice(-10) // Last 10 messages for context
    );

    // Save chat history
    chatHistory.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponse }
    );
    await chatHistory.save();

    res.json({
      response: aiResponse,
      persona: personaDoc.name,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.customPersonaChat = async (req, res) => {
  try {
    const { systemPrompt, message, personaName } = req.body;

    if (!systemPrompt || !message) {
      return res
        .status(400)
        .json({ error: "systemPrompt and message are required" });
    }

    // Save custom persona to database
    const personaDoc = new Persona({
      name: personaName || "Custom Persona",
      systemPrompt: systemPrompt,
      isHardcoded: false,
    });
    await personaDoc.save();

    // Create new chat history
    const chatHistory = new ChatHistory({
      personaId: personaDoc._id,
      messages: [],
    });

    // Get AI response
    const aiResponse = await getChatCompletion(systemPrompt, message);

    // Save chat history
    chatHistory.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponse }
    );
    await chatHistory.save();

    res.json({
      response: aiResponse,
      personaId: personaDoc._id,
      persona: personaDoc.name,
    });
  } catch (error) {
    console.error("Custom chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.continueCustomPersonaChat = async (req, res) => {
  try {
    const { personaId, systemPrompt, message } = req.body;

    if (!personaId || !systemPrompt || !message) {
      return res
        .status(400)
        .json({ error: "personaId, systemPrompt and message are required" });
    }

    // Verify persona exists
    const personaDoc = await Persona.findById(personaId);
    if (!personaDoc) {
      return res.status(404).json({ error: "Persona not found" });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ personaId: personaDoc._id });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        personaId: personaDoc._id,
        messages: [],
      });
    }

    // Get AI response using the provided system prompt
    const aiResponse = await getChatCompletion(
      systemPrompt,
      message,
      chatHistory.messages.slice(-10) // Last 10 messages for context
    );

    // Save chat history
    chatHistory.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponse }
    );
    await chatHistory.save();

    res.json({
      response: aiResponse,
      personaId: personaDoc._id,
      persona: personaDoc.name,
    });
  } catch (error) {
    console.error("Continue custom chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllPersonas = async (req, res) => {
  try {
    const personas = await Persona.find().select(
      "name systemPrompt isHardcoded createdAt"
    );
    res.json(personas);
  } catch (error) {
    console.error("Get personas error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { personaId } = req.params;
    const chatHistory = await ChatHistory.findOne({ personaId }).populate(
      "personaId",
      "name"
    );

    if (!chatHistory) {
      return res.status(404).json({ error: "Chat history not found" });
    }

    res.json(chatHistory);
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

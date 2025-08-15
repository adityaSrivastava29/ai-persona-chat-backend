// models/ChatHistory.js
const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    personaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatHistory", chatHistorySchema);

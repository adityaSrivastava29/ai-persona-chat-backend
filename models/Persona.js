// models/Persona.js
const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    isHardcoded: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Persona", personaSchema);

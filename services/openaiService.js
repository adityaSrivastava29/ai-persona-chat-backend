// services/openaiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChatCompletion = async (
  systemPrompt,
  userMessage,
  chatHistory = []
) => {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
};

module.exports = { getChatCompletion };

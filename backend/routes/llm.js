import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Summarize insurance policy
router.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, cheaper model
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that simplifies insurance policies into plain English for laymen.",
        },
        {
          role: "user",
          content: `Summarize this insurance policy:\n\n${text}`,
        },
      ],
    });

    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to summarize policy" });
  }
});

// Ask questions about policy
router.post("/ask", async (req, res) => {
  try {
    const { text, question } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that explains insurance policies simply.",
        },
        { role: "user", content: `Policy:\n${text}\n\nQuestion: ${question}` },
      ],
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;

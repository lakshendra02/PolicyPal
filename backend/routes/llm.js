import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, // 🔑 set this in .env
});

// Summarize insurance policy
router.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    // Debug: Check what text is being sent to LLM
    console.log("LLM summarize called with:");
    console.log("- Text length:", text ? text.length : 0);
    console.log(
      "- Text preview:",
      text ? text.substring(0, 200) + "..." : "No text"
    );

    const response = await client.chat.completions.create({
      model: "llama3-8b-8192", // free LLaMA-3 model
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
      model: "llama3-8b-8192",
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

// import express from "express";
// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Summarize insurance policy
// router.post("/summarize", async (req, res) => {
//   try {
//     const { text } = req.body;

//     const response = await client.chat.completions.create({
//       model: "gpt-3.5-turbo", // lightweight, cheaper model
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an assistant that simplifies insurance policies into plain English for laymen.",
//         },
//         {
//           role: "user",
//           content: `Summarize this insurance policy:\n\n${text}`,
//         },
//       ],
//     });

//     res.json({ summary: response.choices[0].message.content });
//   } catch (error) {
//     console.error("LLM Error:", error);
//     res.status(500).json({ error: "Failed to summarize policy" });
//   }
// });

// // Ask questions about policy
// router.post("/ask", async (req, res) => {
//   try {
//     const { text, question } = req.body;

//     const response = await client.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an assistant that explains insurance policies simply.",
//         },
//         { role: "user", content: `Policy:\n${text}\n\nQuestion: ${question}` },
//       ],
//     });

//     res.json({ answer: response.choices[0].message.content });
//   } catch (error) {
//     console.error("LLM Error:", error);
//     res.status(500).json({ error: "Failed to answer question" });
//   }
// });

// export default router;

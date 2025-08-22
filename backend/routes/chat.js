import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// Get all chats for a policy
router.get("/:policyId", authMiddleware, async (req, res) => {
  try {
    const { policyId } = req.params;
    const chats = await Chat.find({ policy: policyId })
      .sort({ createdAt: 1 }) // oldest first
      .lean();
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Save a new chat (question + answer)
router.post("/:policyId", authMiddleware, async (req, res) => {
  try {
    const { policyId } = req.params;
    const { question, answer } = req.body;

    const newChat = new Chat({
      policy: policyId,
      user: req.user.id,
      question,
      answer,
    });

    await newChat.save();
    res.json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

export default router;

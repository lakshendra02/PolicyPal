import express from "express";
import Policy from "../models/Policy.js";

const router = express.Router();

// Get all policies of logged-in user
router.get("/", async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(policies);
  } catch (err) {
    console.error("Error fetching policies:", err);
    res.status(500).json({ error: "Failed to fetch policies" });
  }
});

// Get single policy by ID
router.get("/:id", async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!policy) return res.status(404).json({ error: "Policy not found" });
    res.json(policy);
  } catch (err) {
    console.error("Error fetching policy:", err);
    res.status(500).json({ error: "Failed to fetch policy" });
  }
});

// Update summary of a policy
router.put("/:id", async (req, res) => {
  try {
    const { summary } = req.body;
    const policy = await Policy.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { summary },
      { new: true }
    );
    if (!policy) return res.status(404).json({ error: "Policy not found" });
    res.json(policy);
  } catch (err) {
    console.error("Error updating summary:", err);
    res.status(500).json({ error: "Failed to update summary" });
  }
});

export default router;

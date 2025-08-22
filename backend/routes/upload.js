import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse-fixed"; // ✅ using the fixed version
import Policy from "../models/Policy.js"; // 👈 import your Policy model

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // read file
    const dataBuffer = fs.readFileSync(req.file.path);

    // parse PDF text
    const pdfData = await pdf(dataBuffer);

    // delete the uploaded file after parsing
    fs.unlinkSync(req.file.path);

    // save to DB with logged-in user
    const newPolicy = new Policy({
      filename: req.file.originalname,
      context: pdfData.text, // raw text for now
      summary: "", // can fill later with LLM
      user: req.user.id, // 👈 track the user
    });

    await newPolicy.save();

    // return saved policy
    res.json(newPolicy);
  } catch (err) {
    console.error("PDF Parse Error:", err);
    res.status(500).json({ error: "Error processing file" });
  }
});

export default router;

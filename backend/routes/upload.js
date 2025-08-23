import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse-fixed"; // ✅ using the fixed version
import Policy from "../models/Policy.js"; // 👈 import your Policy model

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Function to extract text using pdf-parse-fixed with options
async function extractTextWithPdfParse(dataBuffer) {
  try {
    // Try with different options to improve text extraction
    const options = {
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    };

    const pdfData = await pdf(dataBuffer, options);
    return pdfData.text;
  } catch (error) {
    console.error("pdf-parse-fixed failed:", error.message);
    return null;
  }
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // read file
    const dataBuffer = fs.readFileSync(req.file.path);

    let extractedText = await extractTextWithPdfParse(dataBuffer);
    console.log(
      "PDF extraction result length:",
      extractedText ? extractedText.length : 0
    );

    // Debug: Check final extraction results
    console.log("Final PDF parsing results:");
    console.log("- Text length:", extractedText ? extractedText.length : 0);
    console.log(
      "- Text preview:",
      extractedText
        ? extractedText.substring(0, 300) + "..."
        : "No text extracted"
    );
    console.log(
      "- Raw text (first 500 chars):",
      JSON.stringify(extractedText ? extractedText.substring(0, 500) : "")
    );

    // Check if this might be a scanned document
    if (!extractedText || extractedText.trim().length < 100) {
      console.log(
        "⚠️  WARNING: Very little text extracted. This might be a scanned PDF."
      );
      console.log("   Consider using an OCR service or a text-based PDF.");
    }

    // delete the uploaded file after parsing
    fs.unlinkSync(req.file.path);

    // save to DB with logged-in user
    const newPolicy = new Policy({
      filename: req.file.originalname,
      context: extractedText || "", // use extracted text or empty string
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

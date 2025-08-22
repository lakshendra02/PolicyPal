import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";
import llmRoutes from "./routes/llm.js";
import authRoutes from "./routes/auth.js";
import authenticateToken from "./middleware/authMiddleware.js";
import connectDB from "./config/db.js";
import policyRoutes from "./routes/policy.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/upload", authenticateToken, uploadRoute);
app.use("/api/llm", authenticateToken, llmRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/policies", authenticateToken, policyRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

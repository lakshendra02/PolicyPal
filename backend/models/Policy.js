import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    filename: String,
    summary: String,
    context: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Policy", policySchema);

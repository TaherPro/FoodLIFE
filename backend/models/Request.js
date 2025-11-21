import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "picked_up"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);

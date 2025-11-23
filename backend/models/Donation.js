import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "items" },
    location: { type: String, required: true },
    category: { type: String, default: "other" },
    status: {
      type: String,
      enum: ["pending", "approved", "reserved", "completed", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

donationSchema.index({ status: 1 });

export default mongoose.model("Donation", donationSchema);

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      required: true,
    },
    period: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
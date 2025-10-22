import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Password required only if googleId is not set
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // allow multiple nulls
    },
    agreeToTerms: {
      type: Boolean,
      default: false,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    photo: {
      type: String,
      default: "https://www.svgrepo.com/svg/452030/avatar-default?utm_source=chatgpt.com",
    },
    photoPublicId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "buyer",
    },
    commissionBalance: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },

    // 🟩 Added for Stripe integration
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    customerId: {
      type: String, // Stripe Customer ID
      unique: true,
      sparse: true, // allow multiple nulls
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  { timestamps: true }
);

// Virtual full name
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model("User", userSchema);

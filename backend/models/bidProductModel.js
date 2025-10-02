import mongoose from "mongoose";

const bidProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // seller
    },
    title: {
      type: String,
      required: [true, "Please add a product title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    images: [
      {
        fileName: { type: String },
        filePath: { type: String },   // Cloudinary URL
        fileType: { type: String },
        public_id: { type: String }, // Needed for deletion
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "Laptop",
        "Desktop",
        "CPU",
        "GPU",
        "Motherboard",
        "RAM",
        "Storage",
        "Monitor",
        "Peripherals",
        "Other",
      ],
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    specifications: {
      cpu: { type: String },
      gpu: { type: String },
      ram: { type: String },
      storage: { type: String },
      screenSize: { type: String },
      os: { type: String },
      other: { type: String },
    },
    condition: {
      type: String,
      enum: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
      default: "Used - Good",
    },
    startingBid: {
      type: Number,
      required: [true, "Please add a starting bid price"],
    },
    buyNowPrice: {
      type: Number,
    },
    minIncrement: {
      type: Number,
      default: 100,
    },
    commission: {
      type: Number,
      default: 0,
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    biddingEndTime: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BidProduct = mongoose.model("BidProduct", bidProductSchema);

export default BidProduct;

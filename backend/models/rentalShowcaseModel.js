import mongoose from "mongoose";

const rentalItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RentalItem = mongoose.model("RentalItem", rentalItemSchema);

export default RentalItem;

import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    sku: { type: String, required: true, unique: true }, // Stock Keeping Unit
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    category: { type: String, required: true},
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;

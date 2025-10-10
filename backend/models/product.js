// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String, required: true },
    brand: { type: String },
    specifications: { type: Object },
    availability: { type: String, enum: ["In Stock", "Out of Stock", "Low Stock", "Pre-Order"], default: "In Stock" },
    minStockLevel: { type: Number, default: 5 }
}, { timestamps: true });

// Calculate availability based on quantity
productSchema.pre('save', function(next) {
    if (this.quantity === 0) {
        this.availability = "Out of Stock";
    } else if (this.quantity <= this.minStockLevel) {
        this.availability = "Low Stock";
    } else {
        this.availability = "In Stock";
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
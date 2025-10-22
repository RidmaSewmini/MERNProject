// controllers/product.controller.js
import Product from "../models/product.js";

// GET all products with inventory status
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE new product
export const createProduct = async (req, res) => {
    const { name, price, quantity, description, category, brand, specifications, minStockLevel } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new Product({ 
        name, 
        price, 
        quantity, 
        description, 
        image, 
        category,
        brand,
        specifications: specifications ? JSON.parse(specifications) : {},
        minStockLevel
    });

    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.body.name) product.name = req.body.name;
        if (req.body.price) product.price = req.body.price;
        if (req.body.quantity) product.quantity = req.body.quantity;
        if (req.body.description) product.description = req.body.description;
        if (req.body.category) product.category = req.body.category;
        if (req.body.brand) product.brand = req.body.brand;
        if (req.body.specifications) product.specifications = JSON.parse(req.body.specifications);
        if (req.body.minStockLevel) product.minStockLevel = req.body.minStockLevel;
        if (req.file) product.image = req.file.filename;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET inventory summary
export const getInventorySummary = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStock = await Product.countDocuments({ availability: "In Stock" });
        const outOfStock = await Product.countDocuments({ availability: "Out of Stock" });
        const lowStock = await Product.countDocuments({ availability: "Low Stock" });
        
        const totalValue = await Product.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } }
        ]);

        res.json({
            totalProducts,
            inStock,
            outOfStock,
            lowStock,
            totalValue: totalValue[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
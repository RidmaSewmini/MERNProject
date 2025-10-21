import Stock from "../models/stockModel.js";

// Get all stock items
export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error });
  }
};

// Add new stock item
export const addStock = async (req, res) => {
  try {
    const { productName, sku, totalQuantity, category, description, image } = req.body;
    
    // Validation
    if (!productName || !sku || totalQuantity === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: productName, sku, and totalQuantity are required" 
      });
    }

    const newStock = new Stock({
      productName,
      sku,
      totalQuantity,
      availableQuantity: totalQuantity,
      category,
    });
    await newStock.save();
    res.status(201).json({ message: "Stock item added", stock: newStock });
  } catch (error) {
    console.error("Error adding stock:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "SKU already exists. Please use a unique SKU." 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: "Error adding stock", 
      error: error.message 
    });
  }
};

// Update stock (e.g., quantity)
export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Stock updated", stock });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};

// Delete stock
export const deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock", error });
  }
};

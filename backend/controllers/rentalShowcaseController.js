import RentalItem from "../models/rentalShowcaseModel.js";

// Get all items (optionally filter by category)
export const getAllItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await RentalItem.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await RentalItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new rental item
export const createItem = async (req, res) => {
  const { name, description, pricePerDay, image, category } = req.body;

  if (!name || !pricePerDay || !category) {
    return res.status(400).json({ message: "Please fill all required fields!" });
  }

  try {
    const newItem = new RentalItem({ name, description, pricePerDay, image, category });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a rental item
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await RentalItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a rental item
export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await RentalItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

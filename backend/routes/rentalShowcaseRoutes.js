import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/rentalShowcaseController.js";

const router = express.Router();

// Debug route
router.get("/test", (req, res) => {
  res.json({ message: "Rental showcase routes are working!" });
});

// Routes
router.get("/", getAllItems);         // Get all items (optionally by category)
router.get("/:id", getItemById);      // Get single item
router.post("/", createItem);         // Create new item
router.put("/:id", updateItem);       // Update item
router.delete("/:id", deleteItem);    // Delete item

export default router;

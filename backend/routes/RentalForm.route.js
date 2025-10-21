import express from "express";
import {
  createRentalForm,
  getAllRentalForms,
  getUserRentals,
  getRentalFormById,
  updateRentalForm,
  deleteRentalForm,
  updateRentalStatus,
  cancelRental
} from "../controllers/RentalForm.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/", protect, createRentalForm);
router.get("/my-rentals", protect, getUserRentals); // Get rentals by user email (query param)
router.put("/:id", protect, updateRentalForm);
router.put("/:id/cancel", protect, cancelRental); // Cancel rental

// Admin-only routes
router.get("/", getAllRentalForms);
router.get("/:id", getRentalFormById);
router.put("/:id/status", updateRentalStatus);
router.delete("/:id", deleteRentalForm);

export default router;

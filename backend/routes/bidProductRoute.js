import express from "express";
import {
  createBidProduct,
  getAllProducts,
  getAllProductsOfUser,
  getWonProducts,
  updateProduct,
  deleteProduct,
  getAllSoldProducts,
  verifyAndAddCommissionByAdmin,
  verifyProductByAdmin,
  getAllProductsByAdmin,
  updateProductByAdmin,
  deleteProductsByAdmin,
  getProductById, 
} from "../controllers/bidProductController.js";
import { protect, isSeller, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../utils/fileUpload.js"; 

const router = express.Router();

// Product Routes

// Create product (seller only, with image upload)
router.post("/", protect, isSeller, upload.array("images", 5), createBidProduct);

// Update product (seller only, with image upload)
router.put("/:id", protect, isSeller, upload.array("images", 5), updateProduct);

// Delete product (seller only)
router.delete("/:id", protect, isSeller, deleteProduct);

// Get all products
router.get("/", getAllProducts);

// Get all products of logged-in user
router.get("/user", protect, getAllProductsOfUser);

// Get won products of logged-in user
router.get("/won-products", protect, getWonProducts);

// Get all sold products
router.get("/sold", getAllSoldProducts);

// Only access for admin users
router.get("/admin/products", protect, isAdmin, getAllProductsByAdmin);
router.patch("/admin/verify/:id", protect, isAdmin, verifyAndAddCommissionByAdmin);
router.patch("/admin/verify-only/:id", protect, isAdmin, verifyProductByAdmin);
router.patch("/admin/edit/:id", protect, isAdmin, upload.array("images", 5), updateProductByAdmin );
router.delete("/admin/products", protect, isAdmin, deleteProductsByAdmin);

router.get("/:id", getProductById);

export default router;

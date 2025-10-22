// routes/product.routes.js
import express from "express";
import upload from "../middleware/upload.js";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getInventorySummary
} from "../controllers/product.controller.js";

const router = express.Router();

// Routes
router.get("/", getProducts);
router.get("/summary", getInventorySummary);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
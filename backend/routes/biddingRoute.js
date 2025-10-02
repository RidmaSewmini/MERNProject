import express from "express";
import { placeBid, getBiddingHistory, sellProduct } from "../controllers/biddingController.js";
import { protect, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Get bidding history for a product
// ==========================
router.get("/:productId", getBiddingHistory);

// ==========================
// Place a bid (protected route)
// ==========================
router.post("/", protect, placeBid);

// ==========================
// Sell a product to highest bidder (protected, seller only)
// ==========================
router.post("/sell", protect, isSeller, sellProduct);

export default router;

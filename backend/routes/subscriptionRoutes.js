import express from "express";
import bodyParser from "body-parser";
import { createSubscription, createCheckoutSession, handlePaymentSuccess, getUserSubscription, cancelSubscription } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Payment success callback route
router.get("/payment-success", handlePaymentSuccess);

// All other routes can use normal JSON
router.post("/create", bodyParser.json(), createSubscription);
router.post("/create-checkout-session", bodyParser.json(), createCheckoutSession);

// Protected routes for subscription management
router.get("/user-subscription", protect, getUserSubscription);
router.delete("/cancel", protect, cancelSubscription);

export default router;

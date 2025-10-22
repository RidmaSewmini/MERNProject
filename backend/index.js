import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import session from "express-session";
import passport from "passport";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import bidProductRoutes from "./routes/bidProductRoute.js"; 
import biddingRoutes from "./routes/biddingRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
// import "./utils/auctionScheduler.js";
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";

// ✅ Import Passport configuration
import "./middleware/passport.js";

dotenv.config();

// ===== Cloudinary Configuration =====
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();
const PORT = process.env.PORT || 5001;

// ===== Fix __dirname in ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

// ✅ Add express-session and passport initialization (Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Handle CORS in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Stripe Webhook Route (BEFORE express.json() middleware) =====
// This route needs raw body for signature verification
app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const { handleStripeWebhook } = await import("./controllers/subscriptionController.js");
    return handleStripeWebhook(req, res);
  }
);

// ===== JSON Middleware for all other routes =====
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);  
app.use("/api/bid-products", bidProductRoutes); 
app.use("/api/bidding", biddingRoutes); 
app.use("/api/subscription", subscriptionRoutes);

// ===== Static Uploads Folder =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Home Route =====
app.get("/", (req, res) => {
  res.send("Home Page");
});

// ===== Error Handler (always last) =====
app.use(errorHandler);

// ===== Start Server =====
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import session from "express-session";
import passport from "passport";

// ====== Routes ======
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.route.js";
import rentalRoutes from "./routes/RentalForm.route.js";
import stockRoutes from "./routes/stockRoutes.js";
import rentalShowcaseRoutes from "./routes/rentalShowcaseRoutes.js";
import bidProductRoutes from "./routes/bidProductRoute.js";
import biddingRoutes from "./routes/biddingRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// ====== Database & Middleware ======
import { connectDB } from "./db/connectDB.js";
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

// ===== Fix __dirname for ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CORS =====
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend dev URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());

// ===== Session & Passport (Google OAuth) =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Stripe Webhook (raw body required) =====
app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const { handleStripeWebhook } = await import("./controllers/subscriptionController.js");
    return handleStripeWebhook(req, res);
  }
);

// ===== JSON Middleware (after webhook) =====
app.use(express.json());

// ===== Optional Request Logger =====
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ===== Static Folder for Uploads =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bid-products", bidProductRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/rental-items", rentalShowcaseRoutes);
app.use("/api/upload", uploadRoutes);

// ===== Test & Home Routes =====
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is working", timestamp: new Date() });
});

// ===== Error Handler (must be last) =====
app.use(errorHandler);

// ===== Start Server =====
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

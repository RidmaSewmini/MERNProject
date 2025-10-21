import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

// Routes
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.route.js";
import rentalRoutes from "./routes/RentalForm.route.js";
import stockRoutes from "./routes/stockRoutes.js";
import rentalShowcaseRoutes from "./routes/rentalShowcaseRoutes.js"; 
import bidProductRoutes from "./routes/bidProductRoute.js"; 
import biddingRoutes from "./routes/biddingRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// DB
import { connectDB } from "./db/connectDB.js";

// Middleware
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();
const PORT = process.env.PORT || 5001;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(
  cors({
    origin: ["http://localhost:5173"], // allow frontend dev URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Optional request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
app.use("/api/auth", authRoutes);  
app.use("/api/products", productRoutes);
app.use("/api/bid-products", bidProductRoutes); 
app.use("/api/bidding", biddingRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/rental-items", rentalShowcaseRoutes);
app.use("/api/upload", uploadRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working", timestamp: new Date() });
});

// Error handler (always last)
app.use(errorHandler);

// ===== Start Server =====
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
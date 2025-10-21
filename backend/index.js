import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"
import rentalRoutes from "./routes/RentalForm.route.js";
import stockRoutes from "./routes/stockRoutes.js";
import rentalShowcaseRoutes from "./routes/rentalShowcaseRoutes.js"; 
import bidProductRoutes from "./routes/bidProductRoute.js"; 
import biddingRoutes from "./routes/biddingRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";
//import "./utils/auctionScheduler.js";

// import error middleware
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";

dotenv.config();

// Configure Cloudinary from .env (CLOUDINARY_URL)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: true, // allow any origin in dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Fix __dirname in ES module (since Node ES modules don't have it by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ===== Routes =====
app.use("/api/auth", authRoutes);  
app.use("/api/bid-products", bidProductRoutes); 
app.use("/api/bidding", biddingRoutes); // <-- Mount bidding routes
app.use("/api/rental", rentalRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/rental-items", rentalShowcaseRoutes);
app.use("/api/upload", uploadRoutes);

// static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working", timestamp: new Date() });
});

// error handler (always last)
app.use(errorHandler);

// ===== Start Server =====
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

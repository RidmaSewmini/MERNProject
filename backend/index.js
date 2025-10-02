import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import bidProductRoutes from "./routes/bidProductRoute.js"; 
import biddingRoutes from "./routes/biddingRoute.js"; // <-- New import
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

// static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// error handler (always last)
app.use(errorHandler);

// ===== Start Server =====
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// 🔹 Protect route (requires login)
export const protect = async (req, res, next) => {
  try {
    // Get token from cookie or Bearer header
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, please login" });
    }

    // Verify JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB using userId from token
    const user = await User.findById(verified.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // attach full user object (includes role)
    next();
  } catch (error) {
    console.log("Protect middleware error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, please login" });
  }
};

// 🔹 Admin only
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied - Admin only" });
  }
};

// 🔹 Seller (or Admin) only
export const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
    next(); // access granted
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied - Seller only" });
  }
};



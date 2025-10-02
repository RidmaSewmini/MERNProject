import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    // ✅ Fetch full user from DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // attach full user
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - invalid token" });
  }
};

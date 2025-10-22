import express from "express";
import jwt from "jsonwebtoken"; // <-- Add this for JWT
import passport from "passport"; // <-- Add this for Google OAuth
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	updateProfile,
	loginAsSeller,
	getUser,
	getUserBalance,   
	getAllUser,       
	estimateIncome,
	createUserByAdmin,
	updateUserByAdmin,
	deleteUserByAdmin,
	changePassword ,
	googleLogin   
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { protect,isSeller,isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

// ========== EXISTING ROUTES ==========
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin); 
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", protect, upload.single("photo"), updateProfile);

router.post("/login-seller", loginAsSeller);
router.get("/get-user", protect, getUser);

router.get("/sell-amount", protect, isSeller, getUserBalance);
router.get("/estimate-income", protect, isAdmin, estimateIncome);
router.get("/users", protect, isAdmin, getAllUser);
router.post("/admin/users", protect, isAdmin, upload.single("photo"), createUserByAdmin);
router.patch("/admin/users/:userId", protect, isAdmin, upload.single("photo"), updateUserByAdmin);
router.delete("/admin/users/:userId", protect, isAdmin, deleteUserByAdmin);

router.put("/change-password", protect, changePassword);

// ========== STEP 5 GOOGLE AUTH ROUTES ==========
// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed` }),
  (req, res) => {
    try {
      // Use consistent token generation with other auth methods
      const token = jwt.sign(
        { userId: req.user._id }, // Use userId to match authMiddleware expectations
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Determine redirect URL based on user role
      let redirectUrl;
      switch (req.user.role) {
        case 'admin':
          redirectUrl = `${process.env.CLIENT_URL}/admindashboard`;
          break;
        case 'seller':
          redirectUrl = `${process.env.CLIENT_URL}/sellerdashboard`;
          break;
        case 'buyer':
        default:
          redirectUrl = `${process.env.CLIENT_URL}/userdashboard`;
          break;
      }

      // Set cookie with same configuration as other auth methods
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", // Match generateTokenAndSetCookie configuration
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_generation_failed`);
    }
  }
);

export default router;

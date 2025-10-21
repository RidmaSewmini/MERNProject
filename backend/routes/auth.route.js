import express from "express";
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
	changePassword    
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { protect,isSeller,isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

// existing routes (unchanged)
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
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

export default router;

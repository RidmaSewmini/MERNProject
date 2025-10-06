import bcryptjs from "bcryptjs";
import crypto from "crypto";
import cloudinary from "cloudinary";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessEmail
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, agreeToTerms } = req.body;

    try {
        if (!email || !password || !firstName || !lastName || !agreeToTerms) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        if (agreeToTerms !== true) {
            return res.status(400).json({ 
                success: false, 
                message: "You must agree to the terms and conditions" 
            });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            agreeToTerms,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours

            // ===== new fields =====
            photo: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
            role: "buyer",
            commissionBalance: 0,
            balance: 0
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.error("Email error:", emailError);
        }

        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification.",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isVerified: user.isVerified,
                photo: user.photo,
                role: user.role,
                balance: user.balance,
                commissionBalance: user.commissionBalance
            },
        });
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
				// ensure new fields are also returned
				photo: user.photo,
				role: user.role,
				balance: user.balance,
				commissionBalance: user.commissionBalance
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// controllers/auth.controller.js
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userData = {
      _id: req.user._id,
      firstName: req.user.firstName || null,
      lastName: req.user.lastName || null,
      email: req.user.email || null,
      role: req.user.role || "buyer",
      photo: req.user.photo || null,
      isVerified: req.user.isVerified || false, // ✅ ensure this is included
    };

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const user = req.user; // from protect middleware

    const { firstName, lastName } = req.body;

    // Update name fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Handle profile image upload via Cloudinary
    if (req.file) {
      try {
        const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "UserProfiles",
          resource_type: "image",
          use_filename: true,
          unique_filename: false,
        });

        user.photo = uploadedImage.secure_url; // update user's photo
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Profile image upload failed",
        });
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo,
        role: user.role,
        balance: user.balance,
        commissionBalance: user.commissionBalance,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login as Seller
export const loginAsSeller = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Validate input
		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Please provide both email and password" });
		}

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found, please sign up" });
		}

		// Check password
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid email or password" });
		}

		// Update role to seller
		user.role = "seller";
		await user.save();

		// Generate token + set cookie
		generateTokenAndSetCookie(res, user._id);

		res.status(200).json({
			success: true,
			message: "Logged in as seller successfully",
			user: {
				...user._doc,
				password: undefined,
				photo: user.photo,
				role: user.role,
				balance: user.balance,
				commissionBalance: user.commissionBalance
			},
		});
	} catch (error) {
		console.log("Error in loginAsSeller ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// get User
export const getUser = async (req, res) => {
  try {
    const user = req.user; // attached by protect middleware

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        photo: user.photo,
        role: user.role,
        balance: user.balance,
        commissionBalance: user.commissionBalance
      }
    });
  } catch (error) {
    console.log("Error in getUser ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Balance
export const getUserBalance = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      balance: user.balance,
      commissionBalance: user.commissionBalance
    });
  } catch (error) {
    console.log("Error in getUserBalance ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Users (Admin only)
export const getAllUser = async (req, res) => {
  try {
    // ✅ explicitly include the "photo" field along with other details
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    // Map users to make sure photo is always sent (fallback if missing)
    const usersWithPhotos = users.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      balance: user.balance,
      commissionBalance: user.commissionBalance,
      photo: user.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png", // fallback avatar
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: usersWithPhotos.length,
      users: usersWithPhotos
    });
  } catch (error) {
    console.log("Error in getAllUser ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Estimate Income (Admin only)
export const estimateIncome = async (req, res) => {
	try {
		const admin = await User.findOne({ role: "admin" });
		if (!admin) {
			return res.status(404).json({ success: false, message: "Admin user not found" });
		}

		res.status(200).json({
			success: true,
			income: admin.commissionBalance
		});
	} catch (error) {
		console.log("Error in estimateIncome ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Update any user (Admin)
export const updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Handle image upload
    if (req.file) {
      try {
        const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "UserProfiles",
          resource_type: "image",
          use_filename: true,
          unique_filename: false,
        });
        user.photo = uploadedImage.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error (updateUserByAdmin):", error);
        return res.status(500).json({ success: false, message: "Profile image upload failed" });
      }
    }

    // Apply other updates except password
    Object.keys(updates).forEach(key => {
      if (key !== "password") user[key] = updates[key];
    });

    await user.save();
    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("updateUserByAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete User (Admin)
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserByAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create User (Admin)
export const createUserByAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    let photoUrl = "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"; // default avatar

    // If admin uploaded an image, push it to Cloudinary
    if (req.file) {
      try {
        const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "UserProfiles",
          resource_type: "image",
          use_filename: true,
          unique_filename: false,
        });
        photoUrl = uploadedImage.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error (createUserByAdmin):", error);
      }
    }

    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role, photo: photoUrl });
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("createUserByAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//seperate change password function in dashboard 
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found or password missing" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		agreeToTerms: {
			type: Boolean,
			default: false,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,

		photo: {
			type: String,
			default: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
		},
		role: {
			type: String,
			enum: ["admin", "seller", "buyer"],
			default: "buyer",
		},
		commissionBalance: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

// Add virtual for full name
userSchema.virtual("name").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model("User", userSchema);

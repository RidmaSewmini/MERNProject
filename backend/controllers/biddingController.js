import asyncHandler from "express-async-handler";
import BidProduct from "../models/bidProductModel.js";
import Bidding from "../models/biddingModel.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../mailtrap/emails.js";

// ==========================
// Place a bid
// ==========================
export const placeBid = asyncHandler(async (req, res) => {
  const { productId, price } = req.body;
  const userId = req.user._id;

  const product = await BidProduct.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  if (!product.isVerified) {
    return res.status(400).json({ success: false, message: "Bidding is not verified for this product." });
  }

  if (product.isSoldOut) {
    return res.status(400).json({ success: false, message: "Bidding is closed for this product." });
  }

  // Get current highest bid
  const highestBid = await Bidding.findOne({ product: productId }).sort({ price: -1 });

  let minimumValidBid;

  if (highestBid) {
    // If bids exist: new bid must be >= highestBid + minIncrement
    minimumValidBid = highestBid.price + product.minIncrement;
    if (price < minimumValidBid) {
      return res.status(400).json({
        success: false,
        message: `Your bid must be at least ${minimumValidBid}. Current highest bid is ${highestBid.price}, min increment is ${product.minIncrement}.`,
      });
    }
  } else {
    // First bid: must be > startingBid
    minimumValidBid = product.startingBid + product.minIncrement;
    if (price < minimumValidBid) {
      return res.status(400).json({
        success: false,
        message: `Your first bid must be at least ${minimumValidBid}. Starting bid is ${product.startingBid}, minimum increment is ${product.minIncrement}.`,
      });
    }
  }

  // Check if user already placed a bid
  const existingUserBid = await Bidding.findOne({ user: userId, product: productId });

  if (existingUserBid) {
    if (price <= existingUserBid.price) {
      return res.status(400).json({
        success: false,
        message: "Your new bid must be higher than your previous bid.",
      });
    }
    existingUserBid.price = price;
    await existingUserBid.save();

    return res.status(200).json({
      success: true,
      bidding: existingUserBid,
      message: `Bid updated successfully! Current highest bid is now ${price}`,
    });
  }

  // Save new bid
  const newBid = await Bidding.create({
    user: userId,
    product: productId,
    price,
  });

  return res.status(201).json({
    success: true,
    bidding: newBid,
    message: `Bid placed successfully! Current highest bid is now ${price}`,
  });
});


// ==========================
// Get bidding history for a product
// ==========================
export const getBiddingHistory = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const history = await Bidding.find({ product: productId })
    .sort("-createdAt")
    .populate("user", "name email")
    .populate("product", "title startingBid buyNowPrice");

  res.status(200).json({ success: true, history });
});

// ==========================
// Sell product to highest bidder (after auction end time)
// ==========================
export const sellProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await BidProduct.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  // Ensure only the seller can finalize
  if (product.user.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: "You do not have permission to sell this product." });
  }

  // Check if auction has ended
  const now = new Date();
  if (product.endDate && now < new Date(product.endDate)) {
    return res.status(400).json({
      success: false,
      message: `Auction is still ongoing. It ends at ${product.endDate}.`,
    });
  }

  // If already sold
  if (product.isSoldOut) {
    return res.status(400).json({ success: false, message: "Product is already sold." });
  }

  // Get highest bid at end time
  const highestBid = await Bidding.findOne({ product: productId })
    .sort({ price: -1 })
    .populate("user");

  if (!highestBid) {
    return res.status(400).json({ success: false, message: "No winning bid found for this product." });
  }

  const commissionRate = product.commission || 0;
  const commissionAmount = (commissionRate / 100) * highestBid.price;
  const finalPrice = highestBid.price - commissionAmount;

  // Mark product as sold
  product.isSoldOut = true;
  product.soldTo = highestBid.user._id;
  product.soldPrice = finalPrice;
  await product.save();

  // Update admin balance
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    admin.commissionBalance += commissionAmount;
    await admin.save();
  }

  // Update seller balance
  const seller = await User.findById(product.user);
  if (seller) {
    seller.balance += finalPrice;
    await seller.save();
  }

  // Send email to highest bidder
  try {
    await sendEmail({
      email: highestBid.user.email,
      subject: `🎉 Congratulations! You won the auction for "${product.title}"`,
      text: `You have won the auction for "${product.title}" with a bid of $${highestBid.price}.`,
      html: `<p>Hi ${highestBid.user.name},</p>
             <p>🎉 Congratulations! You have won the auction for <strong>${product.title}</strong> with a bid of <strong>$${highestBid.price}</strong>.</p>
             <p>Thank you for participating in the auction.</p>`,
    });
  } catch (error) {
    console.error("Failed to send winning bid email:", error.message);
  }

  res.status(200).json({ success: true, message: "Product successfully sold to the highest bidder!", product });
});



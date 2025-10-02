import cron from "node-cron";
import BidProduct from "../models/bidProductModel.js";
import Bidding from "../models/biddingModel.js";
import User from "../models/userModel.js";
import sendEmail from "../mailtrap/emails.js"; // your email util

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking ended auctions...");

  const now = new Date();

  // Find products that are not sold but auction has ended
  const expiredProducts = await BidProduct.find({
    isSoldOut: false,
    endDate: { $lte: now },
  });

  for (const product of expiredProducts) {
    console.log(`🔍 Finalizing auction for product: ${product.title}`);

    // Get highest bid
    const highestBid = await Bidding.findOne({ product: product._id })
      .sort({ price: -1 })
      .populate("user");

    if (!highestBid) {
      console.log(`❌ No bids found for ${product.title}, auction closed.`);
      product.isSoldOut = true;
      await product.save();
      continue;
    }

    const commissionRate = product.commission || 0;
    const commissionAmount = (commissionRate / 100) * highestBid.price;
    const finalPrice = highestBid.price - commissionAmount;

    // Update product
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

    // Send email to winner
    try {
      await sendEmail({
        email: highestBid.user.email,
        subject: `🎉 You won "${product.title}"!`,
        text: `Congratulations! You won the auction for "${product.title}" at $${highestBid.price}.`,
      });
    } catch (err) {
      console.error("Email sending failed:", err.message);
    }

    console.log(`✅ Product "${product.title}" sold to ${highestBid.user.email}`);
  }
});

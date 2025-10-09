import mongoose from "mongoose";

const biddingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // the bidder
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BidProduct", // references your bid products
    },
    price: {
      type: Number,
      required: [true, "Please add a bid price"],
    },
  },
  { timestamps: true }
);

const Bidding = mongoose.model("Bidding", biddingSchema);

export default Bidding;

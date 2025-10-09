import mongoose from "mongoose";

const rentalFormSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nic: { type: String, required: true },
    address: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    remark: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index to speed up overlap checks by product and date range
rentalFormSchema.index({ product: 1, startDate: 1, endDate: 1 });

const RentalForm = mongoose.model("RentalForm", rentalFormSchema);
export default RentalForm;

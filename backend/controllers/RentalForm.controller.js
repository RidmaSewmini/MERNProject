import RentalForm from "../models/RentalForm.model.js";
import Stock from "../models/stockModel.js";

const basePrices = {
  "HP Pavilion Laptop": 8500,
  "MacBook": 20000,
  "Curved Gaming Monitor": 30000,
  "Wireless Keyboard": 300,
  "Wireless Mouse": 200,
  "Bluetooth Headphones": 2000,
  "JBL bluetooth Speaker": 4000,
  "Gaming Microphone": 3500,
  "Web Cam": 2000,
  "External Hard Drive (HDD)": 1000,
  "USB-C Hub": 2500,
  "Wi-Fi Router": 3000,
  "Network Switch 8-Port": 12000,
  "Power line Adapter": 2000,
  "USB-C Ethernet Adapter": 1500,
  "Flash Drives 32GB": 500,
  "Flash Drives 128GB": 800,
  "Memory Card Reader": 1000,
  "Power Bank 10000mAh": 3000,
  "PowerBank 32000mAh": 5000,
  "8 Ports USB Charging Station": 4000,
  "Gaming Motherboard": 40000,
  "Gaming PC": 30000,
  "iMac Desktop Computer": 28000,
  Default: 1000,
};

// NOTE: We now use the persistent Stock collection instead of hardcoded product stock

export const createRentalForm = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // <-- check what frontend sends

    const body = { ...req.body };
    
    // Use authenticated user's email instead of form data
    body.email = req.user.email;

    // Normalize field casing for remark
    if (body.Remark && !body.remark) {
      body.remark = body.Remark;
      delete body.Remark;
    }

    // Coerce types
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const quantityNumber = Number(body.quantity) || 1;

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    // Ensure end > start
    const oneDayMs = 1000 * 60 * 60 * 24;
    const days = Math.ceil((end.getTime() - start.getTime()) / oneDayMs);
    if (days <= 0) {
      return res.status(400).json({ message: "endDate must be after startDate" });
    }

    // Helper to escape regex from product name
    const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // First try: case-insensitive exact match
    const nameRegex = new RegExp(`^${escapeRegex(body.product)}$`, "i");

    let updatedStock = await Stock.findOneAndUpdate(
      { productName: { $regex: nameRegex }, availableQuantity: { $gte: quantityNumber } },
      { $inc: { availableQuantity: -quantityNumber } },
      { new: true }
    );

    // Second try: normalized match (remove spaces and non-alphanumeric)
    if (!updatedStock) {
      const normalize = (s = "") => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const desired = normalize(body.product);
      // Find candidate
      const candidate = await Stock.findOne({});
      // Use aggregation to find matching by normalization across all stock docs
      // Fallback: manual pass if small collections
      const allStocks = await Stock.find({}, { productName: 1, availableQuantity: 1 });
      const matched = allStocks.find((st) => normalize(st.productName) === desired);
      if (matched) {
        updatedStock = await Stock.findOneAndUpdate(
          { _id: matched._id, availableQuantity: { $gte: quantityNumber } },
          { $inc: { availableQuantity: -quantityNumber } },
          { new: true }
        );
      }
    }

    if (!updatedStock) {
      return res.status(409).json({
        message: `Insufficient stock or product not found for ${body.product}. Requested: ${quantityNumber}.`,
      });
    }

    // Compute price if missing/invalid
    if (body.price === undefined || body.price === null || Number(body.price) <= 0) {
      const base = basePrices[body.product] || basePrices.Default;
      body.price = base * quantityNumber * days;
    }

    // Assign coerced values
    body.quantity = quantityNumber;
    body.startDate = start;
    body.endDate = end;
    body.status = "Pending"; // Set initial status

    const form = new RentalForm(body);
    await form.save();
    res.status(201).json({ message: "Rental form submitted successfully", form, stock: updatedStock });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllRentalForms = async (req, res) => {
  try {
    const forms = await RentalForm.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rentals by authenticated user
export const getUserRentals = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    
    // Find rentals by user email
    const forms = await RentalForm.find({ email: userEmail }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRentalFormById = async (req, res) => {
  try {
    const form = await RentalForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRentalForm = async (req, res) => {
  try {
    const updatedForm = await RentalForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedForm) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRentalForm = async (req, res) => {
  try {
    const deletedForm = await RentalForm.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Pending", "Ongoing", "Returned", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be Pending, Ongoing, Returned, or Cancelled" });
    }

    const updatedForm = await RentalForm.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedForm) return res.status(404).json({ message: "Rental form not found" });

    res.status(200).json({ message: "Status updated successfully", form: updatedForm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel rental (only for pending rentals)
export const cancelRental = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the rental form
    const rentalForm = await RentalForm.findById(id);
    if (!rentalForm) {
      return res.status(404).json({ message: "Rental form not found" });
    }

    // Check if rental is pending
    if (rentalForm.status !== "Pending") {
      return res.status(400).json({ 
        message: "Only pending rentals can be cancelled",
        currentStatus: rentalForm.status
      });
    }

    // Update status to cancelled
    const updatedForm = await RentalForm.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    // Restore stock availability
    const requestedProductName = updatedForm.product;
    const quantityToRestore = updatedForm.quantity;
    
    // Find and update stock
    const stockItem = await Stock.findOne({ productName: new RegExp(`^${requestedProductName}$`, 'i') });
    
    if (stockItem) {
      await Stock.findByIdAndUpdate(
        stockItem._id,
        { $inc: { availableQuantity: quantityToRestore } },
        { new: true }
      );
    }

    res.status(200).json({ 
      message: "Rental cancelled successfully", 
      form: updatedForm 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

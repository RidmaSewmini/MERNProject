import RentalForm from "../models/RentalForm.model.js";

const basePrices = {
  "HP Pavilion Laptop": 8500,
  "Mac Book": 20000,
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

// Product stock (units available for the same time period)
const productStock = {
  "HP Pavilion Laptop": 5,
  "Mac Book": 3,
  "Curved Gaming Monitor": 4,
  "Wireless Keyboard": 10,
  "Wireless Mouse": 12,
  "Bluetooth Headphones": 8,
  "JBL bluetooth Speaker": 6,
  "Gaming Microphone": 5,
  "Web Cam": 7,
  "External Hard Drive (HDD)": 10,
  "USB-C Hub": 10,
  "Wi-Fi Router": 6,
  "Network Switch 8-Port": 5,
  "Power line Adapter": 8,
  "USB-C Ethernet Adapter": 7,
  "Flash Drives 32GB": 20,
  "Flash Drives 128GB": 15,
  "Memory Card Reader": 10,
  "Power Bank 10000mAh": 10,
  "PowerBank 32000mAh": 6,
  "8 Ports USB Charging Station": 6,
  "Gaming Motherboard": 4,
  "Gaming PC": 3,
  "iMac Desktop Computer": 2,
  Default: 5,
};

export const createRentalForm = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // <-- check what frontend sends

    const body = { ...req.body };

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

    // Stock/availability check by summing overlapping bookings' quantities
    console.log(`Checking availability for ${body.product} from ${start.toISOString()} to ${end.toISOString()}`);

    const totalUnits = productStock[body.product] ?? productStock.Default;

    // Two ranges overlap if existing.start <= requested.end AND existing.end >= requested.start
    const overlappingBookings = await RentalForm.find({
      product: body.product,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    const bookedQuantity = overlappingBookings.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
    const availableUnits = Math.max(0, totalUnits - bookedQuantity);

    console.log(
      `Stock check for ${body.product}: total=${totalUnits}, booked=${bookedQuantity}, available=${availableUnits}, requested=${quantityNumber}`
    );

    if (quantityNumber > availableUnits) {
      const requestedStart = start.toLocaleDateString();
      const requestedEnd = end.toLocaleDateString();
      return res.status(409).json({
        message: `Insufficient stock for ${body.product} between ${requestedStart} and ${requestedEnd}. Available: ${availableUnits}, requested: ${quantityNumber}. Please reduce quantity or choose different dates.`,
        available: availableUnits,
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

    const form = new RentalForm(body);
    await form.save();
    res.status(201).json({ message: "Rental form submitted successfully", form });
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

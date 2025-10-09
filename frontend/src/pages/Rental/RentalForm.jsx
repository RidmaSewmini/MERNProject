import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";
import WirelessMousemg1 from '../../Asset/WirelessMouse.jpeg';
import RFbg from '../Asset/RFbg.jpeg';


const RentalForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product || "";
  const selectedImage = location.state?.image || WirelessMousemg1;
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    product: selectedProduct,
    quantity: 1,
    startDate: "",
    endDate: "",
    Remark: "",
    terms: false,
  });

  const [price, setPrice] = useState(0);

  // Example base prices for products (LKR per day)
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

  // Descriptions for each product displayed under the image (bullet points)
  const productDescriptions = {
    "HP Pavilion Laptop": [
      "HP Pavilion series laptop with Intel® Core™ processor.",
      "Full HD display.",
      "Reliable performance.",
      "Long battery life.",
      "Perfect for students and professionals."
    ],
    "Mac Book": [
      "Apple MacBook with Retina display.",
      "Premium aluminum build.",
      "Smooth macOS performance.",
      "Excellent battery life.",
      "Ideal for creative professionals."
    ],
    "Curved Gaming Monitor": [
      "Immersive wide‑angle curved display.",
      "High refresh rate for smooth gameplay.",
      "Vibrant colors for media and games."
    ],
    "Wireless Keyboard": [
      "Ergonomic, comfortable typing.",
      "Quiet keys.",
      "Long battery life."
    ],
    "Wireless Mouse": [
      "Ergonomic wireless design.",
      "Precision optical tracking.",
      "Smooth scrolling.",
      "Long‑lasting battery."
    ],
    "Bluetooth Headphones": [
      "High‑definition sound.",
      "Noise isolation.",
      "Cushioned ear pads for comfort."
    ],
    "JBL bluetooth Speaker": [
      "Portable waterproof build.",
      "Punchy bass and clear 360° sound.",
      "Great indoors and outdoors."
    ],
    "Gaming Microphone": [
      "USB condenser mic (HyperX/Blue Yeti class).",
      "Crystal‑clear voice capture.",
      "Noise reduction for streaming/meetings."
    ],
    "Web Cam": [
      "Full‑HD 1080p video.",
      "Built‑in microphone.",
      "Plug‑and‑play for calls and streaming."
    ],
    "External Hard Drive (HDD)": [
      "High‑capacity portable storage.",
      "Durable casing.",
      "USB 3.0 fast transfers."
    ],
    "USB-C Hub": [
      "Multiport hub (HDMI/USB/card reader).",
      "Expand laptop connectivity."
    ],
    "Wi‑Fi Router": [
      "Dual‑band router with wide coverage.",
      "Stable speeds.",
      "Strong WPA3 security."
    ],
    "Network Switch 8-Port": [
      "Unmanaged Gigabit switch.",
      "Expand wired LAN connections."
    ],
    "Power line Adapter": [
      "Extend internet via electrical wiring.",
      "Easy setup, stable connection."
    ],
    "USB-C Ethernet Adapter": [
      "USB‑C Gigabit Ethernet.",
      "Instant stable wired internet."
    ],
    "Flash Drives 32GB": [
      "Portable 32GB storage.",
      "Reliable quick transfers."
    ],
    "Flash Drives 128GB": [
      "128GB USB 3.x storage.",
      "High‑speed transfers for large files."
    ],
    "Memory Card Reader": [
      "Fast SD/microSD read & write.",
      "Plug‑and‑play."
    ],
    "Power Bank 10000mAh": [
      "10,000mAh compact power bank.",
      "Dual output, fast charging."
    ],
    "PowerBank 32000mAh": [
      "32,000mAh ultra‑high capacity.",
      "Multiple ports for several devices."
    ],
    "8 Ports USB Charging Station": [
      "8‑port USB charging hub.",
      "Smart IC for safe charging."
    ],
    "Gaming Motherboard": [
      "ASUS/MSI gaming‑grade board.",
      "Advanced overclocking & RGB.",
      "Multiple GPU support."
    ],
    "Gaming PC": [
      "High‑performance GPU & CPU.",
      "Fast SSD storage.",
      "Advanced cooling for heavy workloads."
    ],
    "iMac Desktop Computer": [
      "Retina 4K/5K display.",
      "macOS ecosystem integration.",
      "Powerful all‑in‑one workstation."
    ],
    Default: [
      "Premium tech gear from trusted brands.",
      "Available for rent for work, study, and events."
    ]
  };

  // Calculate price whenever inputs change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );

      if (days > 0) {
        const basePrice =
          basePrices[formData.product] || basePrices["Default"];
        setPrice(basePrice * formData.quantity * days);
      } else {
        setPrice(0);
      }
    }
  }, [formData.startDate, formData.endDate, formData.product, formData.quantity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.terms) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  // Prepare data to send
  const dataToSend = { ...formData, price };

  try {
    const { data } = await api.post("/rental", dataToSend, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    alert("Form submitted successfully!");
    console.log("Saved in backend:", data);
    navigate("/rental");
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    if (status === 409) {
      alert("This item is not available for the selected dates. Please choose different dates.");
    } else {
      alert("Failed to submit form: " + message);
    }
    console.error("Error submitting form:", error);
  }
};


  return (

    <div className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center font-titillium" style={{ backgroundImage: `url(${RFbg})` }}>
      <div className="relative max-w-5xl w-full">
        <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-950 via-pink-700 to-blue-900 opacity-0 blur-md" />
        <div className="relative flex rounded-2xl overflow-hidden bg-white/20 backdrop-blur-xl border border-white/35 shadow-2xl">

        {/* Left Side - Image + Description */}
        <div className="w-1/2 bg-white/5 flex flex-col items-center p-6">
          <img
            src={selectedImage}
            alt="Rental banner"
            className="w-full h-80 object-cover rounded mb-4"
          />
           {/* Product Name */}
          <h3 className="text-xl font-bold mb-2">{selectedProduct || "Select a Product"}</h3>

          {/* Product Description (bullet points) */}
          {selectedProduct ? (
            <ul className="list-disc list-inside text-sm text-gray-950 space-y-1 mb-2 text-left">
              {(productDescriptions[selectedProduct] || productDescriptions.Default).map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800 text-center mb-2">
              Choose a product from our rental page to see details here.
            </p>
          )}

          {/* Price */}
          <p className="text-lg font-semibold text-purple-500 mb-6">
            Price per day: LKR {basePrices[selectedProduct] || basePrices["Default"]}
          </p>

          {/* Terms & Conditions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm p-4 mt-auto">
            <h4 className="font-bold mb-2 text-gray-800">Terms & Conditions</h4>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              <li>Charges apply for damages or late returns.</li>
              <li>Rental must be returned by the agreed due date.</li>
              <li>Reservation cancellations are fully refundable.</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Rental Form */}
        <div className="w-1/2 p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/rental")}
              className=" text-white shadow-sm transition"
            >
              ← Back to Rental Showcase
            </button>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center">Rental Form</h2>

          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">NIC Number</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Product */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Product</label>
              {selectedProduct ? (
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full border rounded p-2 bg-gray-100"
                  readOnly
                />
              ) : (
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select a product</option>
                  {Object.keys(basePrices).filter(key => key !== "Default").map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                min="1"
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Rental Dates */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Auto-Calculated Price */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Total Price (LKR)</label>
              <input
                type="text"
                value={price}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>

            {/* Remark */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Remark</label>
              <textarea
                name="Remark"
                value={formData.Remark}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Terms */}
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                I agree to the rental terms and conditions
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md text-white shadow-sm transition hover:bg-purple-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RentalForm;

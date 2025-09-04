import React, { useState, useEffect } from "react";
import WirelessMousemg1 from '../Asset/WirelessMouse.jpeg';

const RentalForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    product: "",
    quantity: 1,
    startDate: "",
    endDate: "",
    purpose: "",
    terms: false,
  });

  const [price, setPrice] = useState(0);

  // Example base prices for products (LKR per day)
  const basePrices = {
    Laptop: 1500,
    Monitor: 800,
    Keyboard: 300,
    "Wireless Mouse": 200,
    Headphones: 500,
    Default: 1000,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    console.log("Rental Form Data:", { ...formData, price });
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl w-full">
        {/* Left Side - Image + Description */}
        <div className="w-1/2 bg-gray-50 flex flex-col items-center p-6">
          <img
            src={WirelessMousemg1}
            alt="Rental banner"
            className="w-full h-80 object-cover rounded mb-4"
          />
           {/* Product Name */}
          <h3 className="text-xl font-bold mb-2">Wireless Mouse</h3>

          {/* Product Description */}
          <p className="text-gray-700 text-center mb-2">
            Comfortable and lightweight wireless mouse with long battery life 
            and smooth precision tracking. Perfect for office, study, or travel use.
          </p>

          {/* Price */}
          <p className="text-lg font-semibold text-blue-600 mb-6">
            Price per day: LKR 200
          </p>

          {/* Terms & Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mt-auto">
            <h4 className="font-bold mb-2 text-gray-800">Terms & Conditions</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Charges apply for damages or late returns.</li>
              <li>Rental must be returned by the agreed due date.</li>
              <li>Reservation cancellations are fully refundable.</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Rental Form */}
        <div className="w-1/2 p-8">
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
              <label className="block mb-1 font-semibold">Phone</label>
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
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full border rounded p-2"
                required
              />
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

            {/* Purpose */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
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
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RentalForm;

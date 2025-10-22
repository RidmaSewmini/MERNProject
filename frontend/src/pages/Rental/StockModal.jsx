// src/components/StockModal.jsx
import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const StockModal = ({ stock, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    totalQuantity: 0,
    availableQuantity: 0,
    category: "",
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        productName: stock.productName || "",
        sku: stock.sku || "",
        totalQuantity: stock.totalQuantity ?? 0,
        availableQuantity: stock.availableQuantity ?? stock.totalQuantity ?? 0,
        category: stock.category || "",
      });
    }
  }, [stock]);

  if (!stock) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/stock/${stock._id}`, {
        ...formData,
        totalQuantity: Number(formData.totalQuantity),
        availableQuantity: Number(formData.availableQuantity),
      });
      toast.success("Stock updated successfully!");
      if (onSaved) onSaved(res.data.stock);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating stock");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Edit Stock</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="Enter product name"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder="Enter SKU"
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
              required
              disabled
            />
          </div>

          {/* Total Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Total Quantity *
            </label>
            <input
              type="number"
              value={formData.totalQuantity}
              onChange={(e) =>
                setFormData({ ...formData, totalQuantity: e.target.value })
              }
              placeholder="Enter total quantity"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          {/* Available Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Available Quantity *
            </label>
            <input
              type="number"
              value={formData.availableQuantity}
              onChange={(e) =>
                setFormData({ ...formData, availableQuantity: e.target.value })
              }
              placeholder="Enter available quantity"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="Computing">Computing</option>
              <option value="Networking">Networking</option>
              <option value="Storage">Storage</option>
              <option value="Power">Power</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StockModal;

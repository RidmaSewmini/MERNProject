import React, { useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const AddStockModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    totalQuantity: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/stock", {
        ...formData,
        totalQuantity: Number(formData.totalQuantity),
      });
      toast.success("Stock added!");
      if (onSave) onSave(res.data.stock);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding stock");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Add Stock Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Name *</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">SKU *</label>
            <input
              type="text"
              placeholder="Enter SKU"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Total Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Total Quantity *</label>
            <input
              type="number"
              placeholder="Enter total quantity"
              value={formData.totalQuantity}
              onChange={(e) =>
                setFormData({ ...formData, totalQuantity: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
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
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;

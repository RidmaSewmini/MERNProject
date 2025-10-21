import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const EditModal = ({ rental, isOpen, onClose, onUpdate }) => {
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
    remark: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  // Update form data when rental prop changes
  useEffect(() => {
    if (rental) {
      setFormData({
        fullName: rental.fullName || "",
        email: rental.email || "",
        phone: rental.phone || "",
        nic: rental.nic || "",
        address: rental.address || "",
        product: rental.product || "",
        quantity: rental.quantity || 1,
        startDate: rental.startDate ? new Date(rental.startDate).toISOString().split('T')[0] : "",
        endDate: rental.endDate ? new Date(rental.endDate).toISOString().split('T')[0] : "",
        remark: rental.remark || "",
        status: rental.status || "Pending",
      });
    }
  }, [rental]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rental?._id) return;

    setLoading(true);
    try {
      const response = await api.put(`/rental/${rental._id}`, formData);
      toast.success("Rental updated successfully!");
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating rental:", error);
      toast.error(error.response?.data?.message || "Failed to update rental");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !rental) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Rental Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC Number *
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rental Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments..."
              />
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rental Status
              </label>
              <div className="flex items-center space-x-6">
                {/* Pending - Yellow */}
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="Pending"
                    checked={formData.status === "Pending"}
                    onChange={handleChange}
                    className="text-yellow-500 focus:ring-yellow-400"
                  />
                  <span className="text-yellow-600 font-medium">Pending</span>
                </label>

                {/* Ongoing - Blue */}
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="Ongoing"
                    checked={formData.status === "Ongoing"}
                    onChange={handleChange}
                    className="text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-blue-600 font-medium">Ongoing</span>
                </label>

                    {/* Returned - Green */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="status"
                        value="Returned"
                        checked={formData.status === "Returned"}
                        onChange={handleChange}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-green-600 font-medium">Returned</span>
                    </label>

                    {/* Cancelled - Red */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="status"
                        value="Cancelled"
                        checked={formData.status === "Cancelled"}
                        onChange={handleChange}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-600 font-medium">Cancelled</span>
                    </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

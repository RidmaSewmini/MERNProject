import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const RentalUserDashboard = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    nic: "",
    address: ""
  });

  // Fetch user's rentals
  useEffect(() => {
    const fetchUserRentals = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/rental/my-rentals`);
        setRentals(response.data || []);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
        toast.error("Failed to fetch your rentals");
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRentals();
  }, [user?.email]);

  // Cancel rental function
  const handleCancelRental = async (rentalId) => {
    if (!window.confirm("Are you sure you want to cancel this rental? This action cannot be undone.")) {
      return;
    }

    try {
      console.log("Attempting to cancel rental:", rentalId);
      const response = await api.put(`/rental/${rentalId}/cancel`);
      console.log("Cancel response:", response.data);
      toast.success("Rental cancelled successfully");
      
      // Update the rentals list
      setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental._id === rentalId 
            ? { ...rental, status: "Cancelled" }
            : rental
        )
      );
    } catch (error) {
      console.error("Error cancelling rental:", error);
      console.error("Error response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Failed to cancel rental";
      toast.error(errorMessage);
    }
  };

  // Edit rental function
  const handleEditRental = (rental) => {
    setEditingRental(rental);
    setEditFormData({
      fullName: rental.fullName || "",
      phone: rental.phone || "",
      nic: rental.nic || "",
      address: rental.address || ""
    });
    setIsEditModalOpen(true);
  };

  // Update rental function
  const handleUpdateRental = async () => {
    if (!editingRental) return;

    // Basic validation
    if (!editFormData.fullName.trim() || !editFormData.phone.trim() || !editFormData.nic.trim() || !editFormData.address.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await api.put(`/rental/${editingRental._id}`, editFormData);
      toast.success("Rental details updated successfully");
      
      // Update the rentals list
      setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental._id === editingRental._id 
            ? { ...rental, ...editFormData }
            : rental
        )
      );
      
      setIsEditModalOpen(false);
      setEditingRental(null);
    } catch (error) {
      console.error("Error updating rental:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update rental";
      toast.error(errorMessage);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRental(null);
    setEditFormData({
      fullName: "",
      phone: "",
      nic: "",
      address: ""
    });
  };

  // Filter rentals based on search input
  const filteredRentals = rentals.filter((rental) =>
    rental.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900">My Rentals</h2>
          <p className="text-gray-600 text-sm">
            Manage your rented products and track their status.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search rentals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading your rentals...</div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Product</th>
                <th className="py-3 px-4 text-left font-semibold">Rental Period</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Total Price</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRentals.map((rental) => (
                <tr
                  key={rental._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  {/* Product Info */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{rental.product}</p>
                      <p className="text-xs text-gray-500">
                        <span className="text-blue-700 font-medium">Qty: {rental.quantity}</span>
                        {rental.remark && (
                          <>
                            <span className="text-gray-400 mx-1">•</span>
                            <span className="text-gray-600">Note: {rental.remark}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="py-3 px-4 text-gray-700">
                    <p className="text-sm">
                      {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rental.status === "Ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : rental.status === "Returned"
                          ? "bg-green-100 text-green-700"
                          : rental.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : rental.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </td>

                  {/* Total Price */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-green-700 font-semibold">
                      LKR {rental.price?.toLocaleString() || "N/A"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    {rental.status === "Pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditRental(rental)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelRental(rental._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRentals.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    {searchTerm ? "No rentals match your search." : "You haven't made any rentals yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Personal Details</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateRental(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingRental?.email || ""}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.nic}
                    onChange={(e) => setEditFormData({ ...editFormData, nic: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Update Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalUserDashboard;

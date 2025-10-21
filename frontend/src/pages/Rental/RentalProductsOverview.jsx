import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import StockModal from "./StockModal";
import AddStockModal from "./AddStockModal";
import AddRentalItemForm from "./AddRentalItemForm";
import EditShowcaseModal from "./EditShowcaseModal";

{/* .............AllRentalProducts..............  */}
const AllRentalProducts = () => {
  const [activeTab, setActiveTab] = useState("all-products");
  const [rentalForms, setRentalForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Stock state
  const [stocks, setStocks] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [stockToEdit, setStockToEdit] = useState(null);

  // Showcase state
  const [showAddShowcaseModal, setShowAddShowcaseModal] = useState(false);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [showcaseLoading, setShowcaseLoading] = useState(false);
  const [editingShowcaseItem, setEditingShowcaseItem] = useState(null);
  const [showEditShowcaseModal, setShowEditShowcaseModal] = useState(false);
  const [showcaseSearchTerm, setShowcaseSearchTerm] = useState("");
  const [stockSearchTerm, setStockSearchTerm] = useState("");

  // Filtered arrays
  const filteredRentals = rentalForms.filter((rental) => {
    const term = searchTerm.toLowerCase();
    return (
      rental.product?.toLowerCase().includes(term) ||
      rental.fullName?.toLowerCase().includes(term) ||
      rental.email?.toLowerCase().includes(term)
    );
  });

  const filteredShowcaseItems = showcaseItems.filter((item) => {
    const term = showcaseSearchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term)
    );
  });

  const filteredStocks = stocks.filter((stock) => {
    const term = stockSearchTerm.toLowerCase();
    return (
      stock.productName?.toLowerCase().includes(term) ||
      stock.sku?.toLowerCase().includes(term) ||
      stock.category?.toLowerCase().includes(term)
    );
  });

  const tabs = [
    { id: "all-products", label: "All Rental Products" },
    { id: "showcase", label: "Rental Showcase" },
    { id: "stock", label: "Rental Stock" },
  ];

  // Load stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get("/stock");
        setStocks(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch stock");
      }
    };
    fetchStocks();
  }, []);

  // Load showcase items
  useEffect(() => {
    const fetchShowcaseItems = async () => {
      try {
        setShowcaseLoading(true);
        const res = await api.get("/rental-items");
        setShowcaseItems(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch showcase items");
      } finally {
        setShowcaseLoading(false);
      }
    };
    fetchShowcaseItems();
  }, []);

  // Fetch rental forms from API
  useEffect(() => {
    const fetchRentalForms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/rental");
        setRentalForms(response.data || []);
      } catch (error) {
        console.error("Error fetching rental forms:", error);
        toast.error("Failed to fetch rental data");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalForms();
  }, []);

  // Delete rental form
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) return;

    try {
      await api.delete(`/rental/${id}`);
      toast.success("Rental deleted successfully");
      setRentalForms((prev) => prev.filter((rental) => rental._id !== id));
    } catch (error) {
      console.error("Error deleting rental:", error);
      toast.error("Failed to delete rental");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle rental edit
  const handleEdit = (rental) => {
    setEditingRental(rental);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRental(null);
  };

  const handleUpdateSuccess = (updatedRental) => {
    setRentalForms((prev) =>
      prev.map((rental) => (rental._id === updatedRental._id ? updatedRental : rental))
    );
  };

  // Handle status update
  const handleStatusUpdate = async (rentalId, newStatus) => {
    try {
      const response = await api.put(`/rental/${rentalId}/status`, { status: newStatus });
      toast.success("Status updated successfully");
      setRentalForms((prev) =>
        prev.map((rental) =>
          rental._id === rentalId ? { ...rental, status: newStatus } : rental
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // --- STOCK FUNCTIONS ---
  const handleStockEdit = (stockItem) => {
    setStockToEdit(stockItem);
    setShowStockForm(true);
  };

  const handleStockClose = () => {
    setShowStockForm(false);
    setStockToEdit(null);
  };

  const handleStockDeleted = async (id) => {
    if (!window.confirm("Delete this stock item?")) return;
    try {
      await api.delete(`/stock/${id}`);
      setStocks((prev) => prev.filter((s) => s._id !== id));
      toast.success("Stock deleted");
    } catch (err) {
      toast.error("Failed to delete stock");
    }
  };

  // Showcase handlers
  const handleAddShowcaseItem = async (newItem) => {
    try {
      const res = await api.post("/rental-items", newItem);
      setShowcaseItems((prev) => [res.data, ...prev]);
      toast.success("Showcase item added successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add showcase item");
    }
  };

  const handleEditShowcaseItem = (item) => {
    setEditingShowcaseItem(item);
    setShowEditShowcaseModal(true);
  };

  const handleUpdateShowcaseItem = async (updatedItem) => {
    try {
      const res = await api.put(`/rental-items/${editingShowcaseItem._id}`, updatedItem);
      setShowcaseItems((prev) => 
        prev.map((item) => (item._id === editingShowcaseItem._id ? res.data : item))
      );
      toast.success("Showcase item updated successfully!");
      setShowEditShowcaseModal(false);
      setEditingShowcaseItem(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update showcase item");
    }
  };

  const handleDeleteShowcaseItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this showcase item?")) return;
    
    try {
      await api.delete(`/rental-items/${id}`);
      setShowcaseItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Showcase item deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete showcase item");
    }
  };

  const handleCloseShowcaseModal = () => {
    setShowAddShowcaseModal(false);
  };

  const handleCloseEditShowcaseModal = () => {
    setShowEditShowcaseModal(false);
    setEditingShowcaseItem(null);
  };

  // --- RENDER FUNCTIONS ---
  const renderAllProducts = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading rental data...</div>
        </div>
      );

    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            All Rental Products ({filteredRentals.length})
          </h3>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 md:w-30 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
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
            </div>
            {/* refresh button */}
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
            >
              🔄 <span>Refresh</span>
            </button>
          </div>

        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-700">Product Name</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Customer Name</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Rental Dates</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Total Price</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr key={rental._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{rental.product}</td>
                    <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{rental.fullName}</div>
                    <div className="text-sm text-gray-500">{rental.email}</div>
                    </td>
                    <td className="py-3 px-4">{rental.quantity}</td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      LKR {rental.price?.toLocaleString() || "N/A"}
                    </td>
                     <td className="py-3 px-4">
                        <select
                          value={rental.status || "Pending"}
                          onChange={(e) => handleStatusUpdate(rental._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                            rental.status === "Returned"
                            ? "bg-green-100 text-green-700"
                            : rental.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : rental.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Returned">Returned</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(rental)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rental._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No rental forms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

{/* .............renderShowcase..............  */}
  const renderShowcase = () => {
    if (showcaseLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading showcase items...</div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Rental Showcase ({filteredShowcaseItems.length})
          </h3>

          <div className="flex items-center gap-2 w-full md:w-auto">
          {/* search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={showcaseSearchTerm}
              onChange={(e) => setShowcaseSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
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
          </div>
          {/* Add Item button */}
          <button
            onClick={() => setShowAddShowcaseModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
          >
            + <span>Add Item</span>
          </button>
        </div>

        </div>

        {filteredShowcaseItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {showcaseSearchTerm ? "No items match your search." : "No showcase items yet. Click 'Add Item' to get started."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowcaseItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">{item.name} Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {item.description || "No description provided"}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-600 font-semibold">
                    LKR {item.pricePerDay}/day
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditShowcaseItem(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteShowcaseItem(item._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

{/* .............renderStock..............  */}
const renderStock = () => (
  <div>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Rental Stock ({filteredStocks.length})
      </h3>

      <div className="flex items-center gap-2 w-full md:w-auto">
      {/* search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by product name, SKU, or category..."
          value={stockSearchTerm}
          onChange={(e) => setStockSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-80 md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
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
      </div>
      {/* Add item button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
      >
        + <span>Add Item</span>
      </button>
    </div>

    </div>

    <div className="p-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 font-semibold text-gray-700">Product Name</th>
              <th className="py-3 px-4 font-semibold text-gray-700">SKU</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Total</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Available</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{item.productName}</td>
                  <td className="py-3 px-4">{item.sku}</td>
                  <td className="py-3 px-4">{item.totalQuantity}</td>
                  <td className="py-3 px-4">{item.availableQuantity}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleStockEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleStockDeleted(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  {stockSearchTerm ? "No stock items match your search." : "No stock items found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);


  const renderContent = () => {
    switch (activeTab) {
      case "all-products":
        return renderAllProducts();
      case "showcase":
        return renderShowcase();
      case "stock":
        return renderStock();
      default:
        return renderAllProducts();
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Rental Management</h2>
      <p className="text-gray-600 mb-6">
        Manage all rental products, showcase, and stock inventory.
      </p>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderContent()}

      {showStockForm && (
        <StockModal
          stock={stockToEdit}
          onClose={handleStockClose}
          onSaved={(updated) => {
            setStocks((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
          }}
        />
      )}

      {showAddModal && (
        <AddStockModal
          onClose={() => setShowAddModal(false)}
          onSave={(created) => {
            setStocks((prev) => [created, ...prev]);
          }}
        />
      )}

      {showAddShowcaseModal && (
        <AddRentalItemForm
          onClose={handleCloseShowcaseModal}
          onAdd={handleAddShowcaseItem}
        />
      )}

      {showEditShowcaseModal && (
        <EditShowcaseModal
          item={editingShowcaseItem}
          onClose={handleCloseEditShowcaseModal}
          onSave={handleUpdateShowcaseItem}
        />
      )}

      {/* Edit Modal for Rentals */}
      <EditModal
        rental={editingRental}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateSuccess}
      />
    </div>
  );
};

export default AllRentalProducts;

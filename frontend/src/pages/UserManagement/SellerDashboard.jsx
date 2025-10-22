import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { BarChart3Icon, PackageIcon, ShieldCheckIcon, CpuIcon, CalendarCheckIcon, WrenchIcon, CreditCardIcon, UserIcon,HelpCircleIcon, LogOutIcon, WalletIcon, Camera, Save, ShoppingBagIcon, MoreVertical, Eye, Edit, Trash, Plus } from "lucide-react";

// ========== UTILITY: TIME AGO ==========
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const timeRemaining = (endTime) => {
  const totalSeconds = Math.floor((new Date(endTime) - new Date()) / 1000);
  if (totalSeconds <= 0) return "Ended";

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};


// ========== BIDDING HISTORY ==========
const BiddingHistory = () => {
  const { user } = useAuthStore();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api/bidding"
      : "/api/bidding";

  useEffect(() => {
    if (!user) return;

    const fetchUserBids = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_URL}/user-bids/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setBids(response.data.bids || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load your bids");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <PackageIcon className="h-6 w-6 text-blue-500 mr-2" />
        Your Bidding History
      </h2>

      {loading && <p className="text-gray-500">Loading your bids...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && bids.length === 0 && (
        <p className="text-gray-500">You have not placed any bids yet.</p>
      )}

      {!loading &&
        bids.length > 0 &&
        bids.map((bid) => {
          const product = bid.product;
          const highestBid = product.currentBid;
          const isWon = product.isSoldOut && product.soldTo === user._id;
          const isOngoing = !product.isSoldOut;

          // ===== IMAGE HANDLING =====
          let imageUrl = "/placeholder.png";
          if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (firstImage.filePath.startsWith("http")) {
              imageUrl = firstImage.filePath; // Cloud URL
            } else {
              imageUrl = `http://localhost:5001/uploads/${firstImage.filePath}`; // Local upload
            }
          }

          return (
            <div
              key={bid._id}
              className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg mb-4"
            >
              {/* Product Image */}
              <img
                src={imageUrl}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{product.title}</p>
                <p className="text-sm text-gray-500">
                  Your bid: LKR {bid.price?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-500">
                  Highest bid: LKR {highestBid?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400">{timeAgo(bid.createdAt)}</p>
              </div>

              {/* Status Badge */}
              <div>
                {isOngoing && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Ongoing
                  </span>
                )}
                {!isOngoing && isWon && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Won
                  </span>
                )}
                {!isOngoing && !isWon && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Lost
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const defaultSpecifications = {
  cpu: "",
  gpu: "",
  ram: "",
  storage: "",
  screenSize: "",
  os: "",
  other: "",
};
// ========== MY PRODUCTS ==========
const MyProducts = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    model: "",
    specifications: {
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      screenSize: "",
      os: "",
      other: "",
    },
    condition: "New",
    startingBid: "",
    buyNowPrice: "",
    minIncrement: "",
    biddingEndTime: "",
    images: [],
    previewImages: [],
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    model: "",
    specifications: {
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      screenSize: "",
      os: "",
      other: "",
    },
    condition: "Used - Good",
    startingBid: "",
    buyNowPrice: "",
    minIncrement: 100,
    commission: 0,
    biddingEndTime: "",
    newImages: null,
    previewImages: [],
    deleteImages: [],
  });
  const [activeMenu, setActiveMenu] = useState(null);

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api/bid-products"
      : "/api/bid-products";

  // ✅ Fetch user's products
  useEffect(() => {
    if (!user) return;
    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your products");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [user]);

  // ✅ Add new product (with image upload)
  const handleAddProduct = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    Object.entries(addForm).forEach(([key, value]) => {
      if (key === "images" || key === "previewImages") return; // skip previews
      formData.append(key, value);
    });

    if (addForm.images) {
      Array.from(addForm.images).forEach((file) => formData.append("images", file));
    }

    const res = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setProducts((prev) => [res.data.product, ...prev]);
    setShowAddModal(false);
    toast.success("Product added successfully!");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to add product");
  }
};

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // ✅ Open edit modal
  const handleEdit = (product) => {
    const now = new Date();
    const endTime = product.biddingEndTime ? new Date(product.biddingEndTime) : null;

    // 🔒 Prevent editing if verified and auction ongoing
    if (product.isVerified && endTime && endTime > now) {
      toast.error("Ongoing auction product cannot be edited");
      return;
    }

    // 🕓 Prevent editing if auction already ended
    if (product.isVerified && endTime && endTime < now) {
      toast.error("Auction has ended — editing is disabled");
      return;
    }

    // ✅ Allow editing only if unverified or not started
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      model: product.model,
      specifications: {
        ...defaultSpecifications,
        ...(typeof product.specifications === "string"
          ? JSON.parse(product.specifications)
          : product.specifications),
      },
      condition: product.condition,
      startingBid: product.startingBid,
      buyNowPrice: product.buyNowPrice || "",
      minIncrement: product.minIncrement || 100,
      commission: product.commission || 0,
      biddingEndTime: product.biddingEndTime
        ? product.biddingEndTime.slice(0, 16)
        : "",
      newImages: null,
      previewImages: [],
      deleteImages: [],
    });
  };

  // ✅ View product
  const handleViewProduct = (id) => {
    window.open(`/product/${id}`, "_blank");
    setActiveMenu(null);
  };

  // ✅ Update product (with image upload)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("category", editForm.category);
      formData.append("brand", editForm.brand);
      formData.append("model", editForm.model);
      formData.append("condition", editForm.condition);
      formData.append("startingBid", editForm.startingBid);
      formData.append("buyNowPrice", editForm.buyNowPrice);
      formData.append("minIncrement", editForm.minIncrement);
      formData.append("commission", editForm.commission);
      formData.append("biddingEndTime", editForm.biddingEndTime);

      // Specifications as JSON
      formData.append("specifications", JSON.stringify(editForm.specifications));

      // Delete images
      if (editForm.deleteImages.length > 0) {
        editForm.deleteImages.forEach((id) => formData.append("deleteImages[]", id));
      }

      // Add new images
      if (editForm.newImages) {
        Array.from(editForm.newImages).forEach((file) => formData.append("images", file));
      }

      const res = await axios.put(
        `${API_URL}/${editingProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? res.data.product : p))
      );

      setEditingProduct(null);
      toast.success("Product updated successfully");
    } catch (err) {
      // ✅ Show special message if product is verified
      if (err.response?.status === 403) {
        toast.error(err.response.data.message || "Cannot edit verified product");
      } else {
        toast.error(err.response?.data?.message || "Failed to update product");
      }
    }
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => setEditingProduct(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
  if (!activeMenu) return;

  const el = products.find((p) => p._id === activeMenu)?.dropdownRef;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;

  // ✅ Dynamically assign dropdown direction
  setProducts((prev) =>
    prev.map((p) =>
      p._id === activeMenu
        ? { ...p, dropdownDirection: spaceBelow < 150 ? "up" : "down" }
        : p
    )
  );
}, [activeMenu]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <ShoppingBagIcon className="h-6 w-6 text-blue-500 mr-2" />
          My Products
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {!error && products.length === 0 && (
        <p className="text-gray-500">You haven’t added any products yet.</p>
      )}

      {products.length > 0 && (
        <div className="relative z-10 overflow-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Starting Bid
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Min Increment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Bidding End
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const imageUrl =
                  product.images?.[0]?.filePath?.startsWith("http")
                    ? product.images[0].filePath
                    : `http://localhost:5001/uploads/${product.images?.[0]?.filePath || ""}`;

                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    {/* Product */}
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>

                            {/* ✅ Verification badge */}
                            {product.isVerified ? (
                              <span className="text-green-600 text-xs font-medium">Verified</span>
                            ) : (
                              <span className="text-red-600 text-xs font-medium">Unverified</span>
                            )}

                          <div className="text-xs text-gray-400">
                            Listed {timeAgo(product.createdAt)}
                          </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      LKR {product.startingBid?.toLocaleString()}
                    </td>

                    {/* ✅ Min Increment */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      LKR {product.minIncrement?.toLocaleString() || "-"}
                    </td>

                    {/* ✅ Commission */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.commission ? `${product.commission}%` : "-"}
                    </td>

                    {/* ✅ Bidding End Time */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.biddingEndTime ? timeRemaining(product.biddingEndTime) : "-"}
                    </td>

                    {/* ✅ Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const now = new Date();
                        const endTime = product.biddingEndTime ? new Date(product.biddingEndTime) : null;
                        let status = "Pending";
                        let statusClass = "bg-yellow-100 text-yellow-800";

                        if (product.isVerified) {
                          if (endTime && endTime < now) {
                            status = "Auction Ended";
                            statusClass = "bg-gray-200 text-gray-700";
                          } else {
                            status = "Ongoing";
                            statusClass = "bg-blue-100 text-blue-800";
                          }
                        } else {
                          status = "Pending";
                          statusClass = "bg-orange-100 text-orange-800";
                        }

                        return (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                            {status}
                          </span>
                        );
                      })()}
                    </td>

                    {/* ✅ Dropdown Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === product._id ? null : product._id);
                          }}
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {activeMenu === product._id && (
                          <div
                            className={`absolute right-0 ${
                              product.dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
                            } w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]`}
                            style={{
                              position: "fixed",
                              top: "auto",
                              right: "auto",
                              transform: "translateY(0)",
                            }}
                          >
                            <div className="py-1 text-sm text-gray-700">
                              <button
                                onClick={() => handleViewProduct(product._id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                                View
                              </button>

                              <button
                                onClick={() => handleEdit(product)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4 text-blue-500" />
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(product._id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Trash className="w-4 h-4 text-red-500" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

          {/* ✅ Edit Modal */}
          {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[460px] max-h-[90vh] flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                  <h3 className="text-white font-semibold text-lg">✏️ Edit Product</h3>
                  <button
                    onClick={handleCancelEdit}
                    className="text-white hover:text-gray-200 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleUpdate}
                    className="p-6 space-y-4 overflow-y-auto"
                    style={{ maxHeight: "calc(90vh - 60px)" }} // 60px = header height
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter product title"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Category</option>
                      {[
                        "Laptop",
                        "Desktop",
                        "CPU",
                        "GPU",
                        "Motherboard",
                        "RAM",
                        "Storage",
                        "Monitor",
                        "Peripherals",
                        "Other",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label>Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>

                  {/* Brand & Model */}
                  <div className="flex gap-2">
                    <div>
                      <label>Brand</label>
                      <input
                        type="text"
                        value={editForm.brand}
                        onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label>Model</label>
                      <input
                        type="text"
                        value={editForm.model}
                        onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>

                  {/* Specifications Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specifications
                    </label>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.keys(editForm.specifications).map((key) => (
                      <div key={key}>
                        <label>{key.toUpperCase()}</label>
                        <input
                          type="text"
                          value={editForm.specifications[key]}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              specifications: {
                                ...editForm.specifications,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Condition */}
                  <div>
                    <label>Condition</label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                      className="w-full border rounded p-2"
                    >
                      <option value="New">New</option>
                      <option value="Used - Like New">Used - Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Used - Fair">Used - Fair</option>
                    </select>
                  </div>

                  {/* Min Increment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Increment
                    </label>
                    <input
                      type="number"
                      placeholder="Min Increment"
                      value={editForm.minIncrement}
                      onChange={(e) => setEditForm({ ...editForm, minIncrement: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  {/* Bidding End Time */}
                  <div>
                    <label>Bidding End Time</label>
                    <input
                      type="datetime-local"
                      value={editForm.biddingEndTime}
                      onChange={(e) => setEditForm({ ...editForm, biddingEndTime: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  {/* Starting Bid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Starting Bid (LKR)
                    </label>
                    <input
                      type="number"
                      value={editForm.startingBid}
                      onChange={(e) =>
                        setEditForm({ ...editForm, startingBid: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter starting bid"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Images
                    </label>

                    {/* Current images with delete option */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editingProduct.images &&
                        editingProduct.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={
                                img.filePath.startsWith("http")
                                  ? img.filePath
                                  : `http://localhost:5001/uploads/${img.filePath}`
                              }
                              alt={`product-${idx}`}
                              className={`h-14 w-14 object-cover rounded-lg border ${
                                editForm.deleteImages?.includes(img._id)
                                  ? "opacity-40 border-red-400"
                                  : ""
                              }`}
                            />
                            {/* Delete toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedDeleteImages = editForm.deleteImages || [];
                                if (updatedDeleteImages.includes(img._id)) {
                                  setEditForm({
                                    ...editForm,
                                    deleteImages: updatedDeleteImages.filter(
                                      (id) => id !== img._id
                                    ),
                                  });
                                } else {
                                  setEditForm({
                                    ...editForm,
                                    deleteImages: [...updatedDeleteImages, img._id],
                                  });
                                }
                              }}
                              className={`absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs ${
                                editForm.deleteImages?.includes(img._id)
                                  ? "bg-gray-400 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>

                    {/* Preview new uploaded images */}
                    {editForm.previewImages && editForm.previewImages.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {editForm.previewImages.map((src, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={src}
                              alt={`preview-${idx}`}
                              className="h-14 w-14 object-cover rounded-lg border-2 border-blue-400"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = Array.from(editForm.newImages).filter(
                                  (_, i) => i !== idx
                                );
                                const newPreviews = editForm.previewImages.filter(
                                  (_, i) => i !== idx
                                );
                                setEditForm({
                                  ...editForm,
                                  newImages: newFiles,
                                  previewImages: newPreviews,
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload new ones */}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        setEditForm({
                          ...editForm,
                          newImages: files,
                          previewImages: Array.from(files).map((file) =>
                            URL.createObjectURL(file)
                          ),
                        });
                      }}
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      You can delete existing images or upload new ones — both will be saved together.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ✅ Add Product Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-[460px] max-h-[90vh] flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                  <h3 className="text-white font-semibold text-lg">➕ Add New Product</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:text-gray-200 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Body */}
                <form
                  onSubmit={handleAddProduct}
                  className="p-6 space-y-4 overflow-y-auto"
                  style={{ maxHeight: "calc(90vh - 60px)" }}
                >
                  {/* Product Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={addForm.title}
                      onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={addForm.category}
                      onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      required
                    >
                      <option value="">Select Category</option>
                      {[
                        "Laptop",
                        "Desktop",
                        "CPU",
                        "GPU",
                        "Motherboard",
                        "RAM",
                        "Storage",
                        "Monitor",
                        "Peripherals",
                        "Other",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={addForm.description}
                      onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter description"
                      required
                    />
                  </div>

                  {/* Brand & Model */}
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={addForm.brand}
                        onChange={(e) => setAddForm({ ...addForm, brand: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <input
                        type="text"
                        value={addForm.model}
                        onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* ✅ Specifications Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specifications
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.keys(addForm.specifications).map((key) => (
                        <div key={key}>
                          <label className="text-xs text-gray-600">
                            {key.toUpperCase()}
                          </label>
                          <input
                            type="text"
                            value={addForm.specifications[key]}
                            onChange={(e) =>
                              setAddForm({
                                ...addForm,
                                specifications: {
                                  ...addForm.specifications,
                                  [key]: e.target.value,
                                },
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder={`Enter ${key}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={addForm.condition}
                      onChange={(e) => setAddForm({ ...addForm, condition: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="New">New</option>
                      <option value="Used - Like New">Used - Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Used - Fair">Used - Fair</option>
                    </select>
                  </div>

                  {/* Starting Bid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Starting Bid (LKR)
                    </label>
                    <input
                      type="number"
                      value={addForm.startingBid}
                      onChange={(e) => setAddForm({ ...addForm, startingBid: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  {/* Buy Now Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buy Now Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={addForm.buyNowPrice}
                      onChange={(e) => setAddForm({ ...addForm, buyNowPrice: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  {/* Min Increment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Increment (LKR)
                    </label>
                    <input
                      type="number"
                      value={addForm.minIncrement}
                      onChange={(e) => setAddForm({ ...addForm, minIncrement: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  {/* Bidding End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bidding End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={addForm.biddingEndTime}
                      onChange={(e) =>
                        setAddForm({ ...addForm, biddingEndTime: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Images
                    </label>
                    {addForm.previewImages.length > 0 && (
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {addForm.previewImages.map((src, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={src}
                              alt={`preview-${idx}`}
                              className="h-14 w-14 object-cover rounded-lg border-2 border-blue-400"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedPreviews = addForm.previewImages.filter((_, i) => i !== idx);
                                const updatedFiles = Array.from(addForm.images).filter((_, i) => i !== idx);
                                setAddForm({
                                  ...addForm,
                                  images: updatedFiles,
                                  previewImages: updatedPreviews,
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        setAddForm({
                          ...addForm,
                          images: files,
                          previewImages: Array.from(files).map((file) =>
                            URL.createObjectURL(file)
                          ),
                        });
                      }}
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 p-2"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </div>
  );
};

// ========== OTHER DASHBOARD SECTIONS ==========
const PlaceholderSection = ({ title, description }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Sections
const InsuranceManagement = () => {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/subscription/user-subscription`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      return;
    }

    try {
      setCanceling(true);
      const response = await fetch(`${API_BASE}/subscription/cancel`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage("Subscription canceled successfully!");
        setSubscription(null);
        // Update user's plan in the store
        user.plan = "free";
      } else {
        setMessage("Failed to cancel subscription: " + data.message);
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      setMessage("Error canceling subscription. Please try again.");
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPrice = (plan, period) => {
    if (plan === "free") return 0;
    if (plan === "premium" && period === "monthly") return 10;
    if (plan === "premium" && period === "yearly") return 99;
    return 0;
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
            <span className="text-sm text-gray-500">Insurance</span>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successfully") 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {subscription ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Plan</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.plan === "premium" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Period</span>
                  <span className="text-sm text-gray-900">
                    {subscription.period.charAt(0).toUpperCase() + subscription.period.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Price</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${getPrice(subscription.plan, subscription.period)}
                    {subscription.period === "monthly" ? "/month" : "/year"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Start Date</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(subscription.startDate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">End Date</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(subscription.endDate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {subscription.isActive ? "Active" : "Expired"}
                  </span>
                </div>
              </div>
            </div>

            {subscription.isActive && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {canceling ? "Canceling..." : "Cancel Subscription"}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Canceling your subscription will end your premium benefits immediately.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-500 mb-4">
              You don't have an active subscription. Upgrade to Premium to get access to exclusive features.
            </p>
            <a
              href="/subscription"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Subscription Plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
const RentalManagement = () => (
  <PlaceholderSection
    title="Component Rental Management"
    description="Manage your rented components and rental history."
  />
);
const PreOrderManagement = () => (
  <PlaceholderSection
    title="Pre-Order Management"
    description="Track your pre-orders and expected arrival dates."
  />
);
const ServiceManagement = () => (
  <PlaceholderSection
    title="Tech Service Booking"
    description="Manage your service appointments and book new services."
  />
);
const OrderHistory = () => (
  <PlaceholderSection
    title="Order History"
    description="View your complete order history and track current orders."
  />
);
const SupportCenter = () => (
  <PlaceholderSection
    title="Support Center"
    description="Get help with our services and submit support tickets."
  />
);

// ========== ACCOUNT SETTINGS ==========
const AccountSettings = () => {
  const { user, updateProfile, isLoading, message, error } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.photo || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (photo) formData.append("photo", photo);
    await updateProfile(formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center gap-4">
        <div className="relative">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <label
            htmlFor="photo"
            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700"
          >
            <Camera className="w-4 h-4" />
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={isLoading} className="btn btn-primary flex items-center gap-2">
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

// ========== DASHBOARD OVERVIEW ==========
const DashboardOverview = ({ user, stats }) => (
  <div className="space-y-6">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || "User"}!</h1>
      <p className="text-blue-100">Track your sales and manage your products efficiently</p>
    </div>

    {/* Main Dashboard Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column - Stats & Sellers */}
      <div className="space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total Sales</div>
            <div className="text-2xl font-bold text-gray-900">12.5 LKR</div>
            <div className="text-xs text-green-500 mt-1">↑ 24% this month</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Ongoing Auctions</div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-xs text-blue-500 mt-1">3 new this week</div>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Top Sellers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-cover bg-center rounded-full"
                  style={{ backgroundImage: 'url(https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg)' }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Carla Fatie</div>
                  <div className="text-xs text-gray-500">designer</div>
                </div>
              </div>
              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                Follow
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-cover bg-center rounded-full"
                  style={{ backgroundImage: 'url(https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg)' }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Mark Jess</div>
                  <div className="text-xs text-gray-500">designer</div>
                </div>
              </div>
              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                Follow
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-cover bg-center rounded-full"
                  style={{ backgroundImage: 'url(https://i.pinimg.com/736x/0a/f0/b4/0af0b497a827261eaa65e515f0f3e031.jpg)' }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Lisa Breit</div>
                  <div className="text-xs text-gray-500">designer</div>
                </div>
              </div>
              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Extra Bid Section */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-5 text-white shadow-md">
          <h3 className="font-semibold mb-2">EXTRA BID</h3>
          <p className="text-sm text-orange-100 mb-4">Get more bids to use it</p>
          <p className="text-xs text-orange-100 mb-4">Priceless and optimal sign in and get more bids to buy</p>
          <button className="w-full bg-white text-orange-500 font-semibold py-2 rounded-lg hover:bg-gray-100 transition">
            Subscribe
          </button>
        </div>

      </div>

      {/* Middle Column - NFT Items */}
      <div className="space-y-6">
        
        {/* Monkeylord NFT */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-start space-x-4"> 
            <div 
                  className="w-16 h-16 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: 'url(https://www.gamestreet.lk/images/products/5805.jpg)' }}
                ></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">i9-14900k</h3>
              <div className="text-sm text-gray-500 mb-2">Roohi Koohi</div>
              <div className="text-xs text-gray-400 mb-1">Current bid</div>
              <div className="text-lg font-bold text-gray-900">130,000 LKR</div>
            </div>
          </div>
        </div>

        {/* Kinglion NFT */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-start space-x-4">
            <div 
                  className="w-16 h-16 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: 'url(https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-web-og-1200x630.jpg)' }}
                ></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">RTX 4090</h3>
              <div className="text-sm text-gray-500 mb-2">Nozanin Noman</div>
              <div className="text-xs text-gray-400 mb-1">Current bid</div>
              <div className="text-lg font-bold text-gray-900">540,000 LKR</div>
            </div>
          </div>
        </div>

        {/* Trades Section */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Trades</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Language</span>
              <span className="text-sm font-medium text-gray-900">English</span>
            </div>
            <button className="w-full text-center text-blue-500 font-semibold py-2 hover:text-blue-600 transition">
              List your request
            </button>
          </div>
        </div>

      </div>

      {/* Right Column - Wallet & News */}
      <div className="space-y-6">
        
        {/* Wallet View */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white shadow-md">
          <h3 className="font-semibold mb-4">Wallet view</h3>
          <p className="text-sm text-gray-300 mb-4">A brief of your situation</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">New</span>
              <span className="text-lg font-bold text-green-400">+4,179 LKR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total</span>
              <span className="text-lg font-bold text-white">↑12,179 LKR</span>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">News</h3>
            <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
              Boost
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Latest market trends</div>
            <div className="text-sm text-gray-600">Bid Product collections update</div>
            <div className="text-sm text-gray-600">Community events</div>
          </div>
          <button className="w-full text-center text-blue-500 font-semibold py-2 mt-3 hover:text-blue-600 transition">
            View All
          </button>
        </div>

        {/* Subscribe Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-5 text-white shadow-md text-center">
          <h3 className="font-semibold mb-2">NEWSPAPER</h3>
          <p className="text-sm mb-3">Get bid news on your email newspaper</p>
          <p className="text-xs text-blue-100 mb-4">Priceless and optimal sign</p>
          <button className="w-full bg-white text-blue-500 font-semibold py-2 rounded-lg hover:bg-gray-100 transition">
            Subscribe
          </button>
        </div>

      </div>
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2">
            <BarChart3Icon className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2">
            <ShoppingBagIcon className="w-4 h-4" />
            <span>Bidding Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-lg p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-lg font-medium text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

// ========== SIDEBAR ==========
const Sidebar = ({ activeSection, setActiveSection, user, logout }) => (
  <div className="md:w-64 bg-white rounded-lg shadow p-6 h-fit">
    <div className="flex items-center mb-6 pb-4 border-b">
      <WalletIcon className="h-6 w-6 text-blue-500 mr-2" />
      <div>
        <p className="text-xs text-gray-500">Balance</p>
        <p className="font-semibold">LKR {user?.balance?.toLocaleString() || 0}</p>
      </div>
    </div>
    <nav className="space-y-1">
      <NavItem icon={<BarChart3Icon className="h-5 w-5" />} title="Dashboard" isActive={activeSection === "overview"} onClick={() => setActiveSection("overview")} />
      <NavItem icon={<PackageIcon className="h-5 w-5" />} title="Bidding History" isActive={activeSection === "buyback"} onClick={() => setActiveSection("buyback")} />
      <NavItem icon={<ShoppingBagIcon className="h-5 w-5" />} title="My Products" isActive={activeSection === "bidProduct"} onClick={() => setActiveSection("bidProduct")} />
      <NavItem icon={<ShieldCheckIcon className="h-5 w-5" />} title="Insurance" isActive={activeSection === "insurance"} onClick={() => setActiveSection("insurance")} />
      <NavItem icon={<CpuIcon className="h-5 w-5" />} title="Rentals" isActive={activeSection === "rentals"} onClick={() => setActiveSection("rentals")} />
      <NavItem icon={<CalendarCheckIcon className="h-5 w-5" />} title="Pre-Orders" isActive={activeSection === "preorders"} onClick={() => setActiveSection("preorders")} />
      <NavItem icon={<WrenchIcon className="h-5 w-5" />} title="Service Booking" isActive={activeSection === "services"} onClick={() => setActiveSection("services")} />
      <NavItem icon={<CreditCardIcon className="h-5 w-5" />} title="Order History" isActive={activeSection === "orders"} onClick={() => setActiveSection("orders")} />
      <NavItem icon={<UserIcon className="h-5 w-5" />} title="Account Settings" isActive={activeSection === "account"} onClick={() => setActiveSection("account")} />
      <NavItem icon={<HelpCircleIcon className="h-5 w-5" />} title="Support Center" isActive={activeSection === "support"} onClick={() => setActiveSection("support")} />
      <NavItem icon={<LogOutIcon className="h-5 w-5" />} title="Logout" isActive={false} onClick={logout} />
    </nav>
  </div>
);

const NavItem = ({ icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    <span className={`mr-3 ${isActive ? "text-blue-500" : "text-gray-400"}`}>{icon}</span>
    {title}
  </button>
);

// ========== MAIN DASHBOARD ==========
const SellerDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("overview");

  const stats = {
    activeBids: 3,
    insuredItems: 2,
    activeRentals: 1,
    upcomingServices: 2,
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview user={user} stats={stats} />;
      case "buyback":
        return <BiddingHistory />; // ✅ Fully uses images array
      case "bidProduct":
        return <MyProducts/>;
      case "insurance":
        return <InsuranceManagement />;
      case "rentals":
        return <RentalManagement />;
      case "preorders":
        return <PreOrderManagement />;
      case "services":
        return <ServiceManagement />;
      case "orders":
        return <OrderHistory />;
      case "account":
        return <AccountSettings />;
      case "support":
        return <SupportCenter />;
      default:
        return <DashboardOverview user={user} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
      <Navbar />
      
      {/* Remove mx-auto and max width - same as UserDashboard */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-28">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            user={user} 
            logout={logout} 
          />
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
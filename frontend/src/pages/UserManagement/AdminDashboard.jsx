import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminAllBidProducts from "../Bidding/AdminAllBidProducts";
import { useAuthStore } from "../../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3Icon,
  PackageIcon,
  UserIcon,
  CreditCardIcon,
  WalletIcon,
  LogOutIcon,
  CheckCircleIcon,
  Camera, Save,
   MoreVertical, 
   Edit, Eye, 
   Trash2, Search, 
   Filter, Plus ,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Admin Data States
  const [allUsers, setAllUsers] = useState([]);
  const [allBidProducts, setAllBidProducts] = useState([]);
  const [income, setIncome] = useState(0);
  const [winningBids, setWinningBids] = useState([]);

  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersRes = await axios.get(`${API_BASE}/auth/users`, { withCredentials: true });
        setAllUsers(usersRes.data.users || []);

        const bidProductsRes = await axios.get(`${API_BASE}/bid-products/admin/products`, { withCredentials: true });
        setAllBidProducts(bidProductsRes.data || []);

        const incomeRes = await axios.get(`${API_BASE}/auth/estimate-income`, { withCredentials: true });
        setIncome(incomeRes.data?.income || 0);

        const winningBidsRes = await axios.get(`${API_BASE}/bid-products/sold`, { withCredentials: true });
        setWinningBids(winningBidsRes.data || []);

      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => logout();

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview allUsers={allUsers} allBidProducts={allBidProducts} income={income} winningBids={winningBids} />;
      case "all-users":
        return <UsersOverview users={allUsers} fetchUsers={() => axios.get(`${API_BASE}/auth/users`, { withCredentials: true }).then(res => setAllUsers(res.data.users || []))} API_BASE={API_BASE} />;
      case "inventory":
        return <InventoryOverview />;
      case "all-bid-products":
        return <AdminAllBidProducts API_BASE={API_BASE} />;
      case "rental-products":
        return <RentalProductsOverview />;
      case "income":
        return <IncomeOverview income={income} />;
      case "winning-bids":
        return <WinningBidsOverview bids={winningBids} />;
      case "account":
        return <AccountSettings user={user} />;
      default:
        return <DashboardOverview allUsers={allUsers} allBidProducts={allBidProducts} income={income} winningBids={winningBids} />;
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-28 flex gap-8">
        {/* Sidebar */}
        <div className="md:w-64 bg-white rounded-lg shadow p-6 h-fit">
          <div className="flex items-center mb-6 pb-4 border-b">
            <WalletIcon className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Admin Access</p>
              <p className="font-semibold">{user?.role || "Administrator"}</p>
            </div>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<BarChart3Icon />} title="Dashboard" isActive={activeSection === "dashboard"} onClick={() => setActiveSection("dashboard")} />
            <NavItem icon={<UserIcon />} title="All Users" isActive={activeSection === "all-users"} onClick={() => setActiveSection("all-users")} />
            <NavItem icon={<PackageIcon />} title="Inventory" isActive={activeSection === "inventory"} onClick={() => setActiveSection("inventory")} />
            <NavItem icon={<PackageIcon />} title="All Bid Products" isActive={activeSection === "all-bid-products"} onClick={() => setActiveSection("all-bid-products")} />
            <NavItem icon={<PackageIcon />} title="All Rental Products" isActive={activeSection === "rental-products"} onClick={() => setActiveSection("rental-products")} />
            <NavItem icon={<CreditCardIcon />} title="Income" isActive={activeSection === "income"} onClick={() => setActiveSection("income")} />
            <NavItem icon={<CheckCircleIcon />} title="Winning Bids" isActive={activeSection === "winning-bids"} onClick={() => setActiveSection("winning-bids")} />
            <NavItem icon={<UserIcon />} title="Account Settings" isActive={activeSection === "account"} onClick={() => setActiveSection("account")} />
            <NavItem icon={<LogOutIcon />} title="Logout" isActive={false} onClick={handleLogout} />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderSection()}</div>
      </div>
      <Footer />
    </div>
  );
};

// ----- Components -----
const NavItem = ({ icon, title, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
    <span className="mr-3">{icon}</span>
    {title}
  </button>
);

const DashboardOverview = ({ allUsers, allBidProducts, income, winningBids }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <StatCard title="Total Users" value={allUsers.length} />
      <StatCard title="All Bid Products" value={allBidProducts.length} />
      <StatCard title="Income" value={`$${income}`} />
      <StatCard title="Winning Bids" value={winningBids.length} />
    </div>
  </div>
);

const UsersOverview = ({ users, fetchUsers, API_BASE }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "buyer",
    photo: null,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, photo: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "buyer",
      photo: null,
    });
    setPreview(null);
    setEditingUser(null);
    setShowUserModal(false);
  };

  // Create user
  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      return toast.error("All fields are required for new user");
    }
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (form.photo) formData.append("photo", form.photo);

      await axios.post(`${API_BASE}/auth/admin/users`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User created successfully");
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  // Update user
  const handleUpdate = async () => {
    if (!editingUser?._id) return toast.error("No user selected for update");

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("role", form.role);
      if (form.photo) formData.append("photo", form.photo);

      await axios.patch(`${API_BASE}/auth/admin/users/${editingUser._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User updated successfully");
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/auth/admin/users/${userId}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      fetchUsers();
      setShowMenu(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Edit click
  const handleEditClick = (user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      role: user.role || "buyer",
      photo: null,
    });
    setPreview(user.photo || null);
    setShowUserModal(true);
    setShowMenu(null);
  };

  // View profile
  const handleViewProfile = (user) => {
    // You can implement view profile functionality here
    console.log("View profile:", user);
    setShowMenu(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User management</h1>
        <p className="text-gray-600 mb-6">
          Manage your team members and their account permissions here.
        </p>
        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">All users {users.length}</h2>
          
          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            
            {/* Add User Button */}
            <button 
              onClick={() => {
                setEditingUser(null);
                resetForm();
                setShowUserModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add user
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible"> {/* Changed overflow-hidden to overflow-visible */}
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">User name</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Last active</div>
          <div className="col-span-1">Date added</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 overflow-visible"> {/* Added overflow-visible here too */}
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 relative"> {/* Added relative here */}
                {/* User Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={user.photo || "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'broker' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>

                {/* Last Active */}
                <div className="col-span-2 text-sm text-gray-500">
                  {formatDate(user.lastActive)}
                </div>

                {/* Date Added */}
                <div className="col-span-1 text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </div>

                {/* Actions Menu - Right aligned */}
                <div className="col-span-1 flex justify-end">
                  <div className="relative"> {/* Wrapped in relative container */}
                    <button
                      onClick={() => setShowMenu(showMenu === user._id ? null : user._id)}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>

                    {showMenu === user._id && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View profile
                          </button>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit details
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete user
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border p-2 rounded w-1/2"
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border p-2 rounded w-1/2"
                />
              </div>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded w-full"
              />

              {!editingUser && (
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="border p-2 rounded w-full"
                />
              )}

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="broker">Broker</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="border p-2 rounded flex-1" 
                />
                {preview && (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-12 w-12 rounded-full object-cover" 
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {editingUser ? (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update User
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryOverview = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Inventory</h2>
    <p>This section will display all inventory items.</p>
  </div>
);

const RentalProductsOverview = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">All Rental Products</h2>
    <p>This section will display all rental products.</p>
  </div>
);

const IncomeOverview = ({ income }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Income Overview</h2>
    <p className="text-lg">${income}</p>
  </div>
);

const WinningBidsOverview = ({ bids }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Winning Bids</h2>
    {bids.length === 0 ? <p>No winning bids.</p> : <ul>{bids.map(b => <li key={b._id}>{b.productTitle} - ${b.amount}</li>)}</ul>}
  </div>
);

const AccountSettings = () => {
  const { user, updateProfile, isLoading, message, error, changePassword } = useAuthStore();
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

      {/* Profile Info */}
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

      {/* Personal Info Form */}
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
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary flex items-center gap-2"
          >
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

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

export default AdminDashboard;

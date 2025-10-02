import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3Icon,
  PackageIcon,
  UserIcon,
  CreditCardIcon,
  WalletIcon,
  LogOutIcon,
  BoxIcon,
  CheckCircleIcon,
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

        // ✅ All users
        const usersRes = await axios.get(`${API_BASE}/auth/users`, { withCredentials: true });
        setAllUsers(usersRes.data.users || []);

        // ✅ All bid products (admin)
        const bidProductsRes = await axios.get(`${API_BASE}/bid-products/admin/products`, { withCredentials: true });
        setAllBidProducts(bidProductsRes.data || []);

        // ✅ Income
        const incomeRes = await axios.get(`${API_BASE}/auth/estimate-income`, { withCredentials: true });
        setIncome(incomeRes.data?.income || 0);

        // ✅ Winning bids (sold products)
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
        return (
          <DashboardOverview
            allUsers={allUsers}
            allBidProducts={allBidProducts}
            income={income}
            winningBids={winningBids}
          />
        );
      case "all-users":
        return <UsersOverview users={allUsers} />;
      case "all-bid-products":
        return <BidProductsOverview products={allBidProducts} />;
      case "income":
        return <IncomeOverview income={income} />;
      case "winning-bids":
        return <WinningBidsOverview bids={winningBids} />;
      case "account":
        return <AccountSettings user={user} />;
      default:
        return (
          <DashboardOverview
            allUsers={allUsers}
            allBidProducts={allBidProducts}
            income={income}
            winningBids={winningBids}
          />
        );
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
            <NavItem icon={<PackageIcon />} title="All Bid Products" isActive={activeSection === "all-bid-products"} onClick={() => setActiveSection("all-bid-products")} />
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

const UsersOverview = ({ users }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">All Users</h2>
    {users.length === 0 ? <p>No users found.</p> : (
      <ul>
        {users.map(u => <li key={u._id}>{u.firstName} {u.lastName} - {u.email}</li>)}
      </ul>
    )}
  </div>
);

// ----- Updated BidProductsOverview -----
const BidProductsOverview = ({ products }) => {
  const [allProducts, setAllProducts] = useState(products || []);
  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bid-products/admin/products`, { withCredentials: true });
      setAllProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.patch(`${API_BASE}/bid-products/admin/verify/${id}`, {}, { withCredentials: true });
      toast.success("Product verified!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
  };

  const handleAddCommission = async (id) => {
    const commission = prompt("Enter commission %:");
    if (!commission) return;

    try {
      await axios.patch(`${API_BASE}/bid-products/admin/commission/${id}`, { commission }, { withCredentials: true });
      toast.success("Commission added!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Adding commission failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE}/bid-products/admin/delete/${id}`, { withCredentials: true });
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleEdit = async (product) => {
    const newTitle = prompt("Enter new title:", product.title);
    if (!newTitle) return;

    try {
      await axios.patch(`${API_BASE}/bid-products/admin/edit/${product._id}`, { title: newTitle }, { withCredentials: true });
      toast.success("Product updated!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Edit failed");
    }
  };

  if (!allProducts.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">All Bid Products</h2>
        <p>No bid products found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-bold mb-4">All Bid Products</h2>
      <ul className="space-y-2">
        {allProducts.map((p) => (
          <li key={p._id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium">{p.title}</span>
              <span className="text-xs text-gray-500">
                {p.isVerified ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : (
                  <span className="text-red-600 font-semibold">Unverified</span>
                )}
                {p.commission && <span> | Commission: {p.commission}%</span>}
              </span>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(p)} className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              <button onClick={() => handleVerify(p._id)} className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Verify</button>
              <button onClick={() => handleAddCommission(p._id)} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Add Commission</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IncomeOverview = ({ income }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Income Overview</h2>
    <p className="text-lg">${income}</p>
  </div>
);

const WinningBidsOverview = ({ bids }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Winning Bids</h2>
    {bids.length === 0 ? <p>No winning bids.</p> : (
      <ul>{bids.map(b => <li key={b._id}>{b.productTitle} - ${b.amount}</li>)}</ul>
    )}
  </div>
);

const AccountSettings = ({ user }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
    <p>Name: {user.firstName} {user.lastName}</p>
    <p>Email: {user.email}</p>
    <p>Role: {user.role}</p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

export default AdminDashboard;

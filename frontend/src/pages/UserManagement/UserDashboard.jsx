import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../store/authStore";
import {
  BarChart3Icon,
  PackageIcon,
  ShieldCheckIcon,
  CpuIcon,
  CalendarCheckIcon,
  WrenchIcon,
  CreditCardIcon,
  UserIcon,
  HelpCircleIcon,
  LogOutIcon,
  WalletIcon,
  Camera,
  Save,
} from "lucide-react";

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

// ========== OTHER DASHBOARD SECTIONS ==========
const PlaceholderSection = ({ title, description }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Sections
const InsuranceManagement = () => (
  <PlaceholderSection
    title="Tech Insurance Management"
    description="View your insured devices and manage your claims."
  />
);
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
    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || "User"}!</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Active Bids" value={stats.activeBids} icon={<PackageIcon className="h-6 w-6 text-blue-500" />} />
      <StatCard title="Insured Items" value={stats.insuredItems} icon={<ShieldCheckIcon className="h-6 w-6 text-green-500" />} />
      <StatCard title="Active Rentals" value={stats.activeRentals} icon={<CpuIcon className="h-6 w-6 text-purple-500" />} />
      <StatCard title="Upcoming Services" value={stats.upcomingServices} icon={<WrenchIcon className="h-6 w-6 text-orange-500" />} />
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
const UserDashboard = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-28">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} user={user} logout={logout} />
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
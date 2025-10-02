import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../store/authStore"; // <-- auth store
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
  Camera, Save
} from "lucide-react";

const UserDashboard = () => {

  const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/auth"
    : "/api/auth";

  const { user, logout } = useAuthStore(); // get user and logout function from auth store
  const [activeSection, setActiveSection] = useState("overview");

  const stats = {
    activeBids: 3,
    insuredItems: 2,
    activeRentals: 1,
    upcomingServices: 2,
  };

  const recentActivity = [
    { id: 1, action: "Placed bid", item: "RTX 3080", time: "2 hours ago", status: "Pending" },
    { id: 2, action: "Extended rental", item: "Ryzen 9 5950X", time: "1 day ago", status: "Confirmed" },
    { id: 3, action: "Filed insurance claim", item: "Gaming PC", time: "3 days ago", status: "Under Review" },
    { id: 4, action: "Pre-ordered", item: "RTX 4080", time: "5 days ago", status: "Confirmed" },
  ];

  const announcements = [
    { id: 1, title: "New GPU Rental Options", content: "We've added RTX 4090 to our rental inventory.", date: "2023-10-15" },
    { id: 2, title: "Insurance Plan Update", content: "Enhanced coverage now available for gaming laptops.", date: "2023-10-10" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview user={user} stats={stats} recentActivity={recentActivity} announcements={announcements} />;
      case "buyback":
        return <BiddingHistory />;
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
        return <AccountSettings user={user} />;
      case "support":
        return <SupportCenter />;
      default:
        return <DashboardOverview user={user} stats={stats} recentActivity={recentActivity} announcements={announcements} />;
    }
  };

  const handleLogout = () => {
    logout(); // call the auth store logout
  };

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-28">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
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
              <NavItem icon={<LogOutIcon className="h-5 w-5" />} title="Logout" isActive={false} onClick={handleLogout} /> {/* <- integrated logout */}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const NavItem = ({ icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <span className={`mr-3 ${isActive ? "text-blue-500" : "text-gray-400"}`}>{icon}</span>
    {title}
  </button>
);

const DashboardOverview = ({ user, stats, recentActivity, announcements }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || "User"}!</h1>
      <p className="text-gray-600">Here's what's happening with your tech ecosystem today.</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Active Bids" value={stats.activeBids} icon={<PackageIcon className="h-6 w-6 text-blue-500" />} color="blue" />
      <StatCard title="Insured Items" value={stats.insuredItems} icon={<ShieldCheckIcon className="h-6 w-6 text-green-500" />} color="green" />
      <StatCard title="Active Rentals" value={stats.activeRentals} icon={<CpuIcon className="h-6 w-6 text-purple-500" />} color="purple" />
      <StatCard title="Upcoming Services" value={stats.upcomingServices} icon={<WrenchIcon className="h-6 w-6 text-orange-500" />} color="orange" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action} - {activity.item}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {activity.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all activity
          </Link>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Announcements</h2>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <li key={announcement.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{announcement.title}</h3>
                      <p className="text-sm text-gray-500">{announcement.date}</p>
                    </div>
                    <p className="text-sm text-gray-500">{announcement.content}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all announcements
          </Link>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <PackageIcon className="h-8 w-8 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-700">Sell an Item</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <ShieldCheckIcon className="h-8 w-8 text-green-500 mb-2" />
          <span className="text-sm font-medium text-gray-700">Insure Device</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <CpuIcon className="h-8 w-8 text-purple-500 mb-2" />
          <span className="text-sm font-medium text-gray-700">Rent Tech</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <WrenchIcon className="h-8 w-8 text-orange-500 mb-2" />
          <span className="text-sm font-medium text-gray-700">Book Service</span>
        </Link>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  };

  return (
    <div className={`${colorClasses[color]} overflow-hidden shadow rounded-lg p-5`}>
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
};

// Placeholder components for other sections
const BiddingHistory = () => {
  const { user } = useAuthStore();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUserBids = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/bidding/user-bids/${user._id}`); // make sure your backend has this route
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
        Your Bids
      </h2>

      {loading && <p className="text-gray-500">Loading your bids...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bids.length === 0 && (
        <p className="text-gray-500">You have not placed any bids yet.</p>
      )}

      {!loading && bids.length > 0 && (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{bid.product.title}</p>
                <p className="text-sm text-gray-500">
                  Your bid: LKR {bid.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  Placed: {new Date(bid.createdAt).toLocaleString()}
                </p>
              </div>
              {bid.product.isSoldOut && bid.product.soldTo === user._id && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Won
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InsuranceManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Insurance Management</h2>
    <p className="text-gray-600">View your insured devices and manage your claims.</p>
  </div>
);

const RentalManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Component Rental Management</h2>
    <p className="text-gray-600">Manage your rented components and rental history.</p>
  </div>
);

const PreOrderManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Pre-Order Management</h2>
    <p className="text-gray-600">Track your pre-orders and expected arrival dates.</p>
  </div>
);

const ServiceManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Service Booking</h2>
    <p className="text-gray-600">Manage your service appointments and book new services.</p>
  </div>
);

const OrderHistory = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
    <p className="text-gray-600">View your complete order history and track current orders.</p>
  </div>
);

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

      {/* Profile Card */}
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

      {/* Personal Info */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 mb-6"
      >
        <h2 className="text-lg font-bold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Balance (readonly) */}
          <div>
            <label className="block text-sm font-medium mb-1">Balance</label>
            <input
              type="text"
              value={`LKR ${user?.balance?.toLocaleString() || 0}`}
              disabled
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save Button */}
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

        {/* Messages */}
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

const SupportCenter = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Support Center</h2>
    <p className="text-gray-600">Get help with our services and submit support tickets.</p>
  </div>
);

export default UserDashboard;

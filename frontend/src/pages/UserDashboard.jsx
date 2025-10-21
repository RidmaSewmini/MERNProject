import { useState } from "react";
import { Link } from "react-router";
import Inventory from "./Inventory"; 

import {
  BellIcon,
  SearchIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  TruckIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  BarChart3Icon,
  PackageIcon,
  CpuIcon,
  CalendarCheckIcon,
  WrenchIcon,
  UserIcon,
  WalletIcon
} from "lucide-react";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [userData, setUserData] = useState({
    name: "Dasun Perera",
    email: "dasun@example.com",
    balance: 12500,
    membership: "Premium",
  });

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
        return <DashboardOverview stats={stats} recentActivity={recentActivity} announcements={announcements} />;
      case "insurance":
        return <InsuranceManagement />;
      case "productlist":
        return <Inventory />;  
      case "rentals":
        return <RentalManagement />;
      case "preorders":
        return <PreOrderManagement />;
      case "services":
        return <ServiceManagement />;
      case "orders":
        return <OrderHistory />;
      case "account":
        return <AccountSettings userData={userData} setUserData={setUserData} />;
      case "support":
        return <SupportCenter />;
      default:
        return <DashboardOverview stats={stats} recentActivity={recentActivity} announcements={announcements} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              TechSphere Lanka
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, services..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <BellIcon className="h-6 w-6" />
            </button>
            
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">{userData.name.charAt(0)}</span>
              </div>
              <div className="ml-2 hidden md:block">
                <Link to="/DashboardPage"> <p className="text-sm font-medium text-gray-700">{userData.name}</p> </Link>
                <p className="text-xs text-gray-500">{userData.membership} Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-white rounded-lg shadow p-6 h-fit">
            <div className="flex items-center mb-6 pb-4 border-b">
              <WalletIcon className="h-6 w-6 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-semibold">LKR {userData.balance.toLocaleString()}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <NavItem 
                icon={<BarChart3Icon className="h-5 w-5" />} 
                title="Dashboard" 
                isActive={activeSection === "overview"} 
                onClick={() => setActiveSection("overview")} 
              />
             <NavItem
                icon={<PackageIcon className="h-5 w-5" />}
                title="Product List"
                isActive={activeSection === "productlist"} // highlights when active
                onClick={() => setActiveSection("productlist")} // render Inventory
                />
              <NavItem 
                icon={<ShieldCheckIcon className="h-5 w-5" />} 
                title="Insurance" 
                isActive={activeSection === "insurance"} 
                onClick={() => setActiveSection("insurance")} 
              />
              <NavItem 
                icon={<CpuIcon className="h-5 w-5" />} 
                title="Rentals" 
                isActive={activeSection === "rentals"} 
                onClick={() => setActiveSection("rentals")} 
              />
              <NavItem 
                icon={<CalendarCheckIcon className="h-5 w-5" />} 
                title="Pre-Orders" 
                isActive={activeSection === "preorders"} 
                onClick={() => setActiveSection("preorders")} 
              />
              <NavItem 
                icon={<WrenchIcon className="h-5 w-5" />} 
                title="Service Booking" 
                isActive={activeSection === "services"} 
                onClick={() => setActiveSection("services")} 
              />
              <NavItem 
                icon={<CreditCardIcon className="h-5 w-5" />} 
                title="Order History" 
                isActive={activeSection === "orders"} 
                onClick={() => setActiveSection("orders")} 
              />
              <NavItem 
                icon={<UserIcon className="h-5 w-5" />} 
                title="Account Settings" 
                isActive={activeSection === "account"} 
                onClick={() => setActiveSection("account")} 
              />
              <NavItem 
                icon={<HelpCircleIcon className="h-5 w-5" />} 
                title="Support Center" 
                isActive={activeSection === "support"} 
                onClick={() => setActiveSection("support")} 
              />
              <NavItem 
                icon={<LogOutIcon className="h-5 w-5" />} 
                title="Logout" 
                isActive={false} 
                onClick={() => console.log("Logout")} 
              />
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <span className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
      {icon}
    </span>
    {title}
  </button>
);

const DashboardOverview = ({ stats, recentActivity, announcements }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dasun!</h1>
      <p className="text-gray-600">Here's what's happening with your tech ecosystem today.</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Active Bids" 
        value={stats.activeBids} 
        icon={<PackageIcon className="h-6 w-6 text-blue-500" />} 
        color="blue" 
      />
      <StatCard 
        title="Insured Items" 
        value={stats.insuredItems} 
        icon={<ShieldCheckIcon className="h-6 w-6 text-green-500" />} 
        color="green" 
      />
      <StatCard 
        title="Active Rentals" 
        value={stats.activeRentals} 
        icon={<CpuIcon className="h-6 w-6 text-purple-500" />} 
        color="purple" 
      />
      <StatCard 
        title="Upcoming Services" 
        value={stats.upcomingServices} 
        icon={<WrenchIcon className="h-6 w-6 text-orange-500" />} 
        color="orange" 
      />
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
                    <p className="text-sm font-medium text-gray-900">{activity.action} - {activity.item}</p>
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
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50'
  };

  return (
    <div className={`${colorClasses[color]} overflow-hidden shadow rounded-lg p-5`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
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
const BuybackProgram = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Buyback Program</h2>
    <p className="text-gray-600">Manage your items listed for bidding and track your earnings.</p>
    {/* Add buyback program content here */}
  </div>
);

const InsuranceManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Insurance Management</h2>
    <p className="text-gray-600">View your insured devices and manage your claims.</p>
    {/* Add insurance management content here */}
  </div>
);

const RentalManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Component Rental Management</h2>
    <p className="text-gray-600">Manage your rented components and rental history.</p>
    {/* Add rental management content here */}
  </div>
);

const PreOrderManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Pre-Order Management</h2>
    <p className="text-gray-600">Track your pre-orders and expected arrival dates.</p>
    {/* Add pre-order management content here */}
  </div>
);

const ServiceManagement = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Service Booking</h2>
    <p className="text-gray-600">Manage your service appointments and book new services.</p>
    {/* Add service management content here */}
  </div>
);

const OrderHistory = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
    <p className="text-gray-600">View your complete order history and track current orders.</p>
    {/* Add order history content here */}
  </div>
);

const AccountSettings = ({ userData, setUserData }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
    <p className="text-gray-600">Manage your personal information and preferences.</p>
    {/* Add account settings content here */}
  </div>
);

const SupportCenter = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Support Center</h2>
    <p className="text-gray-600">Get help with our services and submit support tickets.</p>
    {/* Add support center content here */}
  </div>
);

export default UserDashboard;
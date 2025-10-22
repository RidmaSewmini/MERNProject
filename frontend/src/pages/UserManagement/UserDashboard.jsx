import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserDBImg1 from "../../Asset/Dashboard/userdbImg1.png";
import Product1 from "../../Asset/Dashboard/product1.jpg";
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
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Weight,
  ChevronDown,
  ArrowRight,
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

  // ========== ACCOUNT SETTINGS (UPDATED UI) ==========
  const AccountSettings = () => {
    // NOTE: NO LOGIC CHANGES HERE, KEEPING EXISTING FUNCTIONALITY
    const { user, updateProfile, isLoading, message, error } = useAuthStore();
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(user?.photo || null);
    
    // State for the fake 2FA toggle (since no logic is requested)
    const [is2FEnabled, setIs2FEnabled] = useState(true);
    // State for the fake Support Access toggle (since no logic is requested)
    const [isSupportAccessGranted, setIsSupportAccessGranted] = useState(true);

    // Existing file change handler
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setPhoto(file);
      if (file) setPreview(URL.createObjectURL(file));
    };
    
    // Existing remove image handler (updated to actually delete from backend)
    const handleRemoveImage = async () => {
      if (!preview) return;

      const confirmDelete = window.confirm("Are you sure you want to remove your profile picture?");
      if (!confirmDelete) return;

      try {
        // 🔥 Call the removeProfilePhoto() function from your auth store
        await useAuthStore.getState().removeProfilePhoto();

        // Update UI preview to default avatar
        setPhoto(null);
        setPreview("https://cdn-icons-png.flaticon.com/512/2202/2202112.png");
      } catch (error) {
        console.error("Failed to remove profile image:", error);
      }
    };

    // Existing submit handler
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      
      // Check if the photo state changed (either a new file or removed)
      if (photo) {
          formData.append("photo", photo);
      } 
      // If photo is null and preview was set (meaning image was removed)
      // NOTE: This is placeholder logic. Your backend needs to handle clearing the image.
      else if (!photo && user?.photo && !preview) { 
          formData.append("removePhoto", true); 
      }

      await updateProfile(formData);
    };
    
    // Dummy values for UI
    const dummyEmail = user?.email || "user@example.com";
    const dummySupportExpiry = "Aug 31, 2024, 9:40 PM"; // Placeholder date

    return (
      // Max width adjusted for a better desktop view
      <div className="bg-white shadow rounded-lg p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* ========================================
          My Profile Section (Wrapped in Form)
          ======================================== 
        */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
              
              {/* SAVE CHANGES BUTTON - TOP RIGHT */}
              <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                  {isLoading ? "Saving..." : "Save Changes"}
              </button>
          </div>

          {/* Profile Image Row */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-gray-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <label 
                  htmlFor="photo-upload" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                  <span className="font-semibold text-sm">+ Change Image</span>
              </label>
              <input
                  id="photo-upload"
                  type="file"
                  accept=".png,.jpeg,.jpg,.gif"
                  onChange={handleFileChange}
                  className="hidden"
              />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm font-medium text-gray-700 hover:text-red-700 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md"
                    disabled={!preview}
                  >
                    Remove Image
                  </button>
            </div>
            
          </div>
          <p className="text-xs text-gray-500 mb-8 ml-24 -mt-4">
              We support PNGs, JPEGs and GIFs under 2MB
          </p>

          {/* Name Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
          </div>
        </form>
        {/* End of My Profile Form */}
        
        {/* Message and Error Feedback for Profile Save (moved here) */}
        {(message || error) && (
          <div className="mt-4 p-3 rounded-md">
              {message && <p className="text-green-600 text-sm">{message}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        )}

        <hr className="my-8 border-gray-200" />

        {/* Account Security Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>

          {/* Password Row */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 mr-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
              {/* Input styled to look like the screenshot */}
              <input
                type="password"
                value="********" // Placeholder for security
                readOnly
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-white"
              />
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap px-4 py-2 mt-6 border border-blue-600 rounded-md">
              Change password
            </button>
          </div>

          {/* 2-Step Verification Row */}
          <div className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm font-medium text-gray-900">2-Step Verifications</p>
              <p className="text-xs text-gray-500">Add an additional layer of security to your account during login.</p>
            </div>
            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={is2FEnabled}
                  onChange={() => setIs2FEnabled(!is2FEnabled)} 
              />
              {/* Updated switch class to match the screenshot's pill/active style */}
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </section>
        
        <hr className="my-8 border-gray-200" />

        {/* Support Access Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Support Access</h2>

          {/* Support Access Toggle Row */}
          <div className="flex items-center justify-between py-2">
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-900">Support access</p>
              <p className="text-xs text-gray-500">
                You have granted us to access to your account for support purposes until <span className="font-semibold">{dummySupportExpiry}</span>.
              </p>
            </div>
            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isSupportAccessGranted}
                  onChange={() => setIsSupportAccessGranted(!isSupportAccessGranted)} 
              />
              {/* Updated switch class */}
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Log out of all devices Row */}
          <div className="flex items-center justify-between py-2 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-900">Log out of all devices</p>
              <p className="text-xs text-gray-500">
                Log out of all other active sessions on other devices besides this one.
              </p>
            </div>
            {/* "Log out" button */}
            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap px-4 py-2 border border-blue-600 rounded-md">
              Log out
            </button>
          </div>
        </section>
        
        <hr className="my-8 border-gray-200" />

        {/* Delete Account Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-red-600">Delete my account</p>
              <p className="text-xs text-gray-500">
                Permanently delete the account and remove access from all workspaces.
              </p>
            </div>
            {/* "Delete Account" button */}
            <button type="button" className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 whitespace-nowrap px-4 py-2 rounded-md transition-colors">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    );
  };

// ========== HELPER COMPONENTS (LIGHT THEME) ==========

// Helper component for stars (reusable)
  const RatingStars = ({ rating, size = 16 }) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={
            i + 1 <= Math.floor(rating)
              ? "currentColor"
              : i < rating
              ? "url(#half_grad_light)" // <-- Changed gradient ID
              : "none"
          }
          stroke="currentColor"
        />
      ))}
      {/* SVG definition for the half-star gradient (LIGHT THEME) */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half_grad_light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="rgb(250 204 21)" /> {/* yellow-400 */}
            {/* Changed dark bg to light bg */}
            <stop offset="50%" stopColor="rgb(229 231 235)" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

// Helper component for product cards (LIGHT THEME)
  const ProductCard = ({ name, price, rating, img }) => (
    <div className="bg-white shadow-md border border-gray-200 p-4 rounded-lg text-left relative">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10">
        <Heart size={20} />
      </button>
      <div className="relative mb-3">
        <img
          src={img}
          alt={name}
          className="w-full h-48 object-cover rounded-lg bg-gray-100" // Added bg-gray-100 placeholder
        />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
          New
        </span>
      </div>
      {/* Changed text to dark */}
      <h4 className="font-medium text-gray-900 mb-1 truncate">{name}</h4>
      <p className="text-lg font-semibold text-gray-900 mb-2">LKR{price}</p>
      <RatingStars rating={rating} />
    </div>
  );

  // Helper for review breakdown (LIGHT THEME)
  const ReviewBar = ({ label, percentage }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-gray-600">{label}</span>
      {/* Changed progress bar track color */}
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full" // Kept blue accent
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {/* Changed text color */}
      <span className="w-8 text-right text-gray-700">{percentage}%</span>
    </div>
  );

  // ========== DASHBOARD OVERVIEW (LIGHT THEME) ==========
  const DashboardOverview = ({ user, stats }) => (
    // Main container
    <div className="space-y-8">
      {/* Top Section: Hero + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === 1. Hero Section (LIGHT THEME) === */}
        {/* Changed bg-neutral-800 to bg-white shadow */}
        <div className="lg:col-span-2 bg-white shadow-md border border-gray-200 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6">
          {/* Image & Controls (Layout Fixed) */}
          <div className="flex-shrink-0 relative w-56 h-60">
            <img
              src={UserDBImg1}
              alt="AORUS PCs"
              className="rounded-lg w-full h-full object-cover"
            />
            {/* Arrows are fine as-is (on top of image) */}
            <button className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Text Content (LIGHT THEME) */}
          <div className="flex-1">
            {/* Changed text-white to text-gray-900 */}
            <h2 className="text-2xl font-normal text-gray-900 mb-7 font-aldrich">
              Dominate every game with unmatched power, precision, and style. 🔥</h2>
            {/* Changed text-gray-400 to text-gray-600 */}
            <p className="mb-8 text-base text-gray-600">
              Explore the latest lineup of AORUS gaming PCs and laptops,
              engineered for peak performance and a premium gaming experience.
            </p>
            <div className="flex items-center gap-4 mb-1 mt-10">
              {/* Changed button from green to blue accent */}
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* === 2. Customer Review Section (LIGHT THEME) === */}
        {/* Changed bg-neutral-800 to bg-white shadow */}
        <div className="lg:col-span-1 bg-white shadow-md border border-gray-200 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-normal text-gray-900">Customer Review</h3>
            {/* Changed button to light theme */}
            <button className="text-sm bg-white border border-gray-300 px-3 py-1 rounded-lg flex items-center hover:bg-gray-50 text-gray-700">
              This Month <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {/* Changed text-white to text-gray-900 */}
            <span className="text-4xl font-semibold text-gray-900">4.7</span>
            <div>
              <RatingStars rating={4.7} size={20} />
              {/* Changed text-gray-400 to text-gray-500 */}
              <p className="text-sm text-gray-500">Based on 602 ratings</p>
            </div>
          </div>

          <div className="space-y-2 my-4">
            <ReviewBar label="5 Star" percentage={40} />
            <ReviewBar label="4 Star" percentage={35} />
            <ReviewBar label="3 Star" percentage={32} />
            <ReviewBar label="2 Star" percentage={28} />
            <ReviewBar label="1 Star" percentage={22} />
          </div>

          {/* Changed border-neutral-700 to border-gray-200 */}
          <div className="flex justify-between items-center mt-4 text-sm border-t border-gray-200 pt-4">
            <p className="text-gray-500">Total 600 Review</p>
            {/* Changed text-blue-400 to text-blue-600 */}
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              See All <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* === 3. Popular Product Section === */}
      <div>
        {/* Changed text-black to text-gray-900 */}
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          Popular Product
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ProductCard component is now light theme */}
          <ProductCard
            name="DELL 610M Lunarli Alienware Wired/Wireless Gaming Mouse"
            price=" 15,900.00"
            rating={5}
            img="https://redtech.lk/wp-content/uploads/2021/08/DELL-610M-Lunarli-Alienware-Wired-Wireless-Gaming-Mouse.png"
          />
          <ProductCard
            name="Corsair VOID Wireless v2 Gaming Headset"
            price=" 45,500.00"
            rating={4}
            img="https://www.gamestreet.lk/images/products/7954.gif"
          />
          <ProductCard
            name="MageGee MK-Star61 Waves 60% Mechanical Keyboard"
            price=" 8,750.00"
            rating={5}
            img="https://disrupt.lk/cdn/shop/files/main_12.jpg?v=1752643834&width=800"
          />
          <ProductCard
            name="DualSense Wireless Controller"
            price=" 32,500.00"
            rating={4}
            img="https://i0.wp.com/tecroot.lk/wp-content/uploads/2021/01/DualSense-Wireless-Controller-ASTRO-BOT-Limited-Edition.webp?fit=600%2C600&ssl=1"
          />
        </div>
      </div>

      {/* === 4. Most Selling Model Section === */}
      <div>
        <div className="flex justify-between items-center mb-4">
          {/* Changed text-black to text-gray-900 */}
          <h3 className="text-xl font-medium text-gray-900 ">
            Most Selling Model
          </h3>
          {/* Changed button to light theme */}
          <button className="text-sm bg-white border border-gray-300 px-3 py-1 rounded-lg flex items-center hover:bg-gray-50 text-gray-700">
            This Year <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
        {/* Changed bg-neutral-800 to bg-white shadow */}
        <div className="overflow-x-auto rounded-lg bg-white shadow-md border border-gray-200">
          <table className="w-full text-left">
            {/* Changed thead bg and text color */}
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Score</th>
              </tr>
            </thead>
            {/* Changed tbody border and hover color */}
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                {/* Changed text-white to text-gray-900 */}
                <td className="p-4 font-bold text-gray-900">01</td>
                <td className="p-4 text-gray-900">Aorus </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={5} />
                    <span className="text-gray-500 ml-1 text-sm">
                      (147 Reviews)
                    </span>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-900">500</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">02</td>
                <td className="p-4 text-gray-900">Dell</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={4.9} />
                    <span className="text-gray-500 ml-1 text-sm">
                      (147 Reviews)
                    </span>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-900">300</td>
              </tr>
            </tbody>
          </table>
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

      {/* remove mx-auto and max width */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-28">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Become a Seller Button */}
          <div className="absolute top-24 right-8">
            <Link
              to="/seller-login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Become a Seller
            </Link>
          </div>
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

export default UserDashboard;
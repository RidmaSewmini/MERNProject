import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Components & Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/UserManagement/LoginPage.jsx";
import RegisterPage from "./pages/UserManagement/RegisterPage.jsx";
import VerifyEmailPage from "./pages/UserManagement/EmailVerificationPage.jsx";
import UserDashboard from "./pages/UserManagement/UserDashboard.jsx";
import AdminDashboard from "./pages/UserManagement/AdminDashboard.jsx";
import LoadingSpinner from "./components/LoadingSpinner";
import BiddingPage from "./pages/Bidding/BiddingPage.jsx";
import BidProductsPage from "./pages/Bidding/BidProductsPage.jsx";
import BidProductDetailsPage from "./pages/Bidding/BidProductDetailsPage.jsx";
import GamingLaptopsPage from "./pages/Inventory/GamingLaptopsPage.jsx";
import GamingMotherboardPage from "./pages/Inventory/GamingMotherboardPage.jsx";
import GamingMonitorPage from "./pages/Inventory/GamingMonitorPage.jsx";
import PremiumGraphicsCardPage from "./pages/Inventory/PremiumGraphicsCardPage.jsx";
import PremiumComponentPage from "./pages/Inventory/PremiumComponentPage.jsx";
import GamingPeripheralPage from "./pages/Inventory/GamingPeripheralPage.jsx";
import DesktopPCPage from "./pages/Inventory/DesktopPCPage.jsx";
import RentalPage from "./pages/Rental/RentalPage.jsx";
import RentalForm from "./pages/Rental/RentalForm.jsx";

// -------------------- Protected Route --------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// -------------------- Admin Only Route --------------------
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />; // non-admins redirected home
  }

  return children;
};

// -------------------- App --------------------
export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  // ✅ Run checkAuth once when the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Show global loader until checkAuth finishes
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route path="/bidding" element={<BiddingPage />} />
      <Route path="/bidproducts" element={<BidProductsPage />} />
      <Route path="/bidproductdetails" element={<BidProductDetailsPage />} />
      <Route path="/laptops" element={<GamingLaptopsPage />} />
      <Route path="/motherboard" element={<GamingMotherboardPage />} />
      <Route path="/Monitor" element={<GamingMonitorPage />} />
      <Route path="/PremiumGraphicsCard" element={<PremiumGraphicsCardPage />} />
      <Route path="/PremiumComponent" element={<PremiumComponentPage />} />
      <Route path="/Peripheral" element={<GamingPeripheralPage />} />
      <Route path="/DesktopPC" element={<DesktopPCPage />} />
      <Route path="/rental" element={<RentalPage />} />
      <Route path="/rentalform" element={<RentalForm />} />

      {/* User-only routes */}
      <Route
        path="/userdashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admindashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

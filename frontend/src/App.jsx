import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Components & Pages
import HomePage from "./pages/HomePage.jsx";

// User Management
import LoginPage from "./pages/UserManagement/LoginPage.jsx";
import RegisterPage from "./pages/UserManagement/RegisterPage.jsx";
import VerifyEmailPage from "./pages/UserManagement/EmailVerificationPage.jsx";
import ForgotPasswordPage from "./pages/UserManagement/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/UserManagement/ResetPasswordPage.jsx";
import UserDashboard from "./pages/UserManagement/UserDashboard.jsx";
import AdminDashboard from "./pages/UserManagement/AdminDashboard.jsx";

// Bidding
import BiddingPage from "./pages/Bidding/BiddingPage.jsx";
import BidProductsPage from "./pages/Bidding/BidProductsPage.jsx";
import BidProductDetailsPage from "./pages/Bidding/BidProductDetailsPage.jsx";

// Inventory
import GamingLaptopsPage from "./pages/Inventory/GamingLaptopsPage.jsx";
import GamingMotherboardPage from "./pages/Inventory/GamingMotherboardPage.jsx";
import GamingMonitorPage from "./pages/Inventory/GamingMonitorPage.jsx";
import PremiumGraphicsCardPage from "./pages/Inventory/PremiumGraphicsCardPage.jsx";
import PremiumComponentPage from "./pages/Inventory/PremiumComponentPage.jsx";
import GamingPeripheralPage from "./pages/Inventory/GamingPeripheralPage.jsx";
import DesktopPCPage from "./pages/Inventory/DesktopPCPage.jsx";

// Rentals
import RentalPage from "./pages/Rental/Rentalpage.jsx";
import RentalForm from "./pages/Rental/RentalForm.jsx";

// Product Details
import LaptopDetailPage from "./pages/LaptopDetailPage.jsx";
import MotherboardDetailPage from "./pages/MotherboardDetailPage.jsx";
import DesktopDetailPage from "./pages/DesktopDetailPage.jsx";
import PeripheralDetailPage from "./pages/PeripheralDetailPage.jsx";
import ComponentDetailPage from "./pages/ComponentDetailPage.jsx";
import GraphicsCardDetailPage from "./pages/GraphicsCardDetailPage.jsx";
import MonitorDetailPage from "./pages/MonitorDetailPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

// Utilities
import LoadingSpinner from "./components/LoadingSpinner";

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
    return <Navigate to="/" replace />;
  }

  return children;
};

// -------------------- App --------------------
export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route path="/bidding" element={<BiddingPage />} />
      <Route path="/bidproducts" element={<BidProductsPage />} />
      <Route path="/product/:id" element={<BidProductDetailsPage />} />

      <Route path="/laptops" element={<GamingLaptopsPage />} />
      <Route path="/motherboard" element={<GamingMotherboardPage />} />
      <Route path="/monitor" element={<GamingMonitorPage />} />
      <Route path="/premiumgraphicscard" element={<PremiumGraphicsCardPage />} />
      <Route path="/premiumcomponent" element={<PremiumComponentPage />} />
      <Route path="/peripheral" element={<GamingPeripheralPage />} />
      <Route path="/desktoppc" element={<DesktopPCPage />} />

      {/* Product detail pages */}
      <Route path="/laptops/:id" element={<LaptopDetailPage />} />
      <Route path="/motherboard/:id" element={<MotherboardDetailPage />} />
      <Route path="/desktop/:id" element={<DesktopDetailPage />} />
      <Route path="/peripheral/:id" element={<PeripheralDetailPage />} />
      <Route path="/component/:id" element={<ComponentDetailPage />} />
      <Route path="/graphics-cards/:id" element={<GraphicsCardDetailPage />} />
      <Route path="/monitor/:id" element={<MonitorDetailPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Protected rental routes */}
      <Route path="/rental" element={<ProtectedRoute><RentalPage /></ProtectedRoute>} />
      <Route path="/rentalform" element={<ProtectedRoute><RentalForm /></ProtectedRoute>} />

      {/* User-only routes */}
      <Route path="/userdashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

      {/* Admin-only routes */}
      <Route path="/admindashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

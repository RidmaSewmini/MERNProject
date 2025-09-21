import { Routes, Route, Navigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import BiddingPage from "./pages/BiddingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import DashboardPage from "./pages/DashboardPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GamingLaptopsPage from "./pages/GamingLaptopsPage";
import GamingMotherboardPage from "./pages/GamingMotherboardPage";
import GamingMonitorPage from "./pages/GamingMonitorPage";
import PremiumGraphicsCardPage from "./pages/PremiumGraphicsCardPage";
import PremiumComponentPage from "./pages/PremiumComponentPage";
import GamingPeripheralPage from "./pages/GamingPeripheralPage";
import DesktopPCPage from "./pages/DesktopPCPage";


import RentalPage from "./pages/Rentalpage";
import RentalForm from "./pages/RentalForm";

import LoadingSpinner from "./components/LoadingSpinner"; // make sure you have this
import toast from "react-hot-toast";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

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
    <div className="relative h-full w-full font-titillium">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="/bidding" element={<BiddingPage />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticatedUser>
              <RegisterPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DashboardPage"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        <Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

        {/* Rental */}
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/rentalform" element={<RentalForm />} />

        {/* Laptops */}
        <Route path="/laptops" element={<GamingLaptopsPage />} />

        {/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
        
        <Route path="/motherboard" element={<GamingMotherboardPage />} />
        <Route path="/Monitor" element={<GamingMonitorPage />} />
        <Route path="/PremiumGraphicsCard" element={<PremiumGraphicsCardPage />} />
        <Route path="/PremiumComponent" element={<PremiumComponentPage/>} />
        <Route path="/Peripheral" element={<GamingPeripheralPage />} />
        <Route path="/DesktopPC" element={<DesktopPCPage/>} />
      </Routes>
    </div>
  );
};

export default App;

import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (firstName, lastName, email, password, agreeToTerms) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
        agreeToTerms,
      });
      set({
        user: response.data?.user || null,
        isAuthenticated: !!response.data?.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        user: response.data?.user || null,
        isAuthenticated: !!response.data?.user,
        isLoading: false,
        error: null,
      });
      navigate("/userdashboard");
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        message: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data?.user || null,
        isAuthenticated: !!response.data?.user,
        isLoading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
      set({
        user: response.data?.user || null,
        isAuthenticated: !!response.data?.user,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({
        message: response.data?.message || "Check your email for reset instructions",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({
        message: response.data?.message || "Password reset successfully",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error resetting password",
      });
      throw error;
    }
  },
}));

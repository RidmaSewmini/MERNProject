import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Loader } from "lucide-react";
import LoginBG from "../../Asset/LoginBG.jpg";
import { useAuthStore } from "../../store/authStore";

const SellerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const { loginAsSeller, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginAsSeller(email, password);
  };

  // Handle Google login with Passport.js OAuth flow
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-titillium"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 bg-transparent p-8 md:p-12 flex flex-col justify-center">
          <Link
            to="/"
            className="flex items-center text-white/80 hover:text-white transition-colors mb-6 md:mb-10"
          >
            <ArrowLeftIcon size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              TechSphere Lanka
            </h1>
            <p className="text-blue-200">
              Your one-stop tech solution in Sri Lanka
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-center">
              <div className="bg-blue-700 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-white">Tech buyback program with bidding</p>
            </div>

            <div className="flex items-center">
              <div className="bg-blue-700 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-white">Tech insurance subscription</p>
            </div>

            <div className="flex items-center">
              <div className="bg-blue-700 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <p className="text-white">Rent high-end components</p>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-black/20 p-6 rounded-xl">
              <p className="text-blue-200 italic">
                "Finally, a tech store in Sri Lanka that understands gamers and
                creators! The component rental service saved me during my
                project crunch time."
              </p>
              <p className="text-white mt-2">- Dasun, Graphic Designer</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              Login as a Seller
            </h2>
            <p className="text-gray-300 mt-2">Access your seller dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email Address*
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="password">
                Password*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your password"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Password must be at least 8 characters, with at least one number
                and one letter
              </p>
            </div>

            {error && (
              <p className="text-red-500 font-semibold text-sm">{error}</p>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                "Sign In as Seller"
              )}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-700"></div>
            <p className="px-4 text-gray-400">Or continue with</p>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </button>
            <button
              className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              FB
            </button>
            <button
              className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center transition duration-300"
            >
              <svg
                className="w-5 h-5 mr-2 text-blue-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;
import React, { useState, useEffect } from 'react';
import { Link } from "react-router";
import { ChevronDown, ShoppingCart, Search } from "lucide-react";
import axios from "axios";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null); // logged-in user
  const [showSearch, setShowSearch] = useState(false); // toggle search input

  // ===== Scroll effect =====
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // ===== Fetch logged-in user =====
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/check-auth", {
          withCredentials: true
        });
        if (res.data.success) setUser(res.data.user);
      } catch (error) {
        console.log("No user logged in");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
      {/* Main Navigation Layer */}
      <header className={`font-titillium px-8 py-4 flex justify-between items-center flex-wrap w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg text-black' 
          : 'bg-transparent text-white'
      }`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-whitw p-2 rounded-lg"></div>
          <div>
            <h1 className="text-xl font-bold font-aldrich">TechSphere</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-5">
          <Link 
            to="/" 
            className="btn btn-ghost text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Home
          </Link>
          <Link 
            to="/laptops" 
            className="btn btn-ghost text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Shop
          </Link >
          <details className="dropdown">
            <summary className="btn btn-ghost text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg">
              Services
              <ChevronDown className="size-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="menu dropdown-content bg-base-100 text-black rounded-box z-[1] w-52 p-2 shadow">
              <li><Link to="/bidding">Bidding Marketplace</Link></li>
              <li><a>Tech Insurance</a></li>
              <li><Link to="/rental">Rental Programme</Link></li>
              <li><a>Pre Order Facility</a></li>
              <li><a>Technician Booking</a></li>
            </ul>
          </details>          
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              {/* Foldable Search */}
              <div className="relative">
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Search size={20} />
                </button>
                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="absolute top-10 right-0 w-48 p-2 border rounded-md shadow-md focus:outline-none"
                  />
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Profile dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photo} alt="Profile" />
                  </div>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow text-black bg-base-100 rounded-box w-52 mt-2">
                  <li><Link to="/userdashboard">Dashboard</Link></li>
                  <li><Link to="/profile">Edit Profile</Link></li>
                  <li><Link to="/logout">Logout</Link></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost text-xl font-bold no-underline hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg">Login</Link>
              <Link to="/register" className="btn btn-ghost text-xl font-bold no-underline hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg">Register</Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Nav;

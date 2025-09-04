import React, { useState, useEffect } from 'react';
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
      {/* Main Navigation Layer (stays below top bar) */}
      <header className={`px-8 py-4 flex justify-between items-center flex-wrap w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg text-black' 
          : 'bg-transparent text-white'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-whitw p-2 rounded-lg">
            
          </div>
          <div>
            <h1 className=" text-xl font-bold font-aldrich">TechSphere</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-5">
          <Link 
            to="/" 
            className=" btn btn-ghost text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Home
          </Link>
          <Link 
            to="/adduser" 
            className="btn btn-ghost text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Shop
          </Link >
                <details className="dropdown">
                  <summary className="btn btn-ghost  text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg">
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
          <Link 
            to="/log" 
            className="btn btn-ghost  text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Login
          </Link>
          <Link 
            to="/regi" 
            className="btn btn-ghost  text-xl font-bold no-underline transition-all duration-300 hover:bg-white/20 hover:text-primary hover:scale-110 hover:shadow-lg"
          >
            Register
          </Link>

        </div>
      </header>
    </div>
  );
}

export default Nav;
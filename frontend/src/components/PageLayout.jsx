// src/components/PageLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            TechSphere Lanka
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/laptops" className="hover:underline">Laptops</Link>
            <Link to="/motherboard" className="hover:underline">Motherboards</Link>
            <Link to="/DesktopPC" className="hover:underline">Desktops</Link>
            <Link to="/Peripheral" className="hover:underline">Peripherals</Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} TechSphere Lanka. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;

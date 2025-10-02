import { useState, useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from 'react-router';

const products = [
  {
    id: 1,
    title: "1964 Ferrari 250 LM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/cars/ferrari.jpg",
    currentBid: 6000000,
    endTime: Date.now() + 30 * 60 * 60 * 1000, // 30h countdown
  },
  {
    id: 2,
    title: "1961 Ferrari 250 GT SWB California Spyder",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/cars/ferrari-spyder.jpg",
    currentBid: 6000000,
    endTime: Date.now() + 30 * 60 * 60 * 1000,
  },
  {
    id: 3,
    title: "1994 McLaren F1 LM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/cars/mclaren.jpg",
    currentBid: 6000000,
    endTime: Date.now() + 30 * 60 * 60 * 1000,
  },
  {
    id: 4,
    title: "Corolla Hybrid",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/cars/corolla.jpg",
    currentBid: 6000000,
    endTime: Date.now() + 30 * 60 * 60 * 1000,
  },
];

const Countdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-semibold">
      {hours}h : {minutes}m : {seconds}s
    </span>
  );
};

const BidProducts = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-titillium">
     <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
        <Navbar/>
      {/* Sidebar Filters */}
      <aside className="w-64 bg-white shadow pt-28 pb-6 pr-6 pl-6">
        <h2 className="font-bold mb-4">Filter by</h2>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Price Range</h3>
          <ul className="space-y-2 text-sm">
            <li><input type="radio" name="price" /> <span>500,000 - 1,000,000 PKR</span></li>
            <li><input type="radio" name="price" /> <span>1,000,001 - 2,000,000 PKR</span></li>
            <li><input type="radio" name="price" /> <span>2,000,001 - 3,000,000 PKR</span></li>
            <li><input type="radio" name="price" /> <span>3,000,001 - 4,000,000 PKR</span></li>
            <li><input type="radio" name="price" /> <span>4,000,001 - 5,000,000 PKR</span></li>
            <li><input type="radio" name="price" /> <span>5,000,001 - 6,000,000 PKR</span></li>
          </ul>
        </div>

        {/* Auction Cities */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">By Auction Cities</h3>
          <ul className="space-y-2 text-sm">
            {["Lahore", "Islamabad", "Faisalabad", "Qasoor", "Okara", "Patoki"].map((city) => (
              <li key={city}>
                <input type="checkbox" /> <span>{city}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Registration City */}
        <div>
          <h3 className="text-sm font-semibold mb-2">By Registration City</h3>
          <ul className="space-y-2 text-sm">
            {["Lahore", "Islamabad", "Faisalabad", "Qasoor", "Okara", "Patoki"].map((city) => (
              <li key={city}>
                <input type="checkbox" /> <span>{city}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-6 pr-6 pl-6">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search keyword"
            className="w-1/2 p-2 border rounded"
          />
          <button className="bg-red-600 text-white px-4 py-2 rounded">Search</button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-2">
                  <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-gray-700 mb-2">
                  <Countdown endTime={product.endTime} />
                </div>
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {product.description} <span className="text-blue-600">Read More...</span>
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    {product.currentBid.toLocaleString()} PKR
                  </span>
                  <Link to="/bidproductdetails">
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Start Bid
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BidProducts;

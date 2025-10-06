import { useState, useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom"; // fixed: should be from react-router-dom
import axios from "axios";

const Countdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(endTime) - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(new Date(endTime) - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft <= 0) return <span className="font-semibold text-red-600">Auction Ended</span>;

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/bid-products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching bid products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-titillium">
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
      <Navbar />

      {/* Sidebar Filters */}
      <aside className="w-64 bg-white shadow pt-28 pb-6 pr-6 pl-6">
        <h2 className="font-bold mb-4">Filter by</h2>
        {/* (keep your filters same as before) */}
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
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0].filePath
                        : "/placeholder.png"
                    }
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
                    <Countdown endTime={product.biddingEndTime} />
                  </div>
                  <h3 className="font-bold text-lg">{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {product.description?.slice(0, 80)}...
                    <span className="text-blue-600"> Read More</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      {product.startingBid?.toLocaleString()} LKR
                    </span>
                    <Link to={`/product/${product._id}`}>
                      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Start Bid
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BidProducts;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Fuel, Gauge, Cog, CheckCircle } from "lucide-react";


const Countdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(endTime) - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(new Date(endTime) - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (!endTime || timeLeft <= 0) {
    return <span className="font-semibold text-red-600">Auction Ended</span>;
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-semibold text-gray-700">
      {hours}h : {minutes}m : {seconds}s
    </span>
  );
};

const ProductDetails = () => {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [myBid, setMyBid] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/bid-products/${productId}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0].filePath);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  // Handle bid submission (later connect to backend)
  const handlePlaceBid = async () => {
    if (!myBid || Number(myBid) <= 0) {
      alert("Enter a valid bid amount");
      return;
    }

    // Check if auction ended
    const isAuctionEnded = new Date(product.biddingEndTime) - Date.now() <= 0;
    if (isAuctionEnded) {
      alert("Auction has ended. You cannot place a bid.");
      return;
    }

    try {
      // Get auth token from localStorage or your auth store
      const token = localStorage.getItem("authToken"); 
      const res = await axios.post(
        "http://localhost:5001/api/bidding/",
        {
          productId,
          price: Number(myBid),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      // Update UI with new bid
      setProduct((prev) => ({
        ...prev,
        currentBid: Number(myBid),
        totalBids: (prev.totalBids || 0) + 1,
      }));

      setMyBid(""); // Clear input
    } catch (err) {
      console.error("Error placing bid:", err);
      alert(err.response?.data?.message || "Failed to place bid");
    }
  };

  const isAuctionEnded = new Date(product.biddingEndTime) - Date.now() <= 0;


  return (
    <div className="bg-gray-50 min-h-screen p-6 font-titillium">
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-400 z-0"></div>
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-8 pt-24">
        {/* Left: Images */}
        <div className="lg:w-2/3">
          <img
            src={mainImage || "/placeholder.png"}
            alt={product.title}
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />
          <div className="flex gap-4 mt-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.filePath}
                alt={`thumb-${idx}`}
                onClick={() => setMainImage(img.filePath)}
                className={`w-32 h-24 object-cover rounded-lg cursor-pointer border ${
                  mainImage === img.filePath ? "border-red-600" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:w-1/3 bg-white shadow rounded-lg p-6">
          <div className="flex flex-col space-y-4">
            {/* Timer */}
            <Countdown endTime={product.biddingEndTime} />

            {/* Bidding Info */}
            <span className="text-lg font-medium text-gray-700">
              Starting Bid: {product.startingBid?.toLocaleString()} LKR
            </span>
            <span className="text-lg font-medium text-gray-700">
              Minimum Increment: {product.minIncrement} LKR
            </span>
            <span className="text-2xl font-bold text-red-600">
              Current Bid: {product.currentBid?.toLocaleString()} LKR
            </span>
            <span className="text-gray-700">
              Total Bids: {product.totalBids}
            </span>

            {/* Place Bid */}
            <input
              type="number"
              placeholder="Enter your bid"
              className="border p-2 rounded w-full"
              value={myBid}
              onChange={(e) => setMyBid(e.target.value)}
              disabled={isAuctionEnded}
            />

            <button
              onClick={handlePlaceBid}
              disabled={isAuctionEnded}
              className={`py-2 rounded text-white ${isAuctionEnded ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {isAuctionEnded ? "Auction Ended" : "Place Bid"}
            </button>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{product.title}</h2>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <CheckCircle className="mx-auto w-6 h-6 text-green-500" />
            <p className="font-medium">Category</p>
            <p className="text-gray-600">{product.category}</p>
          </div>
          <div>
            <Fuel className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Specifications</p>
            <p className="text-gray-600">{product.specifications?.cpu || "N/A"}</p>
          </div>
          <div>
            <Gauge className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Condition</p>
            <p className="text-gray-600">{product.condition}</p>
          </div>
          <div>
            <Cog className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Increment</p>
            <p className="text-gray-600">{product.minIncrement} LKR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
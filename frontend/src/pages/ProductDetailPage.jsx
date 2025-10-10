import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:5001";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  // Handlers for buttons
  const handleAddToCart = () => {
    // You can implement adding to cart logic here
    console.log("Added to cart:", product);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    // You can implement buy now / checkout logic here
    console.log("Buy Now clicked:", product);
    navigate("/checkout", { state: { product } }); // Example: navigate to checkout page with product
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-24 pb-20 pl-12 pr-12 flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-1">
          <img
            src={product.image ? `${API_BASE}/uploads/${product.image}` : "/placeholder.png"}
            alt={product.name}
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-orange-500">{product.name}</h1>
          <p className="text-gray-300">{product.description}</p>
          <p className="text-lg font-semibold">Brand: {product.brand}</p>
          <p className="text-lg font-semibold">Category: {product.category}</p>
          <p className="text-2xl font-bold text-orange-500">LKR {product.price.toLocaleString()}</p>
          <p
            style={{
              backgroundColor:
                product.availability === "In Stock"
                  ? "rgba(0,200,0,0.2)"
                  : product.availability === "Out of Stock"
                  ? "rgba(255,0,0,0.2)"
                  : "rgba(255,165,0,0.2)",
              color:
                product.availability === "In Stock"
                  ? "#00ff00"
                  : product.availability === "Out of Stock"
                  ? "#ff4444"
                  : "orange",
              border:
                product.availability === "In Stock"
                  ? "1px solid #00ff00"
                  : product.availability === "Out of Stock"
                  ? "1px solid #ff4444"
                  : "1px solid orange",
              borderRadius: "5px",
              padding: "5px 10px",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            {product.availability}
          </p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-orange-400 mb-2">Specifications:</h2>
              <ul className="list-disc list-inside text-gray-300">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart & Buy Now Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-lg font-bold bg-orange-500 hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 rounded-lg font-bold bg-green-500 hover:bg-green-600 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

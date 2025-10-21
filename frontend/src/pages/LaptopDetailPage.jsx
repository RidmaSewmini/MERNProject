import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const LaptopDetailPage = () => {
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 w-max"
      >
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={product.image ? `http://localhost:5001/uploads/${product.image}` : "/placeholder.png"}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-orange-500">{product.name}</h1>
          <p className="text-xl font-semibold mb-2">LKR {product.price}</p>
          <p className="font-medium mb-4">{product.availability}</p>
          <h2 className="text-lg font-semibold mb-1">Description:</h2>
          <p className="text-gray-300">{product.description}</p>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default LaptopDetailPage;

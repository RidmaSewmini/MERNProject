import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const GraphicsCardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setCard(res.data);
      } catch (err) {
        console.error("Error fetching graphics card details:", err);
      }
    };
    fetchCard();
  }, [id]);

  if (!card) return <div className="flex items-center justify-center h-screen text-white bg-gray-900">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 w-max"
      >
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={card.image ? `http://localhost:5001/uploads/${card.image}` : "/placeholder.png"}
            alt={card.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-orange-500">{card.name}</h1>
          <p className="text-xl font-semibold mb-2">{card.price.toLocaleString()} LKR</p>
          <p className={`font-medium mb-4 ${card.availability === "In Stock" ? "text-green-400" : card.availability === "Out of Stock" ? "text-red-500" : "text-yellow-400"}`}>
            {card.availability}
          </p>
          <h2 className="text-lg font-semibold mb-1">Description:</h2>
          <p className="text-gray-300">{card.description}</p>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default GraphicsCardDetailPage;

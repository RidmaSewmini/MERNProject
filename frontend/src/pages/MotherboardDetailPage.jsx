import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MotherboardDetailPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBoard();
  }, [id]);

  if (!board) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{board.name}</h1>
      <img src={`http://localhost:5001/uploads/${board.image}`} alt={board.name} />
      <p>{board.description}</p>
      <p>LKR {board.price}</p>
      <p>{board.availability}</p>
      <Footer />
    </div>
  );
};

export default MotherboardDetailPage;

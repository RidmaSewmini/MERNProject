import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PeripheralDetailPage = () => {
  const { id } = useParams();
  const [peripheral, setPeripheral] = useState(null);

  useEffect(() => {
    const fetchPeripheral = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setPeripheral(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPeripheral();
  }, [id]);

  if (!peripheral) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{peripheral.name}</h1>
      <img src={`http://localhost:5001/uploads/${peripheral.image}`} alt={peripheral.name} />
      <p>{peripheral.description}</p>
      <p>LKR {peripheral.price}</p>
      <p>{peripheral.availability}</p>
      <Footer />
    </div>
  );
};

export default PeripheralDetailPage;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MonitorDetailPage = () => {
  const { id } = useParams();
  const [monitor, setMonitor] = useState(null);

  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setMonitor(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMonitor();
  }, [id]);

  if (!monitor) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{monitor.name}</h1>
      <img src={`http://localhost:5001/uploads/${monitor.image}`} alt={monitor.name} />
      <p>{monitor.description}</p>
      <p>LKR {monitor.price}</p>
      <p>{monitor.availability}</p>
      <Footer />
    </div>
  );
};

export default MonitorDetailPage;

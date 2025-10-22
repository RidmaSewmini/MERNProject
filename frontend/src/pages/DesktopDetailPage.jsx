import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DesktopDetailPage = () => {
  const { id } = useParams();
  const [desktop, setDesktop] = useState(null);

  useEffect(() => {
    const fetchDesktop = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setDesktop(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDesktop();
  }, [id]);

  if (!desktop) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{desktop.name}</h1>
      <img src={`http://localhost:5001/uploads/${desktop.image}`} alt={desktop.name} />
      <p>{desktop.description}</p>
      <p>LKR {desktop.price}</p>
      <p>{desktop.availability}</p>
      <Footer />
    </div>
  );
};

export default DesktopDetailPage;

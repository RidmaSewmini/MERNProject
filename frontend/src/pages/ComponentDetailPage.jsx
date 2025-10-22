import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ComponentDetailPage = () => {
  const { id } = useParams();
  const [component, setComponent] = useState(null);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setComponent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComponent();
  }, [id]);

  if (!component) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{component.name}</h1>
      <img src={`http://localhost:5001/uploads/${component.image}`} alt={component.name} />
      <p>{component.description}</p>
      <p>LKR {component.price}</p>
      <p>{component.availability}</p>
      <Footer />
    </div>
  );
};

export default ComponentDetailPage;

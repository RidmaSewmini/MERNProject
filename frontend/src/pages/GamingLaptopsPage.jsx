import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import React from "react";

const laptops = [
  {
    id: 1,
    image: "src/Asset/images/laptop1.png",
    title: "ASUS EXPERTBOOK B3 FLIP B3402FVA CORE I5",
    price: "299,000 LKR",
    alt: "ASUS Expertbook",
  },
  {
    id: 2,
    image: "src/Asset/images/laptop2.png",
    title: "MSI Katana 15 B14WFK Intel I7 14650HX RTX 5060",
    price: "599,000 LKR",
    alt: "MSI Katana",
  },
  {
    id: 3,
    image: "src/Asset/images/laptop3.png",
    title: "MSI Stealth A16 Mercedes AMG Ryzen 9 Ai RTX 5070",
    price: "1,059,000 LKR",
    alt: "MSI Stealth",
  },
  {
    id: 4,
    image: "src/Asset/images/laptop4.png",
    title: "ASUS ROG Strix G16 Intel i9 RTX 4070",
    price: "725,000 LKR",
    alt: "ASUS ROG Strix",
  },
  {
    id: 5,
    image: "src/Asset/images/laptop5.png",
    title: "Alienware M16 Intel i9 RTX 4080",
    price: "1,250,000 LKR",
    alt: "Alienware M16",
  },
  {
    id: 6,
    image: "src/Asset/images/laptop6.png",
    title: "Razer Blade 15 Intel i7 RTX 4070",
    price: "1,100,000 LKR",
    alt: "Razer Blade 15",
  },
];

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
  justifyItems: "center",
};

const cardStyle = {
  backgroundColor: "#2a2a2a",
  border: "2px solid #444",
  borderRadius: "10px",
  textAlign: "center",
  padding: "20px",
  width: "90%",
  transition: "transform 0.3s, box-shadow 0.3s",
};

const imgStyle = {
  width: "100%",
  height: "180px",
  objectFit: "contain",
  marginBottom: "15px",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  
};

const categoryStyle = {
  color: "orange",
  margin: "5px 0",
};

const priceStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  margin: "10px 0",
  color: "#ff9800",
};

const stockStyle = {
  backgroundColor: "transparent",
  color: "orange",
  border: "2px solid orange",
  borderRadius: "5px",
  padding: "5px 15px",
  fontWeight: "bold",
  marginTop: "10px",
  display: "inline-block",
};

const GamingLaptops = () => {
  return (
  <div className="relative min-h-screen">
    {/* Background gradient */}
    <div className="absolute inset-0 -z-10 w-full h-full [background:radial-gradient(80%_50%_at_50%_0%,#000_20%,#FFFFFF_80%)]"></div>

    {/* Page content */}
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div style={{ color: "white", fontFamily: "aldrich", padding: "30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", paddingTop: "50px" }}>
          Gaming Laptops
        </h1>
        <div style={containerStyle}>
          {laptops.map((laptop) => (
            <div
              key={laptop.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0px 8px 20px rgba(255, 140, 0, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img src={laptop.image} alt={laptop.alt} style={imgStyle} />
              <div style={titleStyle}>{laptop.title}</div>
              <div style={categoryStyle}>- Laptop -</div>
              <div style={priceStyle}>{laptop.price}</div>
              <div style={stockStyle}>In Stock</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  </div>
    
  );
};

export default GamingLaptops;

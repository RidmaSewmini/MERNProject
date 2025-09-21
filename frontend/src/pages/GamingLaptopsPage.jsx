import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const laptops = [
  {
    id: 1,
    image: "src/Asset/images/laptop1.png",
    title: "ASUS EXPERTBOOK B3 FLIP B3402FVA CORE I5",
    price: "299,000 LKR",
    alt: "ASUS Expertbook",
    brand: "ASUS",
    cpu: "Intel Core i5",
    availability: "In Stock",
    priceValue: 299000
  },
  {
    id: 2,
    image: "src/Asset/images/laptop2.png",
    title: "MSI Katana 15 B14WFK Intel I7 14650HX RTX 5060",
    price: "599,000 LKR",
    alt: "MSI Katana",
    brand: "MSI",
    cpu: "Intel Core i7",
    availability: "In Stock",
    priceValue: 599000
  },
  {
    id: 3,
    image: "src/Asset/images/laptop3.png",
    title: "MSI Stealth A16 Mercedes AMG Ryzen 9 Ai RTX 5070",
    price: "1,059,000 LKR",
    alt: "MSI Stealth",
    brand: "MSI",
    cpu: "AMD Ryzen 9",
    availability: "Pre-Order",
    priceValue: 1059000
  },
  {
    id: 4,
    image: "src/Asset/images/laptop4.png",
    title: "ASUS ROG Strix G16 Intel i9 RTX 4070",
    price: "725,000 LKR",
    alt: "ASUS ROG Strix",
    brand: "ASUS",
    cpu: "Intel Core i9",
    availability: "In Stock",
    priceValue: 725000
  },
  {
    id: 5,
    image: "src/Asset/images/laptop5.png",
    title: "Alienware M16 Intel i9 RTX 4080",
    price: "1,250,000 LKR",
    alt: "Alienware M16",
    brand: "Alienware",
    cpu: "Intel Core i9",
    availability: "Out of Stock",
    priceValue: 1250000
  },
  {
    id: 6,
    image: "src/Asset/images/laptop6.png",
    title: "Razer Blade 15 Intel i7 RTX 4070",
    price: "1,100,000 LKR",
    alt: "Razer Blade 15",
    brand: "Razer",
    cpu: "Intel Core i7",
    availability: "In Stock",
    priceValue: 1100000
  },
  {
    id: 7,
    image: "src/Asset/images/laptop7.png",
    title: "ASUS TUF GAMING F16 FA607NUG Ryzen 7 RTX 4050",
    price: "355,000 LKR",
    alt: "ASUS TUF Gaming",
    brand: "ASUS",
    cpu: "AMD Ryzen 7",
    availability: "Pre-Order",
    priceValue: 355000
  },
  {
    id: 8,
    image: "src/Asset/images/laptop8.png",
    title: "Gigabyte Aorus 15P Intel i7 RTX 3070",
    price: "850,000 LKR",
    alt: "Gigabyte Aorus",
    brand: "Gigabyte",
    cpu: "Intel Core i7",
    availability: "In Stock",
    priceValue: 850000
  },
  {
    id: 9,
    image: "src/Asset/images/laptop9.png",
    title: "Lenovo Legion 5 Pro AMD Ryzen 7 RTX 3070",
    price: "780,000 LKR",
    alt: "Lenovo Legion",
    brand: "Lenovo",
    cpu: "AMD Ryzen 7",
    availability: "In Stock",
    priceValue: 780000
  }
];

const brands = ["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte", "Lenovo"];
const cpuTypes = ["All", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 7", "AMD Ryzen 9"];
const availabilityOptions = ["All", "In Stock", "Out of Stock", "Pre-Order"];

const GamingLaptops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1643000]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCpu, setSelectedCpu] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("Price: Low to High");

  const filteredLaptops = laptops.filter(laptop => {
    const matchesSearch = laptop.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = laptop.priceValue >= priceRange[0] && laptop.priceValue <= priceRange[1];
    const matchesBrand = selectedBrand === "All" || laptop.brand === selectedBrand;
    const matchesCpu = selectedCpu === "All" || laptop.cpu.includes(selectedCpu);
    const matchesAvailability = selectedAvailability === "All" || laptop.availability === selectedAvailability;
    
    return matchesSearch && matchesPrice && matchesBrand && matchesCpu && matchesAvailability;
  });

  const sortedLaptops = [...filteredLaptops].sort((a, b) => {
    switch(sortOption) {
      case "Price: Low to High":
        return a.priceValue - b.priceValue;
      case "Price: High to Low":
        return b.priceValue - a.priceValue;
      case "Name: A to Z":
        return a.title.localeCompare(b.title);
      case "Name: Z to A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const getAvailabilityStyle = (availability) => {
    switch(availability) {
      case "In Stock": return { backgroundColor: "rgba(0, 200, 0, 0.2)", color: "#00ff00", border: "1px solid #00ff00" };
      case "Out of Stock": return { backgroundColor: "rgba(255, 0, 0, 0.2)", color: "#ff4444", border: "1px solid #ff4444" };
      case "Pre-Order": return { backgroundColor: "rgba(255, 165, 0, 0.2)", color: "orange", border: "1px solid orange" };
      default: return { backgroundColor: "transparent", color: "white", border: "1px solid white" };
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#141313", color: "white", fontFamily: "aldrich" }}>
      <Navbar />
      
      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", paddingTop: "50px", fontSize: "2.5rem", fontWeight: "bold", color: "#ff9800" }}>GAMING LAPTOPS</h1>
        
        {/* Search and Filter Bar */}
        <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", flexGrow: 1, maxWidth: "500px" }}>
              <input
                type="text"
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px 12px 40px",
                  borderRadius: "25px",
                  border: "2px solid #444",
                  backgroundColor: "#2a2a2a",
                  color: "white",
                  fontSize: "16px"
                }}
              />
              <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>
                🔍
              </span>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "12px 20px",
                borderRadius: "25px",
                border: "2px solid #ff9800",
                backgroundColor: showFilters ? "#ff9800" : "transparent",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
            </button>
          </div>
          
          {/* Filters Section */}
          {showFilters && (
            <div style={{ 
              backgroundColor: "#2a2a2a", 
              padding: "20px", 
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>PRICE RANGE: {priceRange[0].toLocaleString()} LKR - {priceRange[1].toLocaleString()} LKR</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span>0 LKR</span>
                  <input
                    type="range"
                    min="0"
                    max="1643000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    style={{ flexGrow: 1, height: "5px", borderRadius: "5px", background: "#ff9800" }}
                  />
                  <span>1,643,000 LKR</span>
                </div>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>AVAILABILITY</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {availabilityOptions.map(option => (
                      <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="availability"
                          value={option}
                          checked={selectedAvailability === option}
                          onChange={() => setSelectedAvailability(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>LAPTOP BRAND</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {brands.map(brand => (
                      <label key={brand} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>LAPTOP CPU</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {cpuTypes.map(cpu => (
                      <label key={cpu} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="cpu"
                          value={cpu}
                          checked={selectedCpu === cpu}
                          onChange={() => setSelectedCpu(cpu)}
                        />
                        {cpu}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setPriceRange([0, 1643000]);
                  setSelectedBrand("All");
                  setSelectedCpu("All");
                  setSelectedAvailability("All");
                }}
                style={{
                  padding: "10px 15px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#ff9800",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  alignSelf: "flex-start"
                }}
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>{sortedLaptops.length} Laptops Found</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Sort by:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "5px", 
                border: "1px solid #444", 
                backgroundColor: "#2a2a2a", 
                color: "white" 
              }}
            >
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A to Z</option>
              <option>Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {/* Laptops Grid */}
        {sortedLaptops.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
            justifyItems: "center"
          }}>
            {sortedLaptops.map((laptop) => (
              <div
                key={laptop.id}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  borderRadius: "10px",
                  textAlign: "center",
                  padding: "20px",
                  width: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0px 8px 20px rgba(255, 140, 0, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img 
                  src={laptop.image} 
                  alt={laptop.alt} 
                  style={{ 
                    width: "100%", 
                    height: "180px", 
                    objectFit: "contain", 
                    marginBottom: "15px",
                    borderRadius: "5px"
                  }} 
                />
                <div style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold", 
                  marginBottom: "10px",
                  flexGrow: 1
                }}>
                  {laptop.title}
                </div>
                <div style={{ color: "orange", margin: "5px 0" }}>- Laptop -</div>
                <div style={{ 
                  fontSize: "22px", 
                  fontWeight: "bold", 
                  margin: "10px 0", 
                  color: "#ff9800" 
                }}>
                  {laptop.price}
                </div>
                <div style={{ 
                  ...getAvailabilityStyle(laptop.availability),
                  borderRadius: "5px",
                  padding: "5px 15px",
                  fontWeight: "bold",
                  marginTop: "10px",
                  display: "inline-block",
                  alignSelf: "center"
                }}>
                  {laptop.availability}
                </div>
                <button
                  style={{
                    marginTop: "15px",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#ff9800",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            <h2>No laptops found matching your criteria</h2>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
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
import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

// Sample Premium Components data
const premiumComponents = [
  {
    id: 1,
    image: "src/Asset/images/motherboard1.png",
    title: "ASUS ROG MAXIMUS Z790 HERO",
    price: "189,000 LKR",
    alt: "ASUS ROG Maximus",
    category: "Motherboard",
    brand: "ASUS",
    availability: "In Stock",
    priceValue: 189000
  },
  {
    id: 2,
    image: "src/Asset/images/gpu1.png",
    title: "NVIDIA RTX 4090 Founders Edition",
    price: "1,200,000 LKR",
    alt: "NVIDIA RTX 4090",
    category: "Graphics Card",
    brand: "NVIDIA",
    availability: "Pre-Order",
    priceValue: 1200000
  },
  {
    id: 3,
    image: "src/Asset/images/cpu1.png",
    title: "Intel Core i9-14900K",
    price: "210,000 LKR",
    alt: "Intel i9 CPU",
    category: "CPU",
    brand: "Intel",
    availability: "In Stock",
    priceValue: 210000
  },
  {
    id: 4,
    image: "src/Asset/images/ram1.png",
    title: "G.SKILL Trident Z5 RGB 32GB DDR5",
    price: "75,000 LKR",
    alt: "G.Skill RAM",
    category: "RAM",
    brand: "G.SKILL",
    availability: "Out of Stock",
    priceValue: 75000
  },
  {
    id: 5,
    image: "src/Asset/images/ssd1.png",
    title: "Samsung 990 PRO 2TB NVMe SSD",
    price: "60,000 LKR",
    alt: "Samsung NVMe SSD",
    category: "Storage",
    brand: "Samsung",
    availability: "In Stock",
    priceValue: 60000
  },
  {
    id: 6,
    image: "src/Asset/images/psu1.png",
    title: "Corsair AX1600i PSU",
    price: "80,000 LKR",
    alt: "Corsair PSU",
    category: "PSU",
    brand: "Corsair",
    availability: "In Stock",
    priceValue: 80000
  }
];

const brands = ["All", "ASUS", "NVIDIA", "Intel", "G.SKILL", "Samsung", "Corsair"];
const categories = ["All", "Motherboard", "Graphics Card", "CPU", "RAM", "Storage", "PSU"];
const availabilityOptions = ["All", "In Stock", "Out of Stock", "Pre-Order"];

const PremiumComponents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("Price: Low to High");

  const filteredComponents = premiumComponents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = item.priceValue >= priceRange[0] && item.priceValue <= priceRange[1];
    const matchesBrand = selectedBrand === "All" || item.brand === selectedBrand;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvailability = selectedAvailability === "All" || item.availability === selectedAvailability;

    return matchesSearch && matchesPrice && matchesBrand && matchesCategory && matchesAvailability;
  });

  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch(sortOption) {
      case "Price: Low to High": return a.priceValue - b.priceValue;
      case "Price: High to Low": return b.priceValue - a.priceValue;
      case "Name: A to Z": return a.title.localeCompare(b.title);
      case "Name: Z to A": return b.title.localeCompare(a.title);
      default: return 0;
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
    <div className="flex flex-col min-h-screen font-titillium" style={{ backgroundColor: "#141313", color: "white" }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", paddingTop: "50px", fontSize: "2.5rem", fontWeight: "bold", color: "#ff9800" }}>
          PREMIUM COMPONENTS
        </h1>

        {/* Search and Filter Bar */}
        <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", flexGrow: 1, maxWidth: "500px" }}>
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "12px 15px 12px 40px", borderRadius: "25px", border: "2px solid #444", backgroundColor: "#2a2a2a", color: "white", fontSize: "16px" }}
              />
              <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>🔍</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ padding: "12px 20px", borderRadius: "25px", border: "2px solid #ff9800", backgroundColor: showFilters ? "#ff9800" : "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}
            >
              {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
            </button>
          </div>

          {showFilters && (
            <div style={{ backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>PRICE RANGE: {priceRange[0].toLocaleString()} LKR - {priceRange[1].toLocaleString()} LKR</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span>0 LKR</span>
                  <input
                    type="range"
                    min="0"
                    max="1500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    style={{ flexGrow: 1, height: "5px", borderRadius: "5px", background: "#ff9800" }}
                  />
                  <span>1,500,000 LKR</span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>AVAILABILITY</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {availabilityOptions.map(option => (
                      <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="availability" value={option} checked={selectedAvailability === option} onChange={() => setSelectedAvailability(option)} />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>BRAND</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {brands.map(brand => (
                      <label key={brand} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="brand" value={brand} checked={selectedBrand === brand} onChange={() => setSelectedBrand(brand)} />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>CATEGORY</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {categories.map(cat => (
                      <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="category" value={cat} checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 1500000]);
                  setSelectedBrand("All");
                  setSelectedCategory("All");
                  setSelectedAvailability("All");
                }}
                style={{ padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white", cursor: "pointer", fontWeight: "bold", alignSelf: "flex-start" }}
              >
                RESET FILTERS
              </button>

            </div>
          )}
        </div>

        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>{sortedComponents.length} Components Found</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white" }}
            >
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A to Z</option>
              <option>Name: Z to A</option>
            </select>
          </div>
        </div>

        {sortedComponents.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", justifyItems: "center" }}>
            {sortedComponents.map((item) => (
              <div
                key={item.id}
                style={{ backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "10px", textAlign: "center", padding: "20px", width: "100%", transition: "transform 0.3s, box-shadow 0.3s", display: "flex", flexDirection: "column", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0px 8px 20px rgba(255, 140, 0, 0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <img src={item.image} alt={item.alt} style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "15px", borderRadius: "5px" }} />
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", flexGrow: 1 }}>{item.title}</div>
                <div style={{ color: "orange", margin: "5px 0" }}>- {item.category} -</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", margin: "10px 0", color: "#ff9800" }}>{item.price}</div>
                <div style={{ ...getAvailabilityStyle(item.availability), borderRadius: "5px", padding: "5px 15px", fontWeight: "bold", marginTop: "10px", display: "inline-block", alignSelf: "center" }}>{item.availability}</div>
                <button style={{ marginTop: "15px", padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white", cursor: "pointer", fontWeight: "bold" }}>ADD TO CART</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            <h2>No premium components found matching your criteria</h2>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default PremiumComponents;

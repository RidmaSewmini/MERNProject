import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const monitors = [
  {
    id: 1,
    image: "src/Asset/images/monitor1.png",
    title: "ASUS ROG Swift PG32UQX",
    price: "450,000 LKR",
    alt: "ASUS ROG Swift 32 inch",
    brand: "ASUS",
    size: "32 inch",
    refreshRate: "144Hz",
    resolution: "4K",
    availability: "In Stock",
    priceValue: 450000
  },
  {
    id: 2,
    image: "src/Asset/images/monitor2.png",
    title: "LG UltraGear 27GN950",
    price: "320,000 LKR",
    alt: "LG UltraGear 27 inch",
    brand: "LG",
    size: "27 inch",
    refreshRate: "144Hz",
    resolution: "4K",
    availability: "Pre-Order",
    priceValue: 320000
  },
  {
    id: 3,
    image: "src/Asset/images/monitor3.png",
    title: "Samsung Odyssey G7",
    price: "280,000 LKR",
    alt: "Samsung Odyssey 27 inch",
    brand: "Samsung",
    size: "27 inch",
    refreshRate: "240Hz",
    resolution: "QHD",
    availability: "In Stock",
    priceValue: 280000
  },
  {
    id: 4,
    image: "src/Asset/images/monitor4.png",
    title: "Acer Predator X34",
    price: "350,000 LKR",
    alt: "Acer Predator 34 inch",
    brand: "Acer",
    size: "34 inch",
    refreshRate: "144Hz",
    resolution: "UWQHD",
    availability: "Out of Stock",
    priceValue: 350000
  }
];

const brands = ["All", "ASUS", "LG", "Samsung", "Acer"];
const sizes = ["All", "24 inch", "27 inch", "32 inch", "34 inch"];
const refreshRates = ["All", "60Hz", "120Hz", "144Hz", "240Hz"];
const availabilityOptions = ["All", "In Stock", "Out of Stock", "Pre-Order"];

const GamingMonitors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedRefreshRate, setSelectedRefreshRate] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("Price: Low to High");

  const filteredMonitors = monitors.filter(monitor => {
    const matchesSearch = monitor.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = monitor.priceValue >= priceRange[0] && monitor.priceValue <= priceRange[1];
    const matchesBrand = selectedBrand === "All" || monitor.brand === selectedBrand;
    const matchesSize = selectedSize === "All" || monitor.size === selectedSize;
    const matchesRefreshRate = selectedRefreshRate === "All" || monitor.refreshRate === selectedRefreshRate;
    const matchesAvailability = selectedAvailability === "All" || monitor.availability === selectedAvailability;

    return matchesSearch && matchesPrice && matchesBrand && matchesSize && matchesRefreshRate && matchesAvailability;
  });

  const sortedMonitors = [...filteredMonitors].sort((a, b) => {
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
        <h1 style={{ textAlign: "center", marginBottom: "30px", paddingTop: "50px", fontSize: "2.5rem", fontWeight: "bold", color: "#ff9800" }}>
          GAMING MONITORS
        </h1>

        {/* Search and Filter Bar */}
        <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", flexGrow: 1, maxWidth: "500px" }}>
              <input
                type="text"
                placeholder="Search monitors..."
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
              <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>🔍</span>
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

          {showFilters && (
            <div style={{ backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>PRICE RANGE: {priceRange[0].toLocaleString()} LKR - {priceRange[1].toLocaleString()} LKR</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span>0 LKR</span>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    style={{ flexGrow: 1, height: "5px", borderRadius: "5px", background: "#ff9800" }}
                  />
                  <span>500,000 LKR</span>
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
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>BRAND</h3>
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
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>SIZE</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {sizes.map(size => (
                      <label key={size} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>REFRESH RATE</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {refreshRates.map(rate => (
                      <label key={rate} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="refreshRate"
                          value={rate}
                          checked={selectedRefreshRate === rate}
                          onChange={() => setSelectedRefreshRate(rate)}
                        />
                        {rate}
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 500000]);
                  setSelectedBrand("All");
                  setSelectedSize("All");
                  setSelectedRefreshRate("All");
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
          <p>{sortedMonitors.length} Monitors Found</p>
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

        {sortedMonitors.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", justifyItems: "center" }}>
            {sortedMonitors.map((monitor) => (
              <div
                key={monitor.id}
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
                  src={monitor.image} 
                  alt={monitor.alt} 
                  style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "15px", borderRadius: "5px" }} 
                />
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", flexGrow: 1 }}>{monitor.title}</div>
                <div style={{ color: "orange", margin: "5px 0" }}>- {monitor.size} / {monitor.refreshRate} / {monitor.resolution} -</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", margin: "10px 0", color: "#ff9800" }}>{monitor.price}</div>
                <div style={{ ...getAvailabilityStyle(monitor.availability), borderRadius: "5px", padding: "5px 15px", fontWeight: "bold", marginTop: "10px", display: "inline-block", alignSelf: "center" }}>
                  {monitor.availability}
                </div>
                <button style={{ marginTop: "15px", padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#ff9800", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            <h2>No monitors found matching your criteria</h2>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GamingMonitors;

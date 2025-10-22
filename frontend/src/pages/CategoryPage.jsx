// src/pages/CategoryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:5001";

const matchesCategory = (prodCategory, slug) => {
  if (!prodCategory) return false;
  const p = prodCategory.toLowerCase().trim();
  const s = slug.toLowerCase().trim();
  if (p === s || p.includes(s) || s.includes(p)) return true;
  if (p.endsWith("s") && p.slice(0, -1) === s) return true;
  if (s.endsWith("s") && s.slice(0, -1) === p) return true;
  return false;
};

const getAvailabilityStyle = (availability) => {
  switch (availability) {
    case "In Stock":
      return { backgroundColor: "rgba(0, 200, 0, 0.2)", color: "#00ff00", border: "1px solid #00ff00" };
    case "Out of Stock":
      return { backgroundColor: "rgba(255, 0, 0, 0.2)", color: "#ff4444", border: "1px solid #ff4444" };
    case "Pre-Order":
      return { backgroundColor: "rgba(255, 165, 0, 0.2)", color: "orange", border: "1px solid orange" };
    default:
      return { backgroundColor: "transparent", color: "white", border: "1px solid white" };
  }
};

const CategoryPage = ({ title, categorySlug, brands = ["All"], availabilityOptions = ["All"] }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // NEW STATES
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products`);
        const filtered = res.data.filter((p) => matchesCategory(p.category, categorySlug));
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [categorySlug]);

  // ✅ Apply filters
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
      const matchesAvailability = selectedAvailability === "All" || product.availability === selectedAvailability;

      const matchesMinPrice = minPrice === "" || product.price >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === "" || product.price <= parseFloat(maxPrice);

      return matchesSearch && matchesBrand && matchesAvailability && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLowHigh":
          return a.price - b.price;
        case "priceHighLow":
          return b.price - a.price;
        case "nameAZ":
          return a.name.localeCompare(b.name);
        case "nameZA":
          return b.name.localeCompare(a.name);
        case "availability":
          return a.availability.localeCompare(b.availability);
        default:
          return 0; // no sorting
      }
    });

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", width: "100%", flex: 1 }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            paddingTop: "50px",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#ff9800",
          }}
        >
          {title.toUpperCase()}
        </h1>

        {/* Search & Filters */}
        <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", justifyContent: "center" }}>
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "300px",
                padding: "12px 15px",
                borderRadius: "25px",
                border: "2px solid #444",
                backgroundColor: "#2a2a2a",
                color: "white",
                fontSize: "16px",
              }}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "12px 20px",
                borderRadius: "25px",
                border: "2px solid #ff9800",
                backgroundColor: showFilters ? "#ff9800" : "transparent",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
            </button>
          </div>

          {showFilters && (
            <div
              style={{
                backgroundColor: "#2a2a2a",
                padding: "20px",
                borderRadius: "10px",
                display: "flex",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              {/* Brand */}
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>BRAND</h3>
                {brands.map((brand) => (
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

              {/* Availability */}
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>AVAILABILITY</h3>
                {availabilityOptions.map((option) => (
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

              {/* Price Range */}
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>PRICE RANGE (LKR)</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      width: "100px",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #444",
                      backgroundColor: "#1a1a1a",
                      color: "white",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      width: "100px",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #444",
                      backgroundColor: "#1a1a1a",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 style={{ marginBottom: "10px", color: "#ff9800" }}>SORT BY</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #444",
                    backgroundColor: "#1a1a1a",
                    color: "white",
                  }}
                >
                  <option value="default">Default</option>
                  <option value="priceLowHigh">Price: Low → High</option>
                  <option value="priceHighLow">Price: High → Low</option>
                  <option value="nameAZ">Name: A → Z</option>
                  <option value="nameZA">Name: Z → A</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSelectedBrand("All");
                  setSelectedAvailability("All");
                  setMinPrice("");
                  setMaxPrice("");
                  setSortOption("default");
                }}
                style={{
                  padding: "10px 15px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#ff9800",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  alignSelf: "flex-end",
                }}
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "10px",
                textAlign: "center",
                padding: "20px",
                transition: "transform 0.3s, box-shadow 0.3s",
                display: "flex",
                flexDirection: "column",
                height: "100%",
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
                src={product.image ? `${API_BASE}/uploads/${product.image}` : "/placeholder.png"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  marginBottom: "15px",
                  borderRadius: "5px",
                }}
              />
              <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", flexGrow: 1 }}>
                {product.name}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", color: "#ff9800" }}>
                {product.price.toLocaleString()} LKR
              </div>
              <div
                style={{
                  ...getAvailabilityStyle(product.availability),
                  borderRadius: "5px",
                  padding: "5px 15px",
                  fontWeight: "bold",
                  marginTop: "10px",
                  display: "inline-block",
                  alignSelf: "center",
                }}
              >
                {product.availability}
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
                  fontWeight: "bold",
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                VIEW DETAILS
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;

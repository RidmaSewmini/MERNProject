// src/pages/GamingLaptopsPage.jsx
import CategoryPage from "./CategoryPage";

const GamingLaptopsPage = () => (
  <CategoryPage
    title="Gaming Laptops"
    categorySlug="laptop"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default GamingLaptopsPage;

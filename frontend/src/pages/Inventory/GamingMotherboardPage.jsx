import CategoryPage from "./CategoryPage";

const GamingMotherboardPage = () => {
  return (
  <CategoryPage
    title="Gaming Motherboard"
    categorySlug="Motherboard"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
  );
};

export default GamingMotherboardPage;

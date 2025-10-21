import CategoryPage from "./CategoryPage";

const GamingPeripheralPage = () => (
  <CategoryPage
    title="Gaming Peripheral"
    categorySlug="Peripheral"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default GamingPeripheralPage;

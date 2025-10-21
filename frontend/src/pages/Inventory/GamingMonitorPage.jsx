import CategoryPage from "./CategoryPage";

const GamingMonitorPage = () => (
  <CategoryPage
    title="Gaming Monitor"
    categorySlug="Monitor"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default GamingMonitorPage;

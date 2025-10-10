import CategoryPage from "./CategoryPage";

const PremiumComponentPage = () => (
  <CategoryPage
    title="Premium Gaming Component"
    categorySlug="Component"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default PremiumComponentPage;

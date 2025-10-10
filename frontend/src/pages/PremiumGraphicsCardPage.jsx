import CategoryPage from "./CategoryPage";

const PremiumGraphicsCardPage = () => (
  <CategoryPage
    title="Premium  Graphics Card"
    categorySlug="Graphics Card"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default PremiumGraphicsCardPage;

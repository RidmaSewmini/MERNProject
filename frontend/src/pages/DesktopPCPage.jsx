import CategoryPage from "./CategoryPage";

const DesktopPCPage = () => (
  <CategoryPage
    title="Desktop PC"
    categorySlug="Desktop"
    brands={["All", "ASUS", "MSI", "Alienware", "Razer", "Gigabyte"]}
    availabilityOptions={["All", "In Stock", "Out of Stock", "Pre-Order"]}
  />
);

export default DesktopPCPage;

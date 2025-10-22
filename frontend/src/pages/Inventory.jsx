import { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "Laptop",
    availability: "In Stock",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/products/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5001/api/products", formData);
      }
      setForm({
        name: "",
        price: "",
        quantity: "",
        description: "",
        category: "Laptop",
        availability: "In Stock",
        image: null,
      });
      setEditingId(null);
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
      availability: product.availability,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Inventory</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="border p-2 rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Laptop</option>
            <option>Motherboard</option>
            <option>Graphics Card</option>
            <option>Desktop</option>
            <option>Peripheral</option>
            <option>Monitor</option>
            <option>Component</option>
          </select>
          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>Pre-Order</option>
          </select>
          <input type="file" name="image" onChange={handleChange} className="border p-2 rounded" />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full mt-2"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products Table */}
      <table className="w-full table-auto border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2">{p.availability}</td>
              <td className="border p-2">
                {p.image && (
                  <img
                    src={`http://localhost:5001/uploads/${p.image}`}
                    alt={p.name}
                    className="w-16 h-16 object-cover"
                  />
                )}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminAllBidProducts = ({ API_BASE }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [commissionInput, setCommissionInput] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bid-products/admin/products`, { withCredentials: true });
      setAllProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setSelectedFiles([]);
    const initialPreviews = (product.images || []).map(img => typeof img === "string" ? img : img?.url).filter(Boolean);
    setPreviewImages(initialPreviews);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...filePreviews]);
  };

  const handleEdit = async () => {
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      selectedFiles.forEach(file => formData.append("images", file));

      await axios.patch(`${API_BASE}/bid-products/admin/edit/${editingProduct._id}`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });

      toast.success("Product updated successfully!");
      setEditingProduct(null);
      setSelectedFiles([]);
      setPreviewImages([]);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/bid-products/admin/products`, {
        withCredentials: true,
        data: { productIds: [productId] },
      });
      toast.success("Product deleted successfully");
      setAllProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleVerify = async (productId) => {
    const commissionValue = parseFloat(commissionInput[productId]);
    if (isNaN(commissionValue) || commissionValue < 0) {
      toast.error("Enter a valid commission");
      return;
    }
    try {
      await axios.patch(`${API_BASE}/bid-products/admin/verify/${productId}`, { commission: commissionValue }, { withCredentials: true });
      toast.success("Product verified successfully");
      fetchProducts();
    } catch (err) {
      console.error("Verify failed:", err);
      toast.error("Failed to verify product");
    }
  };

  const handleCommissionChange = (productId, value) => {
    setCommissionInput(prev => ({ ...prev, [productId]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">All Bid Products</h2>
      {editingProduct && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Editing: {editingProduct.title}</h3>
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" className="border p-1 mb-2 w-full" />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" className="border p-1 mb-2 w-full" />
          <input type="file" multiple onChange={handleFileChange} className="mb-2" />
          <div className="flex gap-2 mb-2 overflow-x-auto">
            {previewImages.map((img, i) => (
              <img key={i} src={img instanceof File ? URL.createObjectURL(img) : img} alt="Preview" className="h-20 w-20 object-cover rounded" />
            ))}
          </div>
          <div className="space-x-2">
            <button onClick={handleEdit} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
            <button onClick={() => { setEditingProduct(null); setSelectedFiles([]); setPreviewImages([]); }} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {allProducts.map((p) => (
          <li key={p._id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium">{p.title}</span>
              <span className="text-xs text-gray-500">
                {p.isVerified ? <span className="text-green-600 font-semibold">Verified</span> : <span className="text-red-600 font-semibold">Unverified</span>}
                {p.commission && <span> | Commission: {p.commission}%</span>}
              </span>
            </div>
            <div className="space-x-2 flex items-center">
              <button onClick={() => startEditing(p)} className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              {!p.isVerified && (
                <>
                  <input type="number" placeholder="Commission %" value={commissionInput[p._id] || ""} onChange={(e) => handleCommissionChange(p._id, e.target.value)} className="border p-1 w-20 text-sm" />
                  <button onClick={() => handleVerify(p._id)} className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Verify</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAllBidProducts;

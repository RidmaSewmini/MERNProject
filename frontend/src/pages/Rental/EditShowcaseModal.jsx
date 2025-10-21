import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const EditShowcaseModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    image: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        pricePerDay: item.pricePerDay || "",
        image: item.image || "",
        category: item.category || "",
      });
      setImagePreview(item.image || null);
    }
  }, [item]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Check if response has the expected data
      if (!response.data || !response.data.imageUrl) {
        throw new Error('Invalid response from server');
      }
      
      // Convert relative URL to full URL
      const imageUrl = response.data.imageUrl.startsWith('http') 
        ? response.data.imageUrl 
        : `http://localhost:5001${response.data.imageUrl}`;
      return imageUrl;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.pricePerDay || !formData.category) {
      toast.error("Please fill all required fields!");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image;

      // If file is selected, upload it first
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      // Create the updated item data
      const updatedData = {
        ...formData,
        image: imageUrl,
        pricePerDay: Number(formData.pricePerDay)
      };

      onSave(updatedData);
    } catch (error) {
      toast.error(error.message || "Failed to update item");
    } finally {
      setUploading(false);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Edit Rental Item</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Price (LKR/day) *</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="Enter daily price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Update Image
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a new image file (PNG, JPG, JPEG, AVIF) - Max 5MB
              </p>
            </div>

            {/* OR Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Image URL Input */}
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide an image URL instead
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="computing">Computing</option>
              <option value="networking">Networking</option>
              <option value="storage">Storage</option>
              <option value="power">Power</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShowcaseModal;

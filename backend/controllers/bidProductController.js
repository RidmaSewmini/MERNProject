import mongoose from "mongoose";
import BidProduct from "../models/bidProductModel.js";
import Bidding from "../models/biddingModel.js";
import cloudinary from "cloudinary";

// Create Product
export const createBidProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      model,
      specifications,
      condition,
      startingBid,
      buyNowPrice,
      minIncrement,
      biddingEndTime,
    } = req.body;

    if (!title || !description || !category || !brand || !model || !startingBid || !biddingEndTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const userId = req.user._id;

    let imageFiles = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) =>
          cloudinary.v2.uploader.upload(file.path, {
            folder: "Bidding/BidProducts",
            resource_type: "image",
            use_filename: true,
            unique_filename: false,
          })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        imageFiles = uploadedImages.map((img, index) => ({
          fileName: req.files[index].originalname,
          filePath: img.secure_url,
          fileType: img.format,
          public_id: img.public_id,
        }));
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    const bidProduct = new BidProduct({
      user: userId,
      title,
      description,
      category,
      brand,
      model,
      specifications,
      condition,
      startingBid,
      buyNowPrice,
      minIncrement,
      biddingEndTime,
      images: imageFiles,
    });

    await bidProduct.save();

    res.status(201).json({
      success: true,
      message: "Bid Product created successfully",
      product: bidProduct,
    });
  } catch (error) {
    console.error("Error in create Bid Product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await BidProduct.find({})
      .sort("-createdAt")
      .populate("user", "name email");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Product by ID (with bids)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await BidProduct.findById(id).populate("user", "name email");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const bids = await Bidding.find({ product: id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.price)) : null;

    res.status(200).json({
      ...product.toObject(),
      bids,
      currentBid: highestBid || product.startingBid,
      totalBids: bids.length,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Products of Logged-in User
export const getAllProductsOfUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await BidProduct.find({ user: userId })
      .sort("-createdAt")
      .populate("user", "name email");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching user's products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Won Products
export const getWonProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const wonProducts = await BidProduct.find({ soldTo: userId })
      .sort("-createdAt")
      .populate("user", "name email");

    res.status(200).json(wonProducts);
  } catch (error) {
    console.error("Error fetching won products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await BidProduct.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const updates = req.body;

    let imageFiles = [];
    if (req.files && req.files.length > 0) {
      try {
        // Remove old images from Cloudinary if they exist
        if (product.images && product.images.length > 0) {
          for (const img of product.images) {
            if (img.public_id) {
              await cloudinary.v2.uploader.destroy(img.public_id);
            }
          }
        }

        // Upload new images
        const uploadPromises = req.files.map((file) =>
          cloudinary.v2.uploader.upload(file.path, {
            folder: "Bidding/BidProducts",
            resource_type: "image",
            use_filename: true,
            unique_filename: false,
          })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        imageFiles = uploadedImages.map((img, index) => ({
          fileName: req.files[index].originalname,
          filePath: img.secure_url,
          fileType: img.format,
          public_id: img.public_id,
        }));
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    const updatedProduct = await BidProduct.findByIdAndUpdate(
      id,
      {
        ...updates,
        images: imageFiles.length > 0 ? imageFiles : product.images,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await BidProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only the owner can delete
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(img.public_id);
          } catch (err) {
            console.error(`Error deleting Cloudinary image ${img.public_id}:`, err);
          }
        }
      }
    }

    // Delete the product from DB
    await product.deleteOne();

    res.status(200).json({ message: "Product and images deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Sold Products
export const getAllSoldProducts = async (req, res) => {
  try {
    const soldProducts = await BidProduct.find({ isSoldOut: true })
      .sort("-createdAt")
      .populate("user", "name email");

    res.status(200).json(soldProducts);
  } catch (error) {
    console.error("Error fetching sold products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify & Add Commission (Admin Only)
export const verifyAndAddCommissionByAdmin = async (req, res) => {
  try {
    const { commission } = req.body;
    const { id } = req.params;

    const product = await BidProduct.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Convert commission to number safely
    const commissionNum = parseFloat(commission.toString().replace("%", ""));
    if (isNaN(commissionNum)) {
      return res.status(400).json({ success: false, message: "Commission must be a valid number" });
    }

    product.isVerified = true;
    product.commission = commissionNum;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product verified successfully",
      product,
    });
  } catch (error) {
    console.error("Error verifying product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify Product Only (Admin)
export const verifyProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await BidProduct.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isVerified = true;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product verified successfully",
      product,
    });
  } catch (error) {
    console.error("Error verifying product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Products (Admin)
export const getAllProductsByAdmin = async (req, res) => {
  try {
    const products = await BidProduct.find({})
      .sort("-createdAt")
      .populate("user", "name email");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products (Admin):", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Product (Admin with Image Upload)
export const updateProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await BidProduct.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          if (img.public_id) {
            await cloudinary.v2.uploader.destroy(img.public_id);
          }
        }
      }

      // Upload new images
      const uploadPromises = req.files.map((file) =>
        cloudinary.v2.uploader.upload(file.path, {
          folder: "Bidding/BidProducts",
          resource_type: "image",
          use_filename: true,
          unique_filename: false,
        })
      );

      const uploadedImages = await Promise.all(uploadPromises);

      newImages = uploadedImages.map((img, index) => ({
        fileName: req.files[index].name || req.files[index].originalname,
        filePath: img.secure_url,
        fileType: img.format,
        public_id: img.public_id,
      }));

      product.images = newImages;
    }

    // Update other fields
    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully by admin",
      product,
    });
  } catch (error) {
    console.error("Error updating product by admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Products (Admin)
export const deleteProductsByAdmin = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: "No product IDs provided" });
    }

    // Fetch the products to delete
    const products = await BidProduct.find({ _id: { $in: productIds } });

    // Delete images from Cloudinary
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          if (img.public_id) {
            try {
              await cloudinary.v2.uploader.destroy(img.public_id);
            } catch (err) {
              console.error(`Error deleting Cloudinary image ${img.public_id}:`, err);
            }
          }
        }
      }
    }

    // Delete the products from DB
    const deleted = await BidProduct.deleteMany({ _id: { $in: productIds } });

    res.status(200).json({
      success: true,
      message: `${deleted.deletedCount} products and their images deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting products (Admin):", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

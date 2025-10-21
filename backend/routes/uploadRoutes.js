import express from "express";
import { upload } from "../utils/fileUpload.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload endpoint
router.post("/", (req, res) => {
  console.log("Upload endpoint hit");
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "File upload error", error: err.message });
    }
    
    try {
      console.log("Request file after multer:", req.file);
      
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Return the file path/URL
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log("File uploaded successfully:", imageUrl);
      
      res.json({
        message: "File uploaded successfully",
        imageUrl: imageUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Upload routes are working!" });
});

export default router;

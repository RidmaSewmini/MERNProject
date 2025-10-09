// utils/fileUpload.js
import multer from "multer";

// ===== Multer Disk Storage =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // save in /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueName =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ===== File Filter =====
function fileFilter(req, file, cb) {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, JPEG allowed."), false);
  }
}


// ===== Export Multer Middleware =====
export const upload = multer({ storage, fileFilter });

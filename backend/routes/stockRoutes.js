import express from "express";
import {
  getAllStock,
  addStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getAllStock);
router.post("/", addStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;

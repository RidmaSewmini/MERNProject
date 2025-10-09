import express from "express";
import {
  createRentalForm,
  getAllRentalForms,
  getRentalFormById,
  updateRentalForm,
  deleteRentalForm
} from "../controllers/RentalForm.controller.js";

const router = express.Router();

router.post("/", createRentalForm);
router.get("/", getAllRentalForms);
router.get("/:id", getRentalFormById);
router.put("/:id", updateRentalForm);
router.delete("/:id", deleteRentalForm);

export default router;

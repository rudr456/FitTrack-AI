import express from "express";

import {
  addNutrition,
  getNutrition,
  deleteNutrition,
  getDailyNutritionSummary,
} from "../controllers/nutritionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add food entry
router.post("/", protect, addNutrition);

// Get all food entries
router.get("/", protect, getNutrition);

// Get daily nutrition summary
router.get("/summary", protect, getDailyNutritionSummary);

// Delete food entry
router.delete("/:id", protect, deleteNutrition);

export default router;

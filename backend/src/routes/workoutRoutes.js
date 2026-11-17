import express from "express";

import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create workout
router.post("/", protect, createWorkout);

// Get all workouts
router.get("/", protect, getWorkouts);

// Get single workout
router.get("/:id", protect, getWorkoutById);

// Update workout
router.put("/:id", protect, updateWorkout);

// Delete workout
router.delete("/:id", protect, deleteWorkout);

export default router;

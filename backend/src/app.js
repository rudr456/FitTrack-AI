import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Authentication API
app.use("/api/auth", authRoutes);

// Workout API
app.use("/api/workouts", workoutRoutes);

// Nutrition API
app.use("/api/nutrition", nutritionRoutes);

// AI Coach API
app.use("/api/ai", aiRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FitTrack AI Backend!",
  });
});

export default app;

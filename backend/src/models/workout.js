import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["chest", "back", "legs", "shoulders", "arms", "abs", "cardio"],
      required: true,
    },

    sets: {
      type: Number,
      required: true,
      min: 1,
    },

    reps: {
      type: Number,
      required: true,
      min: 1,
    },

    weight: {
      type: Number,
      default: 0,
      min: 0,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;

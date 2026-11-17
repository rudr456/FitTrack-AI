import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    age: {
      type: Number,
      min: 13,
      max: 100,
    },

    height: {
      type: Number,
      min: 50,
      max: 250,
    },

    weight: {
      type: Number,
      min: 20,
      max: 350,
    },

    fitnessGoal: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "maintenance", "general_fitness"],
      default: "general_fitness",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

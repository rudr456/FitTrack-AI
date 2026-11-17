import { useEffect, useState } from "react";
import API from "../api/axios";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    exerciseName: "",
    category: "chest",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
  });

  // Fetch workouts from backend
  const fetchWorkouts = async () => {
    try {
      const response = await API.get("/workouts");
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add workout
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const workoutData = {
        ...formData,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: Number(formData.weight || 0),
        duration: Number(formData.duration || 0),
      };

      await API.post("/workouts", workoutData);

      setMessage("Workout added successfully!");

      // Reset form with lowercase category
      setFormData({
        exerciseName: "",
        category: "chest",
        sets: "",
        reps: "",
        weight: "",
        duration: "",
      });

      await fetchWorkouts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add workout.");
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
    try {
      await API.delete(`/workouts/${id}`);

      setMessage("Workout deleted successfully!");
      await fetchWorkouts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete workout.");
    }
  };

  return (
    <div className="page-container">
      <h1>Workout Tracker 🏋️</h1>
      <p>Record your exercises and track your training.</p>

      {/* Add Workout Form */}
      <section className="page-card">
        <h2>Add New Workout</h2>

        <form onSubmit={handleSubmit} className="workout-form">
          <label htmlFor="exerciseName">Exercise Name</label>
          <input
            id="exerciseName"
            type="text"
            name="exerciseName"
            value={formData.exerciseName}
            onChange={handleChange}
            placeholder="e.g. Bench Press"
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="abs">Abs</option>
            <option value="cardio">Cardio</option>
          </select>

          <label htmlFor="sets">Sets</label>
          <input
            id="sets"
            type="number"
            name="sets"
            min="1"
            value={formData.sets}
            onChange={handleChange}
            required
          />

          <label htmlFor="reps">Reps</label>
          <input
            id="reps"
            type="number"
            name="reps"
            min="1"
            value={formData.reps}
            onChange={handleChange}
            required
          />

          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            name="weight"
            min="0"
            value={formData.weight}
            onChange={handleChange}
          />

          <label htmlFor="duration">Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            name="duration"
            min="0"
            value={formData.duration}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn">
            Add Workout
          </button>
        </form>

        {message && <p>{message}</p>}
      </section>

      {/* Workout History */}
      <section className="page-card">
        <h2>Your Workout History</h2>

        {loading ? (
          <p>Loading workouts...</p>
        ) : workouts.length === 0 ? (
          <p>No workouts recorded yet. Add your first workout!</p>
        ) : (
          <div className="workout-list">
            {workouts.map((workout) => (
              <div className="workout-item" key={workout._id}>
                <div>
                  <h3>{workout.exerciseName}</h3>

                  <p>
                    {workout.category} | {workout.sets} sets × {workout.reps}{" "}
                    reps
                  </p>

                  <p>
                    Weight: {workout.weight} kg | Duration: {workout.duration}{" "}
                    min
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Workouts;

import { useEffect, useState } from "react";
import API from "../api/axios";

function Nutrition() {
  const [foods, setFoods] = useState([]);
  const [summary, setSummary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbohydrates: 0,
    totalFats: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    foodName: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbohydrates: "",
    fats: "",
    date: new Date().toLocaleDateString("en-CA"),
  });

  // Fetch food history and daily summary
  const fetchNutrition = async () => {
    try {
      const [foodResponse, summaryResponse] = await Promise.all([
        API.get("/nutrition"),
        API.get("/nutrition/summary"),
      ]);

      const foodData = foodResponse.data;

      const foodList =
        foodData.nutrition ?? foodData.data?.nutrition ?? foodData.data ?? [];

      setFoods(Array.isArray(foodList) ? foodList : []);

      setSummary(
        summaryResponse.data.summary || {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbohydrates: 0,
          totalFats: 0,
        },
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load nutrition data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add food
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/nutrition", {
        ...formData,
        calories: Number(formData.calories),
        protein: Number(formData.protein || 0),
        carbohydrates: Number(formData.carbohydrates || 0),
        fats: Number(formData.fats || 0),
      });

      setMessage("Food entry added successfully!");

      setFormData({
        foodName: "",
        mealType: "breakfast",
        calories: "",
        protein: "",
        carbohydrates: "",
        fats: "",
        date: new Date().toLocaleDateString("en-CA"),
      });

      await fetchNutrition();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add food entry.");
    }
  };

  // Delete food entry
  const handleDelete = async (id) => {
    try {
      await API.delete(`/nutrition/${id}`);

      setMessage("Food entry deleted successfully!");

      await fetchNutrition();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not delete food entry.",
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Nutrition Tracker 🥗</h1>
      <p>Track your meals and monitor your daily nutrition.</p>

      {/* DAILY SUMMARY */}

      <section className="nutrition-summary">
        <div className="nutrition-stat">
          <span>🔥 Calories</span>
          <h2>{summary.totalCalories} kcal</h2>
        </div>

        <div className="nutrition-stat">
          <span>🥩 Protein</span>
          <h2>{summary.totalProtein} g</h2>
        </div>

        <div className="nutrition-stat">
          <span>🌾 Carbs</span>
          <h2>{summary.totalCarbohydrates} g</h2>
        </div>

        <div className="nutrition-stat">
          <span>🥑 Fats</span>
          <h2>{summary.totalFats} g</h2>
        </div>
      </section>

      {/* ADD FOOD FORM */}

      <section className="page-card">
        <h2>Add Food Entry</h2>

        <form className="nutrition-form" onSubmit={handleSubmit}>
          <label>Food Name</label>

          <input
            type="text"
            name="foodName"
            placeholder="e.g. Chicken Breast"
            value={formData.foodName}
            onChange={handleChange}
            required
          />

          <label>Meal Type</label>

          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <label>Calories (kcal)</label>

          <input
            type="number"
            name="calories"
            min="0"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />

          <label>Protein (g)</label>

          <input
            type="number"
            name="protein"
            min="0"
            placeholder="Protein"
            value={formData.protein}
            onChange={handleChange}
          />

          <label>Carbohydrates (g)</label>

          <input
            type="number"
            name="carbohydrates"
            min="0"
            placeholder="Carbohydrates"
            value={formData.carbohydrates}
            onChange={handleChange}
          />

          <label>Fats (g)</label>

          <input
            type="number"
            name="fats"
            min="0"
            placeholder="Fats"
            value={formData.fats}
            onChange={handleChange}
          />

          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Add Food
          </button>
        </form>

        {message && <p className="nutrition-message">{message}</p>}
      </section>

      {/* FOOD HISTORY */}

      <section className="page-card">
        <h2>Your Food History</h2>

        {loading ? (
          <p>Loading nutrition records...</p>
        ) : foods.length === 0 ? (
          <p>No food entries found. Add your first meal!</p>
        ) : (
          <div className="nutrition-list">
            {foods.map((food) => (
              <div className="nutrition-item" key={food._id}>
                <div>
                  <h3>{food.foodName}</h3>

                  <p>
                    {food.mealType} | {food.calories} kcal
                  </p>

                  <p>
                    Protein: {food.protein} g | Carbs: {food.carbohydrates} g |
                    Fats: {food.fats} g
                  </p>

                  <small>
                    {food.date ? new Date(food.date).toLocaleDateString() : ""}
                  </small>
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(food._id)}
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

export default Nutrition;

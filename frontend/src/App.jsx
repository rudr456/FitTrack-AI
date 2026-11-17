import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

import "./App.css";

import API from "./api/axios.js";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Workouts from "./pages/WorkoutPage.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Progress from "./pages/Progress.jsx";
import AICoach from "./pages/AICoach.jsx";

// ========================================
// DASHBOARD
// ========================================

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbohydrates: 0,
    totalFats: 0,
  });

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [workoutError, setWorkoutError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Nutrition summary
      try {
        const response = await API.get("/nutrition/summary");
        const data = response.data.summary || {};

        setSummary({
          totalCalories: data.totalCalories ?? 0,
          totalProtein: data.totalProtein ?? 0,
          totalCarbohydrates: data.totalCarbohydrates ?? 0,
          totalFats: data.totalFats ?? 0,
        });
      } catch (error) {
        setSummaryError(
          error.response?.data?.message || "Could not load nutrition summary.",
        );
      } finally {
        setLoadingSummary(false);
      }

      // Recent workouts
      try {
        const response = await API.get("/workouts");
        const data = response.data;

        const workouts = Array.isArray(data)
          ? data
          : (data.workouts ?? data.data?.workouts ?? data.data ?? []);

        setRecentWorkouts(Array.isArray(workouts) ? workouts.slice(0, 3) : []);
      } catch (error) {
        setWorkoutError(
          error.response?.data?.message || "Could not load workout history.",
        );
      } finally {
        setLoadingWorkouts(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span>💪</span>
          <h2>FitTrack AI</h2>
        </div>

        <p className="menu-title">MENU</p>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">
            🏠 Dashboard
          </Link>

          <Link to="/workouts" className="nav-link">
            🏋️ Workouts
          </Link>

          <Link to="/nutrition" className="nav-link">
            🥗 Nutrition
          </Link>

          <Link to="/progress" className="nav-link">
            📊 Progress
          </Link>

          <Link to="/ai-coach" className="nav-link">
            🤖 AI Coach
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <a href="#settings" className="nav-link">
            ⚙️ Settings
          </a>

          <p>Version 1.0.0</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Let's achieve your fitness goals.</p>
          </div>

          <div className="profile">
            <span>👤</span>

            <div>
              <h4>Fitness User</h4>
              <p>Premium Member</p>
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* WELCOME CARD */}
        <section className="welcome-card">
          <div>
            <p className="welcome-label">YOUR FITNESS JOURNEY</p>

            <h2>Build strength. Stay consistent.</h2>

            <p>
              Track your workouts, monitor nutrition and become stronger every
              day.
            </p>
          </div>

          <div className="welcome-icon">🔥</div>
        </section>

        {/* NUTRITION SUMMARY */}
        <section className="stats-section">
          <div className="section-heading">
            <h2>Today's Overview</h2>
            <p>Your daily fitness statistics</p>
          </div>

          {loadingSummary ? (
            <p>Loading nutrition data...</p>
          ) : summaryError ? (
            <p>{summaryError}</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-card calories">
                <div className="stat-top">
                  <span>🔥</span>
                  <span className="stat-tag">Nutrition</span>
                </div>

                <p>Calories Consumed</p>
                <h2>
                  {summary.totalCalories} <small>kcal</small>
                </h2>
                <small>Today's recorded intake</small>
              </div>

              <div className="stat-card protein">
                <div className="stat-top">
                  <span>🥩</span>
                  <span className="stat-tag">Nutrition</span>
                </div>

                <p>Protein Intake</p>
                <h2>
                  {summary.totalProtein} <small>g</small>
                </h2>
                <small>Today's recorded intake</small>
              </div>

              <div className="stat-card carbs">
                <div className="stat-top">
                  <span>🌾</span>
                  <span className="stat-tag">Nutrition</span>
                </div>

                <p>Carbohydrates</p>
                <h2>
                  {summary.totalCarbohydrates} <small>g</small>
                </h2>
                <small>Today's recorded intake</small>
              </div>

              <div className="stat-card fats">
                <div className="stat-top">
                  <span>🥑</span>
                  <span className="stat-tag">Nutrition</span>
                </div>

                <p>Fat Intake</p>
                <h2>
                  {summary.totalFats} <small>g</small>
                </h2>
                <small>Today's recorded intake</small>
              </div>
            </div>
          )}
        </section>

        {/* WORKOUT ACTIVITY */}
        <section className="workout-section">
          <div className="section-heading">
            <h2>Recent Workout Activity 🏋️</h2>
            <p>Your latest recorded exercises</p>
          </div>

          <div className="workout-card">
            {loadingWorkouts ? (
              <p>Loading workout history...</p>
            ) : workoutError ? (
              <p>{workoutError}</p>
            ) : recentWorkouts.length === 0 ? (
              <p>No workouts recorded yet. Start your training today!</p>
            ) : (
              <div className="workout-list">
                {recentWorkouts.map((workout) => (
                  <div className="workout-item" key={workout._id}>
                    <div className="workout-info">
                      <h3>{workout.exerciseName}</h3>

                      <p>
                        {workout.category} | {workout.sets} sets ×{" "}
                        {workout.reps} reps
                      </p>

                      <p>
                        Weight: {workout.weight} kg | Duration:{" "}
                        {workout.duration} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/workouts")}
            >
              View All Workouts
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2026 FitTrack AI. Built for your fitness journey.</p>
        </footer>
      </main>
    </div>
  );
}

// ========================================
// PROTECTED ROUTES
// ========================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

// ========================================
// HOME REDIRECT
// ========================================

function HomeRedirect() {
  const token = localStorage.getItem("token");

  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
}

// ========================================
// MAIN APPLICATION
// ========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Nutrition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

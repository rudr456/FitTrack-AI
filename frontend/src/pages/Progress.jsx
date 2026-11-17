import { useEffect, useState } from "react";
import API from "../api/axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

function Progress() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch workout records from MongoDB through the backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await API.get("/workouts");
        const data = response.data;

        const records = Array.isArray(data)
          ? data
          : (data.workouts ?? data.data?.workouts ?? data.data ?? []);

        setWorkouts(Array.isArray(records) ? records : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load workout progress.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Prepare chart data
  const chartData = workouts
    .slice(-7)
    .reverse()
    .map((workout, index) => ({
      name: workout.exerciseName || `Workout ${index + 1}`,
      sets: Number(workout.sets) || 0,
      reps: Number(workout.reps) || 0,
      weight: Number(workout.weight) || 0,
    }));

  // Calculate workout statistics
  const totalWorkouts = workouts.length;

  const totalSets = workouts.reduce(
    (total, workout) => total + (Number(workout.sets) || 0),
    0,
  );

  const totalReps = workouts.reduce(
    (total, workout) => total + (Number(workout.reps) || 0),
    0,
  );

  const totalVolume = workouts.reduce(
    (total, workout) =>
      total +
      (Number(workout.sets) || 0) *
        (Number(workout.reps) || 0) *
        (Number(workout.weight) || 0),
    0,
  );

  // Custom dark tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const workout = payload[0].payload;

      return (
        <div className="progress-tooltip">
          <h4>{workout.name}</h4>

          <p>
            <span>Sets</span>
            <strong>{workout.sets}</strong>
          </p>

          <p>
            <span>Reps</span>
            <strong>{workout.reps}</strong>
          </p>

          <p>
            <span>Weight</span>
            <strong>{workout.weight} kg</strong>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-container progress-page">
      {/* Page heading */}
      <div className="progress-header">
        <div className="progress-heading-icon">📊</div>

        <h1>Progress Tracker</h1>

        <p>
          Every rep counts. Track your performance and keep getting stronger.
        </p>
      </div>

      {loading ? (
        <div className="progress-status">
          <div className="progress-loader"></div>
          <p>Loading your performance data...</p>
        </div>
      ) : error ? (
        <div className="progress-status progress-error">{error}</div>
      ) : (
        <>
          {/* Statistics cards */}
          <div className="progress-stats-grid">
            <div className="progress-stat-card">
              <div className="progress-stat-icon">🏋️</div>
              <span>Total Workouts</span>
              <h2>{totalWorkouts}</h2>
              <small>Your recorded exercises</small>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">🔥</div>
              <span>Total Sets</span>
              <h2>{totalSets}</h2>
              <small>Sets completed</small>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">💪</div>
              <span>Total Reps</span>
              <h2>{totalReps}</h2>
              <small>Repetitions recorded</small>
            </div>

            <div className="progress-stat-card">
              <div className="progress-stat-icon">⚡</div>
              <span>Total Volume</span>
              <h2>{totalVolume.toLocaleString("en-IN")}</h2>
              <small>kg × reps × sets</small>
            </div>
          </div>

          {/* Workout chart */}
          <section className="page-card progress-chart-card">
            <div className="progress-section-heading">
              <div>
                <h2>Workout Performance</h2>
                <p>Sets performed in your latest workouts</p>
              </div>

              <span className="progress-live-tag">● LIVE DATA</span>
            </div>

            {workouts.length === 0 ? (
              <div className="progress-empty">
                <span>📈</span>
                <h3>No workout data yet</h3>
                <p>
                  Add your first workout to see your performance chart here.
                </p>
              </div>
            ) : (
              <div
                className="progress-chart"
                style={{
                  width: "100%",
                  height: "380px",
                  minHeight: "380px",
                  minWidth: 0,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 0,
                      bottom: 55,
                    }}
                    barCategoryGap="35%"
                  >
                    <CartesianGrid
                      stroke="#26364b"
                      strokeDasharray="4 5"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                      height={70}
                    />

                    <YAxis
                      stroke="#94a3b8"
                      allowDecimals={false}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        fill: "rgba(56, 189, 248, 0.08)",
                      }}
                    />

                    <Bar
                      dataKey="sets"
                      name="Sets"
                      barSize={48}
                      radius={[9, 9, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={index % 2 === 0 ? "#0ea5e9" : "#38bdf8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Workout history */}
          <section className="page-card progress-history-card">
            <div className="progress-section-heading">
              <div>
                <h2>Recent Workout History</h2>
                <p>Your latest recorded exercises</p>
              </div>
            </div>

            {workouts.length === 0 ? (
              <p className="progress-history-empty">
                Your workout history will appear here.
              </p>
            ) : (
              <div className="progress-history-list">
                {workouts
                  .slice(-5)
                  .reverse()
                  .map((workout) => (
                    <div className="progress-history-item" key={workout._id}>
                      <div className="progress-history-icon">🏋️</div>

                      <div className="progress-history-details">
                        <h3>{workout.exerciseName}</h3>

                        <p>
                          {workout.category} · {workout.sets} sets ×{" "}
                          {workout.reps} reps
                        </p>

                        <small>
                          {workout.weight || 0} kg · {workout.duration || 0}{" "}
                          minutes
                        </small>
                      </div>

                      <div className="progress-history-badge">Completed</div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Progress;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💪 FitTrack AI</h1>

        <p>Welcome back! Login to continue your fitness journey.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className={`login-message ${
              message.toLowerCase().includes("success") ? "" : "login-error"
            }`}
          >
            {message}
          </p>
        )}

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios.js";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      setMessage("Registration successful!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💪 FitTrack AI</h1>

        <p>Create your account and start your fitness journey.</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {message && (
          <p
            className={`login-message ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("exists")
                ? "login-error"
                : ""
            }`}
          >
            {message}
          </p>
        )}

        <p className="register-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

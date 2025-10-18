import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext} from "../store/auth-context";
import "./Login.css";

function LoginPage() {
  const { updateToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include", // important: saves refreshToken cookie
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.accessToken) {
          setError("No access token received");
          return;
        }
        // Update auth context (which handles localStorage)
        updateToken(data.accessToken);

        // Redirect to profile page
        navigate("/profile");
      } else {
        setError(data.error || data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        onSubmit={handleLogin}
        className="login-form"
      >
        <h2 className="login-title">Login</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`submit-button ${isLoading ? "disabled" : "enabled"}`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link-container">
          <p className="auth-link-text">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="auth-link"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

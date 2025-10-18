import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    // Check for password strength requirements
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
      setError("Password must contain at least one uppercase letter, lowercase letter, number, and symbol");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Show success message and redirect to login
        alert("Registration successful! Please login to continue.");
        navigate("/login");
      } else {
        setError(data.message || data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form
        onSubmit={handleRegister}
        className="register-form"
      >
        <h2 className="register-title">
          Register
        </h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <p className="password-hint">
            Password must contain at least 8 characters with uppercase, lowercase, number, and symbol
          </p>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`submit-button ${isLoading ? "disabled" : "enabled"}`}
        >
          {isLoading && <span className="loading-spinner"></span>}
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div className="auth-link-container">
          <p className="auth-link-text">
            Already have an account?{" "}
            <Link
              to="/login"
              className="auth-link"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;

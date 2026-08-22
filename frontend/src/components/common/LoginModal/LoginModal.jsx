import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Service Manager",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      name: formData.name || (isSignUp ? "New User" : "Admin"),
      role: formData.role,
      email: formData.email,
    });

    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <div className="brand-badge">D</div>
          <h2>{isSignUp ? "Create Account" : "Sign In to DeviceNexus"}</h2>
          <p>
            {isSignUp
              ? "Register a new team member profile"
              : "Enter your details to customize your workspace"}
          </p>
          <button
            type="button"
            className="login-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="login-tab-bar">
          <button
            type="button"
            className={`login-tab ${!isSignUp ? "active" : ""}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`login-tab ${isSignUp ? "active" : ""}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Your Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma, Aarav, Priya"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="login-form-group">
            <label>Staff Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Service Manager">Service Manager</option>
              <option value="Senior Technician">Senior Technician</option>
              <option value="Support Executive">Support Executive</option>
              <option value="Front Desk Admin">Front Desk Admin</option>
            </select>
          </div>

          <div className="login-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. rahul@devicenexus.io"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-submit-btn">
            {isSignUp ? "Create Profile & Sign In" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;

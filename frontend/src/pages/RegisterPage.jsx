import React, { useState } from "react";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.register({ ...form, role: "ADMIN" });
      setMessage(`Admin ${data.username} registered! You can login.`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage("Error: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-container">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-circle">
              <span className="logo-text">IM</span>
            </div>
            <h2 className="login-title">Register Admin</h2>
            <p className="login-subtitle">
              Create a new admin account to manage the system
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>

            {/* Email Field */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>

            {/* Password Field */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            {/* Message */}
            {message && (
              <div className={`${message.includes('Error') ? 'error-message' : 'success-message'}`}>
                {message}
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="form-toggle">
            <p>
              Already have an account?
              <button 
                type="button" 
                className="toggle-link"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

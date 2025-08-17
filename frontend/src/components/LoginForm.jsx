import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      if (result.success) {
        // Redirect to the main dashboard
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-circle">
          <span className="logo-text">IS</span>
        </div>
        <h2 className="login-title">Intern System</h2>
        <p className="login-subtitle">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* Username Field */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Username (e.g., john.doe@supervisor)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>

        {/* Password Field */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </form>

      {/* Registration Link */}
      <div className="form-toggle">
        <p>
          Don't have an account?
          <button 
            type="button" 
            className="toggle-link"
            onClick={() => navigate('/register')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

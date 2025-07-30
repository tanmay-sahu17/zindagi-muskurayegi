import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Direct frontend-only credential match
    if (
      (formData.role === 'admin' && formData.username === 'admin' && formData.password === 'admin123') ||
      (formData.role === 'user' && formData.username === 'anganwadi_worker' && formData.password === 'worker123')
    ) {
      // Optionally store user info in localStorage if needed
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/data-entry');
      }
      setLoading(false);
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🏥 Zindagi Muskurayegi Login</h2>
          <p>Select your role and enter credentials to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Role Selection Dropdown */}
          <div className="form-group">
            <label htmlFor="role">Select Your Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="user">👩‍⚕️ Anganwadi Worker</option>
              <option value="admin">👨‍💼 Administrator</option>
            </select>
          </div>

          {/* Demo Credentials Display */}
          <div className={`demo-credentials ${formData.role === 'admin' ? 'admin-theme' : 'user-theme'}`}>
            <strong>Demo {formData.role === 'admin' ? 'Admin' : 'Worker'} Credentials:</strong><br/>
            Username: <code>{formData.role === 'admin' ? 'admin' : 'anganwadi_worker'}</code><br/>
            Password: <code>{formData.role === 'admin' ? 'admin123' : 'worker123'}</code>
          </div>

          <div className="form-group">
            <label htmlFor="username">
              {formData.role === 'admin' ? 'Admin Username' : 'Worker Username'}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={`Enter your ${formData.role === 'admin' ? 'admin' : 'worker'} username`}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {formData.role === 'admin' ? 'Admin Password' : 'Worker Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={`Enter your ${formData.role === 'admin' ? 'admin' : 'worker'} password`}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`login-btn ${formData.role === 'admin' ? 'admin-btn' : 'user-btn'}`}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : (
              formData.role === 'admin' ? '👨‍💼 Admin Login' : '👩‍⚕️ Worker Login'
            )}
          </button>
        </form>
      </div>

      <div className="login-info">
        <h3>Welcome to Zindagi Muskurayegi</h3>
        <p>
          This system helps Anganwadi workers efficiently record and manage 
          child health checkup data, ensuring better healthcare tracking for children.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">📋</span>
            <span>Easy Data Entry</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Health Tracking</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData, 'admin');
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container admin-login">
      <div className="login-card admin-card">
        <div className="login-header">
          <h2>Administrator Login</h2>
          <p>Access the administrative dashboard to view and manage all health records</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn admin-btn"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Login as Admin'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Are you an Anganwadi worker? {' '}
            <Link to="/" className="switch-link">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div className="login-info admin-info">
        <h3>Administrative Portal</h3>
        <p>
          Monitor and oversee all child health records submitted by Anganwadi workers. 
          Access comprehensive reports and analytics for better healthcare management.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">📈</span>
            <span>Analytics Dashboard</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👁️</span>
            <span>Data Oversight</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Comprehensive Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Zindagi Muskurayegi</h1>
          <span className="tagline">Child Health Management System</span>
        </Link>

        <nav className="nav">
          {!isAuthenticated ? (
            <div className="nav-links">
              <Link to="/" className="nav-link">
                System Login
              </Link>
            </div>
          ) : (
            <div className="nav-authenticated">
              <div className="user-info">
                <span className="welcome-text">
                  Welcome, <strong>{user?.username}</strong>
                </span>
                <span className={`role-badge ${user?.role}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Anganwadi Worker'}
                </span>
              </div>
              
              <div className="nav-links">
                {user?.role === 'user' && (
                  <Link to="/user/data-entry" className="nav-link">
                    Data Entry
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                )}
                
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

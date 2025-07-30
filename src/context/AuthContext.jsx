import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (credentials, userType) => {
    setLoading(true);
    let userData = null;
    if (userType === 'user' && credentials.username === 'anganwadi_worker' && credentials.password === 'worker123') {
      userData = {
        id: 1,
        username: 'anganwadi_worker',
        role: 'user',
        name: 'Anganwadi Worker',
        anganwadiCenter: 'Demo Center'
      };
    } else if (userType === 'admin' && credentials.username === 'admin' && credentials.password === 'admin123') {
      userData = {
        id: 2,
        username: 'admin',
        role: 'admin',
        name: 'System Administrator',
        permissions: ['view_all', 'manage_users']
      };
    }
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userData };
    } else {
      setLoading(false);
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

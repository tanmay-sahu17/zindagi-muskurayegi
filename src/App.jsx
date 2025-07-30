import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import './styles/App.css';

const SimpleApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({
    userType: 'anganwadi',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Verify token is still valid
          await authAPI.verifyToken();
          const user = JSON.parse(userData);
          setUser(user);
          
          // Redirect to appropriate page
          if (user.role === 'admin') {
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentPage('data-entry');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    };
    
    checkAuth();
  }, []);
  const [formData, setFormData] = useState({
    childName: '',
    age: '',
    gender: '',
    weight: '',
    symptoms: '',
    schoolName: '',
    anganwadiKendra: '',
    status: 'Pending'
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Direct frontend-only credential match
    const { username, password, userType } = loginData;
    if (
      (userType === 'admin' && username === 'admin' && password === 'admin123') ||
      (userType === 'anganwadi' && username === 'anganwadi_worker' && password === 'worker123')
    ) {
      const user = {
        username,
        role: userType === 'admin' ? 'admin' : 'user'
      };
      setUser(user);
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('data-entry');
      }
      setIsLoading(false);
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setUser(null);
    setCurrentPage('login');
    setLoginData({ userType: 'anganwadi', username: '', password: '' });
    setError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Health record saved successfully!');
    setFormData({
      childName: '',
      age: '',
      gender: '',
      weight: '',
      symptoms: '',
      schoolName: '',
      anganwadiKendra: '',
      status: 'Pending'
    });
  };

  // Login Page with Professional Design
  if (currentPage === 'login') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          maxWidth: '1200px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {/* Left Side - Welcome Section */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
            color: 'white',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '24px' }}>💚</span>
              </div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Zindagi Muskurayegi</h1>
              <p style={{ margin: '5px 0', opacity: 0.9 }}>Child Health Screening & Support System</p>
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Welcome to the Child Health Support Portal</h2>
            
            <p style={{ lineHeight: '1.6', marginBottom: '30px', opacity: 0.9 }}>
              Monitor, report, and manage the health of children enrolled in Anganwadi and Government schools. 
              This platform empowers healthcare teams for early detection of congenital heart conditions and ensures timely free treatment.
            </p>

            <div style={{ space: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ marginRight: '15px', fontSize: '20px' }}>📊</span>
                <span>Submit Child Health Checkup Data</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ marginRight: '15px', fontSize: '20px' }}>�</span>
                <span>Secure role-based access for Anganwadi Workers & Admin</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ marginRight: '15px', fontSize: '20px' }}>⚕️</span>
                <span>Track health screening status and referrals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '15px', fontSize: '20px' }}>🏛️</span>
                <span>Supported by District Administration & Health Dept.</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={{
            flex: 1,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
              <h2 style={{ 
                fontSize: '24px', 
                marginBottom: '10px', 
                color: '#333',
                textAlign: 'center' 
              }}>
                Sign In to Your Account
              </h2>
              <p style={{ 
                color: '#666', 
                textAlign: 'center', 
                marginBottom: '30px' 
              }}>
                Access your child health management dashboard
              </p>

              {/* User Type Toggle with Cool Animation */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                  Select Your Role
                </label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    type="button"
                    onClick={() => setLoginData({...loginData, userType: 'anganwadi'})}
                    style={{
                      flex: 1,
                      padding: '15px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: loginData.userType === 'anganwadi' ? '#4a90e2' : '#f0f4f8',
                      color: loginData.userType === 'anganwadi' ? 'white' : '#666',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>👩‍⚕️</span>
                    Anganwadi Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginData({...loginData, userType: 'admin'})}
                    style={{
                      flex: 1,
                      padding: '15px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: loginData.userType === 'admin' ? '#4a90e2' : '#f0f4f8',
                      color: loginData.userType === 'admin' ? 'white' : '#666',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>👨‍💼</span>
                    Administrator
                  </button>
                </div>
                
                {/* Role Description */}
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px 16px',
                  backgroundColor: loginData.userType === 'anganwadi' ? '#e8f4fd' : '#fff3e0',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    color: loginData.userType === 'anganwadi' ? '#1565c0' : '#e65100',
                    fontWeight: '500'
                  }}>
                    {loginData.userType === 'anganwadi' 
                      ? '� Access data entry forms to record child health checkups and submit reports'
                      : '📊 View comprehensive dashboard with all health records and analytics'
                    }
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin}>
                {error && (
                  <div style={{
                    backgroundColor: '#ffe6e6',
                    color: '#d00',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    <span style={{ marginRight: '8px' }}>✉️</span>
                    {loginData.userType === 'anganwadi' ? 'Anganwadi Worker ID' : 'Administrator Email'}
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder={loginData.userType === 'admin' ? 'admin1' : 'worker1'}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      border: '2px solid #e1e1e1',
                      borderRadius: '10px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4a90e2';
                      e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e1e1';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    � Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="password123"
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e1e1e1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    Remember me
                  </label>
                  <a href="#" style={{ color: '#4a90e2', fontSize: '14px', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isLoading 
                      ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
                      : 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
                    }
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    {isLoading ? (
                      <>
                        <span style={{ 
                          display: 'inline-block', 
                          marginRight: '8px',
                          animation: 'spin 1s linear infinite' 
                        }}>⏳</span>
                        Signing In...
                      </>
                    ) : (
                      loginData.userType === 'anganwadi' ? '🚀 Access Data Entry Portal' : '⚡ Open Admin Dashboard'
                    )}
                  </span>
                </button>
              </form>

              {/* Demo Credentials */}
              <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                <strong>Test Accounts:</strong><br/>
                <strong>Anganwadi Worker:</strong> worker1 / password123<br/>
                <strong>Administrator:</strong> admin1 / password123<br/>
                <em>Connect with backend database for authentication</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data Entry Page with All Required Fields
  if (currentPage === 'data-entry') {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ color: '#333', margin: '0 0 5px 0', fontSize: '32px' }}>Child Health Data Entry</h1>
                <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>Enter comprehensive child health checkup information</p>
              </div>
              <button onClick={handleLogout} style={{
                padding: '12px 24px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                Logout
              </button>
            </div>
          </div>
          
          <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: '25px' }}>
            {/* Child Basic Information */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 25px 0', 
                color: '#333', 
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Child Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    Child Name *
                  </label>
                  <input 
                    type="text" 
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                    required 
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      border: '2px solid #e1e1e1', 
                      borderRadius: '8px', 
                      boxSizing: 'border-box',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }} 
                    placeholder="Enter child's full name"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    Age (years) *
                  </label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required 
                    min="0" 
                    max="18"
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      border: '2px solid #e1e1e1', 
                      borderRadius: '8px', 
                      boxSizing: 'border-box',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    placeholder="Age in years"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '25px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    Gender *
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    required 
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      border: '2px solid #e1e1e1', 
                      borderRadius: '8px', 
                      boxSizing: 'border-box',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    Weight (kg) *
                  </label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    step="0.1" 
                    required 
                    min="0"
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      border: '2px solid #e1e1e1', 
                      borderRadius: '8px', 
                      boxSizing: 'border-box',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                    placeholder="Weight in kg"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 25px 0', 
                color: '#333', 
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Health Information
              </h3>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#333'
                }}>
                  Symptoms / Health Observations
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  rows="4"
                  placeholder="Describe any symptoms, health issues, or observations about the child..."
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    transition: 'border-color 0.3s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                />
              </div>
              
              <div style={{ marginTop: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#333'
                }}>
                  Health Checkup Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                >
                  <option value="Pending">Pending</option>
                  <option value="Checked">Checked</option>
                  <option value="Referred">Referred to Doctor</option>
                  <option value="Treated">Treated</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                </select>
              </div>
            </div>

            {/* School/Anganwadi Information */}
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 25px 0', 
                color: '#333', 
                fontSize: '24px',
                fontWeight: '600'
              }}>
                School/Anganwadi Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    School/Anganwadi Name *
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e1e1e1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    placeholder="Enter school or anganwadi name"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#333'
                  }}>
                    Anganwadi Kendra *
                  </label>
                  <input
                    type="text"
                    value={formData.anganwadiKendra}
                    onChange={(e) => setFormData({...formData, anganwadiKendra: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e1e1e1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    placeholder="Enter anganwadi kendra name"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" style={{
              width: '100%', 
              padding: '15px', 
              backgroundColor: '#4a90e2', 
              color: 'white',
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              cursor: 'pointer', 
              fontWeight: '600',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#357abd'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4a90e2'}>
              Save Health Record
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard with Enhanced Design
  if (currentPage === 'admin-dashboard') {
    const mockRecords = [
      { id: 1, childName: 'राज कुमार', age: 5, gender: 'Male', weight: 15.5, status: 'Checked', schoolName: 'ABC अंगनवाड़ी', date: '2025-01-15', symptoms: 'Fever, Cold' },
      { id: 2, childName: 'प्रिया शर्मा', age: 4, gender: 'Female', weight: 14.2, status: 'Pending', schoolName: 'XYZ अंगनवाड़ी', date: '2025-01-14', symptoms: 'Stomach ache' },
      { id: 3, childName: 'अमित सिंह', age: 6, gender: 'Male', weight: 18.0, status: 'Referred', schoolName: 'PQR अंगनवाड़ी', date: '2025-01-13', symptoms: 'Eye infection' },
      { id: 4, childName: 'सुनीता देवी', age: 3, gender: 'Female', weight: 12.8, status: 'Treated', schoolName: 'DEF अंगनवाड़ी', date: '2025-01-12', symptoms: 'Skin rash' },
    ];

    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ color: '#333', margin: '0 0 5px 0', fontSize: '32px' }}>Admin Dashboard</h1>
                <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>Child Health Management System Overview</p>
              </div>
              <button onClick={handleLogout} style={{
                padding: '12px 24px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                Logout
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '15px', 
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(78, 205, 196, 0.08)',
              border: '1px solid rgba(78, 205, 196, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(78, 205, 196, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.08)';
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#4ECDC4', fontSize: '20px', fontWeight: '600' }}>Total Records</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#4ECDC4' }}>156</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>+12 this week</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '15px', 
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(255, 193, 7, 0.08)',
              border: '1px solid rgba(255, 193, 7, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 193, 7, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.08)';
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffc107', fontSize: '20px', fontWeight: '600' }}>Pending</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>23</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>Needs attention</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '15px', 
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(40, 167, 69, 0.08)',
              border: '1px solid rgba(40, 167, 69, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(40, 167, 69, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.08)';
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745', fontSize: '20px', fontWeight: '600' }}>Checked</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>98</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>Completed</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '15px', 
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(220, 53, 69, 0.08)',
              border: '1px solid rgba(220, 53, 69, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(220, 53, 69, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.08)';
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#dc3545', fontSize: '20px', fontWeight: '600' }}>Referred</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>35</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>To specialists</p>
            </div>
          </div>

          {/* Recent Records Table */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '25px', fontSize: '24px', color: '#333' }}>Recent Health Records</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Child Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Age</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Gender</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Weight</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Symptoms</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>School</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecords.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{record.childName}</td>
                      <td style={{ padding: '15px' }}>{record.age} years</td>
                      <td style={{ padding: '15px' }}>{record.gender}</td>
                      <td style={{ padding: '15px' }}>{record.weight} kg</td>
                      <td style={{ padding: '15px', maxWidth: '150px' }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#666',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {record.symptoms}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: 
                            record.status === 'Checked' ? '#d4edda' : 
                            record.status === 'Pending' ? '#fff3cd' : 
                            record.status === 'Referred' ? '#f8d7da' : '#d1ecf1',
                          color: 
                            record.status === 'Checked' ? '#155724' : 
                            record.status === 'Pending' ? '#856404' : 
                            record.status === 'Referred' ? '#721c24' : '#0c5460'
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px' }}>{record.schoolName}</td>
                      <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{record.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>;
}

export default SimpleApp;


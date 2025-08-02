import axios from 'axios';

// Base API URL - configured for our Node.js backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if it's NOT a login request
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials, userType) => 
    api.post('/auth/login', { ...credentials, role: userType }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  verifyToken: () => 
    api.get('/auth/verify'),
};

// Child Health Records API endpoints
export const childHealthAPI = {
  // Get all records (admin only)
  getAllRecords: (page = 1, limit = 10, filters = {}) => 
    api.get('/child-health-records', { 
      params: { page, limit, ...filters } 
    }),
  
  // Get records by user (for the logged-in user)
  getUserRecords: (page = 1, limit = 10) => 
    api.get('/child-health-records/user', { 
      params: { page, limit } 
    }),
  
  // Create new record
  createRecord: (recordData) => 
    api.post('/child-health-records', recordData),
  
  // Update record
  updateRecord: (id, recordData) => 
    api.put(`/child-health-records/${id}`, recordData),
  
  // Delete record
  deleteRecord: (id) => 
    api.delete(`/child-health-records/${id}`),
  
  // Get record by ID
  getRecordById: (id) => 
    api.get(`/child-health-records/${id}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard statistics (admin only)
  getStats: () => 
    api.get('/dashboard/stats'),
  
  // Get records by status
  getRecordsByStatus: (status) => 
    api.get(`/dashboard/records-by-status/${status}`),
  
  // Get records by date range
  getRecordsByDateRange: (startDate, endDate) => 
    api.get('/dashboard/records-by-date', { 
      params: { startDate, endDate } 
    }),
};

export default api;

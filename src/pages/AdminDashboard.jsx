import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { childHealthAPI, dashboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecords: 0,
    pendingRecords: 0,
    checkedRecords: 0,
    referredRecords: 0,
    treatedRecords: 0
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Mock data for development
      setStats({
        totalRecords: 0,
        pendingRecords: 0,
        checkedRecords: 0,
        referredRecords: 0,
        treatedRecords: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    setRecordsLoading(true);
    setError('');
    
    try {
      const response = await childHealthAPI.getAllRecords(
        filters.page,
        filters.limit,
        {
          status: filters.status,
          search: filters.search
        }
      );
      
      setRecords(response.data.records || []);
      setTotalPages(Math.ceil((response.data.total || 0) / filters.limit));
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records. Please try again.');
      // Mock data for development
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'checked': return 'status-checked';
      case 'referred': return 'status-referred';
      case 'treated': return 'status-treated';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Monitor and manage all child health records</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalRecords}</h3>
            <p>Total Records</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingRecords}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card checked">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.checkedRecords}</h3>
            <p>Checked</p>
          </div>
        </div>
        
        <div className="stat-card referred">
          <div className="stat-icon">🏥</div>
          <div className="stat-info">
            <h3>{stats.referredRecords}</h3>
            <p>Referred</p>
          </div>
        </div>
        
        <div className="stat-card treated">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <h3>{stats.treatedRecords}</h3>
            <p>Treated</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label htmlFor="search">Search Records</label>
          <input
            type="text"
            id="search"
            placeholder="Search by child name, school, or kendra..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">Filter by Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Checked">Checked</option>
            <option value="Referred">Referred</option>
            <option value="Treated">Treated</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="records-section">
        <div className="section-header">
          <h3>Child Health Records</h3>
          <div className="records-count">
            Showing {records.length} records
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {recordsLoading ? (
          <div className="records-loading">
            <LoadingSpinner size="medium" />
            <p>Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="no-records">
            <p>No records found matching the current criteria.</p>
          </div>
        ) : (
          <div className="records-table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Child Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Weight</th>
                  <th>School/Anganwadi</th>
                  <th>Kendra</th>
                  <th>Status</th>
                  <th>Symptoms</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="child-name">{record.child_name}</td>
                    <td>{record.age} years</td>
                    <td>{record.gender}</td>
                    <td>{record.weight} kg</td>
                    <td>{record.school_name}</td>
                    <td>{record.anganwadi_kendra}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="symptoms">
                      {record.symptoms ? (
                        <div className="symptoms-text" title={record.symptoms}>
                          {record.symptoms.length > 50 
                            ? `${record.symptoms.substring(0, 50)}...` 
                            : record.symptoms}
                        </div>
                      ) : (
                        <span className="no-symptoms">No symptoms recorded</span>
                      )}
                    </td>
                    <td>{formatDate(record.created_at)}</td>
                    <td>{record.created_by_username || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {filters.page} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { childHealthAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './DataEntry.css';

const DataEntry = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    child_name: '',
    age: '',
    gender: '',
    weight: '',
    symptoms: '',
    school_name: '',
    anganwadi_kendra: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.child_name || !formData.age || !formData.gender || 
        !formData.weight || !formData.school_name || !formData.anganwadi_kendra) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isNaN(formData.age) || formData.age < 0 || formData.age > 18) {
      setError('Please enter a valid age (0-18 years)');
      setLoading(false);
      return;
    }

    if (isNaN(formData.weight) || formData.weight < 0) {
      setError('Please enter a valid weight');
      setLoading(false);
      return;
    }

    try {
      await childHealthAPI.createRecord(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        child_name: '',
        age: '',
        gender: '',
        weight: '',
        symptoms: '',
        school_name: '',
        anganwadi_kendra: '',
        status: 'Pending'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-entry-container">
      <div className="data-entry-header">
        <h2>Child Health Checkup Data Entry</h2>
        <p>Record comprehensive health information for children in your care</p>
      </div>

      {success && (
        <div className="success-message">
          ✅ Child health record has been successfully saved!
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="data-entry-form">
        <div className="form-section">
          <h3>Child Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="child_name">Child Name *</label>
              <input
                type="text"
                id="child_name"
                name="child_name"
                value={formData.child_name}
                onChange={handleChange}
                placeholder="Enter child's full name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age (years) *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age in years"
                min="0"
                max="18"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg) *</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg"
                step="0.1"
                min="0"
                disabled={loading}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Health Information</h3>
          
          <div className="form-group">
            <label htmlFor="symptoms">Symptoms / Health Observations</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe any symptoms, health concerns, or observations..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Health Checkup Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Checked">Checked</option>
              <option value="Referred">Referred</option>
              <option value="Treated">Treated</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Location Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="school_name">School/Anganwadi Name *</label>
              <input
                type="text"
                id="school_name"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                placeholder="Enter school or anganwadi name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="anganwadi_kendra">Anganwadi Kendra *</label>
              <input
                type="text"
                id="anganwadi_kendra"
                name="anganwadi_kendra"
                value={formData.anganwadi_kendra}
                onChange={handleChange}
                placeholder="Enter anganwadi kendra"
                disabled={loading}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Saving Record...
              </>
            ) : (
              'Save Health Record'
            )}
          </button>
        </div>
      </form>

      <div className="data-entry-info">
        <h4>Data Entry Guidelines</h4>
        <ul>
          <li>Ensure all required fields (*) are completed accurately</li>
          <li>Double-check measurements like age and weight</li>
          <li>Provide detailed symptoms and observations</li>
          <li>Select appropriate health checkup status</li>
          <li>All data will be securely stored and accessible to administrators</li>
        </ul>
      </div>
    </div>
  );
};

export default DataEntry;

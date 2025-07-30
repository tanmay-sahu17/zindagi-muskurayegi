import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'currentColor' }) => {
  return (
    <div className={`loading-spinner ${size}`} style={{ color }}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;

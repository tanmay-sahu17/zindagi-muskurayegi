const express = require('express');
const { 
  submitChildData, 
  getAllRecords, 
  getUserRecords, 
  getDashboardStats 
} = require('../controllers/recordsController');
const { authenticateToken, requireUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// User routes (Anganwadi workers)
router.post('/child-data', authenticateToken, requireUser, submitChildData);
router.get('/my-records', authenticateToken, requireUser, getUserRecords);

// Admin routes
router.get('/records', authenticateToken, requireAdmin, getAllRecords);
router.get('/dashboard-stats', authenticateToken, requireAdmin, getDashboardStats);

module.exports = router;

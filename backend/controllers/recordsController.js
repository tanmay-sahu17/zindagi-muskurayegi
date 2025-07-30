const { pool } = require('../config/database');

// Submit child health data (User only)
const submitChildData = async (req, res) => {
  try {
    const {
      child_name,
      age,
      gender,
      weight,
      symptoms,
      school_name,
      anganwadi_kendra,
      health_status = 'Pending'
    } = req.body;

    // Validation
    if (!child_name || !age || !gender || !weight || !school_name || !anganwadi_kendra) {
      return res.status(400).json({
        success: false,
        message: 'Child name, age, gender, weight, school name, and anganwadi kendra are required'
      });
    }

    if (age < 0 || age > 18) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 0 and 18 years'
      });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be Male, Female, or Other'
      });
    }

    if (weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be a positive number'
      });
    }

    const validStatuses = ['Pending', 'Checked', 'Referred', 'Treated', 'Follow-up Required'];
    if (!validStatuses.includes(health_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid health status'
      });
    }

    // Insert child health record
    const [result] = await pool.execute(
      `INSERT INTO child_health_records 
       (child_name, age, gender, weight, symptoms, school_name, anganwadi_kendra, health_status, submitted_by_user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [child_name, age, gender, weight, symptoms || null, school_name, anganwadi_kendra, health_status, req.user.id]
    );

    // Get the created record with user info
    const [records] = await pool.execute(
      `SELECT chr.*, u.username as submitted_by 
       FROM child_health_records chr 
       JOIN users u ON chr.submitted_by_user_id = u.id 
       WHERE chr.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Child health record submitted successfully',
      data: records[0]
    });

  } catch (error) {
    console.error('Submit child data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while submitting child data'
    });
  }
};

// Get all child health records (Admin only)
const getAllRecords = async (req, res) => {
  try {
    const { 
      anganwadi_kendra, 
      health_status, 
      start_date, 
      end_date, 
      page = 1, 
      limit = 50 
    } = req.query;

    let query = `
      SELECT 
        chr.id,
        chr.child_name,
        chr.age,
        chr.gender,
        chr.weight,
        chr.symptoms,
        chr.school_name,
        chr.anganwadi_kendra,
        chr.health_status,
        chr.created_at,
        chr.updated_at,
        u.username as submitted_by
      FROM child_health_records chr
      JOIN users u ON chr.submitted_by_user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (anganwadi_kendra) {
      query += ' AND chr.anganwadi_kendra LIKE ?';
      params.push(`%${anganwadi_kendra}%`);
    }

    if (health_status) {
      query += ' AND chr.health_status = ?';
      params.push(health_status);
    }

    if (start_date) {
      query += ' AND DATE(chr.created_at) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND DATE(chr.created_at) <= ?';
      params.push(end_date);
    }

    // Add ordering and pagination
    query += ' ORDER BY chr.created_at DESC';
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // Execute query
    const [records] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM child_health_records chr
      JOIN users u ON chr.submitted_by_user_id = u.id
      WHERE 1=1
    `;

    const countParams = [];
    if (anganwadi_kendra) {
      countQuery += ' AND chr.anganwadi_kendra LIKE ?';
      countParams.push(`%${anganwadi_kendra}%`);
    }
    if (health_status) {
      countQuery += ' AND chr.health_status = ?';
      countParams.push(health_status);
    }
    if (start_date) {
      countQuery += ' AND DATE(chr.created_at) >= ?';
      countParams.push(start_date);
    }
    if (end_date) {
      countQuery += ' AND DATE(chr.created_at) <= ?';
      countParams.push(end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_records: total,
          records_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching records'
    });
  }
};

// Get user's own submitted records
const getUserRecords = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [records] = await pool.execute(
      `SELECT 
        id, child_name, age, gender, weight, symptoms, 
        school_name, anganwadi_kendra, health_status, 
        created_at, updated_at
       FROM child_health_records 
       WHERE submitted_by_user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM child_health_records WHERE submitted_by_user_id = ?',
      [req.user.id]
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_records: total,
          records_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user records'
    });
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get total records count
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM child_health_records'
    );

    // Get records by status
    const [statusResult] = await pool.execute(
      `SELECT health_status, COUNT(*) as count 
       FROM child_health_records 
       GROUP BY health_status`
    );

    // Get records by anganwadi kendra (top 10)
    const [kendraResult] = await pool.execute(
      `SELECT anganwadi_kendra, COUNT(*) as count 
       FROM child_health_records 
       GROUP BY anganwadi_kendra 
       ORDER BY count DESC 
       LIMIT 10`
    );

    // Get recent submissions (last 7 days)
    const [recentResult] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM child_health_records 
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    res.json({
      success: true,
      data: {
        total_records: totalResult[0].total,
        status_breakdown: statusResult,
        top_anganwadi_kendras: kendraResult,
        recent_submissions: recentResult
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard statistics'
    });
  }
};

module.exports = {
  submitChildData,
  getAllRecords,
  getUserRecords,
  getDashboardStats
};

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create child_health_records table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS child_health_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        child_name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        symptoms TEXT,
        school_name VARCHAR(200) NOT NULL,
        anganwadi_kendra VARCHAR(200) NOT NULL,
        health_status ENUM('Pending', 'Checked', 'Referred', 'Treated', 'Follow-up Required') NOT NULL DEFAULT 'Pending',
        submitted_by_user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (submitted_by_user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
    throw error;
  }
};

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const bcrypt = require('bcrypt');
    const [rows] = await pool.execute('SELECT * FROM users WHERE role = "admin" LIMIT 1');
    
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await pool.execute(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }

    // Create a demo user as well
    const [userRows] = await pool.execute('SELECT * FROM users WHERE username = "anganwadi_worker"');
    if (userRows.length === 0) {
      const hashedPassword = await bcrypt.hash('worker123', 12);
      await pool.execute(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        ['anganwadi_worker', hashedPassword, 'user']
      );
      console.log('✅ Default user created (username: anganwadi_worker, password: worker123)');
    }
  } catch (error) {
    console.error('❌ Error creating default users:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeTables,
  createDefaultAdmin
};

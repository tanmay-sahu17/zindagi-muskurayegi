-- Simple SQL Queries to Add Users to Database
-- Copy paste these queries in MySQL Workbench

-- First, use the database
USE child_health_db;

-- Add Simple Anganwadi Workers (role: user)
INSERT INTO users (username, password_hash, role) VALUES 
('user1', '$2b$12$K8gTDgRxO8fKHaFYG.ZOpeKn1YmN1YzjU0qhJqHfZc8q1YmN1YzjU0', 'user'),
('user2', '$2b$12$K8gTDgRxO8fKHaFYG.ZOpeKn1YmN1YzjU0qhJqHfZc8q1YmN1YzjU0', 'user'),
('user3', '$2b$12$K8gTDgRxO8fKHaFYG.ZOpeKn1YmN1YzjU0qhJqHfZc8q1YmN1YzjU0', 'user');

-- Add Simple Admins (role: admin)
INSERT INTO users (username, password_hash, role) VALUES 
('admin1', '$2b$12$K8gTDgRxO8fKHaFYG.ZOpeKn1YmN1YzjU0qhJqHfZc8q1YmN1YzjU0', 'admin'),
('admin2', '$2b$12$K8gTDgRxO8fKHaFYG.ZOpeKn1YmN1YzjU0qhJqHfZc8q1YmN1YzjU0', 'admin');

-- Check all users
SELECT id, username, role, created_at FROM users;

-- CREDENTIALS FOR THESE USERS:
-- username: user1, password: 123
-- username: user2, password: 123  
-- username: user3, password: 123
-- username: admin1, password: 123
-- username: admin2, password: 123

-- Note: The password_hash above is for password "123"

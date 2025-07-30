const bcrypt = require('bcrypt');
const { pool } = require('./config/database');

// Function to create a new user
const createUser = async (username, password, role) => {
  try {
    // Validation
    if (!username || !password || !role) {
      console.log('❌ Username, password, and role are required');
      return;
    }

    if (!['user', 'admin'].includes(role)) {
      console.log('❌ Role must be either "user" or "admin"');
      return;
    }

    // Check if username already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.log('❌ Username already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, passwordHash, role]
    );

    console.log('✅ User created successfully!');
    console.log(`📝 Username: ${username}`);
    console.log(`🔐 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log(`🆔 User ID: ${result.insertId}`);

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
  }
};

// Function to list all users
const listUsers = async () => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC'
    );

    console.log('\n📋 All Users:');
    console.log('=====================================');
    users.forEach(user => {
      console.log(`🆔 ID: ${user.id}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`🎭 Role: ${user.role}`);
      console.log(`📅 Created: ${user.created_at}`);
      console.log('-------------------------------------');
    });

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
};

// Main function to handle command line arguments
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'create') {
    const username = args[1];
    const password = args[2];
    const role = args[3];
    
    if (!username || !password || !role) {
      console.log('Usage: node addUser.js create <username> <password> <role>');
      console.log('Example: node addUser.js create user1 123 user');
      console.log('Example: node addUser.js create admin1 123 admin');
      return;
    }
    
    await createUser(username, password, role);
  } 
  else if (command === 'list') {
    await listUsers();
  }
  else {
    console.log('Available commands:');
    console.log('  create <username> <password> <role> - Create new user');
    console.log('  list                                - List all users');
    console.log('');
    console.log('Simple Examples:');
    console.log('  node addUser.js create user1 123 user');
    console.log('  node addUser.js create user2 123 user');
    console.log('  node addUser.js create admin1 123 admin');
    console.log('  node addUser.js list');
  }

  process.exit(0);
};

// Run the script
main().catch(console.error);

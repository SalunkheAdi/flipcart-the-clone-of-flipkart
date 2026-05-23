import pool from '../config/database.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDemoUser = async () => {
  try {
    // Hash the demo password
    const hashedPassword = await bcryptjs.hash('demo123', 10);

    // Check if demo user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@flipcart.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('✓ Demo user already exists');
      process.exit(0);
    }

    // Insert demo user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, email, name',
      ['demo@flipcart.com', hashedPassword, 'Demo User']
    );

    console.log('✓ Demo user created successfully');
    console.log('  Email: demo@flipcart.com');
    console.log('  Password: demo123');
    console.log('  User ID:', result.rows[0].id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo user:', error);
    process.exit(1);
  }
};

seedDemoUser();

import fs from 'fs';
import path from 'path';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const setupAuthSchema = async () => {
  try {
    const sqlPath = path.join(process.cwd(), 'database', 'auth_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('✓ Auth schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up auth schema:', error);
    process.exit(1);
  }
};

setupAuthSchema();

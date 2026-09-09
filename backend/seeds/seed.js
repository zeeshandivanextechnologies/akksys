import { db } from '../config/db.js';
import { hashPassword } from '../utils/hashPassword.js';

const seed = async () => {
  try {
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', ['admin@akksys.in']);
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const passwordHash = await hashPassword('admin123');
    await db.query(
      'INSERT INTO users (name, email, password_hash, phone, company, role) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Admin User', 'admin@akksys.in', passwordHash, '+91 98765 43210', 'AKKSYS', 'superadmin']
    );

    // Insert default settings
    await db.query(
      `INSERT INTO settings (id, company_name, primary_color, secondary_color) VALUES (1, 'AKKSYS', '#00C8FF', '#4DDCFF')
       ON CONFLICT (id) DO NOTHING`
    );

    console.log('Admin user created: admin@akksys.in / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();

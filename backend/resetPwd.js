import { db } from './config/db.js';
import { hashPassword } from './utils/hashPassword.js';

async function resetPassword() {
  try {
    // Set a known password for testing
    const newHash = await hashPassword('Admin@123');
    await db.query('UPDATE users SET password_hash = $1 WHERE id = 1', [newHash]);
    console.log('✅ Password reset to: Admin@123');
    
    // Show user info
    const res = await db.query('SELECT id, name, email, role FROM users WHERE id = 1');
    console.log('User:', res.rows[0]);
    
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
resetPassword();

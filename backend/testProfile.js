import { db } from './config/db.js';

async function testProfileUpdate() {
  try {
    // Check what user exists
    const users = await db.query('SELECT id, name, email, phone, company, role FROM users LIMIT 3');
    console.log('\n=== EXISTING USERS ===');
    users.rows.forEach(u => console.log(u));

    if (users.rows.length === 0) {
      console.log('No users found!');
      process.exit(1);
    }

    const userId = users.rows[0].id;
    const originalName = users.rows[0].name;

    // Simulate a profile update
    const testName = originalName + ' (test)';
    const result = await db.query(
      `UPDATE users SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, email, phone, company, role`,
      [testName, userId]
    );
    console.log('\n=== AFTER UPDATE ===');
    console.log(result.rows[0]);

    // Revert back
    await db.query(`UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2`, [originalName, userId]);
    console.log('\n✅ DB update works! Reverted back to original.');

    process.exit(0);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
}
testProfileUpdate();

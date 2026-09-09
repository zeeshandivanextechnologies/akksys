import { db } from './config/db.js';

async function checkTables() {
  try {
    // Check users table columns
    const usersRes = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.log('\n=== USERS TABLE COLUMNS ===');
    usersRes.rows.forEach(r => console.log(r.column_name, '-', r.data_type));

    // Check settings table exists and columns
    const settingsRes = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'settings' 
      ORDER BY ordinal_position
    `);
    console.log('\n=== SETTINGS TABLE COLUMNS ===');
    if (settingsRes.rows.length === 0) {
      console.log('TABLE DOES NOT EXIST!');
    } else {
      settingsRes.rows.forEach(r => console.log(r.column_name, '-', r.data_type));
    }

    // Check settings data
    try {
      const settingsData = await db.query('SELECT * FROM settings WHERE id = 1');
      console.log('\n=== SETTINGS DATA ===');
      console.log(settingsData.rows[0] || 'NO DATA');
    } catch(e) {
      console.log('Settings table error:', e.message);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
checkTables();

import { db } from './config/db.js';

async function fixColumns() {
  try {
    // Check which columns exist in users table
    const res = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    const existing = res.rows.map(r => r.column_name);
    console.log('Existing columns:', existing);

    // Add missing columns if not present
    const alterations = [];

    if (!existing.includes('sms_auth')) {
      alterations.push(`ALTER TABLE users ADD COLUMN sms_auth BOOLEAN DEFAULT false`);
    }
    if (!existing.includes('email_auth')) {
      alterations.push(`ALTER TABLE users ADD COLUMN email_auth BOOLEAN DEFAULT false`);
    }
    if (!existing.includes('email_alerts')) {
      alterations.push(`ALTER TABLE users ADD COLUMN email_alerts BOOLEAN DEFAULT true`);
    }
    if (!existing.includes('scan_alerts')) {
      alterations.push(`ALTER TABLE users ADD COLUMN scan_alerts BOOLEAN DEFAULT true`);
    }
    if (!existing.includes('weekly_report')) {
      alterations.push(`ALTER TABLE users ADD COLUMN weekly_report BOOLEAN DEFAULT true`);
    }
    if (!existing.includes('campaign_updates')) {
      alterations.push(`ALTER TABLE users ADD COLUMN campaign_updates BOOLEAN DEFAULT true`);
    }
    if (!existing.includes('phone')) {
      alterations.push(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`);
    }
    if (!existing.includes('company')) {
      alterations.push(`ALTER TABLE users ADD COLUMN company VARCHAR(100)`);
    }

    if (alterations.length === 0) {
      console.log('✅ All columns already exist! No changes needed.');
    } else {
      for (const sql of alterations) {
        await db.query(sql);
        console.log('✅ Executed:', sql);
      }
    }

    // Create settings table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        company_name VARCHAR(100) DEFAULT 'AKKSYS',
        primary_color VARCHAR(20) DEFAULT '#00C8FF',
        secondary_color VARCHAR(20) DEFAULT '#4DDCFF',
        logo_url TEXT,
        favicon_url TEXT,
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT settings_single_row CHECK (id = 1)
      )
    `);

    // Insert default settings if not exists
    await db.query(`
      INSERT INTO settings (id, company_name, primary_color, secondary_color)
      VALUES (1, 'AKKSYS', '#00C8FF', '#4DDCFF')
      ON CONFLICT (id) DO NOTHING
    `);

    // Show current user data
    const user = await db.query('SELECT id, name, email, phone, company, role, sms_auth, email_auth, email_alerts, scan_alerts, weekly_report, campaign_updates FROM users WHERE id = 1');
    console.log('\n=== CURRENT USER DATA ===');
    console.log(user.rows[0]);

    const settings = await db.query('SELECT * FROM settings WHERE id = 1');
    console.log('\n=== CURRENT SETTINGS DATA ===');
    console.log(settings.rows[0]);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
fixColumns();

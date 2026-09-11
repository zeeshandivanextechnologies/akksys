import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations(closePoolAfter = false) {
  try {
    console.log('Running database migrations...');
    const client = await pool.connect();
    
    const migrations = ['001_initial.sql', '002_add_2fa_columns.sql', '003_add_notification_columns.sql', '004_landing_content.sql', '005_add_ratings.sql', '006_add_likes.sql', '007_static_qr_codes.sql', '008_landing_columns.sql', '009_redirect_presets.sql', '010_cta_campaign_id.sql', '011_contact_messages.sql', '012_add_legal_pages.sql'];
    
    for (const file of migrations) {
      console.log(`Running ${file}...`);
      const sqlPath = path.join(__dirname, file);
      if (!fs.existsSync(sqlPath)) {
        console.log(`${file} not found, skipping.`);
        continue;
      }
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await client.query(sql);
      console.log(`${file} done.`);
    }
    
    console.log('All migrations successful!');
    client.release();
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    if (closePoolAfter) {
      await pool.end();
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations(true);
}

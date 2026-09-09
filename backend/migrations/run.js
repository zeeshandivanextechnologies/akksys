import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'akksys',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function runMigrations() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    const migrations = ['001_initial.sql', '002_add_2fa_columns.sql', '003_add_notification_columns.sql', '004_landing_content.sql'];
    
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
    await pool.end();
  }
}

runMigrations();

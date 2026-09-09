import { db } from './config/db.js';

async function alterDb() {
  try {
    await db.query(`ALTER TABLE landing_content ADD COLUMN IF NOT EXISTS brand JSONB DEFAULT '{}'::jsonb;`);
    await db.query(`ALTER TABLE landing_content ADD COLUMN IF NOT EXISTS impact_stats JSONB DEFAULT '[]'::jsonb;`);
    console.log("Success");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

alterDb();

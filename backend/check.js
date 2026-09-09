import { db } from './config/db.js';

async function check() {
  const res1 = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'scan_events'");
  console.log('scan_events:', res1.rows);
  const res2 = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cta_clicks'");
  console.log('cta_clicks:', res2.rows);
  process.exit(0);
}
check();

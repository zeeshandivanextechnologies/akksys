import { db } from './config/db.js';

async function alterDb() {
  try {
    await db.query(`CREATE SEQUENCE IF NOT EXISTS qr_serial_seq START 1;`);
    await db.query(`
      ALTER TABLE qr_codes 
      ADD COLUMN IF NOT EXISTS qr_serial_number VARCHAR(50) 
      DEFAULT 'AKK' || LPAD(nextval('qr_serial_seq')::text, 4, '0') UNIQUE;
    `);
    console.log("Success adding qr_serial_number");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

alterDb();

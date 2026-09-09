import { db } from './config/db.js';

async function fixBrand() {
  try {
    const res = await db.query('SELECT brand FROM landing_content WHERE id = 1');
    let brand = res.rows[0].brand || {};
    brand.primaryColor = '#00C8FF';
    brand.secondaryColor = '#4DDCFF';
    // Using CAST to avoid syntax issues
    await db.query('UPDATE landing_content SET brand = CAST($1 AS JSONB) WHERE id = 1', [JSON.stringify(brand)]);
    console.log('Brand updated successfully in DB!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixBrand();

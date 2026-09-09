import { db } from './config/db.js';

async function removeMetric() {
  try {
    const res = await db.query('SELECT impact_stats FROM landing_content WHERE id = 1');
    let stats = res.rows[0].impact_stats || [];
    
    // Remove "metric" key from all stats
    const cleanedStats = stats.map(stat => {
      const { metric, ...rest } = stat;
      return rest;
    });

    await db.query('UPDATE landing_content SET impact_stats = CAST($1 AS JSONB) WHERE id = 1', [JSON.stringify(cleanedStats)]);
    console.log('Removed "metric" key from impact_stats in DB!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

removeMetric();

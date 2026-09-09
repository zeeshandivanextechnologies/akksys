import { db } from './config/db.js';

async function run() {
  try {
    const res = await db.query('SELECT impact_stats FROM landing_content WHERE id = 1');
    let stats = res.rows[0].impact_stats;
    if (stats) {
      stats.forEach(s => {
        if(s.metric === 'businesses' && !s.staticValue) s.staticValue = '500';
        if(s.metric === 'totalScansK' && !s.staticValue) s.staticValue = '2.4';
        if(s.metric === 'avgCTR' && !s.staticValue) s.staticValue = '31.2';
      });
      await db.query('UPDATE landing_content SET impact_stats = $1 WHERE id = 1', [JSON.stringify(stats)]);
      console.log('Fixed DB');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

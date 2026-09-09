import { db } from './config/db.js';

async function fix() {
  try {
    const res = await db.query('SELECT impact_stats FROM landing_content WHERE id = 1');
    let stats = res.rows[0].impact_stats || [];
    
    // Just force it to the defaults completely so they don't have to worry
    const defaultStats = [
      { icon: 'building', label: 'Businesses Empowered', staticValue: '500+' },
      { icon: 'users', label: 'Customer Engagements', staticValue: '2.4M+' },
      { icon: 'chart-line', label: 'Average CTR', staticValue: '31.2%' },
      { icon: 'star', label: 'Customer Rating', staticValue: '4.9/5' }
    ];

    await db.query('UPDATE landing_content SET impact_stats = $1::jsonb WHERE id = 1', [JSON.stringify(defaultStats)]);
    console.log('Database fixed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();

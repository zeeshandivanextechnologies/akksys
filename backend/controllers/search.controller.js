import { db } from '../config/db.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const searchParam = `%${q}%`;

    const campaigns = await db.query(
      `SELECT id, name, status, 'campaign' as type FROM campaigns WHERE name ILIKE $1 LIMIT 5`,
      [searchParam]
    );

    const qrs = await db.query(
      `SELECT id, name, status, 'qr' as type FROM qr_codes WHERE name ILIKE $1 OR qr_id ILIKE $1 LIMIT 5`,
      [searchParam]
    );

    const results = [...campaigns.rows, ...qrs.rows];
    
    res.json(results);
  } catch (err) {
    next(err);
  }
};

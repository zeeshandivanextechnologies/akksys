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
      `SELECT qr_id as id, name, status, qr_serial_number, box_id, lifecycle_status, 'qr' as type 
       FROM qr_codes 
       WHERE name ILIKE $1 OR qr_id ILIKE $1 OR qr_serial_number ILIKE $1 
       LIMIT 5`,
      [searchParam]
    );

    const boxes = await db.query(
      `SELECT b.id, b.box_number as name, b.status, 'box' as type,
        (SELECT COUNT(*) FROM qr_codes WHERE box_id = b.id) as qr_count
       FROM boxes b 
       WHERE b.box_number ILIKE $1 
       LIMIT 5`,
      [searchParam]
    );

    const results = [...qrs.rows, ...boxes.rows, ...campaigns.rows];
    
    res.json(results);
  } catch (err) {
    next(err);
  }
};

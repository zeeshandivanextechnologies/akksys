import { db } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM settings WHERE id = 1');
    if (result.rows.length === 0) {
      return res.json({});
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { company_name, primary_color, secondary_color, logo_url, favicon_url } = req.body;
    const result = await db.query(
      `INSERT INTO settings (id, company_name, primary_color, secondary_color, logo_url, favicon_url) 
       VALUES (1, $1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET company_name = $1, primary_color = $2, secondary_color = $3, logo_url = $4, favicon_url = $5, updated_at = NOW()
       RETURNING *`,
      [company_name, primary_color, secondary_color, logo_url, favicon_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

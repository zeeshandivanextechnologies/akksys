import { db } from '../config/db.js';

export const listCTAs = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM cta_buttons ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createCTA = async (req, res, next) => {
  try {
    const { button_text, destination_url, qr_id } = req.body;
    const result = await db.query(
      'INSERT INTO cta_buttons (button_text, destination_url, qr_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [button_text, destination_url, qr_id || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateCTA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { button_text, destination_url, is_active } = req.body;
    const result = await db.query(
      'UPDATE cta_buttons SET button_text = COALESCE($1, button_text), destination_url = COALESCE($2, destination_url), is_active = COALESCE($3, is_active), updated_at = NOW() WHERE id = $4 RETURNING *',
      [button_text, destination_url, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CTA not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

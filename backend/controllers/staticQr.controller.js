import { db } from '../config/db.js';

export const listStaticQR = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM static_qr_codes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getStaticQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM static_qr_codes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Static QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createStaticQR = async (req, res, next) => {
  try {
    const { name, type, data } = req.body;
    const result = await db.query(
      'INSERT INTO static_qr_codes (name, type, data, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, JSON.stringify(data || {}), req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateStaticQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, data, status } = req.body;
    const result = await db.query(
      `UPDATE static_qr_codes SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        data = COALESCE($3, data),
        status = COALESCE($4, status),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, type, data ? JSON.stringify(data) : null, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Static QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const toggleStaticQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE static_qr_codes SET
        status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END,
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Static QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteStaticQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM static_qr_codes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Static QR code not found' });
    }
    res.json({ message: 'Static QR code deleted successfully' });
  } catch (err) {
    next(err);
  }
};

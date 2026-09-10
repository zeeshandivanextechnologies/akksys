import { db } from '../config/db.js';

export const listCTAs = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT cta.*, c.name as campaign_name, q.name as qr_name
       FROM cta_buttons cta
       LEFT JOIN campaigns c ON cta.campaign_id = c.id
       LEFT JOIN qr_codes q ON cta.qr_id = q.id
       ORDER BY cta.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createCTA = async (req, res, next) => {
  try {
    const { button_text, destination_url, qr_id, campaign_id } = req.body;
    const result = await db.query(
      'INSERT INTO cta_buttons (button_text, destination_url, qr_id, campaign_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [button_text, destination_url, qr_id || null, campaign_id || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateCTA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { button_text, destination_url, is_active, qr_id, campaign_id } = req.body;
    const result = await db.query(
      `UPDATE cta_buttons SET
        button_text = COALESCE($1, button_text),
        destination_url = COALESCE($2, destination_url),
        is_active = COALESCE($3, is_active),
        qr_id = COALESCE($4, qr_id),
        campaign_id = COALESCE($5, campaign_id),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [button_text, destination_url, is_active, qr_id !== undefined ? qr_id : null, campaign_id !== undefined ? campaign_id : null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CTA not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteCTA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM cta_buttons WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CTA not found' });
    }
    res.json({ message: 'CTA deleted' });
  } catch (err) {
    next(err);
  }
};

import { db } from '../config/db.js';

export const listPresets = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM redirect_presets ORDER BY display_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const { name, url, icon, color } = req.body;
    const result = await db.query(
      'INSERT INTO redirect_presets (name, url, icon, color, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, url, icon || 'globe', color || '#6943c8', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updatePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, url, icon, color, display_order } = req.body;
    const result = await db.query(
      'UPDATE redirect_presets SET name = COALESCE($1, name), url = COALESCE($2, url), icon = COALESCE($3, icon), color = COALESCE($4, color), display_order = COALESCE($5, display_order), updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, url, icon, color, display_order, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deletePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM redirect_presets WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    res.json({ message: 'Preset deleted' });
  } catch (err) {
    next(err);
  }
};

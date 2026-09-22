import { db } from '../config/db.js';

export const checkFormEnabled = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const result = await db.query(
      'SELECT form_enabled FROM qr_codes WHERE qr_id = $1',
      [qrId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json({ form_enabled: result.rows[0].form_enabled });
  } catch (err) {
    next(err);
  }
};

export const submitLead = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const { name, phone, email, company, city } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const qrResult = await db.query('SELECT id FROM qr_codes WHERE qr_id = $1', [qrId]);
    if (qrResult.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    const qrInternalId = qrResult.rows[0].id;
    const deviceType = req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop';
    const ip = req.ip || req.connection?.remoteAddress || '';

    const result = await db.query(
      `INSERT INTO leads (qr_id, name, phone, email, company, city, device_type, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [qrInternalId, name.trim(), phone || null, email || null, company || null, city || null, deviceType, ip]
    );

    res.status(201).json({ success: true, lead: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT l.*, q.qr_id as qr_code_id, q.name as qr_name
       FROM leads l
       JOIN qr_codes q ON l.qr_id = q.id
       ORDER BY l.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getLeadsByQR = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const result = await db.query(
      `SELECT l.*, q.qr_id as qr_code_id, q.name as qr_name
       FROM leads l
       JOIN qr_codes q ON l.qr_id = q.id
       WHERE q.qr_id = $1
       ORDER BY l.created_at DESC`,
      [qrId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

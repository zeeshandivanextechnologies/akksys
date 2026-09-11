import { db } from '../config/db.js';
import { generateQrId } from '../utils/generateQrId.js';

export const listQRCodes = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT q.*, 
        (SELECT COUNT(*) FROM scan_events WHERE qr_id = q.id) as total_scans,
        (SELECT COUNT(DISTINCT session_id) FROM scan_events WHERE qr_id = q.id) as unique_scans,
        (SELECT COUNT(*) FROM scan_events WHERE qr_id = q.id AND scanned_at >= NOW() - INTERVAL '7 days') as scans_last_7,
        (SELECT COUNT(*) FROM scan_events WHERE qr_id = q.id AND scanned_at >= NOW() - INTERVAL '14 days' AND scanned_at < NOW() - INTERVAL '7 days') as scans_prev_7,
        (SELECT COUNT(DISTINCT session_id) FROM scan_events WHERE qr_id = q.id AND scanned_at >= NOW() - INTERVAL '7 days') as unique_last_7,
        (SELECT COUNT(DISTINCT session_id) FROM scan_events WHERE qr_id = q.id AND scanned_at >= NOW() - INTERVAL '14 days' AND scanned_at < NOW() - INTERVAL '7 days') as unique_prev_7,
        (SELECT COUNT(*) FROM cta_clicks cv 
         JOIN campaign_versions v ON cv.version_id = v.id 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id) as cta_clicks,
        (SELECT COUNT(*) FROM cta_clicks cv 
         JOIN campaign_versions v ON cv.version_id = v.id 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND cv.clicked_at >= NOW() - INTERVAL '7 days') as cta_last_7,
        (SELECT COUNT(*) FROM cta_clicks cv 
         JOIN campaign_versions v ON cv.version_id = v.id 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND cv.clicked_at >= NOW() - INTERVAL '14 days' AND cv.clicked_at < NOW() - INTERVAL '7 days') as cta_prev_7,
        (SELECT v.video_url FROM campaign_versions v 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND c.status = 'active' AND v.is_active = true 
         ORDER BY v.created_at DESC LIMIT 1) as current_video_url,
        (SELECT c.id FROM campaigns c 
         WHERE c.qr_id = q.id ORDER BY c.created_at DESC LIMIT 1) as campaign_id,
        (SELECT v.video_type FROM campaign_versions v 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND c.status = 'active' AND v.is_active = true 
         ORDER BY v.created_at DESC LIMIT 1) as video_type,
        (SELECT v.cta_text FROM campaign_versions v 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND c.status = 'active' AND v.is_active = true 
         ORDER BY v.created_at DESC LIMIT 1) as cta_text,
        (SELECT v.cta_destination FROM campaign_versions v 
         JOIN campaigns c ON v.campaign_id = c.id 
         WHERE c.qr_id = q.id AND c.status = 'active' AND v.is_active = true 
         ORDER BY v.created_at DESC LIMIT 1) as cta_destination
       FROM qr_codes q ORDER BY q.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createQR = async (req, res, next) => {
  try {
    const { name, logo_url } = req.body;
    const qrId = await generateQrId();
    const result = await db.query(
      'INSERT INTO qr_codes (qr_id, name, logo_url, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [qrId, name, logo_url || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getQRById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM qr_codes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const hasLogo = Object.prototype.hasOwnProperty.call(req.body, 'logo_url');
    let logoVal = hasLogo ? req.body.logo_url : null;
    if (hasLogo && (!logoVal || logoVal === '')) logoVal = null;

    const result = hasLogo
      ? await db.query(
          'UPDATE qr_codes SET name = COALESCE($1, name), logo_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
          [name, logoVal, id]
        )
      : await db.query(
          'UPDATE qr_codes SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING *',
          [name, id]
        );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const toggleQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE qr_codes SET status = CASE WHEN status = 'active' THEN 'paused' ELSE 'active' END, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM qr_codes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json({ message: 'QR code deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const bulkGenerate = async (req, res, next) => {
  try {
    const { items, logo_url } = req.body; // [{ name, destination_url }], optional shared logo
    const results = [];
    for (const item of items) {
      const qrId = await generateQrId();
      const qrResult = await db.query(
        'INSERT INTO qr_codes (qr_id, name, logo_url, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [qrId, item.name, logo_url || null, req.user.id]
      );
      const qr = qrResult.rows[0];

      if (item.destination_url) {
        const campResult = await db.query(
          `INSERT INTO campaigns (qr_id, name, created_by) VALUES ($1, $2, $3) RETURNING id`,
          [qr.id, item.name, req.user.id]
        );
        await db.query(
          `INSERT INTO campaign_versions (campaign_id, version_number, video_type, video_url, cta_text, cta_destination, is_active)
           VALUES ($1, 1, 'library', NULL, 'Learn More', $2, true)`,
          [campResult.rows[0].id, item.destination_url]
        );
      }

      results.push({ ...qr, destination_url: item.destination_url || null });
    }
    res.status(201).json({ count: results.length, qr_codes: results });
  } catch (err) {
    next(err);
  }
};

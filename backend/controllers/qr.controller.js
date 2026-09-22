import { db } from '../config/db.js';
import { generateQrId } from '../utils/generateQrId.js';
import { findOrCreateCategory } from './category.controller.js';

export const listQRCodes = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT q.*, 
        c.name as category_name,
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
         ORDER BY v.created_at DESC LIMIT 1) as cta_destination,
        b.box_number
       FROM qr_codes q 
       LEFT JOIN boxes b ON q.box_id = b.id
       LEFT JOIN categories c ON q.category_id = c.id
       ORDER BY q.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createQR = async (req, res, next) => {
  try {
    const { name, logo_url, form_enabled, category_id } = req.body;
    const qrId = await generateQrId();
    const result = await db.query(
      'INSERT INTO qr_codes (qr_id, name, logo_url, form_enabled, category_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [qrId, name, logo_url || null, form_enabled || false, category_id || null, req.user.id]
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
    const { name, form_enabled, category_id } = req.body;
    const hasLogo = Object.prototype.hasOwnProperty.call(req.body, 'logo_url');
    let logoVal = hasLogo ? req.body.logo_url : null;
    if (hasLogo && (!logoVal || logoVal === '')) logoVal = null;

    const hasFormEnabled = Object.prototype.hasOwnProperty.call(req.body, 'form_enabled');
    const hasCategoryId = Object.prototype.hasOwnProperty.call(req.body, 'category_id');

    if (hasLogo && hasFormEnabled && hasCategoryId) {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), logo_url = $2, form_enabled = $3, category_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [name, logoVal, form_enabled, category_id, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    } else if (hasLogo && hasFormEnabled) {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), logo_url = $2, form_enabled = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [name, logoVal, form_enabled, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    } else if (hasLogo) {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), logo_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [name, logoVal, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    } else if (hasFormEnabled) {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), form_enabled = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [name, form_enabled, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    } else if (hasCategoryId) {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), category_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [name, category_id, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    } else {
      const result = await db.query(
        'UPDATE qr_codes SET name = COALESCE($1, name), updated_at = NOW() WHERE id = $2 RETURNING *',
        [name, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'QR code not found' });
      res.json(result.rows[0]);
    }
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
    const { items, logo_url, category_id } = req.body; 
    const results = [];
    for (const item of items) {
      const qrId = await generateQrId();
      
      let finalCategoryId = item.category_id || category_id || null;
      if (item.category_path) {
        finalCategoryId = await findOrCreateCategory(item.category_path, req.user.id);
      }

      const qrResult = await db.query(
        'INSERT INTO qr_codes (qr_id, name, logo_url, category_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [qrId, item.name, logo_url || null, finalCategoryId, req.user.id]
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

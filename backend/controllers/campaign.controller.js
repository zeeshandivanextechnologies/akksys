import { db } from '../config/db.js';

export const listCampaigns = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT c.*, q.qr_id, q.name as qr_name,
        (SELECT COUNT(*) FROM campaign_versions WHERE campaign_id = c.id) as version_count,
        (SELECT COUNT(*) FROM scan_events se 
         JOIN campaign_versions v ON se.version_id = v.id 
         WHERE v.campaign_id = c.id) as total_scans,
        (SELECT COUNT(*) FROM cta_clicks cc 
         JOIN campaign_versions v ON cc.version_id = v.id 
         WHERE v.campaign_id = c.id) as cta_clicks
       FROM campaigns c 
       JOIN qr_codes q ON c.qr_id = q.id 
       ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { qr_id, name, start_date, end_date, headline, tagline, badge } = req.body;
    const result = await db.query(
      `INSERT INTO campaigns (qr_id, name, start_date, end_date, headline, tagline, badge, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [qr_id, name, start_date || null, end_date || null, headline, tagline, badge, req.user.id]
    );
    // Auto-create version 1
    const campaign = result.rows[0];
    const { video_type, video_url, cta_text, cta_destination } = req.body;
    await db.query(
      `INSERT INTO campaign_versions (campaign_id, version_number, video_type, video_url, cta_text, cta_destination, is_active) 
       VALUES ($1, 1, $2, $3, $4, $5, true)`,
      [campaign.id, video_type || 'library', video_url || null, cta_text || 'Buy Now', cta_destination || null]
    );
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
};

export const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, q.qr_id, q.name as qr_name FROM campaigns c 
       JOIN qr_codes q ON c.qr_id = q.id WHERE c.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const versions = await db.query(
      'SELECT * FROM campaign_versions WHERE campaign_id = $1 ORDER BY version_number DESC',
      [id]
    );
    res.json({ ...result.rows[0], versions: versions.rows });
  } catch (err) {
    next(err);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, status, headline, tagline, badge, video_type, video_url, cta_text, cta_destination } = req.body;
    const result = await db.query(
      `UPDATE campaigns SET name = COALESCE($1, name), status = COALESCE($2, status), 
       headline = COALESCE($3, headline), tagline = COALESCE($4, tagline), badge = COALESCE($5, badge), 
       updated_at = NOW() WHERE id = $6 RETURNING *`,
      [name, status, headline, tagline, badge, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    // Update active version if video/cta fields provided
    if (video_url !== undefined || cta_text !== undefined || cta_destination !== undefined || video_type !== undefined) {
      await db.query(
        `UPDATE campaign_versions SET 
          video_type = COALESCE($1, video_type), 
          video_url = COALESCE($2, video_url), 
          cta_text = COALESCE($3, cta_text), 
          cta_destination = COALESCE($4, cta_destination),
          updated_at = NOW()
        WHERE campaign_id = $5 AND is_active = true`,
        [video_type, video_url, cta_text, cta_destination, id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createVersion = async (req, res, next) => {
  try {
    const { id: campaignId } = req.params;
    const { video_type, video_url, cta_text, cta_destination, activate_immediately } = req.body;

    // Get next version number
    const maxVersion = await db.query(
      'SELECT COALESCE(MAX(version_number), 0) + 1 as next_version FROM campaign_versions WHERE campaign_id = $1',
      [campaignId]
    );
    const nextVersion = maxVersion.rows[0].next_version;

    // Deactivate current active version
    if (activate_immediately) {
      await db.query(
        'UPDATE campaign_versions SET is_active = false WHERE campaign_id = $1 AND is_active = true',
        [campaignId]
      );
    }

    const result = await db.query(
      `INSERT INTO campaign_versions (campaign_id, version_number, video_type, video_url, cta_text, cta_destination, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [campaignId, nextVersion, video_type, video_url, cta_text, cta_destination, activate_immediately]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

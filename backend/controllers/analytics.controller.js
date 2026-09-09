import { db } from '../config/db.js';

export const getOverview = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const [totalScans, uniqueScans, ctaClicks, activeQr] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM scan_events WHERE scanned_at >= $1', [since]),
      db.query('SELECT COUNT(DISTINCT session_id) as count FROM scan_events WHERE scanned_at >= $1', [since]),
      db.query('SELECT COUNT(*) as count FROM cta_clicks WHERE clicked_at >= $1', [since]),
      db.query("SELECT COUNT(*) as count FROM qr_codes WHERE status = 'active'"),
    ]);

    res.json({
      totalScans: parseInt(totalScans.rows[0].count),
      uniqueScans: parseInt(uniqueScans.rows[0].count),
      ctaClicks: parseInt(ctaClicks.rows[0].count),
      activeQr: parseInt(activeQr.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
};

export const getQRAnalytics = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT q.id, q.qr_id, q.name, q.status,
        COUNT(DISTINCT se.id) as total_scans,
        COUNT(DISTINCT se.session_id) as unique_scans,
        COUNT(DISTINCT cc.id) as cta_clicks
       FROM qr_codes q
       LEFT JOIN scan_events se ON se.qr_id = q.id
       LEFT JOIN cta_clicks cc ON cc.qr_id = q.id
       GROUP BY q.id ORDER BY total_scans DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getCampaignAnalytics = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT c.id, c.name, c.status, c.start_date, q.name as qr_name,
        COUNT(DISTINCT se.id) as total_scans,
        COUNT(DISTINCT cc.id) as cta_clicks
       FROM campaigns c
       JOIN qr_codes q ON c.qr_id = q.id
       LEFT JOIN campaign_versions v ON v.campaign_id = c.id
       LEFT JOIN scan_events se ON se.version_id = v.id
       LEFT JOIN cta_clicks cc ON cc.version_id = v.id
       GROUP BY c.id, q.name ORDER BY total_scans DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getVersionAnalytics = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT v.id, v.version_number, c.name as campaign_name, q.name as qr_name,
        v.video_url, v.cta_text, v.cta_destination, v.is_active,
        COUNT(DISTINCT se.id) as total_scans,
        COUNT(DISTINCT cc.id) as cta_clicks
       FROM campaign_versions v
       JOIN campaigns c ON v.campaign_id = c.id
       JOIN qr_codes q ON c.qr_id = q.id
       LEFT JOIN scan_events se ON se.version_id = v.id
       LEFT JOIN cta_clicks cc ON cc.version_id = v.id
       GROUP BY v.id, c.name, q.name ORDER BY total_scans DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getDeviceAnalytics = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT device_type, COUNT(*) as count FROM scan_events GROUP BY device_type ORDER BY count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getLocationAnalytics = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT city, country, COUNT(*) as count FROM scan_events 
       WHERE city != 'Unknown' GROUP BY city, country ORDER BY count DESC LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

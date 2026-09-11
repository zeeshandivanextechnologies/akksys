import { db } from '../config/db.js';

export const getLandingContent = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM landing_content WHERE id = 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Landing content not found' });
    }
    const row = result.rows[0];
    res.json({
      hero: row.hero,
      brand: row.brand,
      impact_stats: row.impact_stats,
      features: row.features,
      how_it_works: row.how_it_works,
      industry_solutions: row.industry_solutions,
      pricing: row.pricing,
      testimonials: row.testimonials,
      faq: row.faq,
      cta: row.cta,
      footer: row.footer,
      legal_pages: row.legal_pages,
      updated_at: row.updated_at,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLandingContent = async (req, res, next) => {
  try {
    const { hero, brand, impact_stats, features, how_it_works, industry_solutions, pricing, testimonials, faq, cta, footer, legal_pages } = req.body;

    const result = await db.query(
      `UPDATE landing_content SET
        hero = COALESCE($1, hero),
        features = COALESCE($2, features),
        how_it_works = COALESCE($3, how_it_works),
        industry_solutions = COALESCE($4, industry_solutions),
        pricing = COALESCE($5, pricing),
        testimonials = COALESCE($6, testimonials),
        faq = COALESCE($7, faq),
        cta = COALESCE($8, cta),
        footer = COALESCE($9, footer),
        brand = COALESCE($10, brand),
        impact_stats = COALESCE($11, impact_stats),
        legal_pages = COALESCE($12, legal_pages),
        updated_at = NOW()
      WHERE id = 1
      RETURNING *`,
      [
        hero ? JSON.stringify(hero) : null,
        features ? JSON.stringify(features) : null,
        how_it_works ? JSON.stringify(how_it_works) : null,
        industry_solutions ? JSON.stringify(industry_solutions) : null,
        pricing ? JSON.stringify(pricing) : null,
        testimonials ? JSON.stringify(testimonials) : null,
        faq ? JSON.stringify(faq) : null,
        cta ? JSON.stringify(cta) : null,
        footer ? JSON.stringify(footer) : null,
        brand ? JSON.stringify(brand) : null,
        impact_stats ? JSON.stringify(impact_stats) : null,
        legal_pages ? JSON.stringify(legal_pages) : null
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Landing content not found' });
    }

    const row = result.rows[0];
    res.json({
      message: 'Landing content updated successfully',
      hero: row.hero,
      features: row.features,
      how_it_works: row.how_it_works,
      industry_solutions: row.industry_solutions,
      pricing: row.pricing,
      testimonials: row.testimonials,
      faq: row.faq,
      cta: row.cta,
      footer: row.footer,
      updated_at: row.updated_at,
    });
  } catch (err) {
    next(err);
  }
};

export const getLandingStats = async (req, res, next) => {
  try {
    const scansResult = await db.query('SELECT COUNT(*) as total_scans FROM scan_events');
    const uniqueResult = await db.query('SELECT COUNT(DISTINCT session_id) as unique_scans FROM scan_events');
    const clicksResult = await db.query('SELECT COUNT(*) as total_clicks FROM cta_clicks');
    const qrResult = await db.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active') as active FROM qr_codes");
    const businessesResult = await db.query('SELECT COUNT(DISTINCT created_by) as count FROM qr_codes WHERE created_by IS NOT NULL');

    const totalScans = parseInt(scansResult.rows[0].total_scans) || 0;
    const uniqueScans = parseInt(uniqueResult.rows[0].unique_scans) || 0;
    const ctaClicks = parseInt(clicksResult.rows[0].total_clicks) || 0;
    const activeQR = parseInt(qrResult.rows[0].active) || 0;
    const totalQR = parseInt(qrResult.rows[0].total) || 0;
    const businesses = parseInt(businessesResult.rows[0].count) || 0;

    const avgCTR = totalScans > 0 ? ((ctaClicks / totalScans) * 100).toFixed(1) : '0.0';

    // Chart Data (Last 6 Months)
    const chartQuery = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', current_date) - interval '5 months',
          date_trunc('month', current_date),
          interval '1 month'
        ) AS month
      ),
      scans AS (
        SELECT date_trunc('month', scanned_at) AS month, COUNT(id) AS count
        FROM scan_events
        WHERE scanned_at >= date_trunc('month', current_date) - interval '5 months'
        GROUP BY 1
      ),
      clicks AS (
        SELECT date_trunc('month', clicked_at) AS month, COUNT(id) AS count
        FROM cta_clicks
        WHERE clicked_at >= date_trunc('month', current_date) - interval '5 months'
        GROUP BY 1
      )
      SELECT 
        to_char(m.month, 'Mon') as category,
        COALESCE(s.count, 0) as page_views,
        COALESCE(c.count, 0) as qr_scans
      FROM months m
      LEFT JOIN scans s ON m.month = s.month
      LEFT JOIN clicks c ON m.month = c.month
      ORDER BY m.month;
    `;
    
    const chartRes = await db.query(chartQuery);
    const categories = chartRes.rows.map(row => row.category);
    const pageViewsData = chartRes.rows.map(row => parseInt(row.page_views));
    const qrScansData = chartRes.rows.map(row => parseInt(row.qr_scans));

    res.json({
      totalScans,
      uniqueScans,
      ctaClicks,
      activeQR,
      totalQR,
      businesses,
      avgCTR: parseFloat(avgCTR),
      chartData: {
        categories,
        series: [
          { name: 'Page Views', data: pageViewsData },
          { name: 'QR Scans', data: qrScansData }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

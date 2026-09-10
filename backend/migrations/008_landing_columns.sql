ALTER TABLE landing_content ADD COLUMN IF NOT EXISTS brand JSONB DEFAULT '{
  "primaryColor": "#00C8FF",
  "secondaryColor": "#4DDCFF"
}';

ALTER TABLE landing_content ADD COLUMN IF NOT EXISTS impact_stats JSONB DEFAULT '[
  {"icon": "building", "label": "Businesses Empowered", "staticValue": "500+"},
  {"icon": "users", "label": "Customer Engagements", "staticValue": "2.4M+"},
  {"icon": "chart-line", "label": "Average CTR", "staticValue": "31.2%"},
  {"icon": "star", "label": "Customer Rating", "staticValue": "4.9/5"}
]';

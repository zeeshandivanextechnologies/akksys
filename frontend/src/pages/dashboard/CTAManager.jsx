import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'react-apexcharts';
import {
  FaLink, FaSave, FaEye, FaCheck, FaArrowUp, FaArrowDown,
  FaChartLine, FaMousePointer, FaShoppingCart,
  FaGlobe, FaMobileAlt, FaFileAlt, FaPlus, FaTrash, FaEdit,
  FaExternalLinkAlt, FaCopy, FaSyncAlt,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/Overview.css';
import '../../styles/CTAManager.css';

const CTAManager = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('configure');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [selectedQR, setSelectedQR] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [ctaList, setCtaList] = useState([]);
  const [selectedCtaId, setSelectedCtaId] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [presets, setPresets] = useState([]);
  const [overviewData, setOverviewData] = useState({ totalScans: 0, uniqueScans: 0, ctaClicks: 0, activeQr: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [qrAnalytics, setQrAnalytics] = useState([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetUrl, setNewPresetUrl] = useState('');

  const [ctaData, setCTAData] = useState({
    buttonText: 'Buy Now',
    destinationUrl: '',
    customText: '',
  });

  const fetchCTAs = useCallback(async () => {
    try {
      const res = await api.get('/cta');
      setCtaList(res.data);
      if (res.data.length > 0 && !selectedCtaId) {
        const first = res.data[0];
        setSelectedCtaId(first.id);
        setCTAData({
          buttonText: first.button_text || 'Buy Now',
          destinationUrl: first.destination_url || '',
          customText: '',
        });
        setSelectedQR(first.qr_id ? String(first.qr_id) : '');
      }
    } catch {
      toast.error('Failed to load CTAs');
    }
  }, []);

  const fetchQRs = useCallback(async () => {
    try {
      const res = await api.get('/qr');
      setQrCodes(res.data);
    } catch {
      toast.error('Failed to load QR codes');
    }
  }, []);

  const fetchPresets = useCallback(async () => {
    try {
      const res = await api.get('/redirect-presets');
      setPresets(res.data);
    } catch {
      // silent fail
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      const [overviewRes, dailyRes, qrRes] = await Promise.all([
        api.get('/analytics/overview', { params: { days: 7 } }),
        api.get('/analytics/overview/daily', { params: { days: 7 } }),
        api.get('/analytics/qr'),
      ]);
      setOverviewData(overviewRes.data);
      setDailyData(dailyRes.data);
      setQrAnalytics(qrRes.data);
    } catch {
      // analytics fail silently
    }
  }, []);

  useEffect(() => {
    fetchCTAs();
    fetchQRs();
    fetchOverview();
    fetchPresets();
  }, [fetchCTAs, fetchQRs, fetchOverview, fetchPresets]);

  const totalScans = overviewData.totalScans || 0;
  const ctaClicks = overviewData.ctaClicks || 0;
  const ctr = totalScans > 0 ? ((ctaClicks / totalScans) * 100).toFixed(1) : '0.0';

  const stats = [
    { title: 'TOTAL CLICKS', value: ctaClicks.toLocaleString(), change: '', trend: 'neutral', color: 'primary', icon: <FaMousePointer /> },
    { title: 'CONVERSIONS', value: totalScans.toLocaleString(), change: '', trend: 'neutral', color: 'blue', icon: <FaShoppingCart /> },
    { title: 'CTR', value: `${ctr}%`, change: '', trend: 'neutral', color: 'orange', icon: <FaChartLine /> },
    { title: 'ACTIVE CTAs', value: String(ctaList.filter(c => c.is_active).length), change: '', trend: 'neutral', color: 'green', icon: <FaLink /> },
  ];

  const buttonTexts = ['Buy Now', 'Explore', 'Apply Now', 'Shop Now', 'Learn More', 'Download', 'Sign Up', 'Get Started'];

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Poppins, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 0 },
    xaxis: {
      categories: dailyData.map(d => d.day),
      labels: { style: { fontSize: '12px', fontWeight: 500, colors: '#49636F' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: '12px', fontWeight: 500, colors: '#49636F' } },
    },
    grid: {
    borderColor: '#B8EEFF',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  colors: ['#00C8FF', '#0077FF'],
  legend: { show: false },
  tooltip: {
    theme: 'light',
    style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' },
  },
};


  const chartSeries = [
    { name: 'Clicks', data: dailyData.map(d => d.clicks) },
  ];

  const handleSave = async () => {
    if (!selectedCtaId) {
      toast.error('No CTA selected');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/cta/${selectedCtaId}`, {
        button_text: ctaData.buttonText,
        destination_url: ctaData.destinationUrl,
        qr_id: selectedQR ? Number(selectedQR) : null,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('CTA saved successfully');
    } catch {
      setSaving(false);
      toast.error('Failed to save CTA');
    }
  };

  const handleModalSave = async () => {
    await handleSave();
    await fetchCTAs();
    setShowEditModal(false);
  };

  const handleSelectPreset = (index) => {
    setSelectedPreset(index);
    setCTAData({
      ...ctaData,
      buttonText: presets[index].name === 'AKKSYS Website' ? 'Visit Website' : 'Buy Now',
      destinationUrl: presets[index].url,
    });
  };

  const handleAddPreset = async () => {
    try {
      const res = await api.post('/redirect-presets/create', {
        name: 'New Preset',
        url: 'https://',
        icon: 'globe',
        color: '#6943c8',
      });
      setPresets(prev => [...prev, res.data]);
      toast.success('Preset added');
    } catch {
      toast.error('Failed to add preset');
    }
  };

  const handleRemovePreset = async (id) => {
    try {
      await api.delete(`/redirect-presets/${id}`);
      setPresets(prev => prev.filter(p => p.id !== id));
      toast.success('Preset deleted');
    } catch {
      toast.error('Failed to delete preset');
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'shopping-cart': <FaShoppingCart />,
      'shopping-bag': <FaShoppingCart />,
      'globe': <FaGlobe />,
      'mobile-alt': <FaMobileAlt />,
      'file-alt': <FaFileAlt />,
    };
    return iconMap[iconName] || <FaGlobe />;
  };

  const tabs = [
    { id: 'configure', label: 'Configure CTA', icon: <FaLink /> },
    { id: 'tracking', label: 'Click Tracking', icon: <FaChartLine /> },
    { id: 'presets', label: 'Redirect Presets', icon: <FaSyncAlt /> },
  ];

  return (
    <div className="ov-wrapper">
      {/* Page Header */}
      <div className="ov-header">
        <div>
          <h4 className="ov-page-title">CTA Manager</h4>
          <p className="ov-page-subtitle">Configure and track call-to-action buttons for your QR codes</p>
        </div>
        <div className="ov-header-actions">
          <button className="thm-btn outline" onClick={() => {
            const qr = qrCodes.find(q => String(q.id) === selectedQR);
            if (qr) {
              window.open(`/r/${qr.qr_id}`, '_blank');
            } else {
              toast.info('Select a QR code first');
            }
          }}>
            <FaEye /> Preview
          </button>
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Saving...</>
            ) : saved ? (
              <><FaCheck /> Saved!</>
            ) : (
              <><FaSave /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row">
        {stats.map((stat, index) => (
          <div className="col-sm-6 col-lg-3 mb-3" key={index}>
            <div className="ov-stat-card">
              <div className="ov-stat-header">
                <span className="ov-stat-title">{stat.title}</span>
                <div className={`ov-stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="ov-stat-value">{stat.value}</div>
              <div className="ov-stat-footer">
                <span className={`ov-stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <FaArrowUp /> : stat.trend === 'down' ? <FaArrowDown /> : null}
                  {stat.change}
                </span>
                <span className="ov-stat-label">vs last week</span>
              </div>
              <div className={`ov-stat-bar ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="cta-tabs an-card">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`cta-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Row */}
      <div className="row">
        <div className="col-lg-8 col-md-6 col-sm-12 mb-3">
          {/* Configure CTA */}
          {activeTab === 'configure' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaLink className="me-2" />Configure CTA</h6>
                  <p className="ov-card-subtitle">Set up your call-to-action button</p>
                </div>
                <button className="thm-btn outline"  onClick={() => setShowEditModal(true)}>
                  <FaEdit /> Edit
                </button>
              </div>
              <div className="ov-card-body">
                {/* View Mode */}
                <div className="cta-view-mode">
                  <div className="cta-view-item">
                    <span className="cta-view-label">Button Text</span>
                    <span className="cta-view-value">{ctaData.buttonText}</span>
                  </div>
                  <div className="cta-view-item">
                    <span className="cta-view-label">Destination URL</span>
                    <span className="cta-view-value cta-view-url">{ctaData.destinationUrl}</span>
                  </div>
                  <div className="cta-view-item">
                    <span className="cta-view-label">Applied to QR</span>
                    <span className="cta-view-value">{qrCodes.find(q => String(q.id) === selectedQR)?.name || '—'}</span>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="cta-live-preview">
                  <div className="cta-preview-label">Live Preview</div>
                  <div className="cta-preview-box">
                    <div className="cta-preview-content">
                      <div className="cta-preview-icon">
                        <FaLink />
                      </div>
                      <div className="cta-preview-info">
                        <span className="cta-preview-button">{ctaData.buttonText} →</span>
                        <span className="cta-preview-url">{ctaData.destinationUrl}</span>
                      </div>
                    </div>
                    <span className="cta-preview-badge">● LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit CTA Modal */}
          {showEditModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(16, 14, 20, 0.6)', backdropFilter : "blur(4px)" }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content show-edit-model">
                  <div className="modal-header justify-content-between">
                    <h6 className="modal-title fw-bold">
                      <FaEdit className="me-2" /> Edit CTA Configuration
                    </h6>
                    <button type="button" className="cmp-back-btn" onClick={() => setShowEditModal(false)}> <FaTimes /> </button>
                  </div>
                  <div className="modal-body">
                    {/* Button Text Selection */}
                    <div className="custom-frm-bx">
                      <label className="cta-label">Button Text</label>
                      <div className="cta-button-options">
                        {buttonTexts.map((text, index) => (
                          <button
                            key={index}
                            className={`cta-button-option ${ctaData.buttonText === text ? 'active' : ''}`}
                            onClick={() => setCTAData({ ...ctaData, buttonText: text })}
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Button Text */}
                    <div className="custom-frm-bx">
                      <label className="cta-label">Custom Button Text</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Or enter custom text..."
                        value={ctaData.customText}
                        onChange={(e) => setCTAData({ ...ctaData, customText: e.target.value, buttonText: e.target.value })}
                      />
                    </div>

                    {/* Destination URL */}
                    <div className="custom-frm-bx">
                      <label className="cta-label">Destination URL</label>
                      <div className="cta-url-input">
                        <input
                          type="url"
                          className="form-control"
                          value={ctaData.destinationUrl}
                          onChange={(e) => setCTAData({ ...ctaData, destinationUrl: e.target.value })}
                        />
                        <button className="cmp-back-btn" onClick={() => { navigator.clipboard.writeText(ctaData.destinationUrl); toast.success('URL copied!'); }}>
                          <FaCopy />
                        </button>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="cta-live-preview">
                      <div className="cta-preview-label">Live Preview</div>
                      <div className="cta-preview-box">
                        <div className="cta-preview-content">
                          <div className="cta-preview-icon">
                            <FaLink />
                          </div>
                          <div className="cta-preview-info">
                            <span className="cta-preview-button">{ctaData.buttonText} →</span>
                            <span className="cta-preview-url">{ctaData.destinationUrl}</span>
                          </div>
                        </div>
                        <span className="cta-preview-badge">● LIVE</span>
                      </div>
                    </div>

                    {/* Apply to QR */}
                    <div className="custom-frm-bx mb-0">
                      <label className="cta-label">Apply to QR Code</label>
                      <select
                        className="form-control"
                        value={selectedQR}
                        onChange={(e) => setSelectedQR(e.target.value)}
                      >
                        <option value="">None</option>
                        {qrCodes.map(qr => (
                          <option key={qr.id} value={qr.id}>{qr.qr_id} - {qr.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="thm-btn outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                    <button className="thm-btn" onClick={handleModalSave}>
                      <FaSave className="me-1" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Click Tracking */}
          {activeTab === 'tracking' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaChartLine className="me-2" />CTA Click Tracking</h6>
                  <p className="ov-card-subtitle">Track performance across all QR codes</p>
                </div>
              </div>
              <div className="ov-card-body" style={qrCodes.length > 10 ? { maxHeight: '600px', overflowY: 'auto' } : {}}>
                {qrCodes.map((qr) => {
                  const clicks = parseInt(qr.cta_clicks) || 0;
                  const scans = parseInt(qr.total_scans) || 0;
                  const maxClicks = Math.max(...qrCodes.map(q => parseInt(q.cta_clicks) || 0), 1);
                  const percent = Math.round((clicks / maxClicks) * 100);
                  return (
                  <div key={qr.id} className="cta-tracking-item">
                    <div className="cta-tracking-info">
                      <span className="cta-tracking-id">{qr.qr_id}</span>
                      <span className="cta-tracking-name">{qr.name}</span>
                    </div>
                    <div className="cta-tracking-bar-container">
                      <div className="cta-tracking-bar-bg">
                        <div
                          className="cta-tracking-bar"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="cta-tracking-stats">
                      <span className="cta-tracking-clicks">{clicks.toLocaleString()}</span>
                      <span className="cta-tracking-percent">{percent}%</span>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Redirect Presets */}
          {activeTab === 'presets' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaSyncAlt className="me-2" />Redirect Presets</h6>
                  <p className="ov-card-subtitle">Quick redirect destinations for your CTAs</p>
                </div>
                <button className="thm-btn outline" onClick={handleAddPreset}>
                  <FaPlus /> Add Preset
                </button>
              </div>
              <div className="ov-card-body">
                {presets.map((preset, index) => (
                  <div
                    key={preset.id}
                    className={`cta-preset-item ${selectedPreset === index ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(index)}
                  >
                    <div className="cta-preset-icon" style={{ background: `${preset.color}15`, color: preset.color }}>
                      {getIconComponent(preset.icon)}
                    </div>
                    <div className="cta-preset-info">
                      <span className="cta-preset-name">{preset.name}</span>
                      <span className="cta-preset-url">{preset.url}</span>
                    </div>
                    <div className="cta-preset-actions">
                      <button className="cta-preset-action " onClick={(e) => { e.stopPropagation(); window.open(preset.url, '_blank'); }}>
                        <FaExternalLinkAlt />
                      </button>
                      <button className="cta-preset-action danger" onClick={(e) => { e.stopPropagation(); handleRemovePreset(preset.id); }}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Custom Preset */}
                <div className="cta-add-preset">
                  <h6 className="cta-add-preset-title">Add Custom Preset</h6>
                  <div className="row">
                    <div className="col-md-5">
                      <div className="custom-frm-bx mb-0">
                        <label className="cta-label">Preset Name</label>
                        <input type="text" className="form-control" placeholder="e.g., My Website" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="custom-frm-bx mb-0">
                        <label className="cta-label">URL</label>
                        <input type="url" className="form-control" placeholder="https://" value={newPresetUrl} onChange={(e) => setNewPresetUrl(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button className="thm-btn outline w-100" onClick={async () => {
                        if (!newPresetName.trim() || !newPresetUrl.trim()) {
                          toast.error('Name and URL required');
                          return;
                        }
                        try {
                          const res = await api.post('/redirect-presets/create', { name: newPresetName, url: newPresetUrl });
                          setPresets(prev => [...prev, res.data]);
                          setNewPresetName('');
                          setNewPresetUrl('');
                          toast.success('Preset added');
                        } catch {
                          toast.error('Failed to add preset');
                        }
                      }}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          {/* Quick Stats */}
          <div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaMousePointer className="me-2" />Quick Stats</h6>
                <p className="ov-card-subtitle">This week's performance</p>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="cta-quick-stats">
                <div className="cta-quick-stat">
                  <span className="cta-quick-stat-label">Total Clicks</span>
                  <span className="cta-quick-stat-value">{overviewData.ctaClicks?.toLocaleString() || '0'}</span>
                </div>
                <div className="cta-quick-stat">
                  <span className="cta-quick-stat-label">Unique Clicks</span>
                  <span className="cta-quick-stat-value">{overviewData.uniqueScans?.toLocaleString() || '0'}</span>
                </div>
                <div className="cta-quick-stat">
                  <span className="cta-quick-stat-label">Conversion Rate</span>
                  <span className="cta-quick-stat-value">{ctr}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
<div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaChartLine className="me-2" />Performance</h6>
                <p className="ov-card-subtitle">Daily clicks this week</p>
              </div>
            </div>
            <div className="ov-apex-chart">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={200}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
<div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaArrowUp className="me-2" />Top Performing</h6>
                <p className="ov-card-subtitle">Best CTA this week</p>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="cta-top-performing">
                {qrAnalytics
                  .filter(q => parseInt(q.cta_clicks) > 0)
                  .slice(0, 3)
                  .map((qr, i) => (
                  <div key={qr.id} className="cta-top-item">
                    <div className="cta-top-rank">{i + 1}</div>
                    <div className="cta-top-info">
                      <span className="cta-top-name">{qr.name}</span>
                      <span className="cta-top-clicks">{parseInt(qr.cta_clicks).toLocaleString()} clicks</span>
                    </div>
                  </div>
                ))}
                {qrAnalytics.filter(q => parseInt(q.cta_clicks) > 0).length === 0 && (
                  <p style={{ color: '#8892a4', fontSize: '13px' }}>No CTA clicks yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CTAManager;

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
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [ctaActive, setCtaActive] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ctaList, setCtaList] = useState([]);
  const [selectedCtaId, setSelectedCtaId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [presets, setPresets] = useState([]);
  const [overviewData, setOverviewData] = useState({ totalScans: 0, uniqueScans: 0, ctaClicks: 0, activeQr: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [qrAnalytics, setQrAnalytics] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
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
        setSelectedCampaign(first.campaign_id ? String(first.campaign_id) : '');
        setCtaActive(first.is_active !== false);
      }
    } catch {
      toast.error('Failed to load CTAs');
    }
  }, []);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await api.get('/campaign');
      setCampaigns(res.data);
    } catch {
      toast.error('Failed to load campaigns');
    }
  }, []);

  const fetchQRs = useCallback(async () => {
    try {
      const res = await api.get('/qr');
      setQrCodes(res.data);
    } catch {
      // silent fail for QR data
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
    fetchCampaigns();
    fetchQRs();
    fetchOverview();
    fetchPresets();
  }, [fetchCTAs, fetchCampaigns, fetchQRs, fetchOverview, fetchPresets]);

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
    setSaving(true);
    try {
      if (!selectedCtaId) {
        const res = await api.post('/cta/create', {
          button_text: ctaData.buttonText,
          destination_url: ctaData.destinationUrl,
          campaign_id: selectedCampaign ? Number(selectedCampaign) : null,
          is_active: ctaActive,
        });
        setSelectedCtaId(res.data.id);
        toast.success('CTA created successfully');
      } else {
        await api.put(`/cta/${selectedCtaId}`, {
          button_text: ctaData.buttonText,
          destination_url: ctaData.destinationUrl,
          campaign_id: selectedCampaign ? Number(selectedCampaign) : null,
          is_active: ctaActive,
        });
        toast.success('CTA saved successfully');
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return true;
    } catch {
      setSaving(false);
      toast.error('Failed to save CTA');
      return false;
    }
  };

  const handleModalSave = async () => {
    const success = await handleSave();
    if (success) {
      await fetchCTAs();
      setShowEditModal(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedCtaId(null);
    setCTAData({
      buttonText: 'Buy Now',
      destinationUrl: '',
      customText: '',
    });
    setSelectedCampaign('');
    setCtaActive(true);
    setShowEditModal(true);
  };

  const handleEditClick = (cta) => {
    setSelectedCtaId(cta.id);
    setCTAData({
      buttonText: cta.button_text,
      destinationUrl: cta.destination_url,
      customText: '',
    });
    setSelectedCampaign(cta.campaign_id ? String(cta.campaign_id) : '');
    setCtaActive(cta.is_active !== false);
    setShowEditModal(true);
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
            const selectedCta = ctaList.find(c => c.id === selectedCtaId);
            if (selectedCta?.qr_id) {
              window.open(`/r/QR${selectedCta.qr_id}`, '_blank');
            } else if (selectedCampaign) {
              toast.info('Preview available after QR code is linked');
            } else {
              toast.info('Select a campaign first');
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
                  <p className="ov-card-subtitle">Manage all your call-to-action buttons</p>
                </div>
                <button className="thm-btn outline" onClick={handleCreateNew}>
                  <FaPlus /> Create New CTA
                </button>
              </div>
              <div className="ov-card-body p-0">
                <div className="dq-table-wrapper" style={{ margin: 0, borderRadius: '0 0 16px 16px' }}>
                  <table className="dq-table table-responsive mb-0">
                    <thead>
                      <tr>
                        <th className="dq-th">Button Text</th>
                        <th className="dq-th">Destination URL</th>
                        <th className="dq-th">Applied to Campaign</th>
                        <th className="dq-th">Status</th>
                        <th className="dq-th text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ctaList.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted" style={{ borderBottom: 'none' }}>
                            <p className="mb-2" style={{color : "#ddd"}}>No CTAs found. Create your first one!</p>
                            <button className="thm-btn outline mt-2" onClick={handleCreateNew}>
                              <FaPlus /> Create New CTA
                            </button>
                          </td>
                        </tr>
                      ) : (
                        ctaList.map((cta) => (
                          <tr key={cta.id} className="dq-tr">
                            <td className="dq-td fw-bold" style={{ color: '#fff' }}>{cta.button_text}</td>
                            <td className="dq-td">
                              <a href={(cta.destination_url || '').startsWith('http') ? cta.destination_url : `https://${cta.destination_url}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#00C8FF' }}>
                                {cta.destination_url}
                              </a>
                            </td>
                            <td className="dq-td">{cta.campaign_name || '—'}</td>
                            <td className="dq-td">
                              <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: cta.is_active ? 'rgba(0, 200, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)', color: cta.is_active ? '#00C8FF' : '#aaa' }}>
                                {cta.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="dq-td text-center">
                              <button className="thm-btn outline" onClick={() => handleEditClick(cta)} style={{ padding: '6px 12px', fontSize: '12px', minHeight: 'unset' }}>
                                <FaEdit className="me-1" /> Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
                      {selectedCtaId ? (
                        <><FaEdit className="me-2 text-primary" /> Edit CTA Configuration</>
                      ) : (
                        <><FaPlus className="me-2 text-primary" /> Create New CTA</>
                      )}
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

                    {/* Apply to Campaign */}
                    <div className="custom-frm-bx">
                      <label className="cta-label">Apply to Campaign</label>
                      <select
                        className="form-control"
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                      >
                        <option value="">None</option>
                        {campaigns.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Active Status */}
                    <div className="custom-frm-bx mb-0">
                      <label className="cta-label">Status</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={ctaActive} onChange={() => setCtaActive(!ctaActive)} style={{ display: 'none' }} />
                          <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: ctaActive ? '#00C8FF' : '#444',
                            borderRadius: '24px', transition: '0.3s'
                          }}>
                            <span style={{
                              position: 'absolute', top: '2px', left: ctaActive ? '24px' : '2px',
                              width: '20px', height: '20px', backgroundColor: '#fff',
                              borderRadius: '50%', transition: '0.3s'
                            }}></span>
                          </span>
                        </label>
                        <span style={{ fontSize: '13px', color: ctaActive ? '#00C8FF' : '#888' }}>
                          {ctaActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
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
                  .slice(0, 5)
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

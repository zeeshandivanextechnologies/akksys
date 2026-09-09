import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import {
  FaDownload, FaEdit, FaTrash, FaArrowLeft, FaCopy, FaEye,
  FaChartLine, FaMousePointer, FaGlobeAsia,
  FaHistory, FaToggleOn, FaToggleOff, FaArrowUp
} from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import QRDownloadModal from '../../components/adminUI/QRDownloadModal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loader from './Loader';
import '../../styles/Overview.css';
import '../../styles/QRDetail.css';

const QRDetail = () => {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [qrRes, campRes] = await Promise.all([
        api.get('/qr'),
        api.get('/campaign'),
      ]);

      const qr = qrRes.data.find(q => q.qr_id === qrId);
      if (!qr) {
        toast.error('QR code not found');
        navigate('/admin/dynamic-qr');
        return;
      }

      const totalScans = parseInt(qr.total_scans) || 0;
      const uniqueScans = parseInt(qr.unique_scans) || 0;
      const ctaClicks = parseInt(qr.cta_clicks) || 0;
      const ctr = totalScans > 0 ? ((ctaClicks / totalScans) * 100).toFixed(1) : '0.0';

      setQrData({
        id: qr.id,
        qrId: qr.qr_id,
        name: qr.name,
        url: `akksys.in/r/${qr.qr_id}`,
        created: new Date(qr.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: qr.status,
        totalScans,
        uniqueScans,
        ctaClicks,
        ctr,
        currentVideoUrl: qr.current_video_url || '—',
        logoUrl: qr.logo_url || null,
      });
      setNewName(qr.name);

      const qrCampaigns = campRes.data.filter(c => c.qr_id === qrId || c.qr_id === qr.id);
      setCampaigns(qrCampaigns);

      if (qrCampaigns.length > 0) {
        const versionsPromises = qrCampaigns.map(c => api.get(`/campaign/${c.id}`));
        const versionsRes = await Promise.all(versionsPromises);
        const allVersions = [];
        versionsRes.forEach((res) => {
          const camp = res.data;
          (camp.versions || []).forEach(v => {
            allVersions.push({
              version: `v${v.version_number}`,
              campaign: camp.name,
              date: new Date(v.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              video: v.video_url || '—',
              cta: v.cta_text ? `${v.cta_text} → ${v.cta_destination || ''}` : '—',
              scans: 0,
              status: v.is_active ? 'active' : 'completed',
            });
          });
        });
        allVersions.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
        setVersionHistory(allVersions);
      }
    } catch (err) {
      console.error('Failed to fetch QR detail', err);
      toast.error('Failed to load QR data');
    } finally {
      setLoading(false);
    }
  }, [qrId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async () => {
    if (!qrData) return;
    try {
      await api.put(`/qr/${qrData.id}/toggle`);
      setQrData(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'paused' : 'active',
      }));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!qrData) return;
    if (!window.confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) return;
    try {
      await api.delete(`/qr/${qrData.id}`);
      toast.success('QR code deleted');
      navigate('/admin/dynamic-qr');
    } catch {
      toast.error('Failed to delete QR code');
    }
  };

  const handleSaveName = async () => {
    if (!qrData || !newName.trim()) return;
    try {
      await api.put(`/qr/${qrData.id}`, { name: newName.trim() });
      setQrData(prev => ({ ...prev, name: newName.trim() }));
      setEditingName(false);
      toast.success('Name updated');
    } catch {
      toast.error('Failed to update name');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${qrData?.url}`);
    toast.success('URL copied!');
  };

  if (loading) return <Loader />;
  if (!qrData) return null;

  const weeklyData = [
    { day: 'Mon', scans: 198, clicks: 62 },
    { day: 'Tue', scans: 245, clicks: 78 },
    { day: 'Wed', scans: 178, clicks: 45 },
    { day: 'Thu', scans: 312, clicks: 89 },
    { day: 'Fri', scans: 289, clicks: 72 },
    { day: 'Sat', scans: 156, clicks: 38 },
    { day: 'Sun', scans: 134, clicks: 43 },
  ];

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
      categories: weeklyData.map(d => d.day),
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
      padding: { top: -10, bottom: -5 },
    },
    colors: ['#00C8FF', '#0077FF'],
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' },
    },
  };

  const chartSeries = [
    { name: 'Scans', data: weeklyData.map(d => d.scans) },
    { name: 'CTA Clicks', data: weeklyData.map(d => d.clicks) },
  ];

  const deviceData = [
    { type: 'Android', percent: 64, color: '#00C8FF' },
    { type: 'iOS', percent: 31, color: '#0077FF' },
    { type: 'Other', percent: 5, color: '#4DDCFF' },
  ];

  const donutOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Poppins, sans-serif',
    },
    plotOptions: {
      donut: {
        size: '72%',
        donut: { size: '60%' },
      },
    },
    dataLabels: { enabled: false },
    labels: deviceData.map(d => d.type),
    colors: ['#00C8FF', '#0077FF', '#4DDCFF'],
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' },
      y: { formatter: (val) => `${val}%` },
    },
    stroke: { width: 2, colors: ['#E6F9FF'] },
    states: { hover: { filter: { type: 'none' } } },
  };

  const donutSeries = deviceData.map(d => d.percent);

  const locations = [
    { city: 'Mumbai', scans: 387, percent: 31 },
    { city: 'Delhi', scans: 284, percent: 23 },
    { city: 'Bengaluru', scans: 198, percent: 16 },
    { city: 'Hyderabad', scans: 142, percent: 11 },
    { city: 'Others', scans: 236, percent: 19 },
  ];

  const stats = [
    {
      title: 'TOTAL SCANS',
      value: qrData.totalScans.toLocaleString(),
      change: '+12.4%',
      trend: 'up',
      color: 'primary',
      icon: <FaChartLine />,
    },
    {
      title: 'UNIQUE SCANS',
      value: qrData.uniqueScans.toLocaleString(),
      change: '+8.1%',
      trend: 'up',
      color: 'blue',
      icon: <FaGlobeAsia />,
    },
    {
      title: 'CTA CLICKS',
      value: qrData.ctaClicks.toLocaleString(),
      change: '+18.3%',
      trend: 'up',
      color: 'orange',
      icon: <FaMousePointer />,
    },
    {
      title: 'CTR',
      value: `${qrData.ctr}%`,
      change: qrData.ctr + '%',
      trend: 'up',
      color: 'green',
      icon: <FaChartLine />,
    },
  ];

  const currentCampaign = campaigns.find(c => c.status === 'active') || campaigns[0] || null;

  return (
    <>
      <div className="ov-wrapper">
        {/* Header */}
        <div className="ov-header">
          <div className="d-flex align-items-center gap-3">
            <button className="cmp-back-btn" onClick={() => navigate('/admin/dynamic-qr')}>
              <FaArrowLeft />
            </button>
            <div>
              {editingName ? (
                <div className="d-flex align-items-center gap-2">
                  <div className='custom-frm-bx mb-2'>
                    <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditingName(false); setNewName(qrData.name); } }}
                    autoFocus
                    style={{ maxWidth: '300px' }}
                  />
                  </div>
                  <button className="thm-btn" style={{ padding: '6px 12px' }} onClick={handleSaveName}>Save</button>
                  <button className="thm-btn outline" style={{ padding: '6px 12px' }} onClick={() => { setEditingName(false); setNewName(qrData.name); }}>Cancel</button>
                </div>
              ) : (
                <h4 className="ov-page-title">
                  {qrData.name}
                  <FaEdit
                    size={14}
                    style={{ cursor: 'pointer', marginLeft: '8px', opacity: 0.6 }}
                    onClick={() => setEditingName(true)}
                  />
                </h4>
              )}
              <div className="ov-page-subtitle">
                <span className="ov-url-badge" onClick={handleCopyUrl}>
                  <FaCopy size={10} /> {qrData.url}
                </span>
              </div>
            </div>
          </div>
          <div className="ov-header-actions">
            <button className="thm-btn outline" onClick={() => setShowDownloadModal(true)}>
              <FaDownload /> Download QR
            </button>
            <a
              href={`https://${qrData.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="thm-btn outline"
              style={{ textDecoration: 'none' }}
            >
              <FaEye /> Preview
            </a>
            {qrData.status === 'active' ? (
              <button className="thm-lg-btn ov-btn-danger" onClick={handleToggle}>
                <FaToggleOff /> Deactivate
              </button>
            ) : (
              <button className="thm-lg-btn ov-btn-success" onClick={handleToggle}>
                <FaToggleOn /> Activate
              </button>
            )}
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
                    <FaArrowUp /> {stat.change}
                  </span>
                  <span className="ov-stat-label">vs last week</span>
                </div>
                <div className={`ov-stat-bar ${stat.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ov-tabs mb-3">
          <button
            className={`ov-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine /> Analytics
          </button>
          <button
            className={`ov-tab ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            <FaHistory /> Version History
          </button>
          <button
            className={`ov-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaEdit /> Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && (
          <div className="row">
            {/* Daily Scans Chart */}
            <div className="col-md-6 col-lg-6 col-sm-12 mb-3">
              <div className="ov-card ov-chart-card">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title">Daily Scans & CTA Clicks</h6>
                    <p className="ov-card-subtitle">Last 7 Days Performance</p>
                  </div>
                  <div className="ov-legend">
                    <span className="ov-legend-item">
                      <span className="ov-dot primary"></span>Scans
                    </span>
                    <span className="ov-legend-item">
                      <span className="ov-dot accent"></span>CTA Clicks
                    </span>
                  </div>
                </div>
                <div className="ov-apex-chart">
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={270}
                  />
                </div>
              </div>
            </div>

            {/* Device Split */}
            <div className="col-md-6 col-lg-6 col-sm-12 mb-3">
              <div className="ov-card ov-chart-card">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title">Device Split</h6>
                    <p className="ov-card-subtitle">By Platform</p>
                  </div>
                </div>
                <div className="ov-apex-chart">
                  <Chart
                    options={donutOptions}
                    series={donutSeries}
                    type="donut"
                    height={180}
                  />
                  <div className="ov-donut-total">
                    <span className="ov-donut-total-value">{qrData.totalScans.toLocaleString()}</span>
                    <span className="ov-donut-total-label">Total Scans</span>
                  </div>
                </div>
                <div className="ov-device-list">
                  {deviceData.map((device, i) => (
                    <div key={i} className="ov-device-item">
                      <div className="ov-device-info">
                        <span className="ov-dot" style={{ background: device.color }}></span>
                        <span className="ov-device-name">{device.type}</span>
                      </div>
                      <span className="ov-device-percent">{device.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="col-12 col-lg-6 mb-3">
              <div className="ov-card">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title"><FaGlobeAsia className="me-2" /> Top Locations</h6>
                    <p className="ov-card-subtitle">Where your scans are coming from</p>
                  </div>
                </div>
                <div className="ov-locations-list">
                  {locations.map((loc, i) => (
                    <div key={i} className="ov-location-item">
                      <div className="ov-location-info">
                        <span className="ov-location-city">{loc.city}</span>
                        <span className="ov-location-badge">IN</span>
                      </div>
                      <div className="ov-location-stats">
                        <div className="ov-location-bar-bg">
                          <div className="ov-location-bar" style={{ width: `${loc.percent}%` }}></div>
                        </div>
                        <div className="ov-location-numbers">
                          <span className="ov-location-scans">{loc.scans.toLocaleString()}</span>
                          <span className="ov-location-percent">{loc.percent}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Performance */}
            <div className="col-12 col-lg-6 mb-3">
              <div className="ov-card ov-chart-card">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title"><FaMousePointer className="me-2" /> CTA Performance</h6>
                    <p className="ov-card-subtitle">Click-through Analysis</p>
                  </div>
                </div>
                <div className="ov-cta-info">
                  <div className="ov-cta-logo">B</div>
                  <div>
                    <div className="ov-cta-text">{currentCampaign?.name || 'No Campaign'} →</div>
                    <div className="ov-cta-dest">{qrData.currentVideoUrl}</div>
                  </div>
                  <div className="ov-cta-clicks">
                    <span className="ov-cta-clicks-value">{qrData.ctaClicks}</span>
                    <span className="ov-cta-clicks-label">clicks</span>
                  </div>
                </div>
                <div className="ov-apex-chart" style={{ height: '120px' }}>
                  <Chart
                    options={{
                      ...chartOptions,
                      colors: ['#00C8FF'],
                      xaxis: {
                        ...chartOptions.xaxis,
                        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      },
                    }}
                    series={[{ name: 'Clicks', data: weeklyData.map(d => d.clicks) }]}
                    type="bar"
                    height={120}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaHistory className="me-2" /> Campaign & Version History</h6>
                <p className="ov-card-subtitle">QR ID remains permanent across all versions</p>
              </div>
            </div>
            {versionHistory.length === 0 ? (
              <div className="ov-card-body text-center py-4" style={{ color: '#8892a4' }}>
                <FaHistory size={32} className="mb-2" style={{ opacity: 0.4 }} />
                <p>No version history yet. Create a campaign to get started.</p>
              </div>
            ) : (
              <div className="ov-timeline">
                {versionHistory.map((version, i) => (
                  <div key={i} className={`ov-timeline-item ${version.status === 'active' ? 'active' : ''}`}>
                    <div className="ov-timeline-marker">
                      <div className={`ov-timeline-dot ${version.status === 'active' ? 'active' : ''}`}></div>
                      {i < versionHistory.length - 1 && <div className="ov-timeline-line"></div>}
                    </div>
                    <div className="ov-timeline-content">
                      <div className="ov-timeline-header">
                        <div>
                          <span className={`ov-timeline-badge ${version.status === 'active' ? 'current' : 'past'}`}>
                            {version.status === 'active' ? 'CURRENT' : 'PAST'}
                          </span>
                          <div className="ov-timeline-title">{version.campaign}</div>
                        </div>
                        <span className="ov-timeline-date">{version.date}</span>
                      </div>
                      <div className="ov-timeline-details">
                        <span className="ov-timeline-detail">
                          Video: <strong>{version.video}</strong>
                        </span>
                        <span className="ov-timeline-detail">
                          CTA: <strong>{version.cta}</strong>
                        </span>
                        <span className="ov-timeline-detail">
                          Scans: <strong>{version.scans.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
              <div className="ov-card mb-3 h-auto">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title">QR Code Details</h6>
                    <p className="ov-card-subtitle">Manage your QR code settings</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <div className="custom-frm-bx">
                    <label className="">Campaign Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="custom-frm-bx">
                    <label className="">QR Short URL</label>
                    <div className="input-group">
                      <span className="input-group-text qr-short-title border-0">https://</span>
                      <input type="text" className="form-control" value={qrData.url} readOnly />
                    </div>
                  </div>
                  <div className="custom-frm-bx mb-0">
                    <label className="">Brand Logo</label>
                    <div className="d-flex align-items-center gap-3">
                      <div className="ov-logo-box">AK</div>
                      <button className="thm-btn outline">Change Logo</button>
                      <button className="thm-lg-btn ov-btn-danger">Remove</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ov-card h-auto">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title">Current Campaign</h6>
                    <p className="ov-card-subtitle">Video and CTA settings</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <div className="custom-frm-bx">
                    <label className="">Video Source</label>
                    <input type="text" className="form-control" value={qrData.currentVideoUrl} readOnly />
                  </div>
                  <div className="custom-frm-bx mb-0">
                    <label className="">Current Campaign</label>
                    <input type="text" className="form-control" value={currentCampaign?.name || 'No campaign'} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
              <div className="ov-card mb-3 h-auto">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title">QR Preview</h6>
                    <p className="ov-card-subtitle">Your QR code</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <div className="ov-qr-preview">
                    <div className="ov-qr-preview-inner">
                      <QRCodeCanvas
                        value={`https://${qrData.url}`}
                        size={150}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#0f1629"
                      />
                      <div className="ov-qr-preview-logo">
                        <div className="ov-qr-preview-logo-inner">AK</div>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <button className="thm-btn outline w-100" onClick={() => setShowDownloadModal(true)}>
                      <FaDownload /> Download QR
                    </button>
                    <a
                      href={`https://${qrData.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="thm-btn outline w-100"
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      <FaEye /> Preview Landing Page
                    </a>
                  </div>
                </div>
              </div>

              <div className="ov-card ov-danger-zone h-auto">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title ov-danger-title"><FaTrash className="me-2" /> Danger Zone</h6>
                    <p className="ov-card-subtitle">Irreversible action</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <p className="small mb-3 text-white">Permanently delete this QR code and all its data.</p>
                  <button className="thm-lg-btn ov-btn-danger w-100" onClick={handleDelete}>
                    <FaTrash /> Delete QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <QRDownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        qrName={qrData.name}
        qrUrl={qrData.url}
        logoUrl={qrData.logoUrl}
      />
    </>
  );
};

export default QRDetail;

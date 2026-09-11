import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { 
  FaChartLine, FaQrcode, FaMobileAlt, FaDesktop, 
  FaGlobeAsia, FaCalendarAlt, FaFilter, FaDownload, FaEye, FaMousePointer 
} from 'react-icons/fa';
import api from '../../services/api';
import Loader from './Loader';
import '../../styles/Analytics.css';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const DEVICE_COLORS = ['#00C8FF', '#0077FF', '#4DDCFF', '#003366', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  const [overviewStats, setOverviewStats] = useState({ totalScans: 0, uniqueScans: 0, ctaClicks: 0, activeQr: 0 });
  const [qrAnalytics, setQrAnalytics] = useState([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState([]);
  const [versionAnalytics, setVersionAnalytics] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, dailyRes, qrRes, campaignRes, versionRes, devicesRes, locationsRes] = await Promise.all([
        api.get(`/analytics/overview?days=${dateRange}`),
        api.get(`/analytics/overview/daily?days=${dateRange}`),
        api.get(`/analytics/qr?days=${dateRange}`),
        api.get(`/analytics/campaign?days=${dateRange}`),
        api.get(`/analytics/version?days=${dateRange}`),
        api.get(`/analytics/devices?days=${dateRange}`),
        api.get(`/analytics/locations?days=${dateRange}`),
      ]);

      setOverviewStats(overviewRes.data);
      setDailyData(dailyRes.data);

      const qrRows = qrRes.data || [];
      setQrAnalytics(qrRows.map(qr => ({
        id: qr.qr_id,
        name: qr.name,
        url: `${window.location.host}/r/${qr.qr_id}`,
        scans: parseInt(qr.total_scans) || 0,
        unique: parseInt(qr.unique_scans) || 0,
        ctaClicks: parseInt(qr.cta_clicks) || 0,
        ctr: parseInt(qr.total_scans) > 0
          ? ((parseInt(qr.cta_clicks) / parseInt(qr.total_scans)) * 100).toFixed(1)
          : '0.0',
        status: qr.status,
      })));

      const campaignRows = campaignRes.data || [];
      setCampaignAnalytics(campaignRows.map(c => ({
        id: c.id,
        name: c.name,
        qr: c.qr_name,
        scans: parseInt(c.total_scans) || 0,
        ctaClicks: parseInt(c.cta_clicks) || 0,
        startDate: c.start_date ? new Date(c.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        status: c.status,
      })));

      const versionRows = versionRes.data || [];
      setVersionAnalytics(versionRows.map(v => ({
        campaign: v.campaign_name,
        version: `v${v.version_number}`,
        qr: v.qr_name,
        scans: parseInt(v.total_scans) || 0,
        ctaClicks: parseInt(v.cta_clicks) || 0,
        video: v.video_url ? v.video_url.split('/').pop() : '—',
        cta: v.cta_text ? `${v.cta_text} → ${v.cta_destination || '—'}` : '—',
        status: v.is_active ? 'active' : 'completed',
      })));

      const deviceRows = devicesRes.data || [];
      const totalDeviceScans = deviceRows.reduce((acc, r) => acc + parseInt(r.count), 0);
      setDeviceData(deviceRows.map((d, i) => ({
        type: d.device_type || 'Other',
        scans: parseInt(d.count) || 0,
        percent: totalDeviceScans > 0 ? Math.round((parseInt(d.count) / totalDeviceScans) * 100) : 0,
        color: DEVICE_COLORS[i % DEVICE_COLORS.length],
      })));

      const locationRows = locationsRes.data || [];
      const totalLocScans = locationRows.reduce((acc, r) => acc + parseInt(r.count), 0);
      setLocationData(locationRows.map(l => ({
        city: l.city,
        country: l.country,
        scans: parseInt(l.count) || 0,
        percent: totalLocScans > 0 ? Math.round((parseInt(l.count) / totalLocScans) * 100) : 0,
      })));
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

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
      labels: { style: { fontSize: '11px', fontWeight: 500, colors: '#49636F' } },
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
    colors: deviceData.map(d => d.color),
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' },
      y: { formatter: (val) => `${val}%` },
    },
    stroke: { width: 2, colors: ['#fff'] },
    states: { hover: { filter: { type: 'none' } } },
  };

  const donutSeries = deviceData.map(d => d.percent);
  const chartSeries = [
    { name: 'Scans', data: dailyData.map(d => d.scans) },
    { name: 'CTA Clicks', data: dailyData.map(d => d.clicks) },
  ];

  const tabs = [
    { key: 'overview', icon: <FaChartLine />, label: 'Overview' },
    { key: 'qr', icon: <FaQrcode />, label: 'QR-wise' },
    { key: 'campaign', icon: <FaFilter />, label: 'Campaign-wise' },
    { key: 'version', icon: <FaCalendarAlt />, label: 'Version-wise' },
    { key: 'devices', icon: <FaMobileAlt />, label: 'Devices' },
    { key: 'locations', icon: <FaGlobeAsia />, label: 'Locations' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="an-page-wrapper ov-wrapper ">
      <div className="an-header">
        <div>
          <h4 className="an-page-title">Analytics Dashboard</h4>
          <p className="an-page-subtitle">Track QR scans, campaigns, versions and CTA performance</p>
        </div>
        <div className="an-header-actions">
          <select 
            className="an-action-btn"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">This Year</option>
          </select>
          <button className="thm-btn">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row">
        <div className="col-md-6 col-lg-3 col-sm-3 mb-3">
          <div className="an-stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div className="an-stat-label">Total Scans</div>
              <div className="an-stat-icon green">
                <FaChartLine />
              </div>
            </div>
            <div className="an-stat-value">{overviewStats.totalScans.toLocaleString()}</div>
            <span className="an-stat-badge green">—</span>
            <div className="an-stat-bar green"></div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 col-sm-3 mb-3">
          <div className="an-stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div className="an-stat-label">Unique Scans</div>
              <div className="an-stat-icon blue">
                <FaEye />
              </div>
            </div>
            <div className="an-stat-value">{overviewStats.uniqueScans.toLocaleString()}</div>
            <span className="an-stat-badge blue">—</span>
            <div className="an-stat-bar blue"></div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 col-sm-3 mb-3">
          <div className="an-stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div className="an-stat-label">CTA Clicks</div>
              <div className="an-stat-icon orange">
                <FaMousePointer />
              </div>
            </div>
            <div className="an-stat-value">{overviewStats.ctaClicks.toLocaleString()}</div>
            <span className="an-stat-badge orange">—</span>
            <div className="an-stat-bar orange"></div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 col-sm-3 mb-3">
          <div className="an-stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div className="an-stat-label">Active QR Codes</div>
              <div className="an-stat-icon purple">
                <FaQrcode />
              </div>
            </div>
            <div className="an-stat-value">{overviewStats.activeQr}</div>
            <div className="an-stat-bar purple"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="an-card mb-3">
        <div className="an-tabs">
          {tabs.map((tab) => (
            <button 
              key={tab.key}
              className={`an-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row ">
          <div className="col-md-6 col-sm-12 col-lg-8 mb-3">
            <div className="an-card h-100">
              <div className="an-card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="an-card-title mb-0">Scans &amp; CTA Clicks — Last {dateRange} Days</h6>
                  <div className="an-chart-legend">
                    <span className="an-chart-legend-item">
                      <span className="an-chart-legend-dot purple"></span> Scans
                    </span>
                    <span className="an-chart-legend-item">
                      <span className="an-chart-legend-dot blue"></span> CTA Clicks
                    </span>
                  </div>
                </div>
                <Chart 
                  options={chartOptions} 
                  series={chartSeries} 
                  type="bar" 
                  height={300}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-lg-4 mb-3">
            <div className="an-card h-100">
              <div className="an-card-body">
                <h6 className="an-card-title">Device Split</h6>
                <div className="ov-donut-total">
                  <span className="ov-donut-total-value">{overviewStats.totalScans.toLocaleString()}</span>
                  <span className="ov-donut-total-label">Total Scans</span>
                </div>
                {deviceData.length > 0 ? (
                  <>
                    <Chart 
                      options={donutOptions} 
                      series={donutSeries} 
                      type="donut" 
                      height={220}
                    />
                    <div className="an-donut-legend">
                      {deviceData.map((device, i) => (
                        <div key={i} className="an-donut-legend-item">
                          <span>
                            <span className="an-donut-legend-dot" style={{ background: device.color }}></span>
                            {device.type}
                          </span>
                          <span>{device.scans.toLocaleString()} scans</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4" style={{ color: '#999' }}>No device data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qr' && (
        <div className="row">
          <div className="col-lg-12">
            <div className="an-card">
          <div className="an-table-wrapper">
            <table className="an-table">
              <thead>
                <tr>
                  <th className="an-th">SR. No.</th>
                  <th className="an-th">QR Code</th>
                  <th className="an-th">Total Scans</th>
                  <th className="an-th an-col-unique">Unique Scans</th>
                  <th className="an-th">CTA Clicks</th>
                  <th className="an-th an-col-ctr">CTR</th>
                  <th className="an-th">Status</th>
                  <th className="an-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {qrAnalytics.length === 0 ? (
                  <tr><td colSpan="8" className="text-center" style={{ color: '#ddd', height : "250px" }}>No QR data yet</td></tr>
                ) : (
                  qrAnalytics.map((qr, i) => (
                    <tr key={i} className="an-tr">
                      <td>{i + 1}</td>
                      <td>
                        <span className="an-td-title">{qr.name}</span>
                        <span className="an-td-subtitle">{qr.url}</span>
                      </td>
                      <td className="fw-semibold">{qr.scans.toLocaleString()}</td>
                      <td className="fw-semibold an-col-unique">{qr.unique.toLocaleString()}</td>
                      <td className="fw-semibold">{qr.ctaClicks.toLocaleString()}</td>
                      <td className="an-td-ctr an-col-ctr">{qr.ctr}%</td>
                      <td><span className={`an-status-badge ${qr.status}`}>{qr.status.toUpperCase()}</span></td>
                      <td><button className="an-view-btn" onClick={() => navigate(`/admin/dynamic-qr/${qr.id}`)}><FaEye size={12} /> View</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        </div>
      )}

      {activeTab === 'campaign' && (
        <div className="row">
          <div className="col-lg-12">
        <div className="an-card">
          <div className="an-table-wrapper">
            <table className="an-table">
              <thead>
                <tr>
                  <th className="an-th">SR. No.</th>
                  <th className="an-th">Campaign</th>
                  <th className="an-th">QR Code</th>
                  <th className="an-th">Scans</th>
                  <th className="an-th">CTA Clicks</th>
                  <th className="an-th an-col-date">Start Date</th>
                  <th className="an-th">Status</th>
                  <th className="an-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaignAnalytics.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-4" style={{  color: '#ddd', height : "250px" }}>No campaign data yet</td></tr>
                ) : (
                  campaignAnalytics.map((cmp, i) => (
                    <tr key={i} className="an-tr">
                      <td>{i + 1}</td>
                      <td><span className="an-td-title">{cmp.name}</span></td>
                      <td>{cmp.qr}</td>
                      <td className="fw-semibold">{cmp.scans.toLocaleString()}</td>
                      <td className="fw-semibold">{cmp.ctaClicks.toLocaleString()}</td>
                      <td className="an-col-date">{cmp.startDate}</td>
                      <td><span className={`an-status-badge ${cmp.status}`}>{cmp.status.toUpperCase()}</span></td>
                      <td><button className="an-view-btn" onClick={() => navigate('/admin/campaign-history')}><FaEye size={12} /> View</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        </div>
      )}

      {activeTab === 'version' && (
        <div className="row">
          <div className="col-lg-12">
        <div className="an-card">
          <div className="an-table-wrapper">
            <table className="an-table">
              <thead>
                <tr>
                  <th className="an-th">SR. No.</th>
                  <th className="an-th">Campaign</th>
                  <th className="an-th">Version</th>
                  <th className="an-th">QR Code</th>
                  <th className="an-th an-col-video">Video</th>
                  <th className="an-th">CTA</th>
                  <th className="an-th">Scans</th>
                  <th className="an-th">CTA Clicks</th>
                  <th className="an-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {versionAnalytics.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4" style={{ color: '#ddd', height : "250px" }}>No version data yet</td></tr>
                ) : (
                  versionAnalytics.map((v, i) => (
                    <tr key={i} className="an-tr">
                      <td>{i + 1}</td>
                      <td><span className="an-td-title">{v.campaign}</span></td>
                      <td><span className="an-version-badge">{v.version}</span></td>
                      <td>{v.qr}</td>
                      <td className="an-col-video" style={{ fontSize: '0.85rem' }}>{v.video}</td>
                      <td style={{ fontSize: '0.85rem' }}>{v.cta}</td>
                      <td className="fw-semibold">{v.scans.toLocaleString()}</td>
                      <td className="fw-semibold">{v.ctaClicks.toLocaleString()}</td>
                      <td><span className={`an-status-badge ${v.status}`}>{v.status.toUpperCase()}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
            </div>
          </div>
      )}

      {activeTab === 'devices' && (
        <div className="row">
          <div className="col-md-6 col-sm-12 col-lg-6 mb-3">
            <div className="an-card ">
              <div className="an-card-body">
                <h6 className="an-card-title">Device Breakdown</h6>
                {deviceData.length > 0 ? (
                  <div className="an-device-list">
                    {deviceData.map((device, i) => (
                      <div key={i} className="an-device-item">
                        <div className={`an-device-icon ${
                          device.color === '#10b981' ? 'green' : 
                          device.color === '#3b82f6' ? 'blue' : 
                          device.color === '#f59e0b' ? 'orange' : 'purple'
                        }`}>
                          {device.type === 'Android' || device.type === 'iOS' ? <FaMobileAlt /> : <FaDesktop />}
                        </div>
                        <div className="an-device-info">
                          <div className="an-device-name">{device.type}</div>
                          <div className="an-device-bar-track">
                            <div className="an-device-bar-fill" style={{ width: `${device.percent}%`, background: device.color }}></div>
                          </div>
                        </div>
                        <div className="an-device-stats">
                          <span className="an-device-percent">{device.percent}%</span>
                          <span className="an-device-count">{device.scans.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4" style={{ color: '#ddd' }}>No device data yet</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-lg-6 mb-3">
            <div className="an-card h-100">
              <div className="an-card-body">
                <h6 className="an-card-title">Device Distribution</h6>
                <div className="ov-donut-total">
                  <span className="ov-donut-total-value">{overviewStats.totalScans.toLocaleString()}</span>
                  <span className="ov-donut-total-label">Total</span>
                </div>
                {deviceData.length > 0 ? (
                  <>
                    <Chart 
                      options={donutOptions} 
                      series={donutSeries} 
                      type="donut" 
                      height={220}
                    />
                    <div className="an-donut-legend">
                      {deviceData.map((device, i) => (
                        <div key={i} className="an-donut-legend-item">
                          <span>
                            <span className="an-donut-legend-dot" style={{ background: device.color }}></span>
                            {device.type}
                          </span>
                          <span>{device.scans.toLocaleString()} scans</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4" style={{ color: '#ddd' }}>No device data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="row">
          <div className="col-lg-8 col-md-6 col-sm-12 mb-3">
            <div className="an-card ">
              <div className="an-card-body">
                <h6 className="an-card-title"><FaGlobeAsia className="me-2" />Scan Locations (Global)</h6>
                {locationData.length > 0 ? (
                  <>
                    <div style={{ width: "100%", height: "400px", marginBottom: "24px", background: "var(--ov-card-bg)", borderRadius: "8px", overflow: "hidden" }}>
                      <ComposableMap
                        projectionConfig={{ scale: 147 }}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <Geographies geography={geoUrl}>
                          {({ geographies }) =>
                            geographies.map((geo) => {
                              const d = locationData.find((s) => s.country === geo.properties.name);
                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  fill={d ? "#0077FF" : "#EAEAEC"}
                                  stroke="#FFFFFF"
                                  strokeWidth={0.5}
                                  style={{
                                    default: { outline: "none", transition: "all 250ms" },
                                    hover: { fill: "#00C8FF", outline: "none", transition: "all 250ms" },
                                    pressed: { outline: "none" },
                                  }}
                                  data-tooltip-id="global-map-tooltip"
                                  data-tooltip-content={`${geo.properties.name}: ${d ? d.scans : 0} scans`}
                                />
                              );
                            })
                          }
                        </Geographies>
                      </ComposableMap>
                      <Tooltip id="global-map-tooltip" />
                    </div>
                    <div className="d-flex gap-3 mb-3">
                      <div className="an-stat-card" style={{ flex: 1, padding: '12px 16px' }}>
                        <div className="an-stat-label">Total Locations</div>
                        <div className="an-stat-value" style={{ fontSize: '1.4rem' }}>{locationData.length}</div>
                      </div>
                      <div className="an-stat-card" style={{ flex: 1, padding: '12px 16px' }}>
                        <div className="an-stat-label">Total Scans</div>
                        <div className="an-stat-value" style={{ fontSize: '1.4rem' }}>{locationData.reduce((a, l) => a + l.scans, 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="an-location-list">
                      {locationData.map((loc, i) => (
                        <div key={i} className="an-location-item">
                          <span className="an-location-rank">#{i + 1}</span>
                          <div className="an-location-info">
                            <div className="an-location-city">{loc.city}</div>
                            <div className="an-location-country">{loc.country}</div>
                          </div>
                          <div className="an-location-bar-track">
                            <div className="an-location-bar-fill" style={{ width: `${loc.percent}%` }}></div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span className="an-location-scans">{loc.scans.toLocaleString()}</span>
                            <span className="an-location-percent">{loc.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4" style={{ color: '#ddd' }}>No location data yet</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-lg-4 mb-3">
            <div className="an-card ">
              <div className="an-card-body">
                <h6 className="an-card-title"><FaGlobeAsia className="me-2" />Top Locations</h6>
                {locationData.length > 0 ? (
                  <div className="ov-locations-list">
                    {locationData.map((loc, i) => (
                      <div key={i} className="ov-location-item">
                        <div className="ov-location-info">
                          <span className="ov-location-city">{loc.city}</span>
                          <span className="ov-location-badge">{loc.country}</span>
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
                ) : (
                  <div className="text-center py-4" style={{ color: '#ddd' }}>No location data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

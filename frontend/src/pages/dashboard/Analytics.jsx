import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { 
  FaChartLine, FaQrcode, FaMobileAlt, FaDesktop, 
  FaGlobeAsia, FaCalendarAlt, FaFilter, FaDownload, FaEye, FaMousePointer 
} from 'react-icons/fa';
import '../../styles/Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  const overviewStats = {
    totalScans: 6071,
    uniqueScans: 3891,
    ctaClicks: 1924,
    activeQr: 4,
  };

  const qrAnalytics = [
    { id: 'xk9p2m', name: 'Pro X1 Launch', url: 'akksys.io/q/xk9p2m', scans: 1247, unique: 892, ctaClicks: 427, ctr: 34.2, status: 'active' },
    { id: 'ms3k8x', name: 'Summer Campaign', url: 'akksys.io/q/ms3k8x', scans: 3845, unique: 2103, ctaClicks: 1103, ctr: 28.7, status: 'active' },
    { id: 'nd7r1q', name: 'App Download', url: 'akksys.io/q/nd7r1q', scans: 612, unique: 540, ctaClicks: 315, ctr: 51.4, status: 'active' },
    { id: 'pw2t6h', name: 'Warranty Card', url: 'akksys.io/q/pw2t6h', scans: 289, unique: 289, ctaClicks: 64, ctr: 22.1, status: 'paused' },
  ];

  const campaignAnalytics = [
    { id: 1, name: 'Festive Offer 2026', qr: 'Pro X1 Launch', scans: 892, ctaClicks: 234, startDate: '25 Aug 2026', status: 'active' },
    { id: 2, name: 'Monsoon Sale', qr: 'Pro X1 Launch', scans: 1456, ctaClicks: 389, startDate: '10 Aug 2026', status: 'completed' },
    { id: 3, name: 'Launch Week', qr: 'Pro X1 Launch', scans: 4247, ctaClicks: 1203, startDate: '01 Aug 2026', status: 'completed' },
    { id: 4, name: 'Summer Campaign', qr: 'Summer Campaign', scans: 3845, ctaClicks: 1103, startDate: '01 Jun 2026', status: 'completed' },
    { id: 5, name: 'App Launch Promo', qr: 'App Download', scans: 612, ctaClicks: 315, startDate: '15 Jul 2026', status: 'active' },
  ];

  const versionAnalytics = [
    { campaign: 'Festive Offer 2026', version: 'v3', qr: 'Pro X1 Launch', scans: 892, ctaClicks: 234, video: 'Festive Promo 2026.mp4', cta: 'Shop Now → Flipkart', status: 'active' },
    { campaign: 'Monsoon Sale', version: 'v2', qr: 'Pro X1 Launch', scans: 1456, ctaClicks: 389, video: 'Monsoon Deal.mp4', cta: 'Explore → AKKSYS Website', status: 'completed' },
    { campaign: 'Launch Week', version: 'v1', qr: 'Pro X1 Launch', scans: 4247, ctaClicks: 1203, video: 'Product Demo 2026.mp4', cta: 'Buy Now → Amazon.in', status: 'completed' },
    { campaign: 'Summer Campaign', version: 'v4', qr: 'Summer Campaign', scans: 987, ctaClicks: 278, video: 'Summer Finale.mp4', cta: 'Shop Now → Flipkart', status: 'completed' },
    { campaign: 'App Launch Promo', version: 'v2', qr: 'App Download', scans: 612, ctaClicks: 315, video: 'App Tutorial.mp4', cta: 'Download → Play Store', status: 'active' },
  ];

  const deviceData = [
    { type: 'Android', percent: 64, color: '#10b981', scans: 3885 },
    { type: 'iOS', percent: 31, color: '#3b82f6', scans: 1882 },
    { type: 'Windows', percent: 3, color: '#f59e0b', scans: 182 },
    { type: 'Mac', percent: 2, color: '#8b5cf6', scans: 122 },
  ];

  const locationData = [
    { city: 'Mumbai', country: 'IN', scans: 1840, percent: 30 },
    { city: 'Delhi', country: 'IN', scans: 1411, percent: 23 },
    { city: 'Bengaluru', country: 'IN', scans: 982, percent: 16 },
    { city: 'Hyderabad', country: 'IN', scans: 674, percent: 11 },
    { city: 'Pune', country: 'IN', scans: 425, percent: 7 },
    { city: 'Jaipur', country: 'IN', scans: 320, percent: 15 },
    { city: 'Sawai Madhopur', country: 'IN', scans: 999, percent: 40 },
    { city: 'Others', country: 'IN', scans: 739, percent: 13 },
  ];

  const dailyData = [
    { day: '20 Aug', scans: 142, clicks: 42 },
    { day: '21 Aug', scans: 198, clicks: 58 },
    { day: '22 Aug', scans: 167, clicks: 49 },
    { day: '23 Aug', scans: 224, clicks: 67 },
    { day: '24 Aug', scans: 289, clicks: 85 },
    { day: '25 Aug', scans: 198, clicks: 56 },
    { day: '26 Aug', scans: 134, clicks: 38 },
    { day: '27 Aug', scans: 178, clicks: 52 },
    { day: '28 Aug', scans: 245, clicks: 72 },
    { day: '29 Aug', scans: 312, clicks: 93 },
    { day: '30 Aug', scans: 289, clicks: 84 },
    { day: '31 Aug', scans: 156, clicks: 46 },
    { day: '01 Sep', scans: 134, clicks: 39 },
    { day: '02 Sep', scans: 198, clicks: 58 },
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
        donut: {
          size: '60%',
        },
      },
    },
    dataLabels: { enabled: false },
    labels: deviceData.map(d => d.type),
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' },
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    stroke: {
      width: 2,
      colors: ['#fff'],
    },
    states: {
      hover: {
        filter: { type: 'none' },
      },
    },
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
            onChange={(e) => setDateRange(e.target.value)}
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
            <span className="an-stat-badge green">+12.4%</span>
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
            <span className="an-stat-badge blue">+8.1%</span>
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
            <span className="an-stat-badge orange">+18.3%</span>
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
            <div className="an-stat-value">{overviewStats.activeQr}/5</div>
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
                  <h6 className="an-card-title mb-0">Scans &amp; CTA Clicks — Last 14 Days</h6>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qr' && (
        <div clasNsName="row">
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
                {qrAnalytics.map((qr, i) => (
                  
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
                ))}
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
                {campaignAnalytics.map((cmp, i) => (
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
                ))}
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
                {versionAnalytics.map((v, i) => (
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
                ))}
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
                <div className="an-map-placeholder">
                  <FaGlobeAsia className="an-map-placeholder-icon" />
                  <span className="an-map-placeholder-text">Interactive Map Visualization Placeholder</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-lg-4 mb-3">
            <div className="an-card ">
              <div className="an-card-body">
                <h6 className="an-card-title"><FaGlobeAsia className="me-2" />Top Locations</h6>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

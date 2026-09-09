import React from 'react';
import Chart from 'react-apexcharts';
import { 
  FaQrcode, FaChartLine, FaMousePointer, FaUsers,
  FaGlobeAsia, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import '../../styles/Overview.css';

const Overview = () => {
  const stats = [
    {
      title: 'TOTAL SCANS',
      value: '6,071',
      change: '+12.4%',
      trend: 'up',
      color: 'primary',
      icon: <FaChartLine />,
    },
    {
      title: 'UNIQUE SCANS',
      value: '3,891',
      change: '+8.1%',
      trend: 'up',
      color: 'blue',
      icon: <FaUsers />,
    },
    {
      title: 'CTA CLICKS',
      value: '1,924',
      change: '+18.3%',
      trend: 'up',
      color: 'orange',
      icon: <FaMousePointer />,
    },
    {
      title: 'ACTIVE QR CODES',
      value: '4/5',
      change: '80%',
      trend: 'neutral',
      color: 'green',
      icon: <FaQrcode />,
    },
  ];

  const weeklyData = [
    { day: 'Mon', scans: 142, clicks: 42 },
    { day: 'Tue', scans: 198, clicks: 58 },
    { day: 'Wed', scans: 167, clicks: 49 },
    { day: 'Thu', scans: 224, clicks: 67 },
    { day: 'Fri', scans: 289, clicks: 85 },
    { day: 'Sat', scans: 198, clicks: 56 },
    { day: 'Sun', scans: 134, clicks: 38 },
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
    pie: {
      donut: {
        size: '60%',
      },
    },
  },

  dataLabels: {
    enabled: false,
  },

  labels: deviceData.map(d => d.type),

  colors: [
    '#00C8FF',
    '#0077FF',
    '#4DDCFF',
  ],

  legend: {
    show: false,
  },

  tooltip: {
    theme: 'light',
    style: {
      fontSize: '12px',
      fontFamily: 'Poppins, sans-serif',
    },
    y: {
      formatter: (val) => `${val}%`,
    },
  },

  stroke: {
    width: 2,
    colors: ['#E6F9FF'],
  },

  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
};



  const donutSeries = deviceData.map(d => d.percent);

  const locations = [
    { city: 'Mumbai', country: 'IN', scans: 1840, percent: 30 },
    { city: 'Delhi', country: 'IN', scans: 1411, percent: 23 },
    { city: 'Bengaluru', country: 'IN', scans: 982, percent: 16 },
    { city: 'Hyderabad', country: 'IN', scans: 674, percent: 11 },
    { city: 'Pune', country: 'IN', scans: 487, percent: 8 },
  ];

  const qrTypes = [
    { type: 'Dynamic QR', desc: 'Updatable', count: 5, percent: 62.5 },
    { type: 'Static QR', desc: 'Fixed', count: 3, percent: 37.5 },
  ];

  return (
    <>
    <div className="ov-wrapper">
        {/* Page Header */}
        <div className="ov-header">
          <div>
            <h4 className="ov-page-title">Dashboard Overview</h4>
            <p className="ov-page-subtitle">Track your QR code performance and analytics</p>
          </div>
          <div className="ov-header-actions">
            <select className="ov-date-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row ">
          {stats.map((stat, index) => (
            <div className="col-sm-12 col-md-6 col-lg-3 mb-3" key={index}>
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

        {/* Charts Row */}
        <div className="row ">
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <div className="ov-card ov-chart-card">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title">Scans & CTA Clicks</h6>
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

          {/* Donut Chart */}
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
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
                  height={200} 
                />
                <div className="ov-donut-total">
                  <span className="ov-donut-total-value">6,071</span>
                  <span className="ov-donut-total-label">Total Scans</span>
                </div>
              </div>
              <div className="ov-device-list">
                {deviceData.map((device, i) => (
                  <div key={i} className="ov-device-item">
                    <div className="ov-device-info">
                      <span className="ov-device-dot" style={{ background: device.color }}></span>
                      <span className="ov-device-name">{device.type}</span>
                    </div>
                    <span className="ov-device-percent">{device.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
            <div className="ov-card">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaGlobeAsia className="me-2" />Top Locations</h6>
                  <p className="ov-card-subtitle">Where your scans are coming from</p>
                </div>
              </div>
              <div className="ov-locations-list">
                {locations.map((loc, i) => (
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

          {/* QR Type Breakdown */}
          <div className="col-sm-12 col-md-6 col-lg-6">
            <div className="ov-card">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaQrcode className="me-2" />QR Type Breakdown</h6>
                  <p className="ov-card-subtitle">Distribution of QR code types</p>
                </div>
              </div>
              <div className="ov-qr-types">
                {qrTypes.map((type, i) => (
                  <div key={i} className="ov-qr-type-item">
                    <div className="ov-qr-type-icon">
                      <FaQrcode />
                    </div>
                    <div className="ov-qr-type-info">
                      <div className="ov-qr-type-header">
                        <span className="ov-qr-type-name">{type.type}</span>
                        <span className="ov-qr-type-desc">{type.desc}</span>
                      </div>
                      <div className="ov-qr-type-bar-bg">
                        <div className="ov-qr-type-bar" style={{ width: `${type.percent}%` }}></div>
                      </div>
                    </div>
                    <div className="ov-qr-type-count">
                      <span className="ov-qr-type-value">{type.count}</span>
                      <span className="ov-qr-type-percent">{type.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="ov-quick-actions">
                <h6 className="ov-card-title mb-3">Quick Actions</h6>
                <div className="ov-action-buttons">
                  <button className="thm-btn w-100">
                    <FaQrcode /> Create QR
                  </button>
                  <button className="thm-btn outline w-100">
                    <FaChartLine /> View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;

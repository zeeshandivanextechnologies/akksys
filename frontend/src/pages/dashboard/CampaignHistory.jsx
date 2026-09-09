import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaEye, FaUndo, FaCalendarAlt, FaSearch, FaPlus, FaChevronDown, FaPlay, FaLink, FaChartLine, FaCheck, FaPause, FaArrowUp } from 'react-icons/fa';
import '../../styles/CampaignHistory.css';

const CampaignHistory = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const campaigns = [
    {
      id: 'CMP-001',
      name: 'Festive Offer 2026',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '25 Aug 2026',
      endDate: 'Present',
      status: 'active',
      video: 'Festive Promo 2026.mp4',
      cta: 'Shop Now → Flipkart',
      scans: 892,
      ctaClicks: 234,
      versions: 3,
    },
    {
      id: 'CMP-002',
      name: 'Monsoon Sale',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '10 Aug 2026',
      endDate: '24 Aug 2026',
      status: 'completed',
      video: 'Monsoon Deal.mp4',
      cta: 'Explore → AKKSYS Website',
      scans: 1456,
      ctaClicks: 389,
      versions: 2,
    },
    {
      id: 'CMP-003',
      name: 'Launch Week',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '01 Aug 2026',
      endDate: '09 Aug 2026',
      status: 'completed',
      video: 'Product Demo 2026.mp4',
      cta: 'Buy Now → Amazon.in',
      scans: 4247,
      ctaClicks: 1203,
      versions: 1,
    },
    {
      id: 'CMP-004',
      name: 'Summer Campaign',
      qrCode: 'Summer Campaign',
      qrId: 'ms3k8x',
      startDate: '01 Jun 2026',
      endDate: '31 Jul 2026',
      status: 'completed',
      video: 'Summer 2026.mp4',
      cta: 'Shop Now → Flipkart',
      scans: 3845,
      ctaClicks: 1103,
      versions: 4,
    },
    {
      id: 'CMP-005',
      name: 'App Launch Promo',
      qrCode: 'App Download',
      qrId: 'nd7r1q',
      startDate: '15 Jul 2026',
      endDate: 'Present',
      status: 'active',
      video: 'App Tutorial.mp4',
      cta: 'Download → Play Store',
      scans: 612,
      ctaClicks: 315,
      versions: 2,
    },
    {
      id: 'CMP-006',
      name: 'Warranty Registration',
      qrCode: 'Warranty Card',
      qrId: 'pw2t6h',
      startDate: '01 Aug 2026',
      endDate: 'Present',
      status: 'paused',
      video: 'Tutorial Video.mp4',
      cta: 'Register → akksys.in',
      scans: 289,
      ctaClicks: 64,
      versions: 1,
    },
  ];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.qrCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    totalScans: campaigns.reduce((sum, c) => sum + c.scans, 0),
    totalCtaClicks: campaigns.reduce((sum, c) => sum + c.ctaClicks, 0),
  };

  const toggleDropdown = (id, e) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      return;
    }
    const btn = e.currentTarget;
    const btnRect = btn.getBoundingClientRect();
    setDropdownPos({
      top: btnRect.bottom + 6,
      left: btnRect.right - 170,
    });
    setOpenDropdown(id);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown && !e.target.closest('.ch-action-cell') && !e.target.closest('.ch-dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="ch-page-wrapper">
      {/* Header — dq-header */}
      <div className="ch-header">
        <div>
          <h4 className="ch-page-title">Campaign History</h4>
          <p className="ch-page-subtitle">{dateStr}</p>
        </div>
        <div className="ch-header-actions">
          <button 
            className="thm-btn"
            onClick={() => navigate('/admin/campaign/create')}
          >
            <FaPlus /> Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row ">
        <div className="col-md-6 col-sm-12 col-lg-3 mb-3">
          <div className="ch-stat-card">
            <div className="ch-stat-header">
              <span className="ch-stat-label">TOTAL</span>
              <div className="ch-stat-icon purple"><FaChartLine /></div>
            </div>
            <p className="ch-stat-value">{stats.total}</p>
            <div className="ch-stat-footer">
              <span className="ch-stat-change up"><FaArrowUp /> 12%</span>
              <span className="ch-stat-period">vs last month</span>
            </div>
            <div className="ch-stat-bar purple"></div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12 col-lg-3 mb-3">
          <div className="ch-stat-card">
            <div className="ch-stat-header">
              <span className="ch-stat-label">ACTIVE</span>
              <div className="ch-stat-icon green"><FaCheck /></div>
            </div>
            <p className="ch-stat-value">{stats.active}</p>
            <div className="ch-stat-footer">
              <span className="ch-stat-change up"><FaArrowUp /> 8%</span>
              <span className="ch-stat-period">vs last month</span>
            </div>
            <div className="ch-stat-bar green"></div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12 col-lg-3 mb-3">
          <div className="ch-stat-card">
            <div className="ch-stat-header">
              <span className="ch-stat-label">COMPLETED</span>
              <div className="ch-stat-icon blue"><FaHistory /></div>
            </div>
            <p className="ch-stat-value">{stats.completed}</p>
            <div className="ch-stat-footer">
              <span className="ch-stat-change up"><FaArrowUp /> 24%</span>
              <span className="ch-stat-period">vs last month</span>
            </div>
            <div className="ch-stat-bar blue"></div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12 col-lg-3 mb-3">
          <div className="ch-stat-card">
            <div className="ch-stat-header">
              <span className="ch-stat-label">PAUSED</span>
              <div className="ch-stat-icon red"><FaPause /></div>
            </div>
            <p className="ch-stat-value">{stats.paused}</p>
            <div className="ch-stat-footer">
              <span className="ch-stat-change down"><FaArrowUp /> 2</span>
              <span className="ch-stat-period">vs last month</span>
            </div>
            <div className="ch-stat-bar red"></div>
          </div>
        </div>
      </div>

      <div className="row ">
        <div className="col-lg-12  ">
   <div className="ch-controls an-card ">
        <div className="ch-search-box custom-frm-bx mb-0">
          <FaSearch className="ch-search-icon" />
          <input 
            type="text" 
            className="ch-search-input form-control  ps-5"
            placeholder="Search campaigns or QR codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ch-filter-tabs">
          <button 
            className={`ch-filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`ch-filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </button>
          <button 
            className={`ch-filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button 
            className={`ch-filter-tab ${filterStatus === 'paused' ? 'active' : ''}`}
            onClick={() => setFilterStatus('paused')}
          >
            Paused
          </button>
        </div>
      </div>
        </div>

      </div>

      <div className="row mb-3">
        <div className="col-lg-12  ">
      <div className="ch-table-card">
        <div className="ch-table-wrapper">
          <table className="ch-table">
            <thead>
              <tr>
                <th className="ch-th">SR. No.</th>
                <th className="ch-th">Campaign</th>
                <th className="ch-th">QR Code</th>
                <th className="ch-th">Duration</th>
                <th className="ch-th">Video</th>
                <th className="ch-th">CTA</th>
                <th className="ch-th">Scans</th>
                <th className="ch-th">CTA Clicks</th>
                <th className="ch-th">Versions</th>
                <th className="ch-th">Status</th>
                <th className="ch-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign, index) => (
                <tr key={campaign.id} className="ch-tr">
                  <td className="ch-td">{index + 1}</td>
                  <td className="ch-td">
                    <span className="ch-td-title">{campaign.name}</span>
                    <span className="ch-td-subtitle">{campaign.id}</span>
                  </td>
                  <td className="ch-td">
                    <span className="ch-td-title">{campaign.qrCode}</span>
                    <span className="ch-td-subtitle">akksys.io/q/{campaign.qrId}</span>
                  </td>
                  <td className="ch-td">
                    <div className="ch-td-meta">
                      <FaCalendarAlt className="ch-td-meta-icon" />
                      <div>
                        <span className="ch-td-meta-text">{campaign.startDate}</span>
                        <span className="ch-td-meta-sub">{campaign.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="ch-td">
                    <div className="ch-td-meta">
                      <FaPlay className="ch-td-meta-icon" size={10} />
                      <span className="ch-td-meta-text">{campaign.video}</span>
                    </div>
                  </td>
                  <td className="ch-td">
                    <div className="ch-td-meta">
                      <FaLink className="ch-td-meta-icon" size={10} />
                      <span className="ch-td-meta-text">{campaign.cta}</span>
                    </div>
                  </td>
                  <td className="ch-td ch-td-number">{campaign.scans.toLocaleString()}</td>
                  <td className="ch-td ch-td-number">{campaign.ctaClicks.toLocaleString()}</td>
                  <td className="ch-td">
                    <span className="ch-version-badge">{campaign.versions} versions</span>
                  </td>
                  <td className="ch-td">
                    <span className={`ch-status-badge ${campaign.status}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="ch-td">
                    <div className="ch-action-cell">
                      <button 
                        className="ch-edit-btn"
                        onClick={(e) => toggleDropdown(campaign.id, e)}
                      >
                        Edit <FaChevronDown size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {openDropdown && (
          <div
            className="ch-dropdown-menu"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <button onClick={() => navigate(`/admin/campaign/${openDropdown}`)}>
              <FaEye size={16} /> View Details
            </button>
            <button onClick={() => navigate(`/admin/campaign/${openDropdown}/version/create`)}>
              <FaPlus size={16} /> New Version
            </button>
            <button onClick={() => setOpenDropdown(null)}>
              <FaUndo size={16} /> Restore
            </button>
          </div>
        )}

        {filteredCampaigns.length === 0 && (
          <div className="ch-empty">
            <FaHistory className="ch-empty-icon" />
            <p className="ch-empty-text">No campaigns found matching your filters</p>
          </div>
        )}
      </div>
        </div>

      </div>

      
   

      {/* Table — dq-card + dq-table */}
     
    </div>
  );
};

export default CampaignHistory;

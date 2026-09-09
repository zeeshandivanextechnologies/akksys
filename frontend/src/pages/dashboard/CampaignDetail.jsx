import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaQrcode, FaVideo, FaLink, FaCalendarAlt, FaChartLine, FaMousePointer, FaEye, FaPlus } from 'react-icons/fa';
import '../../styles/CampaignDetail.css';

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  const campaigns = {
    'CMP-001': {
      id: 'CMP-001',
      name: 'Festive Offer 2026',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '25 Aug 2026',
      endDate: 'Present',
      status: 'active',
      video: 'Festive Promo 2026.mp4',
      videoType: 'Library',
      cta: 'Shop Now → Flipkart',
      ctaUrl: 'https://flipkart.com/festive-offer',
      scans: 892,
      ctaClicks: 234,
      headline: 'Festive Season Sale',
      tagline: 'Best deals on electronics',
      badge: 'LIMITED TIME',
      versions: [
        { id: 'v3', name: 'v3 - Updated CTA', date: '25 Aug 2026', status: 'active' },
        { id: 'v2', name: 'v2 - New Video', date: '20 Aug 2026', status: 'old' },
        { id: 'v1', name: 'v1 - Initial Launch', date: '15 Aug 2026', status: 'old' },
      ],
    },
    'CMP-002': {
      id: 'CMP-002',
      name: 'Monsoon Sale',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '10 Aug 2026',
      endDate: '24 Aug 2026',
      status: 'completed',
      video: 'Monsoon Deal.mp4',
      videoType: 'Library',
      cta: 'Explore → AKKSYS Website',
      ctaUrl: 'https://akksys.in/monsoon',
      scans: 1456,
      ctaClicks: 389,
      headline: 'Monsoon Mania',
      tagline: 'Rain-proof deals',
      badge: 'MONSOON SPECIAL',
      versions: [
        { id: 'v2', name: 'v2 - Final Version', date: '24 Aug 2026', status: 'old' },
        { id: 'v1', name: 'v1 - Launch', date: '10 Aug 2026', status: 'old' },
      ],
    },
    'CMP-003': {
      id: 'CMP-003',
      name: 'Launch Week',
      qrCode: 'Pro X1 Launch',
      qrId: 'xk9p2m',
      startDate: '01 Aug 2026',
      endDate: '09 Aug 2026',
      status: 'completed',
      video: 'Product Demo 2026.mp4',
      videoType: 'Library',
      cta: 'Buy Now → Amazon.in',
      ctaUrl: 'https://amazon.in/akksys-pro-x1',
      scans: 4247,
      ctaClicks: 1203,
      headline: 'Pro X1 is Here',
      tagline: 'The future of smart living',
      badge: 'NEW LAUNCH',
      versions: [
        { id: 'v1', name: 'v1 - Launch Day', date: '01 Aug 2026', status: 'old' },
      ],
    },
    'CMP-004': {
      id: 'CMP-004',
      name: 'Summer Campaign',
      qrCode: 'Summer Campaign',
      qrId: 'ms3k8x',
      startDate: '01 Jun 2026',
      endDate: '31 Jul 2026',
      status: 'completed',
      video: 'Summer 2026.mp4',
      videoType: 'YouTube',
      cta: 'Shop Now → Flipkart',
      ctaUrl: 'https://flipkart.com/summer-sale',
      scans: 3845,
      ctaClicks: 1103,
      headline: 'Summer Savings',
      tagline: 'Beat the heat with deals',
      badge: 'SUMMER DEAL',
      versions: [
        { id: 'v4', name: 'v4 - Final Push', date: '31 Jul 2026', status: 'old' },
        { id: 'v3', name: 'v3 - Mid Summer', date: '15 Jul 2026', status: 'old' },
        { id: 'v2', name: 'v2 - Early Bird', date: '15 Jun 2026', status: 'old' },
        { id: 'v1', name: 'v1 - Kickoff', date: '01 Jun 2026', status: 'old' },
      ],
    },
    'CMP-005': {
      id: 'CMP-005',
      name: 'App Launch Promo',
      qrCode: 'App Download',
      qrId: 'nd7r1q',
      startDate: '15 Jul 2026',
      endDate: 'Present',
      status: 'active',
      video: 'App Tutorial.mp4',
      videoType: 'Library',
      cta: 'Download → Play Store',
      ctaUrl: 'https://play.google.com/store/apps/akksys',
      scans: 612,
      ctaClicks: 315,
      headline: 'AKKSYS App',
      tagline: 'Scan, Shop, Done',
      badge: 'DOWNLOAD NOW',
      versions: [
        { id: 'v2', name: 'v2 - Updated Link', date: '20 Jul 2026', status: 'active' },
        { id: 'v1', name: 'v1 - Launch', date: '15 Jul 2026', status: 'old' },
      ],
    },
    'CMP-006': {
      id: 'CMP-006',
      name: 'Warranty Registration',
      qrCode: 'Warranty Card',
      qrId: 'pw2t6h',
      startDate: '01 Aug 2026',
      endDate: 'Present',
      status: 'paused',
      video: 'Tutorial Video.mp4',
      videoType: 'Vimeo',
      cta: 'Register → akksys.in',
      ctaUrl: 'https://akksys.in/warranty',
      scans: 289,
      ctaClicks: 64,
      headline: 'Register Warranty',
      tagline: 'Secure your product',
      badge: 'FREE',
      versions: [
        { id: 'v1', name: 'v1 - Setup', date: '01 Aug 2026', status: 'old' },
      ],
    },
  };

  const campaign = campaigns[campaignId] || campaigns['CMP-001'];

  return (
    <div className="cd-page-wrapper">
      {/* Header */}
      <div className="cd-header">
        <div className="cd-header-left">
          <button className="cmp-back-btn" onClick={() => navigate('/admin/campaign-history')}>
            <FaArrowLeft /> 
          </button>
          <div>
            <div className="d-flex align-items-center gap-3">
              <h4 className="cd-page-title">{campaign.name}</h4>
              <span className={`cd-status-badge ${campaign.status}`}>{campaign.status.toUpperCase()}</span>
            </div>
            <p className="cd-page-subtitle">{campaign.id} • Created {campaign.startDate}</p>
          </div>
        </div>
        <div className="cd-header-actions">
          <button className="thm-btn outline" onClick={() => navigate('/admin/campaign-history')}>
            <FaEye /> View History
          </button>
          <button className="thm-btn" onClick={() => navigate(`/admin/campaign/${campaign.id}/version/create`)}>
            <FaPlus /> New Version
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="cd-stat-card">
            <div className="cd-stat-header">
              <span className="cd-stat-label">Total Scans</span>
              <div className="cd-stat-icon purple"><FaChartLine /></div>
            </div>
            <p className="cd-stat-value">{campaign.scans.toLocaleString()}</p>
            <div className="cd-stat-bar purple"></div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="cd-stat-card">
            <div className="cd-stat-header">
              <span className="cd-stat-label">CTA Clicks</span>
              <div className="cd-stat-icon green"><FaMousePointer /></div>
            </div>
            <p className="cd-stat-value">{campaign.ctaClicks.toLocaleString()}</p>
            <div className="cd-stat-bar green"></div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="cd-stat-card">
            <div className="cd-stat-header">
              <span className="cd-stat-label">Versions</span>
              <div className="cd-stat-icon blue"><FaEye /></div>
            </div>
            <p className="cd-stat-value">{campaign.versions.length}</p>
            <div className="cd-stat-bar blue"></div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-lg-8 col-md-12 mb-3">
          <div className="cd-info-card">
            <div className="cd-info-header">
              <h6 className="cd-info-title"><FaQrcode className="me-2" />Campaign Details</h6>
            </div>
            <div className="cd-info-body">
              <div className="cd-info-grid">
                <div className="cd-info-item">
                  <span className="cd-info-label">QR Code</span>
                  <span className="cd-info-value">{campaign.qrCode}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">QR ID</span>
                  <span className="cd-info-value purple">akksys.io/q/{campaign.qrId}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Start Date</span>
                  <span className="cd-info-value">{campaign.startDate}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">End Date</span>
                  <span className="cd-info-value">{campaign.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Content */}
          <div className="cd-info-card">
            <div className="cd-info-header">
              <h6 className="cd-info-title"><FaVideo className="me-2" />Video Content</h6>
            </div>
            <div className="cd-info-body">
              <div className="cd-info-grid">
                <div className="cd-info-item">
                  <span className="cd-info-label">Video</span>
                  <span className="cd-info-value">{campaign.video}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Source</span>
                  <span className="cd-info-value">{campaign.videoType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="cd-info-card">
            <div className="cd-info-header">
              <h6 className="cd-info-title"><FaLink className="me-2" />Call to Action</h6>
            </div>
            <div className="cd-info-body">
              <div className="cd-info-grid">
                <div className="cd-info-item">
                  <span className="cd-info-label">Button Text</span>
                  <span className="cd-info-value">{campaign.cta.split(' →')[0]}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Destination</span>
                  <span className="cd-info-value purple">{campaign.ctaUrl}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Headline</span>
                  <span className="cd-info-value">{campaign.headline}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Tagline</span>
                  <span className="cd-info-value">{campaign.tagline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4 col-md-12 mb-3">
          <div className="cd-info-card">
            <div className="cd-info-header">
              <h6 className="cd-info-title"><FaCalendarAlt className="me-2" />Version History</h6>
            </div>
            <div className="cd-info-body">
              <div className="cd-version-list">
                {campaign.versions.map((version) => (
                  <div key={version.id} className={`cd-version-item ${version.status === 'active' ? 'current' : ''}`}>
                    <div className={`cd-version-badge ${version.status === 'old' ? 'old' : ''}`}>
                      {version.id.replace('v', '')}
                    </div>
                    <div className="cd-version-info">
                      <span className="cd-version-name">{version.name}</span>
                      <span className="cd-version-meta">{version.date}</span>
                    </div>
                    <span className={`cd-version-status ${version.status}`}>
                      {version.status === 'active' ? 'ACTIVE' : 'OLD'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

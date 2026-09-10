import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaQrcode, FaVideo, FaLink, FaCalendarAlt, FaChartLine, FaMousePointer, FaEye, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/CampaignDetail.css';

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await api.get(`/campaign/${campaignId}`);
      setCampaign(res.data);
    } catch {
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  if (loading) {
    return <div className="cd-page-wrapper"><p style={{textAlign:'center',padding:'60px 0',color:'#999'}}>Loading campaign...</p></div>;
  }

  if (!campaign) {
    return <div className="cd-page-wrapper"><p style={{textAlign:'center',padding:'60px 0',color:'#999'}}>Campaign not found</p></div>;
  }

  const activeVersion = campaign.versions?.find(v => v.is_active) || campaign.versions?.[0] || {};

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Present';

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
              <span className={`cd-status-badge ${campaign.status}`}>{(campaign.status || 'active').toUpperCase()}</span>
            </div>
            <p className="cd-page-subtitle">ID: {campaign.id} • Created {fmtDate(campaign.start_date)}</p>
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
            <p className="cd-stat-value">{(campaign.total_scans || 0).toLocaleString()}</p>
            <div className="cd-stat-bar purple"></div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="cd-stat-card">
            <div className="cd-stat-header">
              <span className="cd-stat-label">CTA Clicks</span>
              <div className="cd-stat-icon green"><FaMousePointer /></div>
            </div>
            <p className="cd-stat-value">{(campaign.cta_clicks || 0).toLocaleString()}</p>
            <div className="cd-stat-bar green"></div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="cd-stat-card">
            <div className="cd-stat-header">
              <span className="cd-stat-label">Versions</span>
              <div className="cd-stat-icon blue"><FaEye /></div>
            </div>
            <p className="cd-stat-value">{(campaign.versions || []).length}</p>
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
                  <span className="cd-info-value">{campaign.qr_name || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">QR ID</span>
                  <span className="cd-info-value purple">{campaign.qr_id || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Start Date</span>
                  <span className="cd-info-value">{fmtDate(campaign.start_date)}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">End Date</span>
                  <span className="cd-info-value">{fmtDate(campaign.end_date)}</span>
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
                  <span className="cd-info-value">{activeVersion.video_url || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Source</span>
                  <span className="cd-info-value">{activeVersion.video_type || '—'}</span>
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
                  <span className="cd-info-value">{activeVersion.cta_text || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Destination</span>
                  <span className="cd-info-value purple">{activeVersion.cta_destination || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Headline</span>
                  <span className="cd-info-value">{campaign.headline || '—'}</span>
                </div>
                <div className="cd-info-item">
                  <span className="cd-info-label">Tagline</span>
                  <span className="cd-info-value">{campaign.tagline || '—'}</span>
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
                {(campaign.versions || []).map((version) => (
                  <div key={version.id} className={`cd-version-item ${version.is_active ? 'current' : ''}`}>
                    <div className={`cd-version-badge ${version.is_active ? '' : 'old'}`}>
                      {version.version_number}
                    </div>
                    <div className="cd-version-info">
                      <span className="cd-version-name">v{version.version_number} — {version.cta_text || 'Version'}</span>
                      <span className="cd-version-meta">{parseInt(version.total_scans || 0).toLocaleString()} scans</span>
                    </div>
                    <span className={`cd-version-status ${version.is_active ? 'active' : 'old'}`}>
                      {version.is_active ? 'ACTIVE' : 'OLD'}
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

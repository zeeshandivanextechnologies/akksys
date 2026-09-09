import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaVideo, FaMousePointer, FaLink, 
  FaHistory, FaExclamationTriangle
} from 'react-icons/fa';
import '../../styles/CreateCampaign.css';
import '../../styles/CreateVersion.css';

const CreateVersion = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [formData, setFormData] = useState({
    versionName: '',
    videoType: 'library',
    videoUrl: '',
    ctaText: 'Buy Now',
    ctaDestination: '',
    headline: '',
    tagline: '',
    badge: '',
    activateImmediately: true,
  });

  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoOptions = [
    { id: 'v1', name: 'Product Demo 2026', duration: '2:34' },
    { id: 'v2', name: 'Summer 2026 Promo', duration: '1:48' },
    { id: 'v3', name: 'App Tutorial', duration: '3:12' },
  ];

  const ctaPresets = [
    'Buy Now', 'Shop Now', 'Explore', 'Apply Now', 
    'Learn More', 'Download', 'Visit Website', 'Register'
  ];

  const previousVersion = {
    version: 'v2',
    campaign: 'Campaign 2 - Monsoon Sale',
    video: 'Monsoon Deal.mp4',
    cta: 'Explore → AKKSYS Website',
    scans: 1456,
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('New version created and activated!');
    navigate('/admin/campaign-history');
  };

  return (
    <div className="ov-wrapper">
      {/* Header */}
      <div className="cmp-header">
        <div className="cmp-header-left">
          <button className="cmp-back-btn" onClick={() => navigate('/admin/campaign-history')}>
            <FaArrowLeft />
          </button>
          <div>
            <h4 className="cmp-header-title">Create New Version</h4>
            <p className="cmp-header-subtitle">Add a new version to an existing campaign</p>
          </div>
        </div>
        <div className="cmp-header-actions">
          <button className="thm-btn outline" onClick={() => navigate('/admin/campaign-history')}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleSave}>
            <FaSave className="me-1" /> Save & Activate
          </button>
        </div>
      </div>

      {/* Previous Version Info */}
      <div className="cv-prev-version mb-3">
        <div className="cv-prev-icon">
          <FaHistory />
        </div>
        <div>
          <p className="cv-prev-title">Current Active Version: {previousVersion.version}</p>
          <p className="cv-prev-meta">
            {previousVersion.campaign} • {previousVersion.video} • {previousVersion.scans.toLocaleString()} scans
          </p>
        </div>
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-lg-8 col-md-12 mb-0 mb-lg-3">
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title">Version Details</h6>
                <p className="ov-card-subtitle">Name this version for your reference</p>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="row">
                <div className="col-md-8">
                  <label className="cmp-label">Version Name</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    placeholder="e.g., v3 - Festive Offer"
                    value={formData.versionName}
                    onChange={(e) => handleChange('versionName', e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="cmp-label">Campaign</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    value={campaignId || 'CMP-001'}
                    readOnly
                    style={{ background: 'var(--ov-new-bg)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video Content */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaVideo className="me-2" />Video Content</h6>
                <p className="ov-card-subtitle">Choose video type and source</p>
              </div>
            </div>
            <div className="ov-card-body">
              {/* Video Type Tabs */}
              <div className="cmp-video-tabs">
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'library' ? 'active' : ''}`}
                  onClick={() => handleChange('videoType', 'library')}
                >
                  <FaVideo /> From Library
                </button>
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'youtube' ? 'active' : ''}`}
                  onClick={() => handleChange('videoType', 'youtube')}
                >
                  <FaVideo /> YouTube URL
                </button>
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'vimeo' ? 'active' : ''}`}
                  onClick={() => handleChange('videoType', 'vimeo')}
                >
                  <FaVideo /> Vimeo URL
                </button>
              </div>

              {formData.videoType === 'library' && (
                <div className="row">
                  {videoOptions.map(video => (
                    <div className="col-md-4" key={video.id}>
                      <div 
                        className={`cmp-video-card ${selectedVideo === video.id ? 'selected' : ''}`}
                        onClick={() => setSelectedVideo(video.id)}
                      >
                        <div className={`cmp-video-icon ${video.id === 'v1' ? '' : video.id === 'v2' ? 'green' : 'blue'}`}>
                          <FaVideo />
                        </div>
                        <div className="cmp-video-info">
                          <p className="cmp-video-name">{video.name}</p>
                          <p className="cmp-video-duration">{video.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(formData.videoType === 'youtube' || formData.videoType === 'vimeo') && (
                <div>
                  <label className="cmp-label">
                    {formData.videoType === 'youtube' ? 'YouTube' : 'Vimeo'} Video URL
                  </label>
                  <input 
                    type="url" 
                    className="cmp-input" 
                    placeholder={`Paste ${formData.videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL here`}
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Landing Page Content */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaLink className="me-2" />Landing Page Content</h6>
                <p className="ov-card-subtitle">Customize what users see after scanning</p>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="cmp-label">Headline</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    placeholder="e.g., Introducing Pro X1"
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="cmp-label">Badge Text</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    placeholder="e.g., HOT DEAL / LIMITED TIME"
                    value={formData.badge}
                    onChange={(e) => handleChange('badge', e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="cmp-label">Tagline</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    placeholder="e.g., The Future of Smart Living"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4 col-md-12 ">
          {/* CTA Configuration */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaMousePointer className="me-2" />Call to Action</h6>
                <p className="ov-card-subtitle">Set up your CTA button</p>
              </div>
            </div>
            <div className="ov-card-body">
              <label className="cmp-label">Button Text</label>
              <div className="cmp-btn-options">
                {ctaPresets.map(preset => (
                  <button 
                    key={preset}
                    className={`cmp-btn-option ${formData.ctaText === preset ? 'active' : ''}`}
                    onClick={() => handleChange('ctaText', preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                className="cmp-input" 
                placeholder="Or type custom text"
                value={formData.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
              />

              <label className="cmp-label" style={{ marginTop: '16px' }}><span className="cmp-label-icon"><FaLink /></span> Destination URL</label>
              <input 
                type="url" 
                className="cmp-input" 
                placeholder="https://amazon.in/your-product"
                value={formData.ctaDestination}
                onChange={(e) => handleChange('ctaDestination', e.target.value)}
              />
            </div>
          </div>

          {/* Activation */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title">Activation</h6>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="cv-activation-switch">
                <span className="cv-switch-label">Activate immediately</span>
                <label className="cv-switch">
                  <input 
                    type="checkbox" 
                    checked={formData.activateImmediately}
                    onChange={(e) => handleChange('activateImmediately', e.target.checked)}
                  />
                  <span className="cv-switch-slider"></span>
                </label>
              </div>
              <p className="cmp-helper" style={{ marginTop: '10px' }}>
                If enabled, this version will replace the current active version on the QR code
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="cv-warning mb-3">
            <FaExclamationTriangle className="cv-warning-icon" />
            <div>
              <p className="cv-warning-title">Version History</p>
              <p className="cv-warning-text">
                Creating a new version will preserve the current version in history. All scan data from previous versions will remain intact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVersion;

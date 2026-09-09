import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaVideo, FaMousePointer, FaLink, 
  FaCalendarAlt, FaQrcode, FaPlay
} from 'react-icons/fa';
import '../../styles/CreateCampaign.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    campaignName: '',
    qrCode: '',
    startDate: '',
    endDate: '',
    videoType: 'library',
    videoUrl: '',
    ctaText: 'Buy Now',
    ctaDestination: '',
    headline: '',
    tagline: '',
    badge: '',
  });

  const [selectedVideo, setSelectedVideo] = useState(null);

  const qrOptions = [
    { id: 'xk9p2m', name: 'Pro X1 Launch' },
    { id: 'ms3k8x', name: 'Summer Campaign' },
    { id: 'nd7r1q', name: 'App Download' },
    { id: 'pw2t6h', name: 'Warranty Card' },
  ];

  const videoOptions = [
    { id: 'v1', name: 'Product Demo 2026', duration: '2:34' },
    { id: 'v2', name: 'Summer 2026 Promo', duration: '1:48' },
    { id: 'v3', name: 'App Tutorial', duration: '3:12' },
  ];

  const ctaPresets = [
    'Buy Now', 'Shop Now', 'Explore', 'Apply Now', 
    'Learn More', 'Download', 'Visit Website', 'Register'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Campaign saved successfully!');
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
            <h4 className="cmp-header-title">Create New Campaign</h4>
            <p className="cmp-header-subtitle">Set up a new campaign for an existing QR code</p>
          </div>
        </div>
        <div className="cmp-header-actions">
          <button className="thm-btn outline" onClick={() => navigate('/admin/campaign-history')}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleSave}>
            <FaSave className="me-1" /> Save Campaign
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-lg-8 col-md-12 mb-0 mb-lg-3">
          {/* Campaign Details */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaQrcode className="me-2" />Campaign Details</h6>
                <p className="ov-card-subtitle">Basic information about your campaign</p>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="cmp-label">Campaign Name</label>
                  <input 
                    type="text" 
                    className="cmp-input" 
                    placeholder="e.g., Festive Offer 2026"
                    value={formData.campaignName}
                    onChange={(e) => handleChange('campaignName', e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="cmp-label"><span className="cmp-label-icon"><FaQrcode /></span> Link to QR Code</label>
                  <select 
                    className="cmp-select"
                    value={formData.qrCode}
                    onChange={(e) => handleChange('qrCode', e.target.value)}
                  >
                    <option value="">Select QR Code</option>
                    {qrOptions.map(qr => (
                      <option key={qr.id} value={qr.id}>{qr.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="cmp-label"><span className="cmp-label-icon"><FaCalendarAlt /></span> Start Date</label>
                  <input 
                    type="date" 
                    className="cmp-input"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="cmp-label"><span className="cmp-label-icon"><FaCalendarAlt /></span> End Date (Optional)</label>
                  <input 
                    type="date" 
                    className="cmp-input"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                  <p className="cmp-helper">Leave empty for ongoing campaign</p>
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
                  <FaPlay /> YouTube URL
                </button>
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'vimeo' ? 'active' : ''}`}
                  onClick={() => handleChange('videoType', 'vimeo')}
                >
                  <FaPlay /> Vimeo URL
                </button>
              </div>

              {formData.videoType === 'library' && (
                <div className="row ">
                  {videoOptions.map(video => (
                    <div className="col-md-4" key={video.id}>
                      <div 
                        className={`cmp-video-card ${selectedVideo === video.id ? 'selected' : ''}`}
                        onClick={() => setSelectedVideo(video.id)}
                      >
                        <div className={`cmp-video-icon ${video.id === 'v1' ? '' : video.id === 'v2' ? 'green' : 'blue'}`}>
                          <FaPlay />
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
                  <p className="cmp-helper">Supports regular and unlisted videos</p>
                </div>
              )}
            </div>
          </div>

          {/* Landing Page Content */}
          <div className="ov-card h-auto">
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
              <p className="cmp-helper">User will be redirected here after clicking the CTA</p>
            </div>
          </div>

          {/* Live Preview */}
          <div className="ov-card h-auto mb-3">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title">Live Preview</h6>
              </div>
            </div>
            <div className="ov-card-body">
              <div className="cmp-preview-box">
                {formData.badge && (
                  <span className="cmp-preview-badge">{formData.badge}</span>
                )}
                {formData.headline && (
                  <p className="cmp-preview-headline">{formData.headline}</p>
                )}
                {formData.tagline && (
                  <p className="cmp-preview-tagline">{formData.tagline}</p>
                )}
                {formData.ctaText && (
                  <div className="cmp-preview-cta">
                    <button className="thm-btn">{formData.ctaText}</button>
                  </div>
                )}
                {!formData.headline && !formData.tagline && !formData.badge && (
                  <p className="cmp-preview-empty">Fill in the details to see preview</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title">Quick Tips</h6>
              </div>
            </div>
            <div className="ov-card-body">
              <ul className="cmp-tips-list">
                <li>Campaign will replace the current active version on the QR</li>
                <li>Previous campaign data will be preserved in history</li>
                <li>You can set an end date or leave it open-ended</li>
                <li>QR code remains unchanged - only content updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;

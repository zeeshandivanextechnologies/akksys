import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaVideo, FaMousePointer, FaLink, 
  FaHistory, FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/CreateCampaign.css';
import '../../styles/CreateVersion.css';

const CreateVersion = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const ctaPresets = [
    'Buy Now', 'Shop Now', 'Explore', 'Apply Now', 
    'Learn More', 'Download', 'Visit Website', 'Register'
  ];

  const fetchData = useCallback(async () => {
    try {
      const [campRes, vidRes] = await Promise.all([
        api.get(`/campaign/${campaignId}`),
        api.get('/video')
      ]);
      setCampaign(campRes.data);
      setVideos(vidRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video.id);
    setFormData(prev => ({
      ...prev,
      videoType: video.source_type || 'library',
      videoUrl: video.file_path || video.source_url || video.title,
    }));
  };

  const handleSave = async () => {
    if (!formData.ctaText) {
      toast.error('CTA text is required');
      return;
    }
    if (formData.videoType !== 'library' && !formData.videoUrl) {
      toast.error('Video URL is required');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/campaign/${campaignId}/version`, {
        video_type: formData.videoType,
        video_url: formData.videoUrl || null,
        cta_text: formData.ctaText,
        cta_destination: formData.ctaDestination || null,
        activate_immediately: formData.activateImmediately,
      });
      toast.success('New version created and activated!');
      navigate(`/admin/campaign/${campaignId}`);
    } catch {
      toast.error('Failed to create version');
    } finally {
      setSaving(false);
    }
  };

  const activeVersion = campaign?.versions?.find(v => v.is_active) || campaign?.versions?.[0] || null;

  if (loading) {
    return <div className="ov-wrapper"><p style={{textAlign:'center',padding:'60px 0',color:'#999'}}>Loading...</p></div>;
  }

  if (!campaign) {
    return <div className="ov-wrapper"><p style={{textAlign:'center',padding:'60px 0',color:'#999'}}>Campaign not found</p></div>;
  }

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
            <p className="cmp-header-subtitle">Add a new version to {campaign.name}</p>
          </div>
        </div>
        <div className="cmp-header-actions">
          <button className="thm-btn outline" onClick={() => navigate(`/admin/campaign/${campaignId}`)}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            <FaSave className="me-1" /> {saving ? 'Saving...' : 'Save & Activate'}
          </button>
        </div>
      </div>

      {/* Previous Version Info */}
      {activeVersion && (
        <div className="cv-prev-version mb-3">
          <div className="cv-prev-icon">
            <FaHistory />
          </div>
          <div>
            <p className="cv-prev-title">Current Active Version: v{activeVersion.version_number}</p>
            <p className="cv-prev-meta">
              {campaign.name} • {activeVersion.cta_text || 'No CTA'} • {parseInt(activeVersion.total_scans || 0).toLocaleString()} scans
            </p>
          </div>
        </div>
      )}

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
                    value={campaign.name}
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
                  onClick={() => { handleChange('videoType', 'library'); setSelectedVideo(null); }}
                >
                  <FaVideo /> From Library
                </button>
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'youtube' ? 'active' : ''}`}
                  onClick={() => { handleChange('videoType', 'youtube'); setSelectedVideo(null); }}
                >
                  <FaVideo /> YouTube URL
                </button>
                <button 
                  className={`cmp-video-tab ${formData.videoType === 'vimeo' ? 'active' : ''}`}
                  onClick={() => { handleChange('videoType', 'vimeo'); setSelectedVideo(null); }}
                >
                  <FaVideo /> Vimeo URL
                </button>
              </div>

              {formData.videoType === 'library' && (
                <div className="cmp-video-scroll">
                  {videos.length === 0 && (
                    <p className="cmp-helper" style={{ padding: '12px' }}>No videos in library. Upload videos first.</p>
                  )}
                  <div className="row">
                    {videos.map((video, idx) => (
                      <div className="col-md-4 col-sm-6" key={video.id}>
                        <div 
                          className={`cmp-video-card ${selectedVideo === video.id ? 'selected' : ''}`}
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className={`cmp-video-icon ${idx % 3 === 0 ? '' : idx % 3 === 1 ? 'green' : 'blue'}`}>
                            <FaVideo />
                          </div>
                          <div className="cmp-video-info">
                            <p className="cmp-video-name">{video.title || video.filename}</p>
                            <p className="cmp-video-duration">{video.source_type || 'upload'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

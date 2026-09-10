import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import api, { BACKEND_URL } from '../../services/api';
import {
  FaArrowRight, FaShareAlt, FaHeart, FaExclamationTriangle,
  FaRedo, FaCheckCircle, FaStar, FaFire, FaClock, FaPlay,
  FaCheck, FaShieldAlt, FaQrcode
} from 'react-icons/fa';
import './MobileDestinationPage.css';

const LoadingScreen = () => (
  <div className="ld-screen">
    <div className="ld-loader">
      <div className="ld-spinner"><FaQrcode size={18} color="#00C8FF" /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {/* <FaQrcode size={18} color="#00C8FF" /> */}
        <span className="ld-brand-text">AKKSYS</span>
      </div>
    </div>
  </div>
);

const ErrorScreen = ({ message, onRetry }) => (
  <div className="ld-screen">
    <div className="ld-error">
      <div className="ld-error-icon"><FaExclamationTriangle /></div>
      <h3>Oops!</h3>
      <p>{message || "Something went wrong."}</p>
      <button className="thm-btn w-100" onClick={onRetry}><FaRedo /> Try Again</button>
    </div>
  </div>
);

const VideoPlayer = ({ videoUrl }) => {
  const [loaded, setLoaded] = useState(false);

  const getEmbed = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `${BACKEND_URL}${url}`;
    if (url.includes('/embed/')) return url;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('youtu.be') ? url.split('/').pop() : url.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }
    if (url.includes('vimeo.com')) return `https://player.vimeo.com/video/${url.split('/').pop()}`;
    return url;
  };

  const src = getEmbed(videoUrl);
  if (!src) return <div className="ld-video-empty"><FaPlay /><span>Video not available</span></div>;

  const isMp4 = src.includes('/uploads/') || src.endsWith('.mp4');

  return (
    <div className="ld-video">
      <div className="ld-video-inner">
        {isMp4 ? (
          <video 
            src={src} 
            controls 
            playsInline 
            onLoadedData={() => setLoaded(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <iframe src={src} title="Video" allow="autoplay; encrypted-media" allowFullScreen onLoad={() => setLoaded(true)} />
        )}
        {!loaded && <div className="ld-video-loader"><div className="ld-spinner-sm"></div></div>}
      </div>
    </div>
  );
};

const MobileDestinationPage = () => {
  const { qrId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/landing/${qrId}`);
        setData({
          brand: res.data.brand || 'AKKSYS',
          video: res.data.video_url || '',
          headline: res.data.headline || 'Welcome',
          tagline: res.data.tagline || '',
          desc: res.data.description || '',
          cta: res.data.cta_text || 'Learn More',
          ctaLink: res.data.cta_url || '#',
          scans: parseInt(res.data.scans) || 0,
          rating: 5.0, // placeholder
          reviews: 0,
          badge: res.data.badge || '',
          features: res.data.features || [],
          versionId: res.data.version_id
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (qrId) {
      load();
    } else {
      // Preview mode fallback
      setData({
        brand: 'AKKSYS', video: '', headline: 'Preview Mode', tagline: 'This is a preview',
        desc: 'Dynamic content will appear here when a real QR is scanned.',
        cta: 'Learn More', ctaLink: '#', scans: 0, rating: 5.0, reviews: 0, badge: 'PREVIEW',
        features: ['Feature 1', 'Feature 2']
      });
      setLoading(false);
    }
  }, [qrId]);

  const handleCTAClick = async (e) => {
    e.preventDefault();
    if (data.versionId && data.ctaLink !== '#') {
      try {
        await api.post(`/landing/${data.versionId}/click`, { qr_id: qrId });
      } catch (err) {
        console.error('Failed to track click', err);
      }
      window.open(data.ctaLink, '_blank', 'noopener,noreferrer');
    } else if (data.ctaLink !== '#') {
      window.open(data.ctaLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: data.headline, url: window.location.href }); } catch { } }
    else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={() => window.location.reload()} />;
  if (!data) return <ErrorScreen message="Not found" />;

  return (
    <div className="ld-page">
      <div className="ld-glow ld-glow-1"></div>
      <div className="ld-glow ld-glow-2"></div>

      <div className="ld-card">
        <div className="ld-hdr">
          {/* <div className="ld-brand"><span className="ld-brand-dot"><FaQrcode size={16} color="#fff" /></span>{data.brand}</div> */}
          <NavLink to="/" className="ld-brand">
  <span className="ld-brand-dot">
    <FaQrcode size={16} color="#fff" />
  </span>
  {data.brand}
</NavLink>
          <button className={`ld-heart ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}><FaHeart /></button>
        </div>

        <div className="ld-badge"><span className="ld-badge-pulse"></span>{data.badge}</div>

        <div className="ld-info">
          <p className="ld-sub">{data.tagline}</p>
          <h1 className="ld-title">{data.headline}</h1>
          <div className="ld-rating">
            <div className="ld-stars">
              {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.floor(data.rating) ? 'on' : 'off'} />)}
            </div>
            <span className="ld-num">{data.rating}</span>
            <span className="ld-sep">·</span>
            <span className="ld-text-sm">{data.reviews} reviews</span>
            <span className="ld-sep">·</span>
            <span className="ld-text-sm"><FaFire className="ld-fire" />{data.scans.toLocaleString()}</span>
          </div>
        </div>


        <VideoPlayer videoUrl={data.video} />

   
        <div className="ld-features">
          {data.features.map((f, i) => (
            <div key={i} className="ld-feat"><FaCheck className="ld-feat-icon" /><span>{f}</span></div>
          ))}
        </div>

   
        <p className="ld-desc">{data.desc}</p>

   
        <a href={data.ctaLink} onClick={handleCTAClick} className="thm-btn" style={{ padding: "12px 0" }}>
          <span>{data.cta}</span>  <FaArrowRight className="ld-cta-arrow" />
        </a>
        <p className="ld-urgency"><FaClock /> Offer ends soon!</p>


        <div className="ld-bottom">
          <div className="ld-trust-row">
            <span><FaShieldAlt /> Secure</span>
            <span><FaCheckCircle /> Verified</span>
            <span><FaStar /> Trusted</span>
          </div>
          <button className="thm-btn outline" onClick={handleShare}> <FaShareAlt /> {copied ? 'Copied!' : 'Share'}</button>
        </div>

    
        <div className="ld-footer">Powered by <strong>AKKSYS</strong></div>
      </div>
    </div>
  );
};

export default MobileDestinationPage;

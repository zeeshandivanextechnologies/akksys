import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from '../../services/api';
import {
  FaImage, FaHeading, FaLink, FaSave, FaUpload, FaEye, FaPalette,
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGlobe, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaPlus, FaTrash, FaCheck, FaArrowUp,
  FaQrcode, FaChartLine, FaMousePointer, FaSyncAlt, FaChartBar,
  FaVideo, FaPalette as FaPaletteIcon, FaSpinner, FaStar
} from 'react-icons/fa';
import '../../styles/Overview.css';
import '../../styles/LandingContent.css';

const LandingContent = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [showSecondaryBtn, setShowSecondaryBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    ctaClicks: 0,
    businesses: 0,
    avgCTR: 0,
  });

  const [heroData, setHeroData] = useState({
    headline: '',
    subheadline: '',
    featurePills: [],
    primaryButton: { text: '', link: '' },
    secondaryButton: { text: '', link: '' },
    showSecondaryButton: true,
    badge: '',
    heroImage: null,
  });

  const [brandData, setBrandData] = useState({
    logo: null,
    favicon: null,
    primaryColor: '#00C8FF',
    secondaryColor: '#4DDCFF',
  });

  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    address: '',
  });

  const [socialData, setSocialData] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    website: '',
  });

  const [features, setFeatures] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [impactStats, setImpactStats] = useState([]);
  const [industrySolutions, setIndustrySolutions] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [ctaData, setCtaData] = useState({
    title: '',
    description: '',
    primaryButton: { text: '', link: '' },
    secondaryButton: { text: '', link: '' },
    showSecondaryButton: true,
  });
  const [footerData, setFooterData] = useState({
    brandName: '',
    description: '',
    socialLinks: [],
    columns: [],
    copyright: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchContent();
    fetchStats();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await api.get('/landing-content/content');
      const data = res.data;
      
      if (data.hero) setHeroData(data.hero);
      if (data.brand) {
        setBrandData({
          ...data.brand,
          primaryColor: data.brand.primaryColor || '#00C8FF',
          secondaryColor: data.brand.secondaryColor || '#4DDCFF',
        });
      }
      if (data.impact_stats) {
        setImpactStats(data.impact_stats);
      } else {
        setImpactStats([
          { icon: 'building', label: 'Businesses Empowered', staticValue: '500+' },
          { icon: 'users', label: 'Customer Engagements', staticValue: '2.4M+' },
          { icon: 'chart-line', label: 'Average CTR', staticValue: '31.2%' },
          { icon: 'star', label: 'Customer Rating', staticValue: '4.9/5' }
        ]);
      }
      if (data.features) setFeatures(data.features);
      if (data.how_it_works) setHowItWorks(data.how_it_works);
      if (data.industry_solutions) setIndustrySolutions(data.industry_solutions);
      if (data.pricing) setPricingPlans(data.pricing);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.faq) setFaqs(data.faq);
      if (data.cta) setCtaData(data.cta);
      if (data.footer) {
        setFooterData(data.footer);
        if (data.footer.socialLinks) {
          const social = {};
          data.footer.socialLinks.forEach(s => { social[s.platform] = s.url; });
          setSocialData(social);
        }
        if (data.footer.email) setContactData(prev => ({ ...prev, email: data.footer.email }));
        if (data.footer.phone) setContactData(prev => ({ ...prev, phone: data.footer.phone }));
      }
      if (data.hero?.showSecondaryButton !== undefined) setShowSecondaryBtn(data.hero.showSecondaryButton);
    } catch (err) {
      console.error('Failed to load landing content:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/landing-content/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const chartSeries = stats?.chartData?.series || [
    { name: 'Page Views', data: [0, 0, 0, 0, 0, 0] },
    { name: 'QR Scans', data: [0, 0, 0, 0, 0, 0] },
  ];

  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Poppins, sans-serif' },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#00C8FF', '#0077FF'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    xaxis: { categories: stats?.chartData?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { fontSize: '12px', fontWeight: 500, colors: '#49636F' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: '12px', fontWeight: 500, colors: '#49636F' } } },
    grid: { borderColor: '#B8EEFF', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    legend: { show: false },
    tooltip: { theme: 'light', style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif' } },
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const socialLinks = Object.entries(socialData)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({ platform, url }));

      const payload = {
        brand: brandData,
        impact_stats: impactStats,
        hero: {
          ...heroData,
          showSecondaryBtn,
          primaryButton: heroData.primaryButton || { text: 'Book a Demo', link: '/preview' },
          secondaryButton: heroData.secondaryButton || { text: 'Explore Solutions', link: '#industry-solutions' },
        },
        features,
        how_it_works: howItWorks,
        industry_solutions: industrySolutions,
        pricing: pricingPlans,
        testimonials,
        faq: faqs,
        cta: ctaData,
        footer: {
          ...footerData,
          socialLinks,
          email: contactData.email,
          phone: contactData.phone,
        },
      };

      await api.put('/landing-content/content', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, { icon: 'plus', title: 'New Feature', description: 'Feature description' }]);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddHowItWorks = () => {
    setHowItWorks([...howItWorks, { num: String(howItWorks.length + 1).padStart(2, '0'), title: 'New Step', description: 'Step description' }]);
  };

  const handleRemoveHowItWorks = (index) => {
    setHowItWorks(howItWorks.filter((_, i) => i !== index));
  };

  const handleAddIndustry = () => {
    setIndustrySolutions([...industrySolutions, { icon: 'building', title: 'New Industry', description: 'Industry description', stats: 'Key metric' }]);
  };

  const handleRemoveIndustry = (index) => {
    setIndustrySolutions(industrySolutions.filter((_, i) => i !== index));
  };

  const handleAddPlan = () => {
    setPricingPlans([...pricingPlans, { name: 'New Plan', price: '0', period: '/month', description: 'Plan description', features: [], cta: 'Get Started', popular: false, icon: 'rocket' }]);
  };

  const handleRemovePlan = (index) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: 'Name', role: 'Role, Company', text: 'Testimonial text', avatar: 'NA' }]);
  };

  const handleRemoveTestimonial = (index) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'Question?', answer: 'Answer here...' }]);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleAddImpactStat = () => {
    setImpactStats([...impactStats, { icon: 'chart-line', label: 'New Stat', staticValue: '100+' }]);
  };

  const handleRemoveImpactStat = (index) => {
    setImpactStats(impactStats.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FaHeading /> },
    { id: 'brand', label: 'Branding', icon: <FaPalette /> },
    { id: 'features', label: 'Features', icon: <FaImage /> },
    { id: 'howItWorks', label: 'How It Works', icon: <FaSyncAlt /> },
    { id: 'impact', label: 'Impact Stats', icon: <FaChartBar /> },
    { id: 'industry', label: 'Industries', icon: <FaQrcode /> },
    { id: 'pricing', label: 'Pricing', icon: <FaChartLine /> },
    { id: 'testimonials', label: 'Testimonials', icon: <FaStar /> },
    { id: 'faq', label: 'FAQ', icon: <FaGlobe /> },
    { id: 'cta', label: 'Call to Action', icon: <FaLink /> },
    { id: 'contact', label: 'Contact', icon: <FaPhone /> },
    { id: 'social', label: 'Social Media', icon: <FaGlobe /> },
  ];

  const iconOptions = [
    { value: 'sync-alt', label: 'Sync' },
    { value: 'chart-bar', label: 'Chart' },
    { value: 'chart-line', label: 'Chart Line' },
    { value: 'video', label: 'Video' },
    { value: 'palette', label: 'Palette' },
    { value: 'qrcode', label: 'QR Code' },
    { value: 'globe', label: 'Globe' },
    { value: 'image', label: 'Image' },
    { value: 'link', label: 'Link' },
    { value: 'building', label: 'Building' },
    { value: 'home', label: 'Home' },
    { value: 'shopping-cart', label: 'Shopping' },
    { value: 'heartbeat', label: 'Healthcare' },
    { value: 'store', label: 'Store' },
    { value: 'industry', label: 'Industry' },
    { value: 'users', label: 'Users' },
    { value: 'layer-group', label: 'Layers' },
    { value: 'shield-alt', label: 'Shield' },
    { value: 'bullseye', label: 'Bullseye' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'bolt', label: 'Bolt' },
    { value: 'crown', label: 'Crown' },
    { value: 'briefcase', label: 'Briefcase' },
  ];

  const getIconComponent = (iconName) => {
    const map = {
      'sync-alt': <FaSyncAlt />, 'chart-bar': <FaChartBar />, 'chart-line': <FaChartLine />,
      'video': <FaVideo />, 'palette': <FaPaletteIcon />, 'qrcode': <FaQrcode />,
      'globe': <FaGlobe />, 'image': <FaImage />, 'link': <FaLink />,
      'building': <FaQrcode />, 'home': <FaQrcode />, 'shopping-cart': <FaQrcode />,
      'heartbeat': <FaQrcode />, 'store': <FaQrcode />, 'industry': <FaQrcode />,
      'users': <FaQrcode />, 'layer-group': <FaQrcode />, 'shield-alt': <FaQrcode />,
      'bullseye': <FaQrcode />, 'rocket': <FaQrcode />, 'bolt': <FaQrcode />,
      'crown': <FaQrcode />, 'briefcase': <FaQrcode />,
    };
    return map[iconName] || <FaPlus />;
  };

  if (loading) {
    return (
      <div className="ov-wrapper">
        <div className="text-center py-4">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
      </div>
    );
  }

  return (
    <div className="ov-wrapper">
      <div className="ov-header">
        <div>
          <h4 className="ov-page-title">Landing Page Content</h4>
          <p className="ov-page-subtitle">Customize your public landing page content and design</p>
        </div>
        <div className="ov-header-actions">
          <button className="thm-btn outline" onClick={() => window.open('/', '_blank')}>
            <FaEye /> Preview
          </button>
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <><FaSpinner className="fa-spin" /> Saving...</>
            ) : saved ? (
              <><FaCheck /> Saved!</>
            ) : (
              <><FaSave /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="row">
        {[
          { title: 'TOTAL SCANS', value: stats.totalScans?.toLocaleString() || '0', color: 'primary', icon: <FaChartLine /> },
          { title: 'CTA CLICKS', value: stats.ctaClicks?.toLocaleString() || '0', color: 'blue', icon: <FaMousePointer /> },
          { title: 'BUSINESSES', value: stats.businesses || '0', color: 'orange', icon: <FaQrcode /> },
          { title: 'AVG CTR', value: `${stats.avgCTR || 0}%`, color: 'green', icon: <FaArrowUp /> },
        ].map((stat, index) => (
          <div className="col-sm-6 col-lg-3 mb-3" key={index}>
            <div className="ov-stat-card">
              <div className="ov-stat-header">
                <span className="ov-stat-title">{stat.title}</span>
                <div className={`ov-stat-icon ${stat.color}`}>{stat.icon}</div>
              </div>
              <div className="ov-stat-value">{stat.value}</div>
              <div className={`ov-stat-bar ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="lc-tabs an-card">
        {tabs.map(tab => (
          <button key={tab.id} className={`lc-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8 col-md-12 mb-3">
          {activeTab === 'hero' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaHeading className="me-2" />Hero Section</h6><p className="ov-card-subtitle">Main headline and hero image for your landing page</p></div></div>
              <div className="ov-card-body">
                <div className="custom-frm-bx">
                  <label className="lc-label">Badge Text</label>
                  <input type="text" className="form-control" value={heroData.badge || ''} onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })} />
                </div>
                <div className="custom-frm-bx">
                  <label className="lc-label">Main Headline</label>
                  <input type="text" className="form-control" value={heroData.headline || ''} onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })} />
                </div>
                <div className="custom-frm-bx">
                  <label className="lc-label">Sub-headline</label>
                  <textarea className="form-control" rows="3" value={heroData.subheadline || ''} onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })} />
                </div>
                <div className="custom-frm-bx">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="lc-label mb-0">Feature Pills</label>
                    <button type="button" className="thm-btn outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setHeroData({ ...heroData, featurePills: [...(heroData.featurePills || []), ''] })}>
                      <FaPlus /> Add Pill
                    </button>
                  </div>
                  {(heroData.featurePills || []).map((pill, index) => (
                    <div key={index} className="d-flex mb-2 align-items-center" style={{ gap: '10px' }}>
                      <input 
                        type="text" 
                        className="form-control mb-0" 
                        value={pill} 
                        onChange={(e) => {
                          const newPills = [...(heroData.featurePills || [])];
                          newPills[index] = e.target.value;
                          setHeroData({ ...heroData, featurePills: newPills });
                        }} 
                        placeholder="Feature Pill Text"
                      />
                      <button type="button" className="lc-btn-icon mt-0 danger" onClick={() => {
                        const newPills = [...(heroData.featurePills || [])];
                        newPills.splice(index, 1);
                        setHeroData({ ...heroData, featurePills: newPills });
                      }}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  {(!heroData.featurePills || heroData.featurePills.length === 0) && (
                    <div className="text-muted small">No feature pills added. Click "Add Pill" to create one.</div>
                  )}
                </div>
                <div className="custom-frm-bx mb-0">
                  <label className="lc-label">Hero Image</label>
                  <input 
                    type="file" 
                    id="hero-image-upload"
                    accept="image/jpeg, image/png, image/svg+xml" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File size exceeds 5MB limit.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setHeroData({ ...heroData, heroImage: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div 
                    className="lc-upload-zone" 
                    onClick={() => document.getElementById('hero-image-upload').click()}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  >
                    {heroData.heroImage ? (
                      <>
                        <img src={heroData.heroImage} alt="Hero" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                        <button 
                          type="button" 
                          className="lc-btn-icon danger position-absolute" 
                          style={{ top: '10px', right: '10px', zIndex: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHeroData({ ...heroData, heroImage: null });
                            document.getElementById('hero-image-upload').value = '';
                          }}
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <>
                        <FaUpload className="lc-upload-icon" />
                        <p className="lc-upload-text">Click to upload image</p>
                        <span className="lc-upload-hint">Supports JPG, PNG, SVG (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ov-divider mt-4 mb-3"></div>
                <div className="lc-switch-row">
                  <div className="lc-switch-info">
                    <span className="lc-switch-label">Show Performance Stats</span>
                    <p className="lc-switch-desc small  mb-0">Display the real-time stats box under the hero section</p>
                  </div>
                  <label className="lc-switch">
                    <input 
                      type="checkbox" 
                      checked={heroData.showStats !== false} 
                      onChange={(e) => setHeroData({ ...heroData, showStats: e.target.checked })} 
                    />
                    <span className="lc-switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaPalette className="me-2" />Branding Settings</h6><p className="ov-card-subtitle">Customize logo, favicon, and brand colors</p></div></div>
              <div className="ov-card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label">Logo</label>
                      <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setBrandData({ ...brandData, logo: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <div className="lc-upload-zone small" onClick={() => document.getElementById('logo-upload').click()} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                        {brandData.logo ? (
                          <>
                            <img src={brandData.logo} alt="Logo" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                            <button type="button" className="lc-btn-icon danger position-absolute" style={{ top: '5px', right: '5px' }} onClick={(e) => { e.stopPropagation(); setBrandData({ ...brandData, logo: null }); document.getElementById('logo-upload').value=''; }}><FaTrash size={10} /></button>
                          </>
                        ) : (
                          <><FaUpload className="lc-upload-icon small" /><p className="lc-upload-text">Upload Logo</p><span className="lc-upload-hint">PNG, SVG (Max 2MB)</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label">Favicon</label>
                      <input type="file" id="favicon-upload" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setBrandData({ ...brandData, favicon: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <div className="lc-upload-zone small" onClick={() => document.getElementById('favicon-upload').click()} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                        {brandData.favicon ? (
                          <>
                            <img src={brandData.favicon} alt="Favicon" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                            <button type="button" className="lc-btn-icon danger position-absolute" style={{ top: '5px', right: '5px' }} onClick={(e) => { e.stopPropagation(); setBrandData({ ...brandData, favicon: null }); document.getElementById('favicon-upload').value=''; }}><FaTrash size={10} /></button>
                          </>
                        ) : (
                          <><FaUpload className="lc-upload-icon small" /><p className="lc-upload-text">Upload Favicon</p><span className="lc-upload-hint">32x32 PNG (Max 1MB)</span></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6"><div className="custom-frm-bx"><label className="lc-label">Primary Color</label><div className="lc-color-picker"><input type="color" value={brandData.primaryColor} onChange={(e) => setBrandData({ ...brandData, primaryColor: e.target.value })} /><input type="text" className="form-control" value={brandData.primaryColor} onChange={(e) => setBrandData({ ...brandData, primaryColor: e.target.value })} /></div></div></div>
                  <div className="col-md-6"><div className="custom-frm-bx mb-0"><label className="lc-label">Secondary Color</label><div className="lc-color-picker"><input type="color" value={brandData.secondaryColor} onChange={(e) => setBrandData({ ...brandData, secondaryColor: e.target.value })} /><input type="text" className="form-control" value={brandData.secondaryColor} onChange={(e) => setBrandData({ ...brandData, secondaryColor: e.target.value })} /></div></div></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaImage className="me-2" />Features Section</h6><p className="ov-card-subtitle">Manage features displayed on your landing page</p></div><button className="thm-btn outline" onClick={handleAddFeature}><FaPlus /> Add Feature</button></div>
              <div className="ov-card-body">
                {features.map((feature, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box">{getIconComponent(feature.icon)}</div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Icon</label><select className="form-control" value={feature.icon} onChange={(e) => { const n = [...features]; n[index].icon = e.target.value; setFeatures(n); }}>{iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></div>
                        <div className="col-md-4"><div className="custom-frm-bx mb-0"><label className="lc-label">Title</label><input type="text" className="form-control" value={feature.title} onChange={(e) => { const n = [...features]; n[index].title = e.target.value; setFeatures(n); }} /></div></div>
                        <div className="col-md-5"><div className="custom-frm-bx mb-0"><label className="lc-label">Description</label><input type="text" className="form-control" value={feature.description} onChange={(e) => { const n = [...features]; n[index].description = e.target.value; setFeatures(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemoveFeature(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaChartBar className="me-2" />Impact Stats Section</h6><p className="ov-card-subtitle">Manage performance stats displayed on your landing page</p></div><button className="thm-btn outline" onClick={handleAddImpactStat}><FaPlus /> Add Stat</button></div>
              <div className="ov-card-body">
                {impactStats.map((stat, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box">{getIconComponent(stat.icon)}</div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Icon</label><select className="form-control" value={stat.icon} onChange={(e) => { const n = [...impactStats]; n[index].icon = e.target.value; setImpactStats(n); }}>{iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></div>
                        <div className="col-md-5"><div className="custom-frm-bx mb-0"><label className="lc-label">Label</label><input type="text" className="form-control" value={stat.label} onChange={(e) => { const n = [...impactStats]; n[index].label = e.target.value; setImpactStats(n); }} /></div></div>
                        <div className="col-md-4"><div className="custom-frm-bx mb-0"><label className="lc-label">Value (e.g. 500+, 2.4M+)</label><input type="text" className="form-control" value={stat.staticValue || ''} onChange={(e) => { const n = [...impactStats]; n[index].staticValue = e.target.value; setImpactStats(n); }} placeholder="e.g. 500+, 2.4M+, 4.9/5" /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger mt-4" onClick={() => handleRemoveImpactStat(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'howItWorks' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaSyncAlt className="me-2" />How It Works</h6><p className="ov-card-subtitle">Manage the steps section</p></div><button className="thm-btn outline" onClick={handleAddHowItWorks}><FaPlus /> Add Step</button></div>
              <div className="ov-card-body">
                {howItWorks.map((step, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box"><span style={{fontWeight:700,fontSize:'18px'}}>{step.num}</span></div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Number</label><input type="text" className="form-control" value={step.num} onChange={(e) => { const n = [...howItWorks]; n[index].num = e.target.value; setHowItWorks(n); }} /></div></div>
                        <div className="col-md-3"><div className="custom-frm-bx mb-0"><label className="lc-label">Title</label><input type="text" className="form-control" value={step.title} onChange={(e) => { const n = [...howItWorks]; n[index].title = e.target.value; setHowItWorks(n); }} /></div></div>
                        <div className="col-md-6"><div className="custom-frm-bx mb-0"><label className="lc-label">Description</label><input type="text" className="form-control" value={step.description} onChange={(e) => { const n = [...howItWorks]; n[index].description = e.target.value; setHowItWorks(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemoveHowItWorks(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'industry' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaQrcode className="me-2" />Industry Solutions</h6><p className="ov-card-subtitle">Manage industry cards</p></div><button className="thm-btn outline" onClick={handleAddIndustry}><FaPlus /> Add Industry</button></div>
              <div className="ov-card-body">
                {industrySolutions.map((ind, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box">{getIconComponent(ind.icon)}</div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Icon</label><select className="form-control" value={ind.icon} onChange={(e) => { const n = [...industrySolutions]; n[index].icon = e.target.value; setIndustrySolutions(n); }}>{iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></div>
                        <div className="col-md-3"><div className="custom-frm-bx mb-0"><label className="lc-label">Title</label><input type="text" className="form-control" value={ind.title} onChange={(e) => { const n = [...industrySolutions]; n[index].title = e.target.value; setIndustrySolutions(n); }} /></div></div>
                        <div className="col-md-4"><div className="custom-frm-bx mb-0"><label className="lc-label">Description</label><input type="text" className="form-control" value={ind.description} onChange={(e) => { const n = [...industrySolutions]; n[index].description = e.target.value; setIndustrySolutions(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Stats</label><input type="text" className="form-control" value={ind.stats} onChange={(e) => { const n = [...industrySolutions]; n[index].stats = e.target.value; setIndustrySolutions(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemoveIndustry(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaChartLine className="me-2" />Pricing Plans</h6><p className="ov-card-subtitle">Manage pricing cards</p></div><button className="thm-btn outline" onClick={handleAddPlan}><FaPlus /> Add Plan</button></div>
              <div className="ov-card-body">
                {pricingPlans.map((plan, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box">{getIconComponent(plan.icon)}</div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Name</label><input type="text" className="form-control" value={plan.name} onChange={(e) => { const n = [...pricingPlans]; n[index].name = e.target.value; setPricingPlans(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Price</label><input type="text" className="form-control" value={plan.price} onChange={(e) => { const n = [...pricingPlans]; n[index].price = e.target.value; setPricingPlans(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Period</label><input type="text" className="form-control" value={plan.period} onChange={(e) => { const n = [...pricingPlans]; n[index].period = e.target.value; setPricingPlans(n); }} /></div></div>
                        <div className="col-md-3"><div className="custom-frm-bx mb-0"><label className="lc-label">Description</label><input type="text" className="form-control" value={plan.description} onChange={(e) => { const n = [...pricingPlans]; n[index].description = e.target.value; setPricingPlans(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">CTA Text</label><input type="text" className="form-control" value={plan.cta} onChange={(e) => { const n = [...pricingPlans]; n[index].cta = e.target.value; setPricingPlans(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemovePlan(index)}><FaTrash /></button></div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-10"><div className="custom-frm-bx mb-0"><label className="lc-label">Features (comma separated)</label><input type="text" className="form-control" value={(plan.features || []).join(', ')} onChange={(e) => { const n = [...pricingPlans]; n[index].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean); setPricingPlans(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Popular</label><select className="form-control" value={plan.popular ? 'true' : 'false'} onChange={(e) => { const n = [...pricingPlans]; n[index].popular = e.target.value === 'true'; setPricingPlans(n); }}><option value="false">No</option><option value="true">Yes</option></select></div></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaStar className="me-2" />Testimonials</h6><p className="ov-card-subtitle">Manage customer testimonials</p></div><button className="thm-btn outline" onClick={handleAddTestimonial}><FaPlus /> Add Testimonial</button></div>
              <div className="ov-card-body">
                {testimonials.map((t, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box"><span style={{fontWeight:700,fontSize:'14px'}}>{t.avatar}</span></div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Name</label><input type="text" className="form-control" value={t.name} onChange={(e) => { const n = [...testimonials]; n[index].name = e.target.value; setTestimonials(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Role</label><input type="text" className="form-control" value={t.role} onChange={(e) => { const n = [...testimonials]; n[index].role = e.target.value; setTestimonials(n); }} /></div></div>
                        <div className="col-md-5"><div className="custom-frm-bx mb-0"><label className="lc-label">Text</label><input type="text" className="form-control" value={t.text} onChange={(e) => { const n = [...testimonials]; n[index].text = e.target.value; setTestimonials(n); }} /></div></div>
                        <div className="col-md-2"><div className="custom-frm-bx mb-0"><label className="lc-label">Avatar</label><input type="text" className="form-control" value={t.avatar} onChange={(e) => { const n = [...testimonials]; n[index].avatar = e.target.value; setTestimonials(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemoveTestimonial(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaGlobe className="me-2" />FAQ</h6><p className="ov-card-subtitle">Manage frequently asked questions</p></div><button className="thm-btn outline" onClick={handleAddFaq}><FaPlus /> Add FAQ</button></div>
              <div className="ov-card-body">
                {faqs.map((faq, index) => (
                  <div key={index} className="lc-feature-item">
                    <div className="lc-feature-icon-box"><span style={{fontWeight:700,fontSize:'14px'}}>Q{index + 1}</span></div>
                    <div className="lc-feature-content">
                      <div className="row">
                        <div className="col-md-5"><div className="custom-frm-bx mb-0"><label className="lc-label">Question</label><input type="text" className="form-control" value={faq.question} onChange={(e) => { const n = [...faqs]; n[index].question = e.target.value; setFaqs(n); }} /></div></div>
                        <div className="col-md-6"><div className="custom-frm-bx mb-0"><label className="lc-label">Answer</label><input type="text" className="form-control" value={faq.answer} onChange={(e) => { const n = [...faqs]; n[index].answer = e.target.value; setFaqs(n); }} /></div></div>
                        <div className="col-md-1"><button className="lc-btn-icon danger" onClick={() => handleRemoveFaq(index)}><FaTrash /></button></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaLink className="me-2" />Call to Action Settings</h6><p className="ov-card-subtitle">Configure button text and links</p></div></div>
              <div className="ov-card-body">
                <div className="custom-frm-bx"><label className="lc-label">CTA Title</label><input type="text" className="form-control" value={ctaData.title || ''} onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })} /></div>
                <div className="custom-frm-bx"><label className="lc-label">CTA Description</label><textarea className="form-control" rows="2" value={ctaData.description || ''} onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })} /></div>
                <div className="row">
                  <div className="col-md-6"><div className="custom-frm-bx"><label className="lc-label">Primary Button Text</label><input type="text" className="form-control" value={ctaData.primaryButton?.text || ''} onChange={(e) => setCtaData({ ...ctaData, primaryButton: { ...ctaData.primaryButton, text: e.target.value } })} /></div></div>
                  <div className="col-md-6"><div className="custom-frm-bx mb-0"><label className="lc-label">Primary Button Link</label><input type="text" className="form-control" value={ctaData.primaryButton?.link || ''} onChange={(e) => setCtaData({ ...ctaData, primaryButton: { ...ctaData.primaryButton, link: e.target.value } })} /></div></div>
                </div>
                <div className="ov-divider"></div>
                <div className="lc-switch-row">
                  <div className="lc-switch-info"><span className="lc-switch-label">Show Secondary Button</span></div>
                  <label className="lc-switch"><input type="checkbox" checked={ctaData.showSecondaryButton !== false} onChange={(e) => setCtaData({ ...ctaData, showSecondaryButton: e.target.checked })} /><span className="lc-switch-slider"></span></label>
                </div>
                {ctaData.showSecondaryButton !== false && (
                  <div className="row">
                    <div className="col-md-6"><div className="custom-frm-bx"><label className="lc-label">Secondary Button Text</label><input type="text" className="form-control" value={ctaData.secondaryButton?.text || ''} onChange={(e) => setCtaData({ ...ctaData, secondaryButton: { ...ctaData.secondaryButton, text: e.target.value } })} /></div></div>
                    <div className="col-md-6"><div className="custom-frm-bx mb-0"><label className="lc-label">Secondary Button Link</label><input type="text" className="form-control" value={ctaData.secondaryButton?.link || ''} onChange={(e) => setCtaData({ ...ctaData, secondaryButton: { ...ctaData.secondaryButton, link: e.target.value } })} /></div></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaPhone className="me-2" />Contact Information</h6><p className="ov-card-subtitle">Display contact details on your landing page</p></div></div>
              <div className="ov-card-body">
                <div className="custom-frm-bx"><label className="lc-label">Email Address</label><div className="lc-input-with-icon"><FaEnvelope className="lc-input-icon" /><input type="email" className="form-control" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} /></div></div>
                <div className="custom-frm-bx"><label className="lc-label">Phone Number</label><div className="lc-input-with-icon"><FaPhone className="lc-input-icon" /><input type="tel" className="form-control" value={contactData.phone} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} /></div></div>
                <div className="custom-frm-bx mb-0"><label className="lc-label">Address</label><div className="lc-input-with-icon"><FaMapMarkerAlt className="lc-input-icon" /><input type="text" className="form-control" value={contactData.address} onChange={(e) => setContactData({ ...contactData, address: e.target.value })} /></div></div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header"><div><h6 className="ov-card-title"><FaGlobe className="me-2" />Social Media Links</h6><p className="ov-card-subtitle">Add your social media profiles</p></div></div>
              <div className="ov-card-body">
                <div className="custom-frm-bx"><label className="lc-label">Facebook</label><div className="lc-input-with-icon"><FaFacebook className="lc-input-icon facebook" /><input type="url" className="form-control" placeholder="https://facebook.com/yourpage" value={socialData.facebook || ''} onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })} /></div></div>
                <div className="custom-frm-bx"><label className="lc-label">Twitter</label><div className="lc-input-with-icon"><FaTwitter className="lc-input-icon twitter" /><input type="url" className="form-control" placeholder="https://twitter.com/yourhandle" value={socialData.twitter || ''} onChange={(e) => setSocialData({ ...socialData, twitter: e.target.value })} /></div></div>
                <div className="custom-frm-bx"><label className="lc-label">Instagram</label><div className="lc-input-with-icon"><FaInstagram className="lc-input-icon instagram" /><input type="url" className="form-control" placeholder="https://instagram.com/yourprofile" value={socialData.instagram || ''} onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })} /></div></div>
                <div className="custom-frm-bx"><label className="lc-label">YouTube</label><div className="lc-input-with-icon"><FaYoutube className="lc-input-icon youtube" /><input type="url" className="form-control" placeholder="https://youtube.com/yourchannel" value={socialData.youtube || ''} onChange={(e) => setSocialData({ ...socialData, youtube: e.target.value })} /></div></div>
                <div className="custom-frm-bx mb-0"><label className="lc-label">Website</label><div className="lc-input-with-icon"><FaGlobe className="lc-input-icon" /><input type="url" className="form-control" placeholder="https://yourwebsite.com" value={socialData.website || ''} onChange={(e) => setSocialData({ ...socialData, website: e.target.value })} /></div></div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4 mb-3">
          <div className="ov-card h-auto">
            <div className="ov-card-header"><div><h6 className="ov-card-title"><FaEye className="me-2" />Live Preview</h6><p className="ov-card-subtitle">See how your landing page will look</p></div></div>
            <div className="ov-card-body">
              <div className="lc-preview-landing">
                <div className="lc-preview-hero">
                  {heroData.heroImage && (
                    <div className="mb-3 text-center">
                      <img src={heroData.heroImage} alt="Hero Preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <h3 className="lc-preview-headline">{heroData.headline}</h3>
                  <p className="lc-preview-subheadline">{heroData.subheadline}</p>
                  <div className="lc-preview-buttons">
                    <button className="lc-preview-btn primary">{heroData.primaryButton?.text || heroData.buttonText}</button>
                    {showSecondaryBtn && <button className="lc-preview-btn secondary">{heroData.secondaryButton?.text || heroData.secondaryButtonText}</button>}
                  </div>
                  
                </div>
                <div className="lc-preview-features">
                  {features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="lc-preview-feature"><span className="lc-preview-feature-icon">{getIconComponent(feature.icon)}</span><span className="lc-preview-feature-title">{feature.title}</span></div>
                  ))}
                </div>
                <div className="lc-preview-contact">
                  <div className="lc-preview-contact-item"><FaEnvelope /> {contactData.email}</div>
                  <div className="lc-preview-contact-item"><FaPhone /> {contactData.phone}</div>
                </div>
                <div className="lc-preview-social">
                  {socialData.facebook && <FaFacebook className="lc-preview-social-icon" />}
                  {socialData.twitter && <FaTwitter className="lc-preview-social-icon" />}
                  {socialData.instagram && <FaInstagram className="lc-preview-social-icon" />}
                  {socialData.youtube && <FaYoutube className="lc-preview-social-icon" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="ov-card h-auto">
            <div className="ov-card-header"><div><h6 className="ov-card-title"><FaChartLine className="me-2" />Performance</h6><p className="ov-card-subtitle">Landing page metrics</p></div></div>
            <div className="ov-apex-chart"><Chart options={chartOptions} series={chartSeries} type="area" height={250} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContent;

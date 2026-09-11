import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, FaEnvelope, FaLock, FaBell, FaPalette, 
  FaSave, FaEye, FaEyeSlash, FaQrcode,
  FaShieldAlt, FaGlobe, FaCheck, FaUpload, FaTrash,
  FaChartLine
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/Overview.css';
import '../../styles/LandingContent.css';

const Settings = () => {
  const { user, setUser } = useAuth();
  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [avatar, setAvatar] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    scanAlerts: true,
    weeklyReport: true,
    campaignUpdates: true,
  });

  const [twoFactor, setTwoFactor] = useState({
    smsAuth: false,
    emailAuth: false,
  });

  const [branding, setBranding] = useState({
    primaryColor: '#00C8FF',
    secondaryColor: '#4DDCFF',
    companyName: 'AKKSYS',
    logoUrl: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          company: res.data.company || '',
          role: res.data.role === 'superadmin' ? 'Superadmin' : 'Admin',
        });
      } catch {
        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            company: '',
            role: user.role === 'superadmin' ? 'Superadmin' : 'Admin',
          });
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();

    const fetchTwoFactor = async () => {
      try {
        const res = await api.get('/user/two-factor');
        setTwoFactor({
          smsAuth: res.data.sms_auth || false,
          emailAuth: res.data.email_auth || false,
        });
      } catch {
        // use defaults
      }
    };
    fetchTwoFactor();

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/user/notifications');
        setNotifications(res.data);
      } catch {
        // use defaults
      }
    };
    fetchNotifications();

    const fetchBranding = async () => {
      try {
        const res = await api.get('/settings');
        setBranding({
          companyName: res.data.company_name || 'AKKSYS',
          primaryColor: res.data.primary_color || '#00C8FF',
          secondaryColor: res.data.secondary_color || '#4DDCFF',
          logoUrl: res.data.logo_url || null,
        });
      } catch {
        // use defaults
      }
    };
    fetchBranding();
  }, [user]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('akksys_avatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      localStorage.setItem('akksys_avatar', reader.result);
      window.dispatchEvent(new Event('avatarUpdated'));
      toast.success('Avatar updated!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAvatar = () => {
    setAvatar(null);
    localStorage.removeItem('akksys_avatar');
    window.dispatchEvent(new Event('avatarUpdated'));
    toast.success('Avatar removed!');
  };

  const handleBrandingLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBranding({ ...branding, logoUrl: reader.result });
      toast.success('Logo updated!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTwoFactorToggle = async (type) => {
    const updated = {
      smsAuth: type === 'sms' ? !twoFactor.smsAuth : twoFactor.smsAuth,
      emailAuth: type === 'email' ? !twoFactor.emailAuth : twoFactor.emailAuth,
    };
    setTwoFactor(updated);
    try {
      await api.put('/user/two-factor', {
        sms_auth: updated.smsAuth,
        email_auth: updated.emailAuth,
      });
      toast.success(`${type === 'sms' ? 'SMS' : 'Email'} authentication ${updated[type === 'sms' ? 'smsAuth' : 'emailAuth'] ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setTwoFactor(twoFactor);
      toast.error(err.response?.data?.error || 'Failed to update 2FA settings');
    }
  };

  const handleNotificationToggle = async (type) => {
    const updated = {
      ...notifications,
      [type]: !notifications[type],
    };
    setNotifications(updated);
    try {
      await api.put('/user/notifications', updated);
      const label = { emailAlerts: 'Email Alerts', scanAlerts: 'Scan Alerts', weeklyReport: 'Weekly Report', campaignUpdates: 'Campaign Updates' };
      toast.success(`${label[type]} ${updated[type] ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setNotifications(notifications);
      toast.error(err.response?.data?.error || 'Failed to update notification settings');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'branding', label: 'Branding', icon: <FaPalette /> },
  ];

  const handleSave = async () => {
    if (activeTab === 'profile') {
      setSaving(true);
      try {
        const res = await api.put('/user/profile', {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          company: profile.company,
        });
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          company: res.data.company || '',
          role: res.data.role === 'superadmin' ? 'Superadmin' : 'Admin',
        });
        setUser({ ...user, name: res.data.name, email: res.data.email });
        toast.success('Profile updated successfully!');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.details?.[0]?.message || err.message || 'Failed to update profile';
        toast.error(msg);
      } finally {
        setSaving(false);
      }
    } else if (activeTab === 'security') {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        toast.error('All password fields are required');
        return;
      }
      if (passwords.new !== passwords.confirm) {
        toast.error('New password and confirm password do not match');
        return;
      }
      if (passwords.new.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
      setSaving(true);
      try {
        await api.put('/user/password', {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
        setPasswords({ current: '', new: '', confirm: '' });
        toast.success('Password updated successfully!');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.details?.[0]?.message || err.message || 'Failed to update password';
        toast.error(msg);
      } finally {
        setSaving(false);
      }
    } else if (activeTab === 'branding') {
      setSaving(true);
      try {
        await api.put('/settings', {
          company_name: branding.companyName,
          primary_color: branding.primaryColor,
          secondary_color: branding.secondaryColor,
          logo_url: branding.logoUrl,
          favicon_url: null,
        });
        toast.success('Branding settings updated!');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Failed to update branding settings';
        toast.error(msg);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="ov-wrapper">
      {/* Page Header */}
      <div className="ov-header">
        <div>
          <h4 className="ov-page-title">Settings</h4>
          <p className="ov-page-subtitle">Manage your account and preferences</p>
        </div>
        <div className="ov-header-actions">
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Saving...</>
            ) : saved ? (
              <><FaCheck /> Saved!</>
            ) : (
              <><FaSave /> Save Changes</>
            )}
          </button>
        </div>
      </div>

 
      {/* Tabs */}
      <div className="lc-tabs an-card">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`lc-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="row">
        <div className="col-lg-8 col-md-12 mb-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaUser className="me-2" />Profile Information</h6>
                  <p className="ov-card-subtitle">Update your personal details</p>
                </div>
              </div>
              <div className="ov-card-body">
                {loadingProfile ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Avatar */}
                    <div className="d-flex align-items-center gap-4 mb-4 p-3 rounded ov-main-card">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="profile-avatar" style={{ width: '60px', height: '60px', fontSize: '1.2rem', objectFit: 'cover' }} />
                      ) : (
                        <div className="profile-avatar" style={{ width: '60px', height: '60px', fontSize: '1.2rem' }}>
                          {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                      )}
                      <div>
                        <div className="fw-bold text-white">{profile.name || 'User'}</div>
                        <div className="sub-profile-title">{profile.role}</div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleAvatarChange}
                        />
                        <button
                          className="thm-btn outline mt-2"
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <FaUpload className="me-1" /> Change Avatar
                        </button>
                        {avatar && (
                          <button
                            className="thm-lg-btn ov-btn-danger ms-2 mt-2"
                            style={{padding : "6px 12px"}}
                            onClick={removeAvatar}
                          >
                            <FaTrash className="me-1" /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="row">
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label"><FaUser className="me-1" /> Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label"><FaEnvelope className="me-1" /> Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label"><FaGlobe className="me-1" /> Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx mb-0">
                      <label className="lc-label"><FaGlobe className="me-1" /> Company</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <div className="ov-card h-auto mb-3">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title"><FaLock className="me-2" />Change Password</h6>
                    <p className="ov-card-subtitle">Update your password regularly for better security</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <div className="custom-frm-bx">
                    <label className="lc-label">Current Password</label>
                    <div className="lc-input-with-icon">
                      <FaLock className="lc-input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="form-control" 
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        style={{ paddingRight: '40px' }}
                      />
                      <button 
                        className="btn position-absolute end-0 top-50 translate-middle-y text-white border-0"
                        style={{ right: '8px' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="custom-frm-bx">
                        <label className="lc-label">New Password</label>
                        <div className="lc-input-with-icon">
                          <FaLock className="lc-input-icon" />
                          <input 
                            type={showNewPassword ? 'text' : 'password'} 
                            className="form-control" 
                            placeholder="Enter new password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            style={{ paddingRight: '40px' }}
                          />
                          <button 
                            className="btn position-absolute end-0 top-50 translate-middle-y text-white border-0"
                            style={{ right: '8px' }}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="custom-frm-bx mb-0">
                        <label className="lc-label">Confirm New Password</label>
                        <div className="lc-input-with-icon">
                          <FaLock className="lc-input-icon" />
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Confirm new password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ov-card h-auto">
                <div className="ov-card-header">
                  <div>
                    <h6 className="ov-card-title"><FaShieldAlt className="me-2" />Two-Factor Authentication</h6>
                    <p className="ov-card-subtitle">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <div className="ov-card-body">
                  <div className="lc-switch-row">
                    <div className="lc-switch-info">
                      <span className="lc-switch-label">SMS Authentication</span>
                      <span className="lc-switch-desc">Receive verification code via SMS</span>
                    </div>
                    <label className="lc-switch">
                      <input
                        type="checkbox"
                        checked={twoFactor.smsAuth}
                        onChange={() => handleTwoFactorToggle('sms')}
                      />
                      <span className="lc-switch-slider"></span>
                    </label>
                  </div>
                  <div className="lc-switch-row mb-0">
                    <div className="lc-switch-info">
                      <span className="lc-switch-label">Email Authentication</span>
                      <span className="lc-switch-desc">Receive verification code via email</span>
                    </div>
                    <label className="lc-switch">
                      <input
                        type="checkbox"
                        checked={twoFactor.emailAuth}
                        onChange={() => handleTwoFactorToggle('email')}
                      />
                      <span className="lc-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaBell className="me-2" />Notification Preferences</h6>
                  <p className="ov-card-subtitle">Choose what notifications you want to receive</p>
                </div>
              </div>
              <div className="ov-card-body">
                <div className="lc-switch-row">
                  <div className="lc-switch-info">
                    <span className="lc-switch-label">Email Alerts</span>
                    <span className="lc-switch-desc">Receive email for important updates</span>
                  </div>
                  <label className="lc-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.emailAlerts}
                      onChange={() => handleNotificationToggle('emailAlerts')}
                    />
                    <span className="lc-switch-slider"></span>
                  </label>
                </div>
                <div className="lc-switch-row">
                  <div className="lc-switch-info">
                    <span className="lc-switch-label">Scan Alerts</span>
                    <span className="lc-switch-desc">Get notified when QR codes are scanned</span>
                  </div>
                  <label className="lc-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.scanAlerts}
                      onChange={() => handleNotificationToggle('scanAlerts')}
                    />
                    <span className="lc-switch-slider"></span>
                  </label>
                </div>
                <div className="lc-switch-row">
                  <div className="lc-switch-info">
                    <span className="lc-switch-label">Weekly Report</span>
                    <span className="lc-switch-desc">Receive weekly analytics summary</span>
                  </div>
                  <label className="lc-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.weeklyReport}
                      onChange={() => handleNotificationToggle('weeklyReport')}
                    />
                    <span className="lc-switch-slider"></span>
                  </label>
                </div>
                <div className="lc-switch-row mb-0">
                  <div className="lc-switch-info">
                    <span className="lc-switch-label">Campaign Updates</span>
                    <span className="lc-switch-desc">Notifications about campaign changes</span>
                  </div>
                  <label className="lc-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.campaignUpdates}
                      onChange={() => handleNotificationToggle('campaignUpdates')}
                    />
                    <span className="lc-switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="ov-card h-auto">
              <div className="ov-card-header">
                <div>
                  <h6 className="ov-card-title"><FaPalette className="me-2" />Branding Settings</h6>
                  <p className="ov-card-subtitle">Customize your brand colors and logo</p>
                </div>
              </div>
              <div className="ov-card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={branding.companyName}
                        onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label">Primary Color</label>
                      <div className="lc-color-picker">
                        <input 
                          type="color" 
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        />
                        <input 
                          type="text" 
                          className="form-control" 
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx">
                      <label className="lc-label">Secondary Color</label>
                      <div className="lc-color-picker">
                        <input 
                          type="color" 
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        />
                        <input 
                          type="text" 
                          className="form-control" 
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-frm-bx mb-0">
                      <label className="lc-label">Company Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        id="brandingLogoInput"
                        onChange={handleBrandingLogoChange}
                      />
                      {branding.logoUrl ? (
                        <div className="d-flex align-items-center gap-3">
                          <img src={branding.logoUrl} alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', background: '#fff', padding: '4px' }} />
                          <div className="d-flex flex-column gap-1">
                            <label htmlFor="brandingLogoInput" className="thm-btn outline" style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}>
                              <FaUpload className="me-1" /> Change Logo
                            </label>
                            <button
                              className="thm-lg-btn ov-btn-danger"
                              style={{ padding: '6px 14px' , fontSize: '12px'}}
                              onClick={() => setBranding({ ...branding, logoUrl: null })}
                            >
                              <FaTrash className="me-1" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="brandingLogoInput" className="lc-upload-zone small w-100" style={{ cursor: 'pointer' }}>
                          <FaUpload className="lc-upload-icon small" />
                          <p className="lc-upload-text">Upload Logo</p>
                          <span className="lc-upload-hint">PNG, SVG (Max 2MB)</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="col-lg-4 mb-3">
          <div className="ov-card h-auto">
            <div className="ov-card-header">
              <div>
                <h6 className="ov-card-title"><FaEye className="me-2" />Live Preview</h6>
                <p className="ov-card-subtitle">See your changes in real-time</p>
              </div>
            </div>
            <div className="ov-card-body">
              {/* Profile Preview */}
              {activeTab === 'profile' && (
                <div className="lc-preview-landing">
                 <div className="lc-preview-hero" style={{ background: `linear-gradient(135deg, var(--admin-primary), var(--admin-accent))` }}>
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="rounded-circle mb-1" style={{ width: '48px', height: '48px', objectFit: 'cover', margin: '0 auto' }} />
                    ) : (
                      <div className="text-white d-flex align-items-center justify-content-center fw-bold rounded mb-1" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', margin: '0 auto' }}>
                        <h6 className='fz-18 mb-0 fw-600'>{profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}</h6>
                      </div>
                    )}
                    <h3 className="lc-preview-headline" style={{ fontSize: '18px' }}>{profile.name || 'User'}</h3>
                    <p className="lc-preview-subheadline">{profile.role} at {profile.company || 'Company'}</p>
                  </div>
                  <div className="lc-preview-contact">
                    <div className="lc-preview-contact-item">
                      <FaEnvelope /> {profile.email || 'email@example.com'}
                    </div>
                    <div className="lc-preview-contact-item">
                      <FaGlobe /> {profile.phone || 'Phone'}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Preview */}
              {activeTab === 'security' && (
                <div className="lc-preview-landing">
                  <div className="lc-preview-hero" style={{ background: `linear-gradient(135deg, var(--admin-primary), var(--admin-accent))` }}>
                    <FaShieldAlt size={32} className="mb-2" />
                    <h3 className="lc-preview-headline" style={{ fontSize: '16px' }}>Account Protected</h3>
                    <p className="lc-preview-subheadline">Two-factor authentication is enabled</p>
                  </div>
                  <div className="lc-preview-features">
                    <div className="lc-preview-feature">
                      <span className="lc-preview-feature-icon"><FaLock /></span>
                      <span className="lc-preview-feature-title">Password encrypted</span>
                    </div>
                    <div className="lc-preview-feature">
                      <span className="lc-preview-feature-icon"><FaShieldAlt /></span>
                      <span className="lc-preview-feature-title">2FA enabled</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Preview */}
              {activeTab === 'notifications' && (
                <div className="lc-preview-landing">
                  <div className="lc-preview-hero" style={{ background: `linear-gradient(135deg, var(--admin-primary), var(--admin-accent))` }}>
                    <FaBell size={32} className="mb-2" />
                    <h3 className="lc-preview-headline" style={{ fontSize: '16px' }}>Notifications</h3>
                    <p className="lc-preview-subheadline">
                      {Object.values(notifications).filter(Boolean).length} of {Object.values(notifications).length} enabled
                    </p>
                  </div>
                  <div className="lc-preview-features">
                    {notifications.emailAlerts && (
                      <div className="lc-preview-feature">
                        <span className="lc-preview-feature-icon"><FaEnvelope /></span>
                        <span className="lc-preview-feature-title">Email Alerts</span>
                      </div>
                    )}
                    {notifications.scanAlerts && (
                      <div className="lc-preview-feature">
                        <span className="lc-preview-feature-icon"><FaQrcode /></span>
                        <span className="lc-preview-feature-title">Scan Alerts</span>
                      </div>
                    )}
                    {notifications.weeklyReport && (
                      <div className="lc-preview-feature">
                        <span className="lc-preview-feature-icon"><FaChartLine /></span>
                        <span className="lc-preview-feature-title">Weekly Report</span>
                      </div>
                    )}
                    {notifications.campaignUpdates && (
                      <div className="lc-preview-feature">
                        <span className="lc-preview-feature-icon"><FaChartLine /></span>
                        <span className="lc-preview-feature-title">Campaign Updates</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Branding Preview */}
              {activeTab === 'branding' && (
                <div className="lc-preview-landing">
                  <div className="lc-preview-hero" style={{ background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})` }}>
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'cover', margin: '0 auto 5px ', borderRadius: '8px', background: '#fff', padding: '4px' }} />
                    ) : (
                      <div className="text-white d-flex align-items-center justify-content-center fw-bold rounded mb-2" style={{ width: '48px', height: '48px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.2)', margin: '0 auto' }}>
                        {branding.companyName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="lc-preview-headline" style={{ fontSize: '16px' }}>{branding.companyName}</h3>
                    <p className="lc-preview-subheadline">Dynamic QR Platform</p>
                  </div>
                 <div className="lc-preview-buttons lc-preview-features flex-row">
                    <button className="thm-btn" >Get Started</button>
                    <button className="thm-btn outline">Learn More</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

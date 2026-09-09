import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBell, FaAngleDown, FaBars, FaTruck, FaQrcode, FaCalendarCheck, FaChartLine, FaUserPlus, FaUser, FaCog, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ _title, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const loadAvatar = () => {
      setAvatar(localStorage.getItem('akksys_avatar') || null);
    };
    loadAvatar();

    window.addEventListener('avatarUpdated', loadAvatar);
    window.addEventListener('focus', loadAvatar);
    return () => {
      window.removeEventListener('avatarUpdated', loadAvatar);
      window.removeEventListener('focus', loadAvatar);
    };
  }, []);

  const notifications = [
    { id: 1, icon: <FaQrcode />, iconBg: '#00C8FF', text: 'New scan on "Pro X1 Launch" QR code from Mumbai', time: '2 min ago' },
    { id: 2, icon: <FaCalendarCheck />, iconBg: '#10b981', text: 'Campaign "Festive Offer 2026" is now active', time: '15 min ago' },
    { id: 3, icon: <FaTruck />, iconBg: '#3b82f6', text: 'New order #ORD123456 has been placed by John Doe', time: '1 hour ago' },
    { id: 4, icon: <FaChartLine />, iconBg: '#f59e0b', text: 'Monthly analytics report is ready for download', time: '3 hours ago' },
    { id: 5, icon: <FaUserPlus />, iconBg: '#00C8FF', text: 'New user registered: John Doe', time: '5 hours ago' },
    { id: 6, icon: <FaQrcode />, iconBg: '#00C8FF', text: 'QR code "Summer Campaign" crossed 3000 scans', time: '6 hours ago' },
  ];

  const unreadCount = 3;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-topbar d-flex justify-content-between align-items-center sticky-top topbar-header">
      
      {/* Left: Page Title & Mobile Menu Toggle */}
      <div className="d-flex align-items-center gap-3">
        <button 
          className=" mobile-sidebar-toggle-btn"
          onClick={onToggleSidebar}
        >
          <FaBars />
        </button>
           <div className="topbar-search-wrapper d-none d-md-block">
          <FaSearch className="topbar-search-icon" size={14} />
          <input 
            type="text" 
            className="topbar-search-input" 
            placeholder="Search..." 
          />
        </div>
      </div>
      
      {/* Right: Actions, Search, Profile */}
      <div className="d-flex align-items-center gap-3">
        
        <div className="d-flex align-items-center gap-3">
          {/* Notification Bell Dropdown */}
          <div className="notif-bell-wrapper" ref={notifRef}>
            <div className="notif-bell" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell size={18} className="text-white" />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </div>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <h6 className="notif-dropdown-title">Notifications</h6>
                  <span className="notif-dropdown-count">{unreadCount} New</span>
                </div>
                <div className="notif-dropdown-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notif-dropdown-item">
                      <div className="notif-item-icon" style={{ background: `${notif.iconBg}15`, color: notif.iconBg }}>
                        {notif.icon}
                      </div>
                      <div className="notif-item-content">
                        <p className="notif-item-text">{notif.text}</p>
                        <span className="notif-item-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notif-dropdown-footer">
                  <button className="thm-btn w-100">See All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="profile-dropdown-wrapper" ref={profileRef}>
            <div className="d-flex align-items-center gap-2 topbar-profile-container" onClick={() => setShowProfile(!showProfile)}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="rounded-circle topbar-profile-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white topbar-profile-avatar">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="d-none d-sm-block text-start">
                <div className="fw-semibold topbar-profile-name">{user?.name || 'User'}</div>
                <div className="topbar-profile-role">{user?.role === 'superadmin' ? 'Superadmin' : 'Admin'}</div>
              </div>
              <FaAngleDown size={14} className={`text-white profile-arrow ${showProfile ? 'rotate' : ''}`} />
            </div>

            {showProfile && (
              <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="profile-dropdown-header">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="profile-dropdown-avatar" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="profile-dropdown-avatar">{getInitials(user?.name)}</div>
                  )}
                  <div className="profile-dropdown-info">
                    <div className="profile-dropdown-name">{user?.name || 'User'}</div>
                    <div className="profile-dropdown-email">{user?.email || ''}</div>
                  </div>
                </div>
                <div className="profile-dropdown-divider"></div>
                <div className="profile-dropdown-menu">
                  <button className="profile-dropdown-item" onClick={() => { navigate('/admin/settings'); setShowProfile(false); }}>
                    <FaUser className="profile-dropdown-icon" />
                    <span>My Profile</span>
                  </button>
                  <button className="profile-dropdown-item" onClick={() => { navigate('/admin/settings'); setShowProfile(false); }}>
                    <FaCog className="profile-dropdown-icon" />
                    <span>Account Settings</span>
                  </button>
                  <button className="profile-dropdown-item" onClick={() => setShowProfile(false)}>
                    <FaQuestionCircle className="profile-dropdown-icon" />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="profile-dropdown-divider"></div>
                <div className="profile-dropdown-menu">
                  <button className="profile-dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="profile-dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;

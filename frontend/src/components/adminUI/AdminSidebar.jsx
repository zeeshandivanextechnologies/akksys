import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChartPie, 
  FaQrcode, 
  FaVideo, 
  FaMousePointer, 
  FaChartBar, 
  FaFileAlt,
  FaHistory,
  FaBars,
  FaAngleLeft,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaEnvelope
} from 'react-icons/fa';

const AdminSidebar = ({ isMobileOpen, onCloseMobileSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { user } = useAuth();
  const isEffectivelyCollapsed = collapsed && !isMobileOpen;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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

  const handleNavClick = () => {
    if (isMobileOpen) {
      onCloseMobileSidebar();
    }
  };

  return (
    <div className={`admin-sidebar d-flex flex-column h-100 ${isEffectivelyCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className={`admin-logo-container d-flex align-items-center ${isEffectivelyCollapsed ? 'justify-content-center' : 'justify-content-between'} position-relative`}>
        <div className="d-flex align-items-center gap-2">
          <div className="admin-logo-badge" style={{ cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
            {isEffectivelyCollapsed ? <FaBars /> : 'AK'}
          </div>
          {!isEffectivelyCollapsed && (
            <div className="d-flex flex-column">
              <span className="admin-logo-text">AKKSYS</span>
              <span className="admin-logo-version">Admin Panel v1.0</span>
            </div>
          )}
        </div>
        {!isEffectivelyCollapsed && (
          <button className="toggle-sidebar-btn d-none d-lg-block " onClick={() => setCollapsed(true)}>
            <FaAngleLeft />
          </button>
        )}

        {/* Mobile Close Button */}
        <button
          className=" d-lg-none position-absolute mobile-close-btn"
          style={{ right: '10px', top: '15px' }}
          onClick={onCloseMobileSidebar}
        >
          <FaTimes size={18} />
        </button>
      </div>

      <div className="sidebar-nav-section">
        {!isEffectivelyCollapsed && <div className="sidebar-nav-title">Main</div>}
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Dashboard" onClick={handleNavClick}>
          <FaChartPie className="sidebar-link-icon" /> <span className="link-text">Dashboard</span>
        </NavLink>
        <NavLink to="/admin/dynamic-qr" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Dynamic QR" onClick={handleNavClick}>
          <FaQrcode className="sidebar-link-icon" /> <span className="link-text">Dynamic QR</span>
        </NavLink>
        <NavLink to="/admin/static-qr" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Static QR" onClick={handleNavClick}>
          <FaQrcode className="sidebar-link-icon" /> <span className="link-text">Static QR</span>
        </NavLink>
      </div>

      <div className="sidebar-nav-section">
        {!isEffectivelyCollapsed && <div className="sidebar-nav-title">Manage</div>}
        <NavLink to="/admin/videos" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Videos" onClick={handleNavClick}>
          <FaVideo className="sidebar-link-icon" /> <span className="link-text">Videos</span>
        </NavLink>
        <NavLink to="/admin/cta" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="CTA Manager" onClick={handleNavClick}>
          <FaMousePointer className="sidebar-link-icon" /> <span className="link-text">CTA Manager</span>
        </NavLink>
        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Analytics" onClick={handleNavClick}>
          <FaChartBar className="sidebar-link-icon" /> <span className="link-text">Analytics</span>
        </NavLink>
        <NavLink to="/admin/campaign-history" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Campaign History" onClick={handleNavClick}>
          <FaHistory className="sidebar-link-icon" /> <span className="link-text">Campaign History</span>
        </NavLink>
        <NavLink to="/admin/landing-content" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Landing Content" onClick={handleNavClick}>
          <FaFileAlt className="sidebar-link-icon" /> <span className="link-text">Landing Content</span>
        </NavLink>
        <NavLink to="/admin/contact-messages" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Contact Messages" onClick={handleNavClick}>
          <FaEnvelope className="sidebar-link-icon" /> <span className="link-text">Contact Messages</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} title="Settings" onClick={handleNavClick}>
          <FaCog className="sidebar-link-icon" /> <span className="link-text">Settings</span>
        </NavLink>

        <a href="#" className="sidebar-link" title="Logout" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleNavClick}>
          <FaSignOutAlt className="sidebar-link-icon" /> <span className="link-text">Logout</span>
        </a>
      </div>

      <div className={`admin-profile mt-auto d-flex align-items-center gap-2 ${isEffectivelyCollapsed ? 'justify-content-center' : 'justify-content-start'}`}>
        {avatar ? (
          <img src={avatar} alt="Avatar" className="profile-avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="profile-avatar">{getInitials(user?.name)}</div>
        )}
        {!isEffectivelyCollapsed && (
          <div className="profile-info d-flex flex-column">
            <span className="profile-name">{user?.name || 'User'}</span>
            <span className="profile-email">{user?.email || ''}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSidebar;

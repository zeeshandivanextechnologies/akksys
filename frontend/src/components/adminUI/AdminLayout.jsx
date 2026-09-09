import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import TopBar from './TopBar';
import '../../admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  let title = "Overview";
  if (location.pathname.includes("dynamic-qr")) title = "Dynamic QR Codes";
  else if (location.pathname.includes("videos")) title = "Video Library";
  else if (location.pathname.includes("cta")) title = "CTA Manager";
  else if (location.pathname.includes("static-qr")) title = "Static QR Codes";
  else if (location.pathname.includes("analytics")) title = "Analytics";
  else if (location.pathname.includes("campaign-history")) title = "Campaign History";
  else if (location.pathname.includes("landing-content")) title = "Landing Content";
  else if (location.pathname.includes("settings")) title = "Settings";
  else if (location.pathname.includes("campaign/create")) title = "Create Campaign";
  else if (location.pathname.includes("version/create")) title = "Create Version";

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="admin-layout-wrapper container-fluid p-0 vh-100 overflow-hidden position-relative">
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none" 
          style={{zIndex: 999}}
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      <div className="row g-0 h-100">
        <div className="col-auto h-100">
          <AdminSidebar isMobileOpen={isMobileSidebarOpen} onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} />
        </div>
        <div className="col h-100 overflow-auto admin-main-content">
          <TopBar title={title} onToggleSidebar={toggleMobileSidebar} />
          <Outlet />
        </div>
      </div>
      {/* Logout Bootstrap Modal - rendered outside sidebar to avoid mobile overflow issues */}
      <div className="modal fade" id="logoutModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content logout-modal-content">
            <div className="modal-body logout-modal-body p-4">
              <div className="logout-modal-icon">
                <FaSignOutAlt size={25} />
              </div>
              <h4 className="logout-modal-title" id="logoutModalLabel">Logout</h4>
              <p className="logout-modal-text">Are you sure you want to log out of your AKKSYS account? You can sign in again anytime.</p>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <button className="thm-btn outline w-100" style={{ padding: "12px 0" }} data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                <button className="thm-btn w-100" style={{ padding: "12px 0" }} data-bs-dismiss="modal" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

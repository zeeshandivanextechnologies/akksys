import React, { useState, useEffect } from 'react';
import { FaQrcode, FaCalendarCheck, FaBell } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/CampaignHistory.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/user/admin-notifications?limit=50');
        const formatted = res.data.map((item, idx) => {
          let icon, iconBg, text;
          if (item.type === 'scan') {
            icon = <FaQrcode />;
            iconBg = '#00C8FF';
            text = `New scan on "${item.qr_name}" QR code${item.city ? ` from ${item.city}` : ''}`;
          } else {
            icon = <FaCalendarCheck />;
            iconBg = '#10b981';
            text = `New Campaign "${item.qr_name}" was created`;
          }

          const diffMs = Date.now() - new Date(item.time).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let timeStr = 'Just now';
          if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins} min ago`;
          else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          else if (diffDays > 0) timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

          return {
            id: `${item.type}-${item.id}-${idx}`,
            icon,
            iconBg,
            text,
            time: timeStr,
            rawTime: new Date(item.time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
          };
        });
        setNotifications(formatted);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  return (
    <div className="ch-page-wrapper">
      <div className="ch-header">
        <div>
          <h4 className="ch-page-title">Notifications</h4>
          <p className="ch-page-subtitle">Recent activity and alerts</p>
        </div>
      </div>

      <div className="an-card">
        <div className="an-card-body">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ov-subheading-text)' }}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ov-subheading-text)' }}>
              <FaBell style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }} />
              <p>No notifications found.</p>
            </div>
          ) : (
            <div className="notif-box-list">
              {notifications.map(notif => (
                <div key={notif.id} className="notif-box-item">
                  <div className="notif-box-icon" style={{ background: `${notif.iconBg}15`, color: notif.iconBg }}>
                    {notif.icon}
                  </div>
                  <div className="notif-box-content">
                    <span className="notif-box-text">{notif.text}</span>
                    <div className="notif-box-meta">
                      <span className="notif-box-time">{notif.time}</span>
                      <span className="notif-box-sep">•</span>
                      <span className="notif-box-date">{notif.rawTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

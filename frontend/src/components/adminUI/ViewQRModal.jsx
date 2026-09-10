import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaTimes, FaWifi, FaAddressCard, FaLink, FaEnvelope, FaPhone, FaQrcode, FaCalendar } from 'react-icons/fa';
import '../../styles/QRDownloadModal.css';

const ViewQRModal = ({ show, onClose, qr }) => {
  if (!show || !qr) return null;

  const qrValue = qr.url ? `https://${qr.url}` : 'https://akksys.io/s/demo';
  const d = qr.data || {};

  const getTypeIcon = (type) => {
    switch (type) {
      case 'wifi': return <FaWifi />;
      case 'vcard': return <FaAddressCard />;
      case 'url': return <FaLink />;
      case 'email': return <FaEnvelope />;
      case 'phone': return <FaPhone />;
      default: return <FaQrcode />;
    }
  };

  const renderTypeDetails = () => {
    switch (qr.type) {
      case 'wifi':
        return (
          <div className="sq-view-details">
            <div className="sq-view-row">
              <span className="sq-view-label">Network Name</span>
              <span className="sq-view-value">{d.wifi_network || '—'}</span>
            </div>
            <div className="sq-view-row">
              <span className="sq-view-label">Encryption</span>
              <span className="sq-view-value">{d.wifi_encryption || '—'}</span>
            </div>
            <div className="sq-view-row">
              <span className="sq-view-label">Password</span>
              <span className="sq-view-value">{d.wifi_password ? '••••••••' : '—'}</span>
            </div>
          </div>
        );
      case 'vcard':
        return (
          <div className="sq-view-details">
            <div className="sq-view-row">
              <span className="sq-view-label">Full Name</span>
              <span className="sq-view-value">{d.vcard_name || qr.name}</span>
            </div>
            <div className="sq-view-row">
              <span className="sq-view-label">Phone</span>
              <span className="sq-view-value">{d.vcard_phone || '—'}</span>
            </div>
            <div className="sq-view-row">
              <span className="sq-view-label">Email</span>
              <span className="sq-view-value">{d.vcard_email || '—'}</span>
            </div>
            <div className="sq-view-row">
              <span className="sq-view-label">Company</span>
              <span className="sq-view-value">{d.vcard_company || '—'}</span>
            </div>
            {d.vcard_title && (
              <div className="sq-view-row">
                <span className="sq-view-label">Job Title</span>
                <span className="sq-view-value">{d.vcard_title}</span>
              </div>
            )}
          </div>
        );
      case 'email':
        return (
          <div className="sq-view-details">
            <div className="sq-view-row">
              <span className="sq-view-label">Email Address</span>
              <span className="sq-view-value">{d.email || '—'}</span>
            </div>
            {d.email_subject && (
              <div className="sq-view-row">
                <span className="sq-view-label">Default Subject</span>
                <span className="sq-view-value">{d.email_subject}</span>
              </div>
            )}
          </div>
        );
      case 'phone':
        return (
          <div className="sq-view-details">
            <div className="sq-view-row">
              <span className="sq-view-label">Phone Number</span>
              <span className="sq-view-value">{d.phone || '—'}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="sq-view-details">
            <div className="sq-view-row">
              <span className="sq-view-label">Website URL</span>
              <span className="sq-view-value">{d.url || qr.details || '—'}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="qrd-modal-overlay" onClick={onClose}>
      <div className="qrd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qrd-modal-header">
          <div>
            <h5 className="qrd-modal-title">QR Code Details</h5>
            <p className="qrd-modal-subtitle">{qr.name}</p>
          </div>
          <button className="cmp-back-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="qrd-modal-body">
          <div className="row">
            <div className="col-md-5 mb-3 mb-md-0">
              <div className="qrd-preview-box">
                <div className="qrd-preview-qr">
                  <QRCodeCanvas
                    value={qrValue}
                    size={160}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#0f1629"
                  />
                  <div className="qrd-preview-logo">
                    <div className="qrd-preview-logo-inner">AK</div>
                  </div>
                </div>
                <p className="qrd-preview-url">{qr.url}</p>
              </div>
            </div>

            <div className="col-md-7">
              <div className="sq-view-section">
                <div className="sq-view-header">
                  <span className={`sq-type-badge sq-type-${qr.type}`}>
                    {getTypeIcon(qr.type)} {qr.type}
                  </span>
                  <span className={`dq-status-badge ${qr.active ? 'active' : 'paused'}`}>
                    {qr.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="sq-view-info">
                  <div className="sq-view-row">
                    <span className="sq-view-label">Name</span>
                    <span className="sq-view-value">{qr.name}</span>
                  </div>
                  <div className="sq-view-row">
                    <span className="sq-view-label">Created</span>
                    <span className="sq-view-value">
                      <FaCalendar className="me-1" /> {qr.createdDate}
                    </span>
                  </div>
                </div>

                <h6 className="sq-view-subtitle">Type Details</h6>
                {renderTypeDetails()}
              </div>
            </div>
          </div>
        </div>

        <div className="qrd-modal-footer">
          <button className="thm-btn outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQRModal;

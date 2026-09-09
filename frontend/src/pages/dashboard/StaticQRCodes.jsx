import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaWifi, FaAddressCard, FaLink, FaEnvelope, FaPhone, FaQrcode, FaChevronDown } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import QRDownloadModal from '../../components/adminUI/QRDownloadModal';
import ViewQRModal from '../../components/adminUI/ViewQRModal';
import EditQRModal from '../../components/adminUI/EditQRModal';
import '../../styles/DynamicQR.css';
import '../../styles/StaticQR.css';

const StaticQRCodes = () => {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [qrList, setQrList] = useState([
    {
      id: 'sw1',
      name: 'Guest WiFi Network',
      details: 'Network: Office_Guest',
      url: 'akksys.io/s/sw1',
      type: 'wifi',
      typeLabel: 'WiFi',
      createdDate: '20 Aug 2026',
      active: true,
    },
    {
      id: 'vc1',
      name: 'CEO vCard',
      details: 'Contact Details',
      url: 'akksys.io/s/vc1',
      type: 'vcard',
      typeLabel: 'vCard',
      createdDate: '15 Aug 2026',
      active: true,
    },
    {
      id: 'ur1',
      name: 'Company Website',
      details: 'https://akksys.in',
      url: 'akksys.io/s/ur1',
      type: 'url',
      typeLabel: 'URL',
      createdDate: '10 Aug 2026',
      active: true,
    },
    {
      id: 'em1',
      name: 'Support Email',
      details: 'support@akksys.in',
      url: 'akksys.io/s/em1',
      type: 'email',
      typeLabel: 'Email',
      createdDate: '5 Aug 2026',
      active: false,
    },
    {
      id: 'ph1',
      name: 'Sales Contact',
      details: '+91 98765 43210',
      url: 'akksys.io/s/ph1',
      type: 'phone',
      typeLabel: 'Phone',
      createdDate: '1 Aug 2026',
      active: true,
    },
  ]);

  const toggleActive = (id) => {
    setQrList(prev => prev.map(qr =>
      qr.id === id ? { ...qr, active: !qr.active } : qr
    ));
  };

  const handleView = (qr) => {
    setSelectedQR(qr);
    setShowViewModal(true);
    setOpenDropdown(null);
  };

  const handleDownload = (qr) => {
    setSelectedQR(qr);
    setShowDownloadModal(true);
    setOpenDropdown(null);
  };

  const handleEdit = (qr) => {
    setSelectedQR(qr);
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const handleSaveEdit = (updatedQR) => {
    setQrList(prev => prev.map(qr =>
      qr.id === updatedQR.id ? updatedQR : qr
    ));
  };

  const toggleDropdown = (id, e) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      return;
    }
    const btn = e.currentTarget;
    const btnRect = btn.getBoundingClientRect();
    setDropdownPos({
      top: btnRect.bottom + 6,
      left: btnRect.right - 170,
    });
    setOpenDropdown(id);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown && !e.target.closest('.dq-action-cell') && !e.target.closest('.dq-dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <div className="dq-page-wrapper">
        <div className="dq-header">
          <div>
            <h4 className="dq-page-title">Static QR Codes</h4>
            <p className="dq-page-subtitle">{dateStr}</p>
          </div>
          <div className="dq-header-actions">
            <button
              className="thm-btn"
              onClick={() => navigate('/admin/static-qr/create')}
            >
              + Create New Static QR
            </button>
          </div>
        </div>

        <div className="dq-controls mb-0 mb-lg-3">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-4">
              <div className="custom-frm-bx mb-3 mb-md-0">
                <input
                  type="text"
                  placeholder="Search static QR codes..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-2">
              <div className="custom-frm-bx mb-3 mb-md-0">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>WiFi</option>
                  <option>vCard</option>
                  <option>URL</option>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dq-card">
          <div className="dq-table-wrapper">
            <table className="dq-table table-responsive">
              <thead>
                <tr>
                  <th className="dq-th">SR. No.</th>
                  <th className="dq-th">QR Code</th>
                  <th className="dq-th dq-col-type">Type</th>
                  <th className="dq-th dq-col-date">Created Date</th>
                  <th className="dq-th dq-col-status">Status</th>
                  <th className="dq-th dq-col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {qrList.map((qr) => (
                  <tr key={qr.id} className="dq-tr">
                    <td>{qrList.indexOf(qr) + 1}</td>
                    <td>
                      <div className="dq-qr-cell">
                        <div className="dq-qr-thumb">
                          <QRCodeCanvas
                            value={`https://${qr.url}`}
                            size={44}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#0f1629"
                          />
                          <div className="dq-qr-logo">
                            <div className="dq-qr-logo-inner">AK</div>
                          </div>
                        </div>
                        <div className="dq-qr-info">
                          <span className="dq-qr-name">{qr.name}</span>
                          <span className="dq-qr-url">{qr.details}</span>
                        </div>
                      </div>
                    </td>
                    <td className="dq-col-type">
                      <span className={`sq-type-badge sq-type-${qr.type}`}>
                        {getTypeIcon(qr.type)} {qr.typeLabel}
                      </span>
                    </td>
                    <td className="dq-col-date">{qr.createdDate}</td>
                    <td className="dq-col-status">
                      <span className={`dq-status-badge ${qr.active ? 'active' : 'paused'}`}>
                        {qr.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="dq-col-action">
                      <div className="dq-action-cell">
                        <button
                          className="dq-edit-btn"
                          onClick={(e) => toggleDropdown(qr.id, e)}
                        >
                          Edit <FaChevronDown size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {openDropdown && (
            <div
              className="dq-dropdown-menu"
              style={{ top: dropdownPos.top, left: dropdownPos.left }}
            >
              <button onClick={() => handleView(qrList.find(q => q.id === openDropdown))}>
                <FaEye size={16} /> View Details
              </button>
              <button onClick={() => handleDownload(qrList.find(q => q.id === openDropdown))}>
                <FaDownload size={16} /> Download QR
              </button>
              <button onClick={() => handleEdit(qrList.find(q => q.id === openDropdown))}>
                <FaEdit size={16} /> Edit QR
              </button>
              <button onClick={() => { toggleActive(openDropdown); setOpenDropdown(null); }}>
                {qrList.find(q => q.id === openDropdown)?.active
                  ? <><FaToggleOff size={12} /> Deactivate</>
                  : <><FaToggleOn size={16} /> Activate</>}
              </button>
              <button className="sq-dropdown-danger" onClick={() => alert('Delete QR')}>
                <FaTrash size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <QRDownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        qrName={selectedQR?.name}
        qrUrl={selectedQR?.url}
      />

      <ViewQRModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        qr={selectedQR}
      />

      <EditQRModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        qr={selectedQR}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default StaticQRCodes;

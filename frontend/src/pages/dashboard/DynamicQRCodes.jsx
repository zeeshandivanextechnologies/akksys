import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEye, FaToggleOn, FaToggleOff, FaQrcode, FaChevronDown, FaTrash, FaPen } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import QRDownloadModal from '../../components/adminUI/QRDownloadModal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loader from './Loader';
import '../../styles/DynamicQR.css';

const DynamicQRCodes = () => {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [qrList, setQrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchQRs = useCallback(async () => {
    try {
      const res = await api.get('/qr');
      const mapped = res.data.map(qr => ({
        id: qr.id,
        qrId: qr.qr_id,
        name: qr.name,
        url: `${window.location.host}/r/${qr.qr_id}`,
        scans: parseInt(qr.total_scans) || 0,
        unique: parseInt(qr.unique_scans) || 0,
        ctaClicks: parseInt(qr.cta_clicks) || 0,
        ctr: qr.total_scans > 0 ? ((parseInt(qr.cta_clicks) / parseInt(qr.total_scans)) * 100).toFixed(1) : '0.0',
        ctaDestination: qr.cta_destination || qr.current_video_url || '—',
        status: qr.status,
        active: qr.status === 'active',
        logoUrl: qr.logo_url || null,
        campaignId: qr.campaign_id || null,
        videoUrl: qr.current_video_url || null,
        videoType: qr.video_type || null,
        ctaText: qr.cta_text || null,
      }));
      setQrList(mapped);
    } catch (err) {
      console.error('Failed to fetch QR codes', err);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQRs();
  }, [fetchQRs]);

  const toggleActive = async (id) => {
    try {
      await api.put(`/qr/${id}/toggle`);
      setQrList(prev => prev.map(qr =>
        qr.id === id ? { ...qr, active: !qr.active, status: qr.active ? 'paused' : 'active' } : qr
      ));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    try {
      await api.delete(`/qr/${id}`);
      setQrList(prev => prev.filter(qr => qr.id !== id));
      toast.success('QR code deleted successfully');
      setOpenDropdown(null);
    } catch (err) {
      toast.error('Failed to delete QR code');
    }
  };

  const handleDownload = (qr) => {
    setSelectedQR(qr);
    setShowDownloadModal(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
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

  const filteredList = qrList.filter(qr => {
    const matchSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        qr.qrId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All Status' ||
                        (statusFilter === 'Active' && qr.active) ||
                        (statusFilter === 'Paused' && !qr.active);
    return matchSearch && matchStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <Loader />;

  return (
    <>
      <div className="dq-page-wrapper">
        <div className="dq-header">
          <div>
            <h4 className="dq-page-title">Dynamic QR Codes</h4>
            <p className="dq-page-subtitle">{dateStr}</p>
          </div>
          <div className="dq-header-actions">
            <button
              className="thm-btn outline"
              onClick={() => navigate('/admin/dynamic-qr/bulk')}
            >
              <FaQrcode className="me-2" /> Bulk Generate
            </button>
            <button
              className="thm-btn"
              onClick={() => navigate('/admin/dynamic-qr/create')}
            >
              + New QR Code
            </button>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12"> 
 <div className="dq-controls mb-0 mb-lg-3">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-4">
              <div className="custom-frm-bx mb-3 mb-md-0">
                <input
                  type="text"
                  placeholder="Search QR codes..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </div>
            </div>
          </div>
        </div>
          </div>

          <div className="col-lg-12"> 
            <div className="dq-card">
          <div className="dq-table-wrapper" >
            <table className="dq-table table-responsive">
              <thead>
                <tr>
                  <th className="dq-th">SR. No.</th>
                  <th className="dq-th">QR Code</th>
                  <th className="dq-th dq-col-scans">Scans</th>
                  <th className="dq-th dq-col-unique">Unique</th>
                  <th className="dq-th dq-col-clicks">CTA Clicks</th>
                  <th className="dq-th dq-col-ctr">CTR</th>
                  <th className="dq-th dq-col-dest">CTA Destination</th>
                  <th className="dq-th dq-col-status">Status</th>
                  <th className="dq-th dq-col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center" style={{ color: '#ddd', height : "250px" }}>
                      No QR codes found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((qr, index) => (
                    <tr key={qr.id} className="dq-tr">
                      <td>{indexOfFirstItem + index + 1}</td>
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
                            <a
                              href={`https://${qr.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dq-qr-url"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {qr.url}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="dq-col-scans">{qr.scans.toLocaleString()}</td>
                      <td className="dq-col-unique">{qr.unique.toLocaleString()}</td>
                      <td className="dq-col-clicks">{qr.ctaClicks.toLocaleString()}</td>
                      <td className="dq-ctr dq-col-ctr">{qr.ctr}%</td>
                      <td className="dq-cta-dest dq-col-dest">{qr.ctaDestination}</td>
                      <td className="dq-col-status">
                        <span className={`dq-status-badge ${qr.active ? 'active' : 'paused'}`}>
                          {qr.active ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                      <td className="dq-col-action">
                        <div className="dq-action-cell" style={{ position: 'relative' }}>
                          <button
                            className="dq-edit-btn"
                            onClick={(e) => toggleDropdown(qr.id, e)}
                          >
                            Edit <FaChevronDown size={10} />
                          </button>
                          
                          {openDropdown === qr.id && (
                            <div
                              className="dq-dropdown-menu"
                              style={{ 
                                position: 'absolute', 
                                ...(currentItems.length > 2 && index >= currentItems.length - 2 ? { bottom: 'calc(100% + 5px)' } : { top: 'calc(100% + 5px)' }),
                                right: 0, 
                                zIndex: 1050,
                                minWidth: '160px'
                              }}
                            >
                              <button onClick={() => navigate(`/admin/dynamic-qr/${qr.qrId}`)}>
                                <FaEye size={16} /> View Details
                              </button>
                              <button onClick={() => {
                                setOpenDropdown(null);
                                navigate('/admin/dynamic-qr/create', { state: { editQR: qr } });
                              }}>
                                <FaPen size={14} /> Edit QR
                              </button>
                              <button onClick={() => handleDownload(qr)}>
                                <FaDownload size={16} /> Download QR
                              </button>
                              <button onClick={() => { toggleActive(qr.id); setOpenDropdown(null); }}>
                                {qr.active
                                  ? <><FaToggleOff size={12} /> Deactivate</>
                                  : <><FaToggleOn size={16} /> Activate</>}
                              </button>
                              <button style={{ color: '#ef4444' }} onClick={() => handleDelete(qr.id)}>
                                <FaTrash size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            
          </div>

            {totalPages > 1 && (
            <div className="d-flex justify-content-end pagination-main-box">
              <ul className="pagination custom-pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </li>
              </ul>
            </div>
          )}

        

        </div>

          </div>


        </div>

       

        
      </div>

      <QRDownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        qrName={selectedQR?.name}
        qrUrl={selectedQR?.url}
        logoUrl={selectedQR?.logoUrl}
      />
    </>
  );
};

export default DynamicQRCodes;

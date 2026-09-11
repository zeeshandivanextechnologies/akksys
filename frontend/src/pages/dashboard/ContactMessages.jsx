import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaUser, FaPhone, FaBuilding, FaClock, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/CampaignHistory.css';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('unread');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const markAsUnread = async (id) => {
    try {
      await api.put(`/contact/${id}/unread`);
      fetchMessages();
      setSelectedMsg(null);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleSelect = (msg) => {
    setSelectedMsg(msg);
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const filteredMessages = messages.filter(m => {
    if (filterTab === 'unread' && m.status !== 'unread') return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || m.message.toLowerCase().includes(term);
  });

  const getSubjectLabel = (subject) => {
    const map = { general: 'General Inquiry', support: 'Technical Support', billing: 'Billing Issue', feedback: 'Feedback', partnership: 'Partnership' };
    return map[subject] || subject;
  };

  return (
    <div className="ch-page-wrapper">
      <div className="ch-header">
        <div>
          <h4 className="ch-page-title">Contact Messages</h4>
          <p className="ch-page-subtitle">{unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="ch-controls an-card">
            <div className="ch-search-box custom-frm-bx mb-0">
              <FaSearch className="ch-search-icon" />
              <input
                type="text"
                className="ch-search-input form-control ps-5"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ch-filter-tabs">
              <button className={`ch-filter-tab ${filterTab === 'unread' ? 'active' : ''}`} onClick={() => setFilterTab('unread')}>Unread</button>
              <button className={`ch-filter-tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>All</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className={`${selectedMsg ? 'col-lg-6' : 'col-lg-12'} mb-3`}>
          <div className="ch-table-card">
            <div className="ch-table-wrapper">
              <table className="ch-table">
                <thead>
                  <tr>
                    <th className="ch-th">Name</th>
                    <th className="ch-th">Email</th>
                    <th className="ch-th">Subject</th>
                    <th className="ch-th">Date</th>
                    <th className="ch-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="ch-td text-center py-4">Loading...</td></tr>
                  ) : filteredMessages.length === 0 ? (
                    <tr><td colSpan="5" className="ch-td text-center" style={{color : "#ddd", height : "250px"}}>No messages found.</td></tr>
                  ) : (
                    filteredMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`ch-tr ${selectedMsg?.id === msg.id ? 'ch-tr-selected' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelect(msg)}
                      >
                        <td className="ch-td">
                          <span className="ch-td-title">{msg.name}</span>
                          {msg.phone && <span className="ch-td-subtitle">{msg.phone}</span>}
                        </td>
                        <td className="ch-td">
                          <span className="ch-td-title">{msg.email}</span>
                        </td>
                        <td className="ch-td">
                          <span className="ch-td-title">{getSubjectLabel(msg.subject)}</span>
                        </td>
                        <td className="ch-td">
                          <span className="ch-td-title">{new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="ch-td-subtitle">{new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="ch-td">
                          <span className={`ch-status-badge ${msg.status === 'unread' ? 'active' : 'paused'}`}>
                            {msg.status === 'unread' ? <><FaEnvelope size={10} /> Unread</> : <><FaEnvelopeOpen size={10} /> Read</>}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedMsg && (
          <div className="col-lg-6 mb-3">
            <div className="ch-table-card">
              <div style={{ padding: '16px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="notif-box-icon" style={{ background: 'rgba(0, 200, 255, 0.15)', color: '#00C8FF', width: '42px', height: '42px', fontSize: '15px', flexShrink: 0 }}>
                      <FaUser />
                    </div>
                    <div>
                      <h5 className="ch-page-title" style={{ fontSize: '16px', marginBottom: '2px' }}>{selectedMsg.name}</h5>
                      <p className="ch-page-subtitle" style={{ margin: 0, fontSize: '12px' }}>{selectedMsg.email}</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {selectedMsg.status === 'unread' ? (
                      <button className="ch-filter-tab active" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => markAsRead(selectedMsg.id)}>
                        <FaEnvelopeOpen size={11} className="me-1" /> Read
                      </button>
                    ) : (
                      <button className="ch-filter-tab" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => markAsUnread(selectedMsg.id)}>
                        <FaEnvelope size={11} className="me-1" /> Unread
                      </button>
                    )}
                    <button className="thm-lg-btn ov-btn-danger" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => deleteMessage(selectedMsg.id)}>
                      <FaTrash size={11} className="me-1" /> Delete
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-3 flex-wrap" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--ov-new-border)' }}>
                  {selectedMsg.phone && (
                    <span className="d-flex align-items-center gap-1" style={{ fontSize: '14px', color: 'var(--ov-subheading-text)', background: 'var(--ov-new-bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--ov-new-border)' }}>
                      <FaPhone size={10} /> {selectedMsg.phone}
                    </span>
                  )}
                  <span className="d-flex align-items-center gap-1" style={{ fontSize: '14px', color: 'var(--ov-subheading-text)', background: 'var(--ov-new-bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--ov-new-border)' }}>
                    <FaBuilding size={10} /> {getSubjectLabel(selectedMsg.subject)}
                  </span>
                  <span className="d-flex align-items-center gap-1" style={{ fontSize: '14px', color: 'var(--ov-subheading-text)', background: 'var(--ov-new-bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--ov-new-border)' }}>
                    <FaClock size={10} /> {new Date(selectedMsg.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div style={{ background: 'var(--ov-new-bg)', border: '1px solid var(--ov-new-border)', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '16px', color: 'var(--ov-heading-text)', lineHeight: '1.8', margin: 0 }}>{selectedMsg.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
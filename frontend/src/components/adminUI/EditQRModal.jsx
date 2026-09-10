import React, { useState, useEffect } from 'react';
import { FaTimes, FaWifi, FaAddressCard, FaLink, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/QRDownloadModal.css';

const EditQRModal = ({ show, onClose, qr, onSave }) => {
  const [qrName, setQrName] = useState('');
  const [qrType, setQrType] = useState('url');
  const [saving, setSaving] = useState(false);

  const [wifiNetwork, setWifiNetwork] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');

  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardCompany, setVcardCompany] = useState('');
  const [vcardTitle, setVcardTitle] = useState('');

  const [urlAddress, setUrlAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (qr) {
      setQrName(qr.name || '');
      setQrType(qr.type || 'url');
      const d = qr.data || {};
      setWifiNetwork(d.wifi_network || '');
      setWifiPassword(d.wifi_password || '');
      setWifiEncryption(d.wifi_encryption || 'WPA');
      setVcardName(d.vcard_name || '');
      setVcardPhone(d.vcard_phone || '');
      setVcardEmail(d.vcard_email || '');
      setVcardCompany(d.vcard_company || '');
      setVcardTitle(d.vcard_title || '');
      setUrlAddress(d.url || '');
      setEmailAddress(d.email || '');
      setEmailSubject(d.email_subject || '');
      setPhoneNumber(d.phone || '');
    }
  }, [qr]);

  if (!show || !qr) return null;

  const typeOptions = [
    { id: 'url', label: 'URL', icon: <FaLink /> },
    { id: 'wifi', label: 'WiFi', icon: <FaWifi /> },
    { id: 'vcard', label: 'vCard', icon: <FaAddressCard /> },
    { id: 'email', label: 'Email', icon: <FaEnvelope /> },
    { id: 'phone', label: 'Phone', icon: <FaPhone /> },
  ];

  const buildData = () => {
    switch (qrType) {
      case 'wifi':
        return { wifi_network: wifiNetwork, wifi_password: wifiPassword, wifi_encryption: wifiEncryption };
      case 'vcard':
        return { vcard_name: vcardName, vcard_phone: vcardPhone, vcard_email: vcardEmail, vcard_company: vcardCompany, vcard_title: vcardTitle };
      case 'email':
        return { email: emailAddress, email_subject: emailSubject };
      case 'phone':
        return { phone: phoneNumber };
      default:
        return { url: urlAddress };
    }
  };

  const renderTypeForm = () => {
    switch (qrType) {
      case 'wifi':
        return (
          <>
            <div className="custom-frm-bx">
              <label className="dq-label">Network Name (SSID)</label>
              <input type="text" className="form-control" placeholder="e.g., Office_Guest" value={wifiNetwork} onChange={(e) => setWifiNetwork(e.target.value)} />
            </div>
            <div className="custom-frm-bx">
              <label className="dq-label">Password</label>
              <input type="text" className="form-control" placeholder="Enter WiFi password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
            </div>
            <div className="custom-frm-bx mb-0">
              <label className="dq-label">Encryption</label>
              <select className="form-select" value={wifiEncryption} onChange={(e) => setWifiEncryption(e.target.value)}>
                <option>WPA/WPA2</option>
                <option>WEP</option>
                <option>None</option>
              </select>
            </div>
          </>
        );
      case 'vcard':
        return (
          <>
            <div className="custom-frm-bx">
              <label className="dq-label">Full Name</label>
              <input type="text" className="form-control" placeholder="e.g., John Doe" value={vcardName} onChange={(e) => setVcardName(e.target.value)} />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="custom-frm-bx">
                  <label className="dq-label">Phone Number</label>
                  <input type="tel" className="form-control" placeholder="+91 98765 43210" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="custom-frm-bx mb-0">
                  <label className="dq-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="john@company.com" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} />
                </div>
              </div>
            </div>
          </>
        );
      case 'email':
        return (
          <>
            <div className="custom-frm-bx">
              <label className="dq-label">Email Address</label>
              <input type="email" className="form-control" placeholder="support@company.com" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
            </div>
            <div className="custom-frm-bx mb-0">
              <label className="dq-label">Default Subject (Optional)</label>
              <input type="text" className="form-control" placeholder="e.g., Inquiry from website" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
          </>
        );
      case 'phone':
        return (
          <div className="custom-frm-bx mb-0">
            <label className="dq-label">Phone Number</label>
            <input type="tel" className="form-control" placeholder="+91 98765 43210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
        );
      default:
        return (
          <div className="custom-frm-bx mb-0">
            <label className="dq-label">Website URL</label>
            <input type="url" className="form-control" placeholder="https://your-website.com" value={urlAddress} onChange={(e) => setUrlAddress(e.target.value)} />
          </div>
        );
    }
  };

  const handleSave = async () => {
    if (!qrName.trim()) {
      toast.error('Please enter a QR code name');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/static-qr/${qr.id}`, {
        name: qrName.trim(),
        type: qrType,
        data: buildData(),
      });
      onSave(res.data);
      toast.success('QR code updated');
      onClose();
    } catch {
      toast.error('Failed to update QR code');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="qrd-modal-overlay" onClick={onClose}>
      <div className="qrd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qrd-modal-header">
          <div>
            <h5 className="qrd-modal-title">Edit QR Code</h5>
            <p className="qrd-modal-subtitle">{qr.name}</p>
          </div>
          <button className="cmp-back-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="qrd-modal-body">
          <div className="custom-frm-bx">
            <label className="dq-label">QR Code Name</label>
            <input type="text" className="form-control" placeholder="Enter QR name" value={qrName} onChange={(e) => setQrName(e.target.value)} />
          </div>

          <div className="custom-frm-bx">
            <label className="dq-label">QR Type</label>
            <div className="sq-edit-type-options">
              {typeOptions.map((type) => (
                <button key={type.id} className={`sq-edit-type-btn ${qrType === type.id ? 'active' : ''}`} onClick={() => setQrType(type.id)}>
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sq-edit-type-form">
            <label className="dq-label">Type Details</label>
            {renderTypeForm()}
          </div>
        </div>

        <div className="qrd-modal-footer">
          <button className="thm-btn outline" onClick={onClose}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            {saving ? <><FaSpinner className="me-1" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQRModal;

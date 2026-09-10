import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWifi, FaAddressCard, FaLink, FaEnvelope, FaPhone, FaQrcode, FaCheck, FaSpinner } from 'react-icons/fa';
import { BsQrCodeScan } from 'react-icons/bs';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/DynamicQR.css';

const CreateStaticQR = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [qrName, setQrName] = useState('');
  const [qrType, setQrType] = useState('url');

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

  const typeOptions = [
    { id: 'url', label: 'URL', icon: <FaLink />, desc: 'Website or page link' },
    { id: 'wifi', label: 'WiFi', icon: <FaWifi />, desc: 'WiFi network access' },
    { id: 'vcard', label: 'vCard', icon: <FaAddressCard />, desc: 'Contact information' },
    { id: 'email', label: 'Email', icon: <FaEnvelope />, desc: 'Email address' },
    { id: 'phone', label: 'Phone', icon: <FaPhone />, desc: 'Phone number' },
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

  const handleGenerate = async () => {
    if (!qrName.trim()) {
      toast.error('Please enter a QR code name');
      return;
    }

    setSaving(true);
    try {
      await api.post('/static-qr/create', {
        name: qrName.trim(),
        type: qrType,
        data: buildData(),
      });
      toast.success('Static QR code created');
      navigate('/admin/static-qr');
    } catch {
      toast.error('Failed to create QR code');
    } finally {
      setSaving(false);
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
                <div className="custom-frm-bx">
                  <label className="dq-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="john@company.com" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="custom-frm-bx">
                  <label className="dq-label">Company</label>
                  <input type="text" className="form-control" placeholder="Company name" value={vcardCompany} onChange={(e) => setVcardCompany(e.target.value)} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="custom-frm-bx mb-0">
                  <label className="dq-label">Job Title</label>
                  <input type="text" className="form-control" placeholder="e.g., CEO" value={vcardTitle} onChange={(e) => setVcardTitle(e.target.value)} />
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

  return (
    <div className="dq-page-wrapper">
      <div className="dq-header">
        <div className='cd-header-left'>
          <button className="cmp-back-btn" onClick={() => navigate('/admin/static-qr')}>
            <FaArrowLeft />
          </button>
          <div>
            <h4 className="dq-page-title">Create New Static QR</h4>
            <p className="dq-page-subtitle">Generate a static QR code that never changes</p>
          </div>
        </div>
        <div className="dq-header-actions">
          <button className="thm-btn outline" onClick={() => navigate('/admin/static-qr')}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleGenerate} disabled={saving}>
            {saving ? <><FaSpinner className="me-1" /> Generating...</> : 'Generate QR Code'}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="dq-card mb-4">
            <div className="dq-card-header">
              <h6 className="dq-card-title">Basic Details</h6>
            </div>
            <div className="dq-card-body">
              <div className="custom-frm-bx mb-0">
                <label className="dq-label">QR Code Name</label>
                <input type="text" className="form-control" placeholder="e.g., Guest WiFi, CEO vCard" value={qrName} onChange={(e) => setQrName(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="dq-card mb-4">
            <div className="dq-card-header">
              <h6 className="dq-card-title"><FaQrcode className="me-2" /> QR Code Type</h6>
            </div>
            <div className="dq-card-body">
              <div className="sq-type-options">
                {typeOptions.map((type) => (
                  <button key={type.id} className={`sq-type-option ${qrType === type.id ? 'active' : ''}`} onClick={() => setQrType(type.id)}>
                    <span className="sq-type-icon">{type.icon}</span>
                    <span className="sq-type-label">{type.label}</span>
                    <span className="sq-type-desc">{type.desc}</span>
                    {qrType === type.id && <span className="sq-type-check"><FaCheck /></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dq-card">
            <div className="dq-card-header">
              <h6 className="dq-card-title">
                {typeOptions.find(t => t.id === qrType)?.icon} {typeOptions.find(t => t.id === qrType)?.label} Details
              </h6>
            </div>
            <div className="dq-card-body">
              {renderTypeForm()}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="dq-card dq-card-sticky">
            <div className="dq-card-header">
              <h6 className="dq-card-title">Preview</h6>
            </div>
            <div className="dq-card-body">
              <div className="sq-preview-box">
                <div className="sq-preview-qr">
                  <BsQrCodeScan size={80} color="#e8e4f0" />
                  <div className="sq-preview-logo">AK</div>
                </div>
              </div>
              <div className="sq-preview-info">
                <span className="sq-preview-name">{qrName || 'QR Code Name'}</span>
                <span className="sq-preview-type">
                  {typeOptions.find(t => t.id === qrType)?.icon} {typeOptions.find(t => t.id === qrType)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaticQR;

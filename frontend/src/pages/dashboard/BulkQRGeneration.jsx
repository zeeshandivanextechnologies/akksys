import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileCsv, FaQrcode, FaDownload, FaTrash, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaSpinner, FaUpload } from 'react-icons/fa';
import { BsQrCodeScan } from 'react-icons/bs';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/DynamicQR.css';

const BulkQRGeneration = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const customLogoInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const [parseError, setParseError] = useState('');

  const [qrSize, setQrSize] = useState('Medium (400x400)');
  const [qrFormat, setQrFormat] = useState('PNG');
  const [errorCorrection, setErrorCorrection] = useState('Medium (15%)');
  const [brandLogo, setBrandLogo] = useState('No Logo');
  const [customLogo, setCustomLogo] = useState(null);

  const getQrSizeValue = () => {
    if (qrSize.includes('200')) return 200;
    if (qrSize.includes('1200')) return 1200;
    if (qrSize.includes('800')) return 800;
    return 400;
  };

  const getLevel = () => {
    if (errorCorrection.includes('Low')) return 'L';
    if (errorCorrection.includes('Quartile')) return 'Q';
    if (errorCorrection.includes('High')) return 'H';
    return 'M';
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) {
      setParseError('CSV must have a header row and at least one data row');
      return [];
    }
    const header = lines[0].toLowerCase().replace(/"/g, '').split(',').map(h => h.trim());
    const nameIdx = header.findIndex(h => h === 'name');
    const urlIdx = header.findIndex(h => h === 'destination_url' || h === 'url');
    if (nameIdx === -1) {
      setParseError('CSV must have a "name" column');
      return [];
    }
    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
      const name = cols[nameIdx];
      const destination_url = urlIdx !== -1 ? cols[urlIdx] : '';
      if (name) items.push({ name, destination_url: destination_url || '' });
    }
    return items;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { toast.error('Please upload a CSV file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File size must be less than 10MB'); return; }
    setParseError('');
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const items = parseCSV(event.target.result);
      if (items.length > 1000) { setParseError('Maximum 1000 rows allowed'); setBulkData([]); return; }
      setBulkData(items.map((item, i) => ({ ...item, id: i + 1, status: 'pending', qr_url: null })));
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (bulkData.length === 0) return;
    setGenerating(true);
    try {
      const items = bulkData.map(d => ({ name: d.name, destination_url: d.destination_url }));
      const res = await api.post('/qr/bulk', { items });
      const created = res.data.qr_codes;
      setBulkData(prev => prev.map((item, i) => ({
        ...item,
        status: 'generated',
        qr_url: created[i] ? `${window.location.host}/r/${created[i].qr_id}` : item.qr_url,
      })));
      setGenerated(true);
      toast.success(`${created.length} QR codes generated successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate QR codes');
    } finally {
      setGenerating(false);
    }
  };

  const generateQRDataUrl = (url, size, level, logoSrc) => {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(container);

      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(
          <QRCodeCanvas
            value={url}
            size={size}
            level={level}
            bgColor="#ffffff"
            fgColor="#0f1629"
            includeMargin={false}
            imageSettings={logoSrc ? {
              src: logoSrc,
              height: size * 0.2,
              width: size * 0.2,
              excavate: true,
            } : undefined}
          />
        );

        setTimeout(() => {
          const canvas = container.querySelector('canvas');
          const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
          root.unmount();
          document.body.removeChild(container);
          resolve(dataUrl);
        }, 100);
      }).catch(() => {
        document.body.removeChild(container);
        resolve(null);
      });
    });
  };

  const handleDownloadAll = async () => {
    if (!generated || bulkData.length === 0) return;
    setDownloading(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('akksys_qr_codes');
      const size = getQrSizeValue();
      const level = getLevel();
      const logoSrc = brandLogo === 'AKKSYS Logo'
        ? 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#00C8FF"/><text x="50" y="62" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">AK</text></svg>')
        : customLogo;

      if (qrFormat === 'SVG') {
        for (const item of bulkData) {
          const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">` +
            `<rect width="200" height="200" fill="white"/>` +
            `<g id="qr"></g>` +
            (logoSrc ? `<rect x="70" y="70" width="60" height="60" rx="8" fill="white"/><image x="74" y="74" width="52" height="52" href="${logoSrc}"/>` : '') +
            `</svg>`;
          const safeName = item.name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
          folder.file(`${safeName}.svg`, svgStr);
        }
      } else if (qrFormat === 'PDF') {
        const batchSize = 10;
        for (let b = 0; b < bulkData.length; b += batchSize) {
          const batch = bulkData.slice(b, b + batchSize);
          const promises = batch.map(item => {
            const url = item.qr_url ? `https://${item.qr_url}` : '';
            return generateQRDataUrl(url, size, level, logoSrc);
          });
          const results = await Promise.all(promises);
          results.forEach((dataUrl, i) => {
            if (dataUrl) {
              const safeName = batch[i].name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 80],
              });
              const imgProps = pdf.getImageProperties(dataUrl);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
              const w = imgProps.width * ratio;
              const h = imgProps.height * ratio;
              const x = (pdfWidth - w) / 2;
              const y = (pdfHeight - h) / 2;
              pdf.addImage(dataUrl, 'PNG', x, y, w, h);
              const pdfBase64 = pdf.output('datauristring').split(',')[1];
              folder.file(`${safeName}.pdf`, pdfBase64, { base64: true });
            }
          });
        }
      } else {
        const batchSize = 20;
        for (let b = 0; b < bulkData.length; b += batchSize) {
          const batch = bulkData.slice(b, b + batchSize);
          const promises = batch.map(item => {
            const url = item.qr_url ? `https://${item.qr_url}` : '';
            return generateQRDataUrl(url, size, level, logoSrc);
          });
          const results = await Promise.all(promises);
          results.forEach((dataUrl, i) => {
            if (dataUrl) {
              const safeName = batch[i].name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
              folder.file(`${safeName}.png`, dataUrl.split(',')[1], { base64: true });
            }
          });
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `akksys_qr_codes.${qrFormat === 'PDF' ? 'zip' : 'zip'}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${bulkData.length} QR codes downloaded as ${qrFormat}!`);
    } catch (err) {
      console.error('Download failed', err);
      toast.error('Failed to download QR codes');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSample = () => {
    const csv = `name,destination_url
Pro X1 Launch - Mumbai,https://amazon.in/dp/example1
Pro X1 Launch - Delhi,https://amazon.in/dp/example2
Summer Sale Campaign,https://flipkart.com/sale/example
App Download - Play Store,https://play.google.com/store/apps/details?id=example
Warranty Registration,https://akksys.in/warranty/register`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'akksys_bulk_qr_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCustomLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setBulkData([]);
    setGenerated(false);
    setParseError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const level = getLevel();

  return (
    <div className="dq-page-wrapper">
      <div className="dq-header">
        <div className='cd-header-left'>
          <button className="cmp-back-btn" onClick={() => navigate('/admin/dynamic-qr')}>
            <FaArrowLeft />
          </button>
          <div>
            <h4 className="dq-page-title mt-2">Bulk QR Generation</h4>
            <p className="dq-page-subtitle">Generate multiple QR codes at once from a CSV file</p>
          </div>
        </div>
        <div className="dq-header-actions">
          <button className="thm-btn outline" onClick={() => navigate('/admin/dynamic-qr')}>Cancel</button>
          {generated && (
            <button className="thm-btn" onClick={handleDownloadAll} disabled={downloading}>
              {downloading ? (
                <><FaSpinner className="spin me-2" /> Downloading...</>
              ) : (
                <><FaDownload className="me-2" /> Download All ({qrFormat})</>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className="dq-card mb-3">
            <div className="dq-card-header">
              <h6 className="dq-card-title">Upload CSV File</h6>
            </div>
            <div className="dq-card-body">
              <p className="dq-field-hint mb-3">
                Upload a CSV file with columns: <code>name, destination_url</code>. Each row will generate a unique QR code.
              </p>
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              {!uploadedFile ? (
                <>
                  <div className="dq-upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <FaFileCsv className="dq-upload-icon" size={40} />
                    <p className="dq-upload-text">Click to upload or drag and drop</p>
                    <span className="dq-upload-hint">CSV files only (Max 10MB, up to 1000 rows)</span>
                  </div>
                  <div className="text-center mt-2">
                    <button type="button" className="btn btn-link" style={{ color: '#00C8FF', fontSize: '13px', textDecoration: 'none' }} onClick={(e) => { e.stopPropagation(); handleDownloadSample(); }}>
                      <FaDownload className="me-1" /> Download Sample CSV
                    </button>
                  </div>
                </>
              ) : (
                <div className="dq-uploaded-file">
                  <div className="dq-uploaded-file-info">
                    <div className="dq-uploaded-file-icon"><FaFileCsv size={24} /></div>
                    <div>
                      <div className="dq-uploaded-file-name">{uploadedFile.name}</div>
                      <div className="dq-uploaded-file-meta">
                        {bulkData.length} QR codes detected
                        {parseError && <span className="text-danger ms-2">{parseError}</span>}
                      </div>
                    </div>
                  </div>
                  <button className="vum-file-remove" onClick={handleRemoveFile}><FaTrash /> Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className="dq-card mb-3">
            <div className="dq-card-header">
              <h6 className="dq-card-title">QR Code Settings</h6>
            </div>
            <div className="dq-card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label className="dq-label">QR Size</label>
                    <select className="form-select" value={qrSize} onChange={(e) => setQrSize(e.target.value)}>
                      <option>Small (200x200)</option>
                      <option>Medium (400x400)</option>
                      <option>Large (800x800)</option>
                      <option>Print (1200x1200)</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label className="dq-label">Format</label>
                    <select className="form-select" value={qrFormat} onChange={(e) => setQrFormat(e.target.value)}>
                      <option>PNG</option>
                      <option>SVG</option>
                      <option>PDF</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label className="dq-label">Error Correction</label>
                    <select className="form-select" value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)}>
                      <option>Low (7%)</option>
                      <option>Medium (15%)</option>
                      <option>Quartile (25%)</option>
                      <option>High (30%)</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label className="dq-label">Brand Logo</label>
                    <select className="form-select" value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)}>
                      <option>No Logo</option>
                      <option>AKKSYS Logo</option>
                      <option>Custom Logo</option>
                    </select>
                  </div>
                </div>
                {brandLogo === 'Custom Logo' && (
                  <div className="col-12">
                    <div className="custom-frm-bx mb-0">
                      <label className="dq-label">Upload Custom Logo</label>
                      <input
                        type="file"
                        ref={customLogoInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleCustomLogoUpload}
                      />
                      {customLogo ? (
                        <div className="dq-uploaded-file">
                          <div className="dq-uploaded-file-info">
                            <img src={customLogo} alt="Logo" className="dq-logo-thumb" />
                            <div>
                              <div className="dq-uploaded-file-name">Custom logo selected</div>
                              <div className="dq-uploaded-file-meta">Click change to replace</div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="thm-btn outline py-2" onClick={() => customLogoInputRef.current?.click()}>
                              Change
                            </button>
                            <button className="vum-file-remove" onClick={() => setCustomLogo(null)}>
                              <FaTrash /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="dq-upload-zone" onClick={() => customLogoInputRef.current?.click()}>
                          <FaUpload className="dq-upload-icon" size={20} />
                          <p className="dq-upload-text" style={{ fontSize: '14px' }}>Click to upload brand logo</p>
                          <span className="dq-upload-hint">PNG, JPG (Max 2MB) — will appear at QR center</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="thm-btn" onClick={handleGenerate} disabled={!uploadedFile || generating || bulkData.length === 0 || !!parseError}>
              {generating ? <><FaSpinner className="spin me-2" /> Generating...</> : <><FaQrcode className="me-2" /> Generate {bulkData.length || ''} QR Codes</>}
            </button>
            <button className="thm-btn outline" onClick={handleRemoveFile}>Cancel</button>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="dq-card mb-3">
            <div className="dq-card-header">
              <h6 className="dq-card-title">Preview</h6>
            </div>
            <div className="dq-card-body">
              {generated ? (
                <div className="dq-preview-grid">
                  {bulkData.slice(0, 4).map((item, i) => (
                    <div key={i} className="dq-preview-item">
                      <div className="dq-preview-qr">
                        {qrFormat === 'SVG' ? (
                          <QRCodeSVG
                            value={item.qr_url ? `https://${item.qr_url}` : `https://${window.location.host}/r/preview-${i}`}
                            size={60}
                            level={level}
                            bgColor="#ffffff"
                            fgColor="#0f1629"
                          />
                        ) : (
                          <QRCodeCanvas
                            value={item.qr_url ? `https://${item.qr_url}` : `https://${window.location.host}/r/preview-${i}`}
                            size={60}
                            level={level}
                            bgColor="#ffffff"
                            fgColor="#0f1629"
                            imageSettings={brandLogo !== 'No Logo' ? {
                              src: brandLogo === 'AKKSYS Logo'
                                ? 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#00C8FF"/><text x="50" y="62" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">AK</text></svg>')
                                : customLogo,
                              height: 12,
                              width: 12,
                              excavate: true,
                            } : undefined}
                          />
                        )}
                        <div className="dq-preview-logo">AK</div>
                      </div>
                      <span className="dq-preview-name">{item.name.split(' - ')[0]}</span>
                    </div>
                  ))}
                  {bulkData.length > 4 && (
                    <div className="dq-preview-item">
                      <div className="dq-preview-qr dq-preview-more">+{bulkData.length - 4}</div>
                      <span className="dq-preview-name">More</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="dq-preview-empty">
                  <BsQrCodeScan size={80} color="#e8e4f0" />
                  <p>Upload a CSV to see preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="dq-card mb-3">
            <div className="dq-card-header">
              <h6 className="dq-card-title">CSV Format Guide</h6>
            </div>
            <div className="dq-card-body">
              <div className="dq-code-box">
                <code>
                  name,destination_url<br />
                  Product A - Store Mumbai,https://example.com/a<br />
                  Product B - Store Delhi,https://example.com/b
                </code>
              </div>
              <p className="dq-field-hint mt-3 mb-0">
                <FaExclamationCircle className="me-1" />
                First row should be headers. Maximum 1000 rows per upload.
              </p>
            </div>
          </div>

          {generated && (
            <div className="dq-card">
              <div className="dq-card-header">
                <h6 className="dq-card-title">Generation Summary</h6>
              </div>
              <div className="dq-card-body">
                <div className="dq-summary-list">
                  <div className="dq-summary-row"><span>Total Generated</span><strong>{bulkData.length}</strong></div>
                  <div className="dq-summary-row"><span>Format</span><strong>{qrFormat}</strong></div>
                  <div className="dq-summary-row"><span>Size</span><strong>{getQrSizeValue()}x{getQrSizeValue()}</strong></div>
                  <div className="dq-summary-row"><span>Error Correction</span><strong>{errorCorrection}</strong></div>
                  <div className="dq-summary-row"><span>Brand Logo</span><strong>{brandLogo}</strong></div>
                  <div className="dq-summary-row"><span>Status</span><strong className="dq-text-success"><FaCheckCircle className="me-1" /> Complete</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkQRGeneration;

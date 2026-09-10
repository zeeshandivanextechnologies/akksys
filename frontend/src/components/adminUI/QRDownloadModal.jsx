import React, { useState, useMemo } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaImage, FaFilePdf, FaFileCode, FaTimes, FaCheck } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import '../../styles/QRDownloadModal.css';

const QRDownloadModal = ({ show, onClose, qrName, qrUrl, logoUrl }) => {
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState('400');
  const [withLogo, setWithLogo] = useState(true);
  const fallbackLogo = useMemo(() => {
    if (!withLogo || logoUrl) return null;
    const s = 200;
    const r = 16;
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00C8FF';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(s - r, 0);
    ctx.quadraticCurveTo(s, 0, s, r);
    ctx.lineTo(s, s - r);
    ctx.quadraticCurveTo(s, s, s - r, s);
    ctx.lineTo(r, s);
    ctx.quadraticCurveTo(0, s, 0, s - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 67px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AK', s / 2, s / 2 + 2);
    return canvas.toDataURL('image/png');
  }, [withLogo, logoUrl]);

  if (!show) return null;

  const qrValue = qrUrl ? `https://${qrUrl}` : 'https://akksys.io/q/xk9p2m';
  const sizeNum = parseInt(size);
  const logoSrc = withLogo ? (logoUrl || fallbackLogo || undefined) : undefined;

  const formats = [
    { id: 'png', label: 'PNG', icon: <FaImage />, desc: 'Best for web & social' },
    { id: 'svg', label: 'SVG', icon: <FaFileCode />, desc: 'Scalable vector' },
    { id: 'pdf', label: 'PDF', icon: <FaFilePdf />, desc: 'Print ready' },
  ];

  const sizes = [
    { value: '200', label: '200x200', desc: 'Small' },
    { value: '400', label: '400x400', desc: 'Medium' },
    { value: '800', label: '800x800', desc: 'Large' },
    { value: '1200', label: '1200x1200', desc: 'Print' },
  ];

  const downloadSvg = (svgString, fileName) => {
    const sized = svgString
      .replace(/<svg[^>]*>/, (match) => match
        .replace(/width="[^"]*"/, `width="${sizeNum}"`)
        .replace(/height="[^"]*"/, `height="${sizeNum}"`)
      );
    const blob = new Blob([sized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const safeName = (qrName || 'qrcode').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');

    if (format === 'svg') {
      // Generate SVG by rendering QR on canvas, then converting to SVG
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(container);

      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(
          <QRCodeCanvas
            value={qrValue}
            size={sizeNum}
            level="H"
            bgColor="#ffffff"
            fgColor="#0f1629"
            imageSettings={logoSrc ? {
              src: logoSrc,
              height: sizeNum * 0.2,
              width: sizeNum * 0.2,
              excavate: true,
            } : undefined}
          />
        );

        setTimeout(() => {
          const canvas = container.querySelector('canvas');
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${sizeNum}" height="${sizeNum}" viewBox="0 0 ${sizeNum} ${sizeNum}">` +
              `<image href="${dataUrl}" width="${sizeNum}" height="${sizeNum}"/>` +
              `</svg>`;
            downloadSvg(svgStr, safeName);
          }
          root.unmount();
          document.body.removeChild(container);
        }, 100);
      });
    } else {
      // Generate full-size QR for download
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(container);

      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(
          <QRCodeCanvas
            value={qrValue}
            size={sizeNum}
            level="H"
            bgColor="#ffffff"
            fgColor="#0f1629"
            imageSettings={logoSrc ? {
              src: logoSrc,
              height: sizeNum * 0.2,
              width: sizeNum * 0.2,
              excavate: true,
            } : undefined}
          />
        );

        setTimeout(() => {
          const canvas = container.querySelector('canvas');
          if (canvas) {
            if (format === 'pdf') {
              const dataUrl = canvas.toDataURL('image/png');
              const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 80] });
              const imgProps = pdf.getImageProperties(dataUrl);
              const pdfW = pdf.internal.pageSize.getWidth();
              const pdfH = pdf.internal.pageSize.getHeight();
              const ratio = Math.min(pdfW / imgProps.width, pdfH / imgProps.height);
              const w = imgProps.width * ratio;
              const h = imgProps.height * ratio;
              pdf.addImage(dataUrl, 'PNG', (pdfW - w) / 2, (pdfH - h) / 2, w, h);
              pdf.save(`${safeName}.pdf`);
            } else {
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = `${safeName}.png`;
              link.click();
            }
          }
          root.unmount();
          document.body.removeChild(container);
        }, 100);
      });
    }
    onClose();
  };

  return (
    <div className="qrd-modal-overlay" onClick={onClose}>
      <div className="qrd-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="qrd-modal-header">
          <div>
            <h5 className="qrd-modal-title">Download QR Code</h5>
            <p className="qrd-modal-subtitle">{qrName || 'QR Code'}</p>
          </div>
          <button className="cmp-back-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="qrd-modal-body">
          <div className="row">
            {/* QR Preview — Canvas (for PNG/PDF) */}
            {format !== 'svg' && (
              <div className="col-md-4">
                <div className="qrd-preview-box">
                  <div className="qrd-preview-qr">
                    <QRCodeCanvas
                      value={qrValue}
                      size={150}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#0f1629"
                      imageSettings={logoSrc ? {
                        src: logoSrc,
                        height: 30,
                        width: 30,
                        excavate: true,
                      } : undefined}
                    />
                    {withLogo && !logoUrl && (
                      <div className="qrd-preview-logo">
                        <div className="qrd-preview-logo-inner">AK</div>
                      </div>
                    )}
                  </div>
                  <p className="qrd-preview-url">
                    <a href={`https://${qrUrl || 'akksys.io/q/xk9p2m'}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} className='preview-click-btn'>
                      {qrUrl || 'akksys.io/q/xk9p2m'}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* QR Preview — SVG */}
            {format === 'svg' && (
              <div className="col-md-4">
                <div className="qrd-preview-box">
                  <div className="qrd-preview-qr">
                    <QRCodeSVG
                      value={qrValue}
                      size={150}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#0f1629"
                      imageSettings={logoSrc ? {
                        src: logoSrc,
                        height: 30,
                        width: 30,
                        excavate: true,
                      } : undefined}
                    />

                    {withLogo && !logoUrl && (
                      <div className="qrd-preview-logo">
                        <div className="qrd-preview-logo-inner">AK</div>
                      </div>
                    )}

                  </div>
                  <p className="qrd-preview-url">
                    <a href={`https://${qrUrl || 'akksys.io/q/xk9p2m'}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} className='preview-click-btn'>
                      {qrUrl || 'akksys.io/q/xk9p2m'}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Options */}
            <div className={format === 'svg' ? 'col-md-8' : 'col-md-8'}>
              {/* Format */}
              <div className="qrd-option-group">
                <label className="qrd-option-label">FORMAT</label>
                <div className="qrd-format-options">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      className={`qrd-format-btn ${format === f.id ? 'active' : ''}`}
                      onClick={() => setFormat(f.id)}
                    >
                      <span className="qrd-format-icon">{f.icon}</span>
                      <span className="qrd-format-label">{f.label}</span>
                      <span className="qrd-format-desc">{f.desc}</span>
                      {format === f.id && (
                        <span className="qrd-format-check"><FaCheck /></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="qrd-option-group">
                <label className="qrd-option-label">SIZE</label>
                <div className="qrd-size-options">
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      className={`qrd-size-btn ${size === s.value ? 'active' : ''}`}
                      onClick={() => setSize(s.value)}
                    >
                      <span className="qrd-size-label">{s.label}</span>
                      <span className="qrd-size-desc">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Logo */}
              <div className="qrd-option-group mb-0">
                <label className="qrd-option-label">BRAND LOGO</label>
                <div className="qrd-logo-toggle">
                  <label className="qrd-toggle">
                    <input
                      type="checkbox"
                      checked={withLogo}
                      onChange={(e) => setWithLogo(e.target.checked)}
                    />
                    <span className="qrd-toggle-slider"></span>
                  </label>
                  <span className="qrd-toggle-text">Include AKKSYS logo in center</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="qrd-modal-footer">
          <button className="thm-btn outline" onClick={onClose}>
            Cancel
          </button>
          <button className="thm-btn" onClick={handleDownload}>
            <FaDownload className="me-2" /> Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRDownloadModal;

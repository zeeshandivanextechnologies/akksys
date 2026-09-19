import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CreateBoxModal = ({
  show,
  onClose,
  onSubmit,
  newBoxNumber,
  setNewBoxNumber,
  newProductName,
  setNewProductName,
}) => {
  if (!show) return null;

  return (
    <div className="qrd-modal-overlay" onClick={onClose}>
      <div className="qrd-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="qrd-modal-header">
          <div>
            <h5 className="qrd-modal-title">Create New Box</h5>
            <p className="qrd-modal-subtitle">Enter box details</p>
          </div>
          <button type="button" className="cmp-back-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="qrd-modal-body">
            <div className="custom-frm-bx mb-3">
              <label className="dq-label">Box Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. BOX-001"
                value={newBoxNumber}
                onChange={(e) => setNewBoxNumber(e.target.value)}
                autoFocus
              />
            </div>
            <div className="custom-frm-bx mb-0">
              <label className="dq-label">Product Name (optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Pro X1"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
            </div>
          </div>
          <div className="qrd-modal-footer">
            <button type="button" className="thm-btn outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="thm-btn" disabled={!newBoxNumber.trim()}>Create Box</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoxModal;

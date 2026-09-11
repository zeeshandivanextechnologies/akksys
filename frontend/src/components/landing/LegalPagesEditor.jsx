import React, { useState } from 'react';
import { FaTrash, FaPlus, FaFileContract, FaGavel } from 'react-icons/fa';

const LegalPagesEditor = ({ legalPages, setLegalPages }) => {
  const [activeSubTab, setActiveSubTab] = useState('privacyPolicy');

  const currentData = legalPages[activeSubTab];

  const handleUpdateLastUpdated = (e) => {
    setLegalPages(prev => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        lastUpdated: e.target.value
      }
    }));
  };

  const handleUpdateSection = (index, field, value) => {
    const newSections = [...currentData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setLegalPages(prev => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        sections: newSections
      }
    }));
  };

  const handleAddSection = () => {
    const newSections = [
      ...currentData.sections,
      { id: `section-${Date.now()}`, title: 'New Section', content: '<p>Content here...</p>' }
    ];
    setLegalPages(prev => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        sections: newSections
      }
    }));
  };

  const handleRemoveSection = (index) => {
    const newSections = currentData.sections.filter((_, i) => i !== index);
    setLegalPages(prev => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        sections: newSections
      }
    }));
  };

  return (
    <div className="mk-cms-editor w-100">
      <div className="lc-tabs an-card mb-4">
        <button
          className={`lc-tab ${activeSubTab === 'privacyPolicy' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('privacyPolicy')}
        >
          <FaFileContract /> Privacy Policy
        </button>
        <button
          className={`lc-tab ${activeSubTab === 'termsAndConditions' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('termsAndConditions')}
        >
          <FaGavel /> Terms & Conditions
        </button>
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="custom-frm-bx mb-0" style={{ width: '300px' }}>
            <label className="lc-label">Last Updated Date</label>
            <input
              type="text"
              className="form-control"
              value={currentData.lastUpdated}
              onChange={handleUpdateLastUpdated}
              placeholder="e.g. September 11, 2026"
            />
          </div>
          <button className="thm-btn outline" onClick={handleAddSection}>
            <FaPlus className="me-1" /> Add Section
          </button>
        </div>

        <div className="ov-divider"></div>

        <h6 className="lc-section-title mb-3">Document Sections</h6>
        {currentData.sections.map((section, index) => (
          <div key={index} className="lc-feature-item">
            <div className="lc-feature-icon-box">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>S{index + 1}</span>
            </div>
            <div className="lc-feature-content">
              <div className="row">
                <div className="col-md-3">
                  <div className="custom-frm-bx">
                    <label className="lc-label">Section ID (Anchor)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={section.id}
                      onChange={(e) => handleUpdateSection(index, 'id', e.target.value)}
                    />
                  </div>
                  <div className="custom-frm-bx mb-0">
                    <label className="lc-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="custom-frm-bx mb-0 h-100">
                    <label className="lc-label d-flex justify-content-between">
                      <span>Content (HTML)</span>
                      <small className="text-muted" style={{ fontSize: '10px', textTransform: 'none' }}>
                        Tip: Use &lt;p&gt;, &lt;ul class="mk-legal-list"&gt;, &lt;h4 class="mk-legal-card-subtitle"&gt;
                      </small>
                    </label>
                    <textarea
                      className="form-control font-monospace"
                      rows="6"
                      value={section.content}
                      onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                      placeholder="<p>Paragraph text</p><ul class='mk-legal-list'><li>Item</li></ul>"
                    />
                  </div>
                </div>
                <div className="col-md-1 d-flex align-items-center justify-content-center">
                  <button className="lc-btn-icon danger" onClick={() => handleRemoveSection(index)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalPagesEditor;

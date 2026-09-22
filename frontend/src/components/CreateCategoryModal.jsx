import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const CreateCategoryModal = ({ show, onClose, onSuccess, editItem = null }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flatCategories, setFlatCategories] = useState([]);

  useEffect(() => {
    if (show) {
      setName(editItem ? editItem.name : '');
      setParentId(editItem ? editItem.parent_id : null);
      fetchFlatCategories();
    }
  }, [show, editItem]);

  const fetchFlatCategories = async () => {
    // Left for compatibility if needed elsewhere, but no longer used in UI
    try {
      const res = await api.get('/categories');
      setFlatCategories(res.data.flat || []);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      let savedCategory = null;
      if (editItem) {
        const res = await api.put(`/categories/${editItem.id}`, { name: name.trim(), parent_id: parentId });
        savedCategory = res.data;
        toast.success('Category updated');
      } else {
        const res = await api.post('/categories', { name: name.trim(), parent_id: parentId });
        savedCategory = res.data;
        toast.success('Category created');
      }
      onSuccess(savedCategory);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="qrd-modal-overlay" onClick={onClose}>
      <div className="qrd-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="qrd-modal-header">
          <div>
            <h5 className="qrd-modal-title">{editItem ? 'Edit Category' : 'New Category'}</h5>
          </div>
          <button className="cmp-back-btn" onClick={onClose}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>&times;</span>
          </button>
        </div>
        <div className="qrd-modal-body">
          <div className="custom-frm-bx">
            <label className="dq-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Gift / Birthday"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Parent category dropdown removed as requested by client */}
        </div>
        <div className="qrd-modal-footer">
          <button className="thm-btn outline" onClick={onClose}>Cancel</button>
          <button className="thm-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (editItem ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;

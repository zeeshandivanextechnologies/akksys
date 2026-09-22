import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/DynamicQR.css';

const CategoryItem = ({ category, onEdit, onDelete, depth = 0, openDropdown, toggleDropdown, isLast = false }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <tr className="dq-tr">
        <td style={{ paddingLeft: `${16 + depth * 32}px` }}>
          <div className="d-flex align-items-center gap-2">
            <span 
              onClick={() => hasChildren && setExpanded(!expanded)} 
              style={{ cursor: hasChildren ? 'pointer' : 'default', width: '20px', display: 'flex', justifyContent: 'center', color: '#8892a4' }}
            >
              {hasChildren ? (expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />) : null}
            </span>
            <div className="dq-qr-thumb" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,200,255,0.1)', borderRadius: '10px' }}>
              {expanded && hasChildren ? <FaFolderOpen size={20} style={{ color: 'var(--admin-primary)' }} /> : <FaFolder size={20} style={{ color: 'var(--admin-primary)' }} />}
            </div>
            <div className="dq-qr-info">
              <span className="dq-qr-name">{category.name}</span>
            </div>
          </div>
        </td>
        <td>{category.qr_count || 0}</td>
        <td className="dq-col-action">
          <div className="dq-action-cell" style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className="dq-edit-btn"
              onClick={(e) => toggleDropdown(category.id, e)}
            >
              Edit <FaChevronDown size={10} />
            </button>

            {openDropdown === category.id && (
              <div
                className="dq-dropdown-menu"
                style={{
                  position: 'absolute',
                  ...(isLast ? { bottom: 'calc(100% + 5px)' } : { top: 'calc(100% + 5px)' }),
                  right: 0,
                  zIndex: 1050,
                  minWidth: '120px'
                }}
              >
                <button onClick={() => { toggleDropdown(category.id, {stopPropagation:()=>{}}); onEdit(category); }}>
                  <FaEdit size={14} /> Edit
                </button>
                <button style={{ color: '#ef4444' }} onClick={() => { toggleDropdown(category.id, {stopPropagation:()=>{}}); onDelete(category.id); }}>
                  <FaTrash size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
      {expanded && hasChildren && category.children.map(child => (
        <CategoryItem 
          key={child.id} 
          category={child} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          depth={depth + 1} 
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
        />
      ))}
    </>
  );
};

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.tree || []);
      setFlatCategories(res.data.flat || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown && !e.target.closest('.dq-action-cell') && !e.target.closest('.dq-dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleCreate = () => {
    setEditItem(null);
    setName('');
    setParentId(null);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditItem(cat);
    setName(cat.name);
    setParentId(cat.parent_id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/categories/${editItem.id}`, { name: name.trim(), parent_id: parentId });
        toast.success('Category updated');
      } else {
        await api.post('/categories', { name: name.trim(), parent_id: parentId });
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? QR codes in this category will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="dq-page-wrapper">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ddd' }}>
          <div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dq-page-wrapper">
      <div className="dq-header">
        <div className="d-flex align-items-center gap-3">
          <button className="cmp-back-btn" onClick={() => navigate('/admin/dynamic-qr')}>
            <FaArrowLeft />
          </button>
          <div>
            <h4 className="dq-page-title mt-2">Categories</h4>
            <p className="dq-page-subtitle">Organize your QR codes into folders</p>
          </div>
        </div>
        <div className="dq-header-actions">
          <button className="thm-btn" onClick={handleCreate}>
            <FaPlus className="me-2" /> New Category
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="dq-card">
            <div className="dq-table-wrapper">
              {categories.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#ddd' }}>
                  <FaFolder size={40} style={{ color: '#aaa', marginBottom: '12px' }} />
                  <p style={{ color: '#ddd' }}>No categories yet. Create your first category to organize QR codes.</p>
                  <button className="thm-btn mt-2" onClick={handleCreate}><FaPlus className="me-2" /> Create Category</button>
                </div>
              ) : (
                <table className="dq-table table-responsive">
                  <thead>
                    <tr>
                      <th className="dq-th">Category Name</th>
                      <th className="dq-th">QR Codes</th>
                      <th className="dq-th dq-col-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, index) => (
                      <CategoryItem 
                        key={cat.id} 
                        category={cat} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        openDropdown={openDropdown}
                        toggleDropdown={toggleDropdown}
                        isLast={categories.length > 2 && index >= categories.length - 2}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="qrd-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="qrd-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="qrd-modal-header">
              <div>
                <h5 className="qrd-modal-title">{editItem ? 'Edit Category' : 'New Category'}</h5>
              </div>
              <button className="cmp-back-btn" onClick={() => setShowModal(false)}>
                <FaTrash size={14} style={{ display: 'none' }} />
                <span style={{ fontSize: '20px', lineHeight: 1 }}>&times;</span>
              </button>
            </div>
            <div className="qrd-modal-body">
              <div className="custom-frm-bx">
                <label className="dq-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Clothing / Men / T-Shirts"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="custom-frm-bx mb-0">
                <label className="dq-label">Parent Category (optional)</label>
                <select
                  className="form-select"
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">None (Root Level)</option>
                  {flatCategories
                    .filter(c => !editItem || c.id !== editItem.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="qrd-modal-footer">
              <button className="thm-btn outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="thm-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (editItem ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

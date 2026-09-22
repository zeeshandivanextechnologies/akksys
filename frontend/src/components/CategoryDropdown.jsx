import React, { useState, useEffect } from 'react';
import api from '../services/api';

const buildOptions = (items, level = 0) => {
  const options = [];
  for (const item of items) {
    options.push({ id: item.id, name: item.name, level });
    if (item.children && item.children.length > 0) {
      options.push(...buildOptions(item.children, level + 1));
    }
  }
  return options;
};

const CategoryDropdown = ({ value, onChange, className, defaultOptionText = "No Category" }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.tree || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const options = buildOptions(categories);

  return (
    <select
      className={className || 'form-select'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">{defaultOptionText}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {'  '.repeat(opt.level)}{opt.level > 0 ? '└ ' : ''}{opt.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;

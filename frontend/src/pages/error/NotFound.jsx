import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="nf-page">
      <div className="nf-grid-bg"></div>
      <div className="nf-orb nf-orb-1"></div>
      <div className="nf-orb nf-orb-2"></div>

      <div className="nf-content">
        <div className="nf-badge">ERROR</div>
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="nf-actions">
          <Link to="/" className="thm-btn" style={{padding : "12px 16px"}}>
            <FaHome /> Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="thm-btn outline" style={{padding : "12px 16px"}}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

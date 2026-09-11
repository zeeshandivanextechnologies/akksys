import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaQrcode, FaArrowLeft, FaFileContract } from 'react-icons/fa';
import api from '../../services/api';
import Footer from '../../components/landing/Footer';
import { defaultTermsAndConditions } from './legalDefaults';
import './MarketingWebsite.css';

const TermsAndConditions = () => {
  const [footerData, setFooterData] = useState({});
  const [termsData, setTermsData] = useState(defaultTermsAndConditions);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/landing-content/content');
        if (res.data) {
          if (res.data.footer) setFooterData(res.data.footer);
          if (res.data.legal_pages && res.data.legal_pages.termsAndConditions) {
            setTermsData(res.data.legal_pages.termsAndConditions);
          }
        }
      } catch (err) {
        console.error('Failed to load content data:', err);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="mk-container">
      <nav className="mk-nav">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <NavLink to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="mk-nav-logo">
              <FaQrcode />
            </div>
            <span className="mk-nav-brand">AKKSYS</span>
          </NavLink>
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="thm-btn outline">
              <FaArrowLeft className="me-1" /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="mk-section">
        <div className="container">

           <div className="text-center pb-4">
            <span className="mk-badge"><FaFileContract className="me-1" /> LEGAL</span>
            <h2 className="mk-heading mb-0">Terms <span className="mk-gradient-text">&amp; Conditions</span></h2>
            <p className="mk-subtext">Last updated: {termsData.lastUpdated}</p>
          </div>

          <div className="row">

            <div className="col-lg-12 col-md-12">
              <div className="mk-legal-content">
                {termsData.sections.map((section) => (
                  <div key={section.id} className="mk-legal-card" id={section.id}>
                    <h3 className="mk-legal-card-title">{section.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer footerData={footerData} />
    </div>
  );
};

export default TermsAndConditions;
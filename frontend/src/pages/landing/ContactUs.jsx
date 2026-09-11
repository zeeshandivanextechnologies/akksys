import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaQrcode, FaEnvelope, FaPhone, FaArrowLeft, FaPaperPlane, FaUser, FaBuilding, FaHeadset } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Footer from '../../components/landing/Footer';
import './MarketingWebsite.css';

const ContactUs = () => {
  const [footerData, setFooterData] = useState({});
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/landing-content/content');
        if (res.data && res.data.footer) {
          setFooterData(res.data.footer);
        }
      } catch (err) {
        console.error('Failed to load footer data:', err);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Name, Email and Message are required');
      return;
    }
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully');
      setForm({ name: '', email: '', phone: '', subject: 'general', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

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
            <span className="mk-badge"><FaHeadset className="me-1" /> SUPPORT</span>
            <h2 className="mk-heading mb-0">Contact <span className="mk-gradient-text">Us</span></h2>
            <p className="mk-subtext">Have a question or need help? We'd love to hear from you.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="mk-legal-content">
                <div className="mk-legal-card">
                  <h3 className="mk-legal-card-title"><FaPaperPlane className="me-2" />Send us a Message</h3>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="custom-frm-bx">
                          <label className="lc-label"><FaUser className="me-1" /> Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="custom-frm-bx">
                          <label className="lc-label"><FaEnvelope className="me-1" /> Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="custom-frm-bx">
                          <label className="lc-label"><FaPhone className="me-1" /> Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="custom-frm-bx">
                          <label className="lc-label"><FaBuilding className="me-1" /> Subject</label>
                          <select
                            name="subject"
                            className="form-control"
                            value={form.subject}
                            onChange={handleChange}
                          >
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Issue</option>
                            <option value="feedback">Feedback</option>
                            <option value="partnership">Partnership</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="custom-frm-bx mb-0">
                          <label className="lc-label">Message *</label>
                          <textarea
                            name="message"
                            className="form-control"
                            rows="5"
                            placeholder="Tell us how we can help you..."
                            value={form.message}
                            onChange={handleChange}
                            style={{ resize: 'vertical' }}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="text-end mt-3">
                      <button type="submit" className="thm-btn" disabled={sending}>
                        {sending ? 'Sending...' : <><FaPaperPlane className="me-1" /> Send Message</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer footerData={footerData} />
    </div>
  );
};

export default ContactUs;
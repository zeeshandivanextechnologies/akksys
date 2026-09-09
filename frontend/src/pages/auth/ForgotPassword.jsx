import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaSpinner, FaCheck, FaArrowLeft } from 'react-icons/fa';
import '../auth/Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      {/* Background Elements */}
      <div className="login-bg-orb login-bg-orb-1"></div>
      <div className="login-bg-orb login-bg-orb-2"></div>
      <div className="login-bg-grid"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="login-card">
              {/* Logo Section */}
              <div className="login-header text-center mb-3">
                <div className="login-logo-wrapper">
                  <div className="login-logo">
                    <FaQrcode size={28} />
                  </div>
                </div>
                <h2 className="login-title">Reset Password</h2>
                <p className="login-subtitle">
                  {sent 
                    ? 'Check your email for reset instructions'
                    : 'Enter your email to receive a reset link'
                  }
                </p>
              </div>

              {sent ? (
                /* Success State */
                <div className="text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '60px', height: '60px', background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
                    <FaCheck size={24} style={{ color: '#00C8FF' }} />
                  </div>
                  <p className="mb-3" style={{ color: '#eee', fontSize: '0.85rem' }}>
                    We've sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>
                  <button 
                    className="thm-btn w-100 mb-3" style={{padding : "12px 16px"}}
                    onClick={() => navigate('/login')}
                  >
                    Back to Sign In
                  </button>
                  <p className="mb-0" style={{ color: '#eee', fontSize: '14px' }}>
                    Didn't receive the email?{' '}
                    <button 
                      type="button" 
                      className="login-link-btn"
                      onClick={() => setSent(false)}
                    >
                      Try again
                    </button>
                  </p>
                </div>
              ) : (
                /* Form State */
                <>
                  {/* Error Message */}
                  {error && (
                    <div className="login-error">
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="login-field mb-3">
                      <label className="login-label">Email Address</label>
                      <div className="login-input-wrapper">
                        <input
                          type="email"
                          className="login-input"
                          placeholder="admin@akksys.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="thm-btn w-100" style={{padding : "12px 16px"}}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="spinner" /> Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <div className="login-divider">
                    <span>or</span>
                  </div>

                  <button 
                    className="thm-btn outline w-100" style={{padding : "12px 16px"}}
                    onClick={() => navigate('/login')}
                  >
                    <FaArrowLeft className="me-2" /> Back to Sign In
                  </button>
                </>
              )}
            </div>

            {/* Back to Website */}
            <div className="login-back text-center mt-3">
              <button type="button" className="login-back-btn" onClick={() => navigate('/')}>
                ← Back to Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
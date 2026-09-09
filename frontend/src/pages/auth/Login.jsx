import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaQrcode, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Loader from '../dashboard/Loader';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) return <Loader />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-orb login-bg-orb-1"></div>
      <div className="login-bg-orb login-bg-orb-2"></div>
      <div className="login-bg-grid"></div>

      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="login-card">
              <div className="login-header text-center mb-3">
                <div className="login-logo-wrapper">
                  <div className="login-logo">
                    <FaQrcode size={28} />
                  </div>
                </div>
                <h2 className="login-title">AKKSYS Admin</h2>
                <p className="login-subtitle">Sign in to manage your business campaigns</p>
              </div>

              {error && (
                <div className="login-error">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="login-field mb-3">
                  <label className="login-label">Email Address</label>
                  <div className="login-input-wrapper">
                    <input
                      type="email"
                      className="login-input"
                      placeholder="admin@akksys.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="login-field mb-3">
                  <label className="login-label d-flex justify-content-between">
                    <span>Password</span>
                  </label>
                  <div className="login-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                <div className='mb-3 text-end'>
                  <button type="button" className="login-forgot-btn" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
                </div>

                <button
                  type="submit"
                  className="thm-btn w-100"
                  style={{ padding: "12px 16px" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spinner" /> Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              <div className="login-divider">
                <span>or</span>
              </div>

              <div className="login-social-btns">
                <button className="thm-btn outline w-100" style={{ padding: "12px 16px" }} type="button">
                  Continue as Guest
                </button>
              </div>

              <div className="login-footer">
                <p className="login-footer-text">
                  Don't have an account?{' '}
                  <button type="button" className="login-link-btn">Contact Sales</button>
                </p>
              </div>
            </div>

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

export default Login;

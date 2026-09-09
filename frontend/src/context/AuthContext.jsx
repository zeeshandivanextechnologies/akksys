import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('akksys_token');
    const savedUser = localStorage.getItem('akksys_user');
    if (savedToken && savedUser) {
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem('akksys_token');
        localStorage.removeItem('akksys_user');
      } else {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('akksys_token');
          localStorage.removeItem('akksys_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('akksys_token', newToken);
    localStorage.setItem('akksys_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('akksys_token');
    localStorage.removeItem('akksys_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

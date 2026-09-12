import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ivy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('ivy_access_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('ivy_refresh_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto refresh token before 15-min expiration (900s)
  useEffect(() => {
    if (!refreshToken) return;

    // Refresh every 12 minutes (720 seconds)
    const interval = setInterval(async () => {
      try {
        console.log('Refreshing auth session...');
        const res = await api.refreshToken(refreshToken);
        if (res.access_token) {
          setAccessToken(res.access_token);
          localStorage.setItem('ivy_access_token', res.access_token);
          if (res.refresh_token) {
            setRefreshToken(res.refresh_token);
            localStorage.setItem('ivy_refresh_token', res.refresh_token);
          }
        }
      } catch (err) {
        console.error('Session refresh failed:', err);
      }
    }, 720 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      const userData = res.user || { email };
      setUser(userData);
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);

      localStorage.setItem('ivy_user', JSON.stringify(userData));
      localStorage.setItem('ivy_access_token', res.access_token);
      localStorage.setItem('ivy_refresh_token', res.refresh_token);

      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('ivy_user');
    localStorage.removeItem('ivy_access_token');
    localStorage.removeItem('ivy_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

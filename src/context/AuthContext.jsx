import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'fastor_auth_token';
const PHONE_KEY = 'fastor_user_phone';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [phone, setPhone] = useState(() => localStorage.getItem(PHONE_KEY) || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial state
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedPhone = localStorage.getItem(PHONE_KEY);
    if (savedToken) {
      setToken(savedToken);
      setPhone(savedPhone || '');
    }
    setLoading(false);

    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('fastor_auth_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('fastor_auth_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (newToken, userPhone) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    if (userPhone) {
      localStorage.setItem(PHONE_KEY, userPhone);
      setPhone(userPhone);
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PHONE_KEY);
    setToken('');
    setPhone('');
  };

  const isAuthenticated = Boolean(token);

  const value = {
    token,
    phone,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vrm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vrm_token');
    if (token) {
      authService.getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('vrm_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('vrm_token', token);
    localStorage.setItem('vrm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vrm_token');
    localStorage.removeItem('vrm_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newObj = { ...user, ...updatedData };
    setUser(newObj);
    localStorage.setItem('vrm_user', JSON.stringify(newObj));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

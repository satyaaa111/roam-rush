// hooks/useAuth.js
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api'; // ← Simple import

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const response = await api.get('/auth/me'); // → goes to /api/auth/me → rewritten to backend
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/v1/auth/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    const userResponse = await api.get('/auth/me');
    setUser(userResponse.data);
    return userResponse.data;
  };

  const signup = async (username, email, password) => {
    const response = await api.post('/v1/auth/register', { username, email, password });
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
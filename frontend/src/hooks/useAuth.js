'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import {getApi} from '@/lib/api'; // <-- IMPORT OUR NEW "SMART CLIENT"

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
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // The interceptor automatically adds the token!
          // We use .get() and just the endpoint.
          // The response.data is the JSON body.
          const response = await api.get('/auth/me'); 
          setUser(response.data);
        } catch (error) {
          // The interceptor will also catch 401s here,
          // but we log other errors (like 404s)
          console.error('Auth check failed:', error.message);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const api = await getApi();
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const userResponse = await api.get('/auth/me');
    setUser(userResponse.data);
    
    return userResponse.data;
  };

  const signup = async (username, email, password) => {
    const api = await getApi();
    const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
    });
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');

    delete api.defaults.headers.common['Authorization'];
    
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
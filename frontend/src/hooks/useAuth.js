// src/hooks/useAuth.js
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api'; // Your smart api instance
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // The token is only checked to avoid a useless API call
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // The request interceptor automatically adds the token
          const response = await api.get('/v1/auth/me'); 
          setUser(response.data);
        } catch (error) {
          // The response interceptor will handle 401s, 
          // but we still need to catch other errors.
          // If it *was* a 401, the interceptor redirects.
          // If not, we just log out the user state.
          setUser(null);
          console.error("Auth check failed:", error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try { // <-- 1. Add try block
      // 1. Log in. The API returns a token.
      const response = await api.post('/v1/auth/login', { email, password });
      const token = response.data.token;
      
      // 2. Save the token.
      localStorage.setItem('token', token);
      
      // 3. Get the user.
      const userResponse = await api.get('/v1/auth/me');
      setUser(userResponse.data);
      return userResponse.data;

    } catch (error) { // <-- 2. Add catch block
      console.error("Login failed:", error);
      throw error; // <-- 3. RE-THROW THE ERROR!
                   // This is the crucial part.
    }
  };

  const signup = async (username, email, password) => {
    const response = await api.post('/v1/auth/register', { username, email, password });
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // Use the router for a clean client-side navigation
    router.push('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
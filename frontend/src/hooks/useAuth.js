'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  initials: '',
  checkEmailStatus: async () => {}, 
  register: async () => {},
  verifyEmail: async () => {},
  resendOtp: async () => {},
  login: async () => {},
  verifyLoginOtp: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initials, setInitials] = useState('');
  const router = useRouter();

  // --- 1. USER INITIALS LOGIC ---
  useEffect(() => {
    if (user?.displayName) {
      setInitials(getInitials(user.displayName));
    } else {
      setInitials('');
    }
  }, [user]);

  function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  }

  // --- 2. FETCH PROFILE (With Guard Clause) ---
  const fetchUserProfile = async () => {
    // SAFETY CHECK: Only attempt to fetch if we actually have a token
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
        // No token? Don't hit the backend.
        return; 
    }

    try {
      const response = await api.get('/users/me'); 
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      // Note: We don't force logout here; the api.js interceptor handles 401s
    }
  };

  // --- 3. INITIALIZATION ---
  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      // If no token exists on startup, stop loading immediately.
      if (!token) {
        setLoading(false);
        return;
      }

      // If token exists, try to validate it by fetching the user
      try {
        await fetchUserProfile();
      } catch (error) {
        // If local check fails hard, sync state
        if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
           setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // --- AUTH ACTIONS ---

  // Check if email exists/is verified (for Smart Signup)
  const checkEmailStatus = async (email) => {
      const response = await api.post('/auth/check-email', { email });
      return response.data; 
  }

  // Flow 1: Registration
  const register = async (email, password, displayName) => {
    const response = await api.post('/auth/register', { email, password, displayName });
    return response.data; 
  };

  const verifyEmail = async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    const { accessToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    await fetchUserProfile(); // Fetch immediately after setting token
    
    return response.data;
  };

  const resendOtp = async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  }

  // Flow 2: Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; 
  };

  const verifyLoginOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    const { accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    await fetchUserProfile(); // Fetch immediately after setting token

    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }

    setUser(null);
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      initials,
      checkEmailStatus, 
      register, 
      verifyEmail, 
      resendOtp,
      login, 
      verifyLoginOtp, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
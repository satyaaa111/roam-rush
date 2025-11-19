'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  initials: '',
  register: async () => {},       // Step 1: Signup
  verifyEmail: async () => {},    // Step 2: Verify & Login (New User)
  resendOtp: async () => {},      // Helper: Resend
  login: async () => {},          // Step 1: Login Password
  verifyLoginOtp: async () => {}, // Step 2: Verify & Login (Returning User)
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initials, setInitials] = useState('');
  const [userName, setUserName] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  }, [user]);
  
  useEffect(() => {
    setInitials(getInitials(userName));
  }, [userName]);

  function getInitials(name) {
    if (!name) return "";

    // Split by whitespace, remove empty pieces
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";

    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

    return (firstInitial + lastInitial).toUpperCase();
  }

  // Helper to fetch user profile after getting a token
  // NOTE: You need to create a GET /api/users/me endpoint in your backend
  // Or simply decode the JWT here if you only need ID/Email.
  const fetchUserProfile = async () => {
    try {
      // Assuming you have/will create this endpoint to get user details
      // If not, you can skip this and just setUser({ authenticated: true })
      const response = await api.get('/users/me'); 
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      // If fetching profile fails, we might want to logout or just leave user null
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // If we have a token, try to fetch user data
        await fetchUserProfile();
      } catch (error) {
        // Token might be invalid, but the interceptor in api.js handles the refresh logic.
        // If interceptor fails, it clears storage. We just sync state here.
        if (!localStorage.getItem('accessToken')) {
           setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // --- Flow 1: Registration ---

  const register = async (email, password, displayName) => {
    // Calls POST /api/auth/register
    // Does NOT log in. Just triggers OTP email.
    const response = await api.post('/auth/register', { email, password, displayName });
    return response.data; 
  };

  const verifyEmail = async (email, otp) => {
    // Calls POST /api/auth/verify-email
    // Returns: { accessToken: "..." }
    const response = await api.post('/auth/verify-email', { email, otp });
    const { accessToken } = response.data;
    
    // Save Token
    localStorage.setItem('accessToken', accessToken);
    
    // Fetch User Data & Set State
    await fetchUserProfile();
    
    return response.data;
  };

  const resendOtp = async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  }

  // --- Flow 2: Login ---

  const login = async (email, password) => {
    // Calls POST /api/auth/login
    // Does NOT log in. Just triggers 2FA OTP email.
    const response = await api.post('/auth/login', { email, password });
    return response.data; 
  };

  const verifyLoginOtp = async (email, otp) => {
    // Calls POST /api/auth/verify-otp (Note the different endpoint)
    // Returns: { accessToken: "..." }
    const response = await api.post('/auth/verify-otp', { email, otp });
    const { accessToken } = response.data;

    // Save Token
    localStorage.setItem('accessToken', accessToken);

    // Fetch User Data & Set State
    await fetchUserProfile();

    return response.data;
  };

  // --- Logout ---

  const logout = async () => {
    try {
      // Call backend to delete Refresh Token from DB and clear Cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }

    // Cleanup Client Side
    setUser(null);
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      initials,
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
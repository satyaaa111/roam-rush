// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // ← This goes through Next.js rewrites!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
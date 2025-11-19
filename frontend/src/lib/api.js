import axios from 'axios';

const BASE_URL = '/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet...
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // ---
      // --- THIS IS THE FIX ---
      // ---
      // Helper to check if we are on a public auth page
      const isAuthPage = typeof window !== 'undefined' && 
        (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/signup'));

      // 1. If the error comes FROM the refresh endpoint, we failed.
      if (originalRequest.url.includes('/auth/refresh')) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            // Only redirect if we are NOT on login/signup
            if (!isAuthPage) {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
      }

      // 2. If we are on Login/Signup, IGNORE the auto-refresh logic for 401s.
      // We want the specific page (Signup) to handle the error (e.g., "Email in use").
      if (isAuthPage) {
        return Promise.reject(error);
      }

      // --- END OF FIX ---

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            // Double check before redirecting here too
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

// Ideally, put this in .env: NEXT_PUBLIC_API_URL=http://localhost:8080
// For now, we assume Next.js rewrites /api to your backend
const BASE_URL = '/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Allows sending cookies (RefreshToken) to backend
});

// --- Request Interceptor ---
// Adds the Access Token to every request if we have it
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

// Handles 401 errors by attempting to refresh the token
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
      
      // If the error comes FROM the refresh endpoint, we are truly doomed. Logout.
      if (originalRequest.url.includes('/auth/refresh')) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
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
        // Call the backend refresh endpoint. 
        // We don't send a body/token; the browser sends the httpOnly cookie automatically.
        const { data } = await api.post('/auth/refresh');
        
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        // Update the header for the original request
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Process any other requests that failed while we were refreshing
        processQueue(null, newAccessToken);
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If refresh fails (e.g., cookie expired), logout user
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
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
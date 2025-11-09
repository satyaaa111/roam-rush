import axios from 'axios';

// 1. Create the "smart client" instance
const api = axios.create({
    // This tells axios to automatically add "/api/v1" to all requests
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. The "Request Interceptor" (Runs before every request)
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// 3. The "Response Interceptor" (Runs after every response)
api.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // --- This is the key for future scalability! ---
        // If the server returns a 401 Unauthorized (e.g., token expired)
        if (error.response && error.response.status === 401) {
            console.error("API Error: Token is invalid or expired.");
            
            // 1. Remove the bad token
            localStorage.removeItem('token');
            
            // 2. Redirect to the login page
            // (We check for 'window' to make sure this only runs in the browser)
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        
        // For all other errors, just return the error
        return Promise.reject(error);
    }
);

export default api;
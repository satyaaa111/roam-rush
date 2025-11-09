// // This is the 'apiRequest' function your useAuth.js was trying to use.

// /**
//  * A wrapper for the native fetch function that:
//  * 1. Automatically adds the 'Content-Type: application/json' header.
//  * 2. Automatically gets the JWT token from localStorage and adds the
//  * 'Authorization: Bearer ...' header for all requests *except* login/register.
//  * 3. Automatically prepends the Next.js proxy path (`/api/v1`) to the URL.
//  * 4. Throws an error if the response is not ok.
//  */
// export async function apiRequest(endpoint, options = {}) {
//     const { method = 'GET', body } = options;
//     const token = localStorage.getItem('token');
    
//     // 1. Define base headers
//     const headers = {
//         'Content-Type': 'application/json',
//     };

//     // 2. Add the token to the header if it exists
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     // 3. Build the full request
//     const response = await fetch(`/api/v1${endpoint}`, {
//         method,
//         headers,
//         body,
//     });

//     // 4. Check for errors
//     if (!response.ok) {
//         const errorData = await response.json();
//         // e.g., "Email already in use"
//         throw new Error(errorData.error || 'API request failed');
//     }

//     // 5. Handle "No Content" responses (like logout)
//     if (response.status === 204) {
//         return null;
//     }

//     // 6. Return the JSON response
//     return response.json();
// }


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
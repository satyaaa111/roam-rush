import axios from 'axios';

let api = null;                // axios instance
let configLoaded = false;      // to prevent double loading

// --- 1. Load runtime config file written by runtime-env.sh ---
async function loadRuntimeConfig() {
    if (configLoaded) return;

    try {
        const res = await fetch('/runtime-config.json', { cache: 'no-store' });
        const conf = await res.json();

        // The final full backend URL
        const BASE = conf.API_BASE_URL || 'http://localhost:8080';

        // Create axios instance dynamically AFTER config is loaded
        api = axios.create({
            baseURL: `${BASE}/api`,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor
        api.interceptors.request.use(
            (config) => {
                const token = typeof window !== 'undefined'
                    ? localStorage.getItem('token')
                    : null;

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add response interceptor
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    console.error("API Error: Token expired or invalid.");
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        configLoaded = true;
    } catch (err) {
        console.error("Failed to load runtime-config.json!", err);
        throw err;
    }
}

// --- 2. Export a function that guarantees API is ready ---
export async function getApi() {
    if (!configLoaded) {
        await loadRuntimeConfig();
    }
    return api;
}

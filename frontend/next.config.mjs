/** @type {import('next').NextConfig} */

// 1. Check if we are in "production" (in the AWS container)
// This env var is set by `npm start`
const isProd = process.env.NODE_ENV === 'production';

// 2. Define the backend URLs
// API_BASE_URL comes from the terraform/services.tf file
// It is the *private* DNS name of your internal load balancer
const PROD_BACKEND = process.env.API_BASE_URL; 
const DEV_BACKEND = 'http://localhost:8080';

const nextConfig = {
  reactStrictMode: true,
  
  // 3. This is the "smart" proxy
  async rewrites() {
    // If we are in production AND the env var is missing, log a big error
    if (isProd && !PROD_BACKEND) {
      console.error(
        'FATAL ERROR: API_BASE_URL environment variable is not set.'
      );
      // This will still probably crash, which is good.
    }
    
    return [
      {
        source: '/api/v1/:path*', // Your API calls
        // If in production, proxy to the internal ALB (from env var).
        // If in dev, proxy to the local backend container (localhost:8080).
        destination: `${isProd ? PROD_BACKEND : DEV_BACKEND}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

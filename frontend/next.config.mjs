/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV == 'production';

// In production, backend URL comes from env (injected at build time)
const PROD_BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL; // ← We'll set this in CI

const DEV_BACKEND = 'http://localhost:8080';

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    const backendUrl = isProd ? PROD_BACKEND : DEV_BACKEND;
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
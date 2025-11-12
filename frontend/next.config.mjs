const isProd = process.env.NODE_ENV === 'production';
const PROD_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const DEV_BACKEND = 'http://localhost:8080';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${isProd ? PROD_BACKEND : DEV_BACKEND}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

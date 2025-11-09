/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* config options here */
  // This rewrites rule acts as a proxy during development
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Any request starting with /api...
        destination: 'http://localhost:8080/api/:path*', // ...is sent to your backend
      },
    ];
  },
};

export default nextConfig;

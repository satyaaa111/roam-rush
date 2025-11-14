
//const isProd = process.env.NODE_ENV == 'production';
// In production, backend URL comes from env (injected at build time)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!BACKEND_URL) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL is not defined. ' +
        'Please set it as a build argument (e.g., --build-arg NEXT_PUBLIC_BACKEND_URL=...).'
      );
    }
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
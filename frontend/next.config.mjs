/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// The backend URL provided by Terraform at container runtime
const PROD_BACKEND = process.env.API_BASE_URL || "http://localhost:8080";

// Local backend for development
const DEV_BACKEND = "http://localhost:8080";

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        // Browser calls:   /api/v1/anything
        // Next.js rewrites to internal ALB  
        source: "/api/v1/:path*",

        // VERY IMPORTANT:
        // Rewrites ALWAYS keep same /api/v1 prefix
        destination: `${isProd ? PROD_BACKEND : DEV_BACKEND}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

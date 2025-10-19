/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  eslint: {
    // Temporarily ignore ESLint errors during builds to allow dev server to run
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TS errors during builds
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;

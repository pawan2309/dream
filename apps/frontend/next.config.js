/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: "3000",
  },
  // Remove rewrites as they might be causing issues
};

module.exports = nextConfig; 
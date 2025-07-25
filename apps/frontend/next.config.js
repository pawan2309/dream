/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: "3000",
  },
  // Disable Next.js automatic scroll restoration
  experimental: {
    scrollRestoration: false,
  },
  // Reduce reload frequency
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.prisma/**', '**/prisma/migrations/**'],
      };
    }
    return config;
  },
};

module.exports = nextConfig; 
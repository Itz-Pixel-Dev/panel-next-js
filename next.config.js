/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        'bcrypt': 'bcryptjs'
      }
    }
  },
  webpack: (config) => {
    config.resolve.fallback = {};
    return config;
  }
};

module.exports = nextConfig; 
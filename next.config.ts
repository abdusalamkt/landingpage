/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
  },
};
// next.config.js
module.exports = {
  images: {
    domains: ['gfi.local'], // Replace with actual domain
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

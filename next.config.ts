/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
  },
  images: {
    domains: ['test.shopgfiuae.com'], // Replace with your real domain or CDN hostname
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

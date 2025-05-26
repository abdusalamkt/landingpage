/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
  },
};

module.exports = nextConfig;

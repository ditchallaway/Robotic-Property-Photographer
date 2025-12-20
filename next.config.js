/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CESIUM_BASE_URL: '/cesium',
  },
};

module.exports = nextConfig;

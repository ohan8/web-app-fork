/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'core.subsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
});
module.exports = nextConfig;

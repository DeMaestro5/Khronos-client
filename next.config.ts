import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com', 'example.org'],
  },

  // Disable development indicators
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },

  // Disable draft mode indicator
  experimental: {
    // Other experimental features
  },
};

export default nextConfig;

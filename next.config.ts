import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'via.placeholder.com',
      'images.unsplash.com',
      'example.org',
      'lh3.googleusercontent.com',
    ],
  },

  // Fix deprecated devIndicators configuration
  devIndicators: {
    position: 'bottom-right',
  },

  // Add webpack configuration for Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },

  // Disable draft mode indicator
  experimental: {
    // Other experimental features
  },
};

export default nextConfig;

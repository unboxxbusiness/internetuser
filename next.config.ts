import type { NextConfig } from 'next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = (() => {
  return {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      serverComponentsExternalPackages: ['firebase-admin'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
    },
  };
})();

export default nextConfig;

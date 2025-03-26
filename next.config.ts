import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['192.168.0.106'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.qz.run',
        pathname: '**',
      },
    ],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

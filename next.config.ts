import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode:false,
  images: {
    domains: ['qz-api.testlab.fun'],
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

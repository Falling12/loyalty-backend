import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: true
  },
  
  // Add images configuration with production domain
  images: {
    domains: ['localhost', 'backend.scsanad.hu'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.scsanad.hu',
        port: '',
        pathname: '/uploads/**',
      }
    ],
  },
  
  // Configure so Next.js doesn't attempt to route /uploads requests
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;

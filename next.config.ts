import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    esmExternals: false
  },
};

export default nextConfig;

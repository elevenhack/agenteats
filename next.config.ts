import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    middlewareClientMaxBodySize: "20mb",
  },
};

export default nextConfig;

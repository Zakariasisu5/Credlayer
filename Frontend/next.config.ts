import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  serverExternalPackages: ["ws"],
  transpilePackages: ["@credlayer/sdk", "sas-lib"],
  turbopack: {
    resolveAlias: {
      fs: { browser: "./empty-module.js" },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback, 
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Ensure node_modules are resolved properly for local packages
    config.resolve.symlinks = false;
    
    return config;
  },
};

export default nextConfig;

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
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback, 
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Prevent webpack from following symlinks into other workspaces
    config.resolve.symlinks = false;
    
    // Optimize file watching to prevent WSL memory spikes
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        // Use polling in WSL — inotify is unreliable across the 9P filesystem
        poll: 1000,
        ignored: [
          '**/node_modules/**', 
          '**/.git/**', 
          '**/.next/**', 
          '**/blockchain/**',
        ],
      };
    }
    
    return config;
  },
};

export default nextConfig;

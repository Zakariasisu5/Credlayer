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
  // Suppress next-themes script warning in console
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  turbopack: {
    resolveAlias: {
      fs: { browser: "./empty-module.js" },
    },
    // Ensure Turbopack follows symlinks for local packages
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
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
    
    config.resolve.symlinks = true;
    
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
  // Filter out next-themes script warning from React
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;

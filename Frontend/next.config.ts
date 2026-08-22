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
  experimental: {
    // Enable Turbopack to resolve local packages correctly
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
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
    
    // ENABLE symlink resolution for local packages
    // The SDK is installed as a symlink from ../blockchain/sdk
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
};

export default nextConfig;

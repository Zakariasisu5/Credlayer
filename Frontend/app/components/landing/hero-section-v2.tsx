"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SecurityVisualization } from "./security-visualization";

export function HeroSectionV2() {
  const [walletAddress, setWalletAddress] = useState("");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      window.location.href = `/app?address=${encodeURIComponent(walletAddress)}`;
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Solid Black Background */}
      <div className="absolute inset-0 z-0 bg-black" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Hero Content */}
          <div className="text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-tight mb-6">
              TRUST EVERY{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  TRANSACTION
                </span>
                <span className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl -z-10" />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 max-w-2xl lg:max-w-none leading-relaxed">
              AI-powered reputation and risk intelligence for Web3 wallets, protocols, and autonomous agents
            </p>

            {/* Primary CTA - Wallet Input */}
            <form onSubmit={handleAnalyze} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address to analyze..."
                    className="w-full h-14 pl-12 pr-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-8 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 whitespace-nowrap"
                >
                  Analyze Wallet
                </button>
              </div>
            </form>

            {/* Secondary Link */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
              <span>Building on Web3?</span>
              <Link
                href="/developers"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Explore developer docs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Security Visualization */}
          <div className="flex items-center justify-center lg:justify-end">
            <SecurityVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}

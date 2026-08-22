"use client";

import { ArrowRight, Zap, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SecurityVisualization } from "./security-visualization";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent min-h-[90vh] flex items-center">
      {/* Animated background gradient circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 py-20 lg:px-8 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.1] tracking-tight">
              TRUST EVERY{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  TRANSACTION.
                </span>
                <span className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl -z-10" />
              </span>
            </h1>

            <p className="max-w-xl text-base lg:text-lg leading-7 text-gray-400">
              AI-powered reputation and risk intelligence for Web3 wallets, protocols, and
              autonomous agents.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/app"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
              >
                <span>Analyze a Wallet</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/developers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg hover:border-cyan-400/70 transition-all duration-300"
              >
                Developers
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-cyan-400" />
                <span>AI-Powered Risk Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-cyan-400" />
                <span>Real-Time On-Chain Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan-400" />
                <span>Verifiable Reputation</span>
              </div>
            </div>
          </div>

          {/* Right: Security Visualization */}
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="w-full max-w-[500px]">
              <SecurityVisualization />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

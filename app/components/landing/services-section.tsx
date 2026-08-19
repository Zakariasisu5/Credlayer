"use client";

import { Target, Layers, TrendingUp, Shield, Zap, Database } from "lucide-react";
import { ServiceCard } from "./service-card";

const CORE_SERVICES = [
  {
    icon: Shield,
    title: "AI REPUTATION",
    description:
      "Advanced AI-powered trust scoring for wallets, agents, and on-chain identities with real-time risk assessment.",
    href: "/app",
  },
  {
    icon: Database,
    title: "BLOCKCHAIN CREDENTIALS",
    description:
      "Issue and verify tamper-proof credentials on-chain with cryptographic proof and instant validation.",
    href: "/developers",
  },
  {
    icon: Zap,
    title: "DEVELOPER API",
    description:
      "Enterprise-grade API infrastructure for seamless integration with comprehensive SDKs and webhooks.",
    href: "/developers",
  },
  {
    icon: Target,
    title: "FRAUD DETECTION",
    description:
      "Real-time anomaly detection and behavioral analysis to prevent fraudulent activities before they happen.",
    href: "/protocol",
  },
  {
    icon: Layers,
    title: "MULTI-CHAIN",
    description:
      "Cross-chain reputation aggregation supporting Solana, Ethereum, and emerging blockchain networks.",
    href: "/developers",
  },
  {
    icon: TrendingUp,
    title: "ANALYTICS",
    description:
      "Deep insights and metrics dashboards for tracking reputation trends and verification patterns.",
    href: "/explorer",
  },
];

export function ServicesSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20 lg:px-8 lg:py-32 border-t border-cyan-500/10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 sm:h-20 bg-gradient-to-b from-cyan-500/50 to-transparent" />
      
      <div className="relative">
        {/* Section Header - Mobile optimized */}
        <div className="mb-8 sm:mb-16 text-center px-2 sm:px-0">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-cyan-400 mb-2 flex items-center gap-2 justify-center">
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-cyan-400" />
                CORE SERVICES
                <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-cyan-400" />
              </h2>
            </div>
          </div>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">
            Enterprise Trust Infrastructure
          </h3>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            Comprehensive verification solutions powered by AI and blockchain technology
          </p>
        </div>

        {/* Service Cards Grid - Mobile optimized */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICES.map((service, index) => (
            <div
              key={service.title}
              className="opacity-0 animate-fadeInUp"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Bottom CTA - Mobile optimized */}
        <div className="mt-8 sm:mt-16 text-center px-4 sm:px-0">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-gray-400">
            <span>Looking for custom solutions?</span>
            <a 
              href="/developers" 
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
            >
              Talk to our team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

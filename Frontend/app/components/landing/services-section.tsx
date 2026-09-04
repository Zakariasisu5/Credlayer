"use client";

import { Target, Layers, TrendingUp, Shield, Zap, Database } from "lucide-react";
import { ServiceCard } from "./service-card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";

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
    href: "/app",
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
    href: "/app",
  },
  {
    icon: Layers,
    title: "MULTI-CHAIN",
    description:
      "Cross-chain reputation aggregation supporting Solana, Ethereum, and emerging blockchain networks.",
    href: "/app",
  },
  {
    icon: TrendingUp,
    title: "ANALYTICS",
    description:
      "Deep insights and metrics dashboards for tracking reputation trends and verification patterns.",
    href: "/app",
  },
];

export function ServicesSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24 border-t border-border">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      
      <div className="relative">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mb-12 text-center">
            <div className="inline-block mb-3">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2 flex items-center gap-2 justify-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary" />
                CORE SERVICES
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary" />
              </h2>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Enterprise Trust Infrastructure
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Comprehensive verification solutions powered by AI and blockchain technology
            </p>
          </div>
        </ScrollReveal>

        {/* Service Cards Grid */}
        <StaggerContainer staggerDelay={0.1}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CORE_SERVICES.map((service) => (
              <StaggerItem key={service.title}>
                <ServiceCard {...service} />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
              <span>Looking for custom solutions?</span>
              <a 
                href="/contact" 
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                Talk to our team
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

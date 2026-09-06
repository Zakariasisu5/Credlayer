"use client";

import { ArrowRight, Zap, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SecurityVisualization } from "./security-visualization";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Framed rounded card container with corner glows */}
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top-left corner glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Bottom-right corner glow */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tl from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Main hero card with rounded corners and subtle border */}
        <div className="relative rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl overflow-hidden">
          {/* Gradient border glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          
          {/* Content container */}
          <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 text-left">
                {/* Eyebrow label */}
                <ScrollReveal direction="up">
                  <div className="inline-block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/80 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      AI-Powered Web3 Security
                    </span>
                  </div>
                </ScrollReveal>

                {/* Headline */}
                <ScrollReveal direction="up" delay={0.05}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
                    <span className="text-foreground">TRUST EVERY</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      TRANSACTION.
                    </span>
                  </h1>
                </ScrollReveal>

                {/* Supporting subtext */}
                <ScrollReveal direction="up" delay={0.1}>
                  <p className="max-w-xl text-base lg:text-lg leading-relaxed text-muted-foreground">
                    AI-powered reputation and risk intelligence for Web3 wallets, protocols, and autonomous agents.
                  </p>
                </ScrollReveal>

                {/* Primary CTA */}
                <ScrollReveal direction="up" delay={0.15}>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link
                      href="/app"
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all text-base gap-2 group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                    >
                      <span>Analyze a Wallet</span>
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/developers"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-border text-foreground hover:bg-accent font-semibold rounded-full transition-all text-base"
                    >
                      Developers
                    </Link>
                  </div>
                </ScrollReveal>

                {/* Feature badges */}
                <ScrollReveal direction="up" delay={0.2}>
                  <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-muted-foreground border-t border-border/50 mt-8">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Zap className="size-4 text-primary" />
                      </div>
                      <span>AI-Powered Risk Intelligence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Activity className="size-4 text-primary" />
                      </div>
                      <span>Real-Time On-Chain Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <span>Verifiable Reputation</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right: Isometric product visualization */}
              <ScrollReveal direction="right" delay={0.25}>
                <div className="flex items-center justify-center lg:justify-end">
                  <div className="relative w-full max-w-lg">
                    <SecurityVisualization />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

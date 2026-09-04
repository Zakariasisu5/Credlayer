"use client";

import { ArrowRight, Zap, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SecurityVisualization } from "./security-visualization";
import { Button } from "../ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background using theme variable */}
      <div className="absolute inset-0 z-0 bg-background" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 lg:px-10 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 text-left">
            <ScrollReveal direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                TRUST EVERY{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    TRANSACTION.
                  </span>
                  <span className="absolute -inset-2 bg-primary/20 blur-2xl -z-10" />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <p className="max-w-xl text-base lg:text-lg leading-7 text-muted-foreground">
                AI-powered reputation and risk intelligence for Web3 wallets, protocols, and
                autonomous agents.
              </p>
            </ScrollReveal>

            {/* CTAs using Button component */}
            <StaggerContainer staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row gap-4">
                <StaggerItem>
                  <Button
                    href="/app"
                    size="lg"
                    className="group w-full sm:w-auto"
                  >
                    <span>Analyze a Wallet</span>
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </StaggerItem>
                <StaggerItem>
                  <Button
                    href="/developers"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Developers
                  </Button>
                </StaggerItem>
              </div>
            </StaggerContainer>

            {/* Feature badges */}
            <StaggerContainer staggerDelay={0.1}>
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                <StaggerItem>
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    <span>AI-Powered Risk Intelligence</span>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    <span>Real-Time On-Chain Analysis</span>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    <span>Verifiable Reputation</span>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>

          {/* Right: Security Visualization */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="flex items-center justify-center">
              <SecurityVisualization />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

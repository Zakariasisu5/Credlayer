"use client";

import Link from "next/link";
import { Code, Rocket, Database, GitBranch, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

const MILESTONES = [
  { 
    label: "Architecture",
    value: "Complete",
    icon: Code,
    description: "Full-stack system designed"
  },
  { 
    label: "GNN Model",
    value: "Trained",
    icon: Database,
    description: "Graph Neural Network ready"
  },
  { 
    label: "MVP Status",
    value: "Active Dev",
    icon: Rocket,
    description: "Building in public"
  },
  { 
    label: "Open Source",
    value: "Coming Soon",
    icon: GitBranch,
    description: "Community-driven"
  },
];

export function ClientsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24 border-t border-border bg-background">
      {/* Background effects - subtle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-4xl rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-3">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2 flex items-center gap-2 justify-center">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary" />
              BUILDING IN PUBLIC
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#06b6d4]" />
            </h2>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            What We&apos;ve Built So Far
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            We&apos;re developing AI-powered reputation intelligence for Web3. Here&apos;s our current progress.
          </p>
        </div>

        {/* Development Milestones Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-16">
          {MILESTONES.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <div
                key={milestone.label}
                className="group relative opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="relative h-full rounded-xl border border-border bg-card backdrop-blur-sm p-5 shadow-card transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg border border-primary/30 bg-transparent">
                    <Icon className="size-6 text-primary" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-xl font-bold text-foreground mb-1">
                    {milestone.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm text-muted-foreground font-medium mb-1">
                    {milestone.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-xs text-muted-foreground/70">
                    {milestone.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Details Section */}
        <div className="mt-8">
          <div className="rounded-xl border border-border bg-card backdrop-blur-sm p-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-bold text-foreground mb-3">
                  Early Access Available
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  We&apos;re in active development and looking for early adopters to help shape the future of Web3 reputation systems.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors text-sm"
                  >
                    Try the Demo
                  </Link>
                  <Link
                    href="/developers"
                    className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[#06b6d4] text-primary hover:bg-[#06b6d4]/10 font-semibold rounded-full transition-colors text-sm"
                  >
                    View Docs
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href="https://huggingface.co/credlayer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 hover:border-[#06b6d4]/40 transition-colors opacity-0 animate-fadeInLeft group"
                  style={{ 
                    animationDelay: '200ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-sm text-muted-foreground">GNN Model on Hugging Face</span>
                  <ExternalLink className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                </a>
                <div 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 opacity-0 animate-fadeInLeft"
                  style={{ 
                    animationDelay: '300ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold text-primary">MVP Development</span>
                </div>
                <div 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 opacity-0 animate-fadeInLeft"
                  style={{ 
                    animationDelay: '400ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-sm text-muted-foreground">License</span>
                  <span className="text-sm font-semibold text-primary">Open Source Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

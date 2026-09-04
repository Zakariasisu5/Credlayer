"use client";

import { Code, Rocket, Database, GitBranch, ExternalLink } from "lucide-react";

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
    <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20 lg:px-8 lg:py-32 border-t border-cyan-500/10">
      {/* Background effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-4xl rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="mb-8 sm:mb-16 text-center px-2 sm:px-0">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-cyan-400 mb-2 flex items-center gap-2 justify-center">
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-cyan-400" />
                BUILDING IN PUBLIC
                <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-cyan-400" />
              </h2>
            </div>
          </div>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">
            What We&apos;ve Built So Far
          </h3>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            We&apos;re developing AI-powered reputation intelligence for Web3. Here&apos;s our current progress.
          </p>
        </div>

        {/* Development Milestones Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-20">
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
                {/* Card background with hover effect */}
                <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-full rounded-xl border border-cyan-500/20 bg-[#0a1628]/60 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:-translate-y-1">
                  {/* Icon */}
                  <div className="mb-3 sm:mb-4 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-cyan-500/30 bg-transparent">
                    <Icon className="size-5 sm:size-6 text-cyan-400" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                    {milestone.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs sm:text-sm text-gray-400 font-medium mb-1">
                    {milestone.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-xs text-gray-500">
                    {milestone.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Details Section */}
        <div className="mt-8">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6 sm:p-12">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h4 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Early Access Available
                </h4>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                  We&apos;re in active development and looking for early adopters to help shape the future of Web3 reputation systems.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <a 
                    href="/app"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm sm:text-base font-medium transition-colors duration-300"
                  >
                    Try the Demo
                  </a>
                  <a 
                    href="/developers"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm sm:text-base font-medium transition-colors duration-300"
                  >
                    View Docs
                  </a>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="https://huggingface.co/credlayer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40 hover:border-cyan-400/40 transition-colors opacity-0 animate-fadeInLeft group"
                  style={{ 
                    animationDelay: '200ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-xs sm:text-sm text-gray-400">GNN Model on Hugging Face</span>
                  <ExternalLink className="size-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </a>
                <div 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40 opacity-0 animate-fadeInLeft"
                  style={{ 
                    animationDelay: '300ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-xs sm:text-sm text-gray-400">Status</span>
                  <span className="text-xs sm:text-sm font-semibold text-cyan-400">MVP Development</span>
                </div>
                <div 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40 opacity-0 animate-fadeInLeft"
                  style={{ 
                    animationDelay: '400ms',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-xs sm:text-sm text-gray-400">License</span>
                  <span className="text-xs sm:text-sm font-semibold text-cyan-400">Open Source Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

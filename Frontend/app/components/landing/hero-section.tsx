"use client";

import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { SecurityVisualization } from "./security-visualization";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      {/* Animated particles effect - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse hidden sm:block" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse [animation-delay:1s] hidden sm:block" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-50 animate-pulse [animation-delay:2s] hidden lg:block" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-30 animate-pulse [animation-delay:3s] hidden lg:block" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 pt-20 pb-12 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="grid gap-6 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-5 sm:space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1.1] tracking-tight">
              SECURING TOMORROW&apos;S{" "}
              <span className="relative inline-block text-cyan-400">
                <span className="relative z-10">TRANSACTIONS</span>
                <span className="absolute -inset-1 sm:-inset-2 bg-cyan-400/20 blur-xl -z-10" />
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 text-gray-400 px-2 sm:px-0">
              Developing advanced verification protocols to secure and verify B2B
              interactions with blockchain-powered trust infrastructure.
            </p>

            {/* Feature highlights - Mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
                <Shield className="size-4 sm:size-5 text-cyan-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">AI-Powered Trust</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                <Zap className="size-4 sm:size-5 text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Real-Time Verification</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
                <Lock className="size-4 sm:size-5 text-purple-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Blockchain Security</span>
              </div>
            </div>

            {/* CTAs - Mobile optimized */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
              <Button 
                href="/app" 
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white w-full sm:w-auto shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 text-sm sm:text-base"
              >
                <span>GET SECURE</span>
                <ArrowRight className="size-4" />
              </Button>
              <Button 
                href="/developers" 
                variant="outline" 
                size="lg"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 w-full sm:w-auto hover:border-cyan-400/70 transition-all duration-300 text-sm sm:text-base"
              >
                BOOK A DEMO
              </Button>
            </div>

            {/* Trust indicators - Mobile optimized */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 sm:pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:1s]" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:2s]" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right: Security Visualization - Show on mobile with smaller size */}
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 mt-8 sm:mt-0">
            <div className="w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px]">
              <SecurityVisualization />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

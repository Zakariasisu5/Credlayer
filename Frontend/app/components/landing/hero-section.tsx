"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SecurityVisualization } from "./security-visualization";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#030c18]">
      {/* Simple subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <Badge tone="green" className="inline-flex">
              DIGITAL VERIFICATION LAYER
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1.1] tracking-tight">
              SECURING TOMORROW&apos;S{" "}
              <span className="text-cyan-400">
                TRANSACTIONS
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 text-gray-400">
              Developing advanced verification protocols to secure and verify B2B
              interactions.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                href="/app" 
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white w-full sm:w-auto"
              >
                <span>GET SECURE</span>
                <ArrowRight className="size-4" />
              </Button>
              <Button 
                href="/developers" 
                variant="outline" 
                size="lg"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 w-full sm:w-auto"
              >
                BOOK A DEMO
              </Button>
            </div>
          </div>

          {/* Right: Security Visualization - Hidden on small mobile */}
          <div className="hidden sm:flex items-center justify-center">
            <SecurityVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}

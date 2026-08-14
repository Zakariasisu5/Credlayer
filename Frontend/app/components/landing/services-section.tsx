"use client";

import { Target, Layers, TrendingUp } from "lucide-react";
import { ServiceCard } from "./service-card";

const CORE_SERVICES = [
  {
    icon: Target,
    title: "STRATEGY",
    description:
      "Proactive strategy protocols to drive growth & trust.",
    iconGradient: "from-cyan-400 to-blue-500",
    href: "/protocol",
  },
  {
    icon: Layers,
    title: "TECHNOLOGY",
    description:
      "Blockchain technology solutions for digital transformation.",
    iconGradient: "from-blue-400 to-purple-500",
    href: "/developers",
  },
  {
    icon: TrendingUp,
    title: "GROWTH",
    description:
      "Analytics-driven growth with data-driven innovation.",
    iconGradient: "from-green-400 to-cyan-400",
    href: "/explorer",
  },
];

export function ServicesSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-16 sm:py-20 lg:px-8 lg:py-28">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-block">
            <div className="relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-400 mb-2">
                SERVICES
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>
          </div>
        </div>

        {/* Service Cards - Stack on mobile, grid on larger screens */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICES.map((service, index) => (
            <div
              key={service.title}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

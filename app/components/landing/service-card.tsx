"use client";

import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href = "/protocol",
}: ServiceCardProps) {
  return (
    <Link href={href} className="group relative block h-full min-h-[200px] sm:min-h-[220px]">
      {/* Glow effect on hover */}
      <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-transparent opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Card */}
      <div className="relative h-full rounded-xl border border-cyan-500/30 bg-[#0a1628]/95 backdrop-blur-sm p-5 sm:p-6 transition-all duration-500 group-hover:border-cyan-400/60 group-active:scale-[0.98] lg:group-hover:-translate-y-1">
        {/* Icon Container */}
        <div className="mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg border border-cyan-500/30 bg-transparent transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Title */}
        <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-bold uppercase tracking-wide text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-4 sm:mb-5 text-xs sm:text-sm leading-relaxed text-gray-400">
          {description}
        </p>

        {/* Learn More Link */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
          <span>Learn More</span>
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/50" />
      </div>
    </Link>
  );
}

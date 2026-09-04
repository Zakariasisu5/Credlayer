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
    <Link href={href} className="group relative block h-full min-h-[200px]">
      {/* Card using shared design tokens */}
      <div className="relative h-full rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-card transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
        {/* Icon Container */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-transparent transition-all duration-300 group-hover:border-primary/50">
          <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Learn More Link */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors group-hover:text-primary/80">
          <span>Learn More</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

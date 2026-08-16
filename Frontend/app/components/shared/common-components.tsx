"use client";

import { Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Empty state component
export function Empty({ 
  icon: Icon = Database, 
  title, 
  description 
}: { 
  icon?: LucideIcon; 
  title: string; 
  description: string 
}) {
  return (
    <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border bg-card/30 p-8 text-center">
      <div>
        <span className="mx-auto mb-4 grid size-10 place-items-center rounded-full border border-border bg-accent text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// Styled card component
export function StyledCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <section className={`rounded-xl border border-primary/20 bg-[#071a2c]/80 p-5 shadow-[0_0_24px_rgba(14,165,233,0.06)] backdrop-blur-sm ${className}`}>
      {children}
    </section>
  );
}

// Stat card component
export function Stat({ 
  label, 
  value = "—", 
  note = "Awaiting data" 
}: { 
  label: string; 
  value?: string; 
  note?: string 
}) {
  return (
    <StyledCard>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </StyledCard>
  );
}

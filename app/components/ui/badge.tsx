import type { ReactNode } from "react";

type BadgeTone = "default" | "green" | "amber";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "default", className = "" }: BadgeProps) {
  const toneStyles = {
    green: "border-primary/30 bg-primary/10 text-primary",
    amber: "border-amber-400/30 bg-amber-300/10 text-amber-200",
    default: "border-border bg-card text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${toneStyles[tone]} ${className}`}
    >
      {tone === "green" && (
        <span className="size-1.5 rounded-full bg-primary" />
      )}
      {children}
    </span>
  );
}

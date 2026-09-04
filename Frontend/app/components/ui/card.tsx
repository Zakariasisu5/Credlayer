import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

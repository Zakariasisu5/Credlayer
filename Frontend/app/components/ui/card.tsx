import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-primary/20 bg-[#071a2c]/80 p-5 shadow-[0_0_24px_rgba(14,165,233,0.06)] backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

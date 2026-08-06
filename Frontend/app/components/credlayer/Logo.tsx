"use client";

export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/assets/favicon.png"
        alt="CredLayer"
        className={className}
        style={{ objectFit: "contain" }}
      />
      <span className="font-bold text-lg text-foreground whitespace-nowrap">CredLayer</span>
    </div>
  );
}

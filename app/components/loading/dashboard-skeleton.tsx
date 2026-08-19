"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-48 bg-accent rounded mb-2" />
          <div className="h-4 w-64 bg-accent rounded" />
        </div>
        <div className="h-10 w-32 bg-accent rounded" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-3 w-24 bg-accent rounded mb-4" />
            <div className="h-10 w-32 bg-accent rounded mb-2" />
            <div className="h-3 w-40 bg-accent rounded" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <div className="h-5 w-40 bg-accent rounded mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-16 bg-accent rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

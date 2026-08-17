"use client";

export function ReputationSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Score Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-4 w-32 bg-accent rounded mb-4" />
        <div className="h-16 w-40 bg-accent rounded mb-2" />
        <div className="h-3 w-24 bg-accent rounded" />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="h-3 w-24 bg-accent rounded mb-3" />
            <div className="h-8 w-16 bg-accent rounded mb-2" />
            <div className="h-2 w-full bg-accent rounded" />
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="h-4 w-32 bg-accent rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-accent rounded" />
          <div className="h-3 w-full bg-accent rounded" />
          <div className="h-3 w-3/4 bg-accent rounded" />
        </div>
      </div>
    </div>
  );
}

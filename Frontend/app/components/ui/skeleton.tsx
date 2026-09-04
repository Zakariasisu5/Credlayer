interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-accent ${className}`}
      {...props}
    />
  );
}

// Specialized skeleton variants for common patterns
export function SkeletonText({ className = "", ...props }: SkeletonProps) {
  return <Skeleton className={`h-4 w-full ${className}`} {...props} />;
}

export function SkeletonCard({ className = "", ...props }: SkeletonProps) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`} {...props}>
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonStat({ className = "", ...props }: SkeletonProps) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`} {...props}>
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function SkeletonList({ count = 3, className = "", ...props }: SkeletonProps & { count?: number }) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

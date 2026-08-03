import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-elevated-strong ${className}`} />;
}

/** Full dashboard skeleton shown while the wallet session is being restored. */
export function DashboardSkeleton({ label = "Restoring your wallet…" }: { label?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-4">
      <div className="glass-strong rounded-2xl p-5 flex items-center gap-3">
        <Loader2 className="size-4 animate-spin text-gold" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="glass-strong rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skel className="size-12 rounded-xl" />
          <div className="space-y-2">
            <Skel className="h-3 w-32" />
            <Skel className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skel className="h-7 w-28 rounded-full" />
          <Skel className="h-7 w-24 rounded-full" />
          <Skel className="h-7 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5 glass rounded-2xl p-4 sm:p-6 space-y-4">
          <Skel className="h-3 w-40" />
          <div className="flex items-center gap-6">
            <Skel className="size-32 rounded-full" />
            <div className="space-y-2">
              <Skel className="h-3 w-16" />
              <Skel className="h-6 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => <Skel key={i} className="h-12" />)}
          </div>
        </div>
        <div className="lg:col-span-4 glass rounded-2xl p-4 sm:p-6 space-y-5">
          <Skel className="h-3 w-40" />
          {[0, 1, 2, 3].map((i) => <Skel key={i} className="h-6" />)}
        </div>
        <div className="lg:col-span-3 glass rounded-2xl p-4 sm:p-6 space-y-4">
          <Skel className="h-3 w-24" />
          <Skel className="h-12" />
          <Skel className="h-8 w-24" />
          <Skel className="h-9" />
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7 glass rounded-2xl p-4 sm:p-6 space-y-3">
          <Skel className="h-3 w-48" />
          <Skel className="h-4 w-full" />
          <Skel className="h-4 w-11/12" />
          <Skel className="h-4 w-9/12" />
        </div>
        <div className="lg:col-span-5 glass rounded-2xl p-4 sm:p-6 space-y-3">
          <Skel className="h-3 w-40" />
          {[0, 1, 2, 3].map((i) => <Skel key={i} className="h-4" />)}
        </div>
      </div>
    </motion.div>
  );
}

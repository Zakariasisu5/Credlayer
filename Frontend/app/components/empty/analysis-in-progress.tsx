"use client";

import { Loader2 } from "lucide-react";

interface AnalysisInProgressProps {
  wallet: string;
  progress?: number;
}

export function AnalysisInProgress({ wallet, progress }: AnalysisInProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="relative mb-6">
        <Loader2 className="size-16 text-primary animate-spin" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Analyzing Wallet</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">
        Our AI reputation engine is analyzing on-chain behavior and generating your trust score.
      </p>
      <p className="text-xs text-muted-foreground font-mono">
        {wallet.slice(0, 8)}...{wallet.slice(-8)}
      </p>
      {progress !== undefined && (
        <div className="w-full max-w-xs mt-6">
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
        </div>
      )}
    </div>
  );
}

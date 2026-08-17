"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "../ui";

interface NoAnalysisProps {
  onAnalyze?: () => void;
  wallet?: string;
}

export function NoAnalysis({ onAnalyze, wallet }: NoAnalysisProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="rounded-full bg-accent p-6 mb-6">
        <BarChart3 className="size-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Reputation Analysis</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {wallet
          ? "This wallet hasn't been analyzed yet. Start an analysis to view reputation data."
          : "No reputation analysis available for this wallet."}
      </p>
      {onAnalyze && (
        <Button onClick={onAnalyze}>Analyze Wallet</Button>
      )}
    </div>
  );
}

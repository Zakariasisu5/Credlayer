"use client";

import { Activity } from "lucide-react";

export function NoActivity() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="rounded-full bg-transparent border border-accent p-6 mb-6">
        <Activity className="size-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No recent activity to display. Activity will appear here as you interact with CredLayer services.
      </p>
    </div>
  );
}

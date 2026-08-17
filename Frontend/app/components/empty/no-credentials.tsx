"use client";

import { ShieldCheck } from "lucide-react";

export function NoCredentials() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="rounded-full bg-transparent border border-accent p-6 mb-6">
        <ShieldCheck className="size-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Credentials Found</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No verifiable credentials have been issued for this wallet yet. Credentials will appear here once they are created.
      </p>
    </div>
  );
}

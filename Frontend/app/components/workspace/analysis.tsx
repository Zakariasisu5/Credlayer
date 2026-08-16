"use client";

import { BarChart3 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";

export function AnalysisPage() {
  return (
    <Shell title="Analysis" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Understand the signals behind your reputation.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Stat label="Verified signals" />
          <Stat label="Trust connections" />
          <Stat label="Credentials" />
        </div>
        <div className="mt-5">
          <Empty
            icon={BarChart3}
            title="No analysis data yet"
            description="This workspace is connected to the CredLayer protocol, but no live records are available yet."
          />
        </div>
      </div>
    </Shell>
  );
}

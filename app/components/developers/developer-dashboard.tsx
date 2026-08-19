"use client";

import { Code2 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";

export function DeveloperDashboardPage() {
  return (
    <Shell title="Developer dashboard" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          <Stat label="API requests" />
          <Stat label="Credentials issued" />
          <Stat label="Webhooks" />
        </div>
        <div className="mt-5">
          <Empty
            icon={Code2}
            title="Connect your first project"
            description="Create an API key to start seeing usage and integration health."
          />
        </div>
      </div>
    </Shell>
  );
}

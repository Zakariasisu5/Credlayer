"use client";

import { Search } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge } from "../ui";
import { Empty, Stat } from "../shared/common-components";

export function ExplorerPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Public explorer</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Explore the layer</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Search addresses, credentials, and protocol activity.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 md:w-80">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search an address or credential"
            />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Stat label="Verified credentials" />
          <Stat label="Active issuers" />
          <Stat label="Protocol events" />
        </div>
        <div className="mt-5">
          <Empty
            icon={Search}
            title="No records to display"
            description="Connect an indexer to populate the explorer. Search is ready for when your data source is configured."
          />
        </div>
      </div>
    </Shell>
  );
}

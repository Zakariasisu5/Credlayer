"use client";

import { ShieldCheck } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";

export function CredentialsPage() {
  return (
    <Shell title="Credentials" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Portable proof you can share with consent.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Stat label="Verified signals" />
          <Stat label="Trust connections" />
          <Stat label="Credentials" />
        </div>
        <div className="mt-5">
          <Empty
            icon={ShieldCheck}
            title="No credentials data yet"
            description="This workspace is connected to the CredLayer protocol, but no live records are available yet."
          />
        </div>
      </div>
    </Shell>
  );
}

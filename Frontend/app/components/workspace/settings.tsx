"use client";

import { Shell } from "../layout/app-shell";
import { StyledCard } from "../shared/common-components";

export function SettingsPage() {
  return (
    <Shell title="Settings" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Manage preferences and connected services.
        </p>
        <StyledCard>
          <h2 className="font-semibold">Workspace settings</h2>
          <div className="mt-6 flex flex-col gap-4">
            <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
              <span>
                <span className="block font-medium">Privacy mode</span>
                <span className="text-xs text-muted-foreground">
                  Only share credentials when explicitly requested.
                </span>
              </span>
              <input type="checkbox" defaultChecked className="accent-primary" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
              <span>
                <span className="block font-medium">Activity notifications</span>
                <span className="text-xs text-muted-foreground">
                  Receive updates for new attestations.
                </span>
              </span>
              <input type="checkbox" className="accent-primary" />
            </label>
          </div>
        </StyledCard>
      </div>
    </Shell>
  );
}

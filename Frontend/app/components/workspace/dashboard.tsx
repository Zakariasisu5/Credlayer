"use client";

import { Shell } from "../layout/app-shell";
import { ErrorBoundary } from "../shared/error-boundary";
import { TrustScoreLiveDemo } from "./sdk-client";

export function DashboardPage() {
  return (
    <Shell title="Reputation" eyebrow="CredLayer">
      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10">
        <ErrorBoundary>
          <TrustScoreLiveDemo />
        </ErrorBoundary>
      </div>
    </Shell>
  );
}
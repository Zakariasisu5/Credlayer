"use client";

import { KeyRound } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Button } from "../ui";
import { Empty, StyledCard } from "../shared/common-components";

export function ApiKeysPage() {
  return (
    <Shell title="API keys" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
        <StyledCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Project API keys</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keys are generated locally in this preview only.
              </p>
            </div>
            <Button>
              Create key <KeyRound className="size-4" />
            </Button>
          </div>
          <div className="mt-6">
            <Empty
              icon={KeyRound}
              title="No API keys"
              description="Create a key to authenticate your first integration."
            />
          </div>
        </StyledCard>
      </div>
    </Shell>
  );
}

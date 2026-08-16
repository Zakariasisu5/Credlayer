"use client";

import { ArrowRight } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge, Button } from "../ui";
import { StyledCard } from "../shared/common-components";

export function SdkPage() {
  return (
    <Shell title="SDK" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
        <StyledCard>
          <Badge tone="green">TypeScript SDK</Badge>
          <h2 className="mt-5 text-2xl font-semibold">
            Ship trusted experiences faster.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            The CredLayer SDK will provide typed clients for identity, credentials, and verification requests.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
            npm install @credlayer/sdk
          </div>
          <Button href="/developers/docs" variant="outline">
            View SDK guide <ArrowRight className="size-4" />
          </Button>
        </StyledCard>
      </div>
    </Shell>
  );
}

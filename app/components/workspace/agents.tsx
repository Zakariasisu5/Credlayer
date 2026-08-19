"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Button } from "../ui";
import { Empty, StyledCard } from "../shared/common-components";

export function AgentsPage() {
  return (
    <Shell title="Agents" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Create trusted workflows for your products.
        </p>
        <div className="flex flex-col gap-5">
          <StyledCard>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Registered agents</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agents will use scoped credentials to act on your behalf.
                </p>
              </div>
              <Button variant="outline">
                Register agent <ArrowRight className="size-4" />
              </Button>
            </div>
          </StyledCard>
          <Empty
            icon={Sparkles}
            title="No agents registered"
            description="Create an agent when you are ready to automate a trusted workflow."
          />
        </div>
      </div>
    </Shell>
  );
}

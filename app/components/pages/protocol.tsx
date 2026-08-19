"use client";

import { ArrowRight, Globe2, Network, ShieldCheck } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge, Button } from "../ui";
import { StyledCard } from "../shared/common-components";

export function ProtocolPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <Badge tone="green">The protocol</Badge>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
          A shared language for trust.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          CredLayer turns verifiable activity into composable credentials without turning people into scores.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Network,
              title: "Signals",
              body: "Collect consented activity and attestations from connected ecosystems."
            },
            {
              icon: ShieldCheck,
              title: "Credentials",
              body: "Package proof into portable credentials with clear provenance."
            },
            {
              icon: Globe2,
              title: "Access",
              body: "Let apps request exactly the context they need, and nothing more."
            }
          ].map(({ icon: Icon, title, body }) => (
            <StyledCard key={title}>
              <Icon className="size-5 text-primary" />
              <h2 className="mt-8 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </StyledCard>
          ))}
        </div>
        <StyledCard className="mt-5">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Designed for interoperability
              </p>
              <h2 className="mt-3 text-2xl font-semibold">One layer. Many ecosystems.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Solana is our first home. The adapter model keeps the protocol ready for other networks, attestations, and data sources.
              </p>
            </div>
            <Button href="/developers/docs">
              Read technical docs <ArrowRight className="size-4" />
            </Button>
          </div>
        </StyledCard>
      </div>
    </Shell>
  );
}

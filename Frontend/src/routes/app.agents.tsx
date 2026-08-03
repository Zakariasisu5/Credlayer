import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Bot, ShieldCheck, AlertTriangle } from "lucide-react";
import { isAddress } from "viem";
import { useState } from "react";
import { useWalletProfile } from "@/hooks/api/useWallets";
import { shortenAddress } from "@/lib/wallet/useWallet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { CardSkeleton } from "@/components/ui/loading-state";

export const Route = createFileRoute("/app/agents")({
  component: AgentsPage,
  head: () => ({
    meta: [
      { title: "AI Agent Trust · CredLayer" },
      {
        name: "description",
        content:
          "Verify autonomous AI agents with on-chain behavior history, trust scores, and risk signals from the CredLayer reputation protocol.",
      },
      { property: "og:title", content: "AI Agent Trust · CredLayer" },
      {
        property: "og:description",
        content: "Verify autonomous agents before delegating on-chain authority.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/agents" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/agents" }],
  }),
});

function AgentsPage() {
  const [addr, setAddr] = useState("");
  const [submitted, setSubmitted] = useState("");
  const valid = isAddress(addr.trim());

  const { data, isLoading, isError, error, refetch } = useWalletProfile(submitted);
  const agent = data?.data;

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-w-0">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-accent">AI Agents</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Verify autonomous agents</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Every AI agent that acts on-chain needs verifiable behavior history. CredLayer computes
          trust scores for agent wallets from their attested actions.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) setSubmitted(addr.trim());
        }}
        className="glass-strong rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"
      >
        <div className="glass flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
          <Bot className="size-4 shrink-0 text-accent" />
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="Agent wallet 0x…"
            className="bg-transparent outline-none w-full min-w-0 font-mono text-sm"
          />
        </div>
        <Button type="submit" variant="gold" disabled={!valid} className="w-full sm:w-auto">
          Verify agent
        </Button>
      </form>

      {!submitted && (
        <div className="glass rounded-2xl">
          <EmptyState
            icon={Bot}
            title="No agent selected"
            description="Enter an agent wallet address to load its verified trust profile. CredLayer does not maintain a curated agent list — every result comes from live on-chain attestations."
          />
        </div>
      )}

      {submitted && isLoading && <CardSkeleton />}

      {submitted && isError && <ErrorState error={error as Error} onRetry={() => refetch()} />}

      {submitted && !isLoading && !isError && !agent && (
        <div className="glass rounded-2xl">
          <EmptyState
            icon={AlertTriangle}
            title="No trust record found"
            description="This agent wallet has no attested behavior history on the CredLayer network yet."
          />
        </div>
      )}

      {agent && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-5 sm:p-8 min-w-0"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="glass rounded-2xl p-4 shrink-0">
                <Bot className="size-8 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Agent identity
                </div>
                <div className="font-mono text-base sm:text-lg mt-0.5 break-all">
                  {shortenAddress(agent.address, 8)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{agent.tier} reputation</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-success/15 text-success text-xs px-2.5 py-1 font-medium flex items-center gap-1.5">
                <ShieldCheck className="size-3" /> On-chain verified
              </span>
              <span
                className={`rounded-full text-xs px-2.5 py-1 font-medium ${
                  agent.risk === "Low"
                    ? "bg-success/15 text-success"
                    : agent.risk === "Medium"
                      ? "bg-warn/15 text-warn"
                      : "bg-danger/15 text-danger"
                }`}
              >
                {agent.risk} risk
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
            <BigStat label="Trust Score" value={`${agent.trust}%`} />
            <BigStat label="Reputation" value={String(agent.score)} />
            <BigStat label="Signals" value={String(agent.signals)} />
            <BigStat label="History" value={`${agent.ageYears}y`} />
          </div>

          {agent.aiSummary && (
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{agent.aiSummary}</p>
          )}
        </motion.div>
      )}

      <div className="glass rounded-2xl p-4 sm:p-6 flex gap-4">
        <AlertTriangle className="size-5 text-warn shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          Agent verification is advisory. Always review contract approvals and operator keys before
          delegating on-chain authority. CredLayer never custodies agent funds.
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl sm:text-3xl font-semibold text-gold font-mono">{value}</div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ShieldCheck, TrendingUp, Activity, Bot, ArrowUpRight, Wallet as WalletIcon,
  Sparkles, CheckCircle2, ExternalLink, Copy, AlertTriangle,
} from "lucide-react";
import { useWalletSession } from "@/lib/wallet/session";
import { useReputation, useWalletActivity, useWalletDataSync } from "@/lib/wallet/useWalletData";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton";
import { formatNum, formatUsd } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Reputation Dashboard · CredLayer" },
      { name: "description", content: "Live reputation score, behavioral metrics, and activity for your connected wallet." },
      { property: "og:title", content: "Reputation Dashboard · CredLayer" },
      { property: "og:description", content: "Live reputation score, behavioral metrics, and activity for your connected wallet." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const s = useWalletSession();
  useWalletDataSync();
  const { data: p, isLoading, isError, error, refetch } = useReputation();
  const { data: activity } = useWalletActivity();

  if (s.restoring) return <DashboardSkeleton />;
  if (!s.authenticated || !s.address) return <ConnectPrompt />;
  if (isLoading || !p) return <DashboardSkeleton label="Loading your reputation data…" />;

  if (isError) {
    return (
      <div className="glass-strong rounded-2xl p-8 max-w-xl mx-auto mt-16 text-center">
        <AlertTriangle className="mx-auto size-6 text-warn" />
        <h2 className="mt-3 text-lg font-semibold">We couldn't load your reputation data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "The reputation service is temporarily unavailable."}
        </p>
        <Button variant="gold" size="sm" className="mt-5" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const identity = {
    chain: s.chain === "sol" ? "Solana" : "EVM",
    address: s.address,
    displayAddress: s.displayAddress,
    walletName: s.walletName ?? "Wallet",
    network: s.networkLabel,
    balance: s.balanceLabel,
  };


  return (
    <div className="max-w-7xl mx-auto space-y-4 min-w-0">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Dashboard</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Reputation Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live reputation score, behavioral signals, and activity for your connected wallet.
        </p>
      </div>

      {/* Wallet identity card */}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 min-w-0"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="glass rounded-xl p-3 shrink-0">
            <WalletIcon className="size-5 text-gold" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Connected wallet</span>
              <span className="rounded bg-elevated-strong px-1.5 py-0.5 font-mono normal-case tracking-normal text-[10px]">
                {identity.chain}
              </span>
              <span className="text-muted-foreground/80 normal-case tracking-normal">
                · {identity.walletName}
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm mt-0.5 flex items-center gap-2 min-w-0 break-all">
              {identity.displayAddress}
              <button
                onClick={() => navigator.clipboard.writeText(identity.address)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Copy address"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-success/15 text-success text-xs px-2.5 py-1 font-medium flex items-center gap-1.5">
            <ShieldCheck className="size-3" /> Ownership verified
          </span>
          <span className="glass rounded-full text-xs px-2.5 py-1">{identity.network}</span>
          {identity.balance && (
            <span className="glass rounded-full text-xs px-2.5 py-1 font-mono">{identity.balance}</span>
          )}
          <span className="glass rounded-full text-xs px-2.5 py-1">
            Age <span className="font-mono">{p.ageYears}y</span>
          </span>
          <span className="glass rounded-full text-xs px-2.5 py-1">
            Chains <span className="font-mono">{p.chains}</span>
          </span>
          {s.explorerUrl && (
            <Button variant="glass" size="sm" asChild>
              <a href={s.explorerUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" /> View on chain
              </a>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Score + metrics + agent trust */}
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Reputation Score</div>
            <span className={`rounded-full text-[10px] px-2 py-0.5 font-medium ${
              p.risk === "Low" ? "bg-success/15 text-success" :
              p.risk === "Medium" ? "bg-warn/15 text-warn" : "bg-danger/15 text-danger"
            }`}>{p.risk} risk</span>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-4 sm:gap-6">
            <ScoreRing score={p.score} />
            <div>
              <div className="text-xs text-muted-foreground">Tier</div>
              <div className="text-2xl font-semibold text-gold">{p.tier}</div>
              <div className="mt-3 text-xs text-success flex items-center gap-1">
                <TrendingUp className="size-3.5" /> Trust {p.trust}%
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Stat k="Signals" v={formatNum(p.signals)} />
            <Stat k="Tx / 30d" v={formatNum(p.tx30d)} />
            <Stat k="Volume" v={formatUsd(p.volumeUsd)} />
          </div>
        </div>

        <div className="lg:col-span-4 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Behavioral Metrics</div>
            <Activity className="size-4 text-accent" />
          </div>
          <ul className="mt-5 space-y-4">
            {(p.metrics ?? []).map((m) => (
              <li key={m.key}>
                <div className="flex justify-between text-xs">
                  <span>{m.key}</span>
                  <span className="font-mono text-muted-foreground">{m.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-elevated] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor:
                      m.tone === "gold" ? "oklch(0.82 0.15 85)" :
                      m.tone === "azure" ? "oklch(0.65 0.14 240)" :
                      m.tone === "success" ? "oklch(0.68 0.16 150)" :
                      "oklch(0.75 0.14 70)"
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Agent</div>
            <span className="rounded-full bg-accent/15 text-accent text-[10px] px-2 py-0.5 font-medium">Available</span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="glass-strong rounded-xl p-2.5"><Bot className="size-5 text-accent" /></div>
            <div>
              <div className="text-sm">Agent verification</div>
              <div className="text-[11px] text-muted-foreground">Delegate reputation</div>
            </div>
          </div>
          <div className="mt-5 text-xs text-muted-foreground">Delegable trust</div>
          <div className="mt-1 text-3xl font-semibold text-accent">{p.trust}%</div>
          <Button variant="glass" size="sm" className="mt-4 w-full" asChild>
            <Link to="/app/agents">Verify an agent</Link>
          </Button>
        </div>
      </div>

      {/* AI summary + credentials */}
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5 text-gold" /> AI Reputation Summary
          </div>
          <p className="mt-4 text-sm text-foreground/90 leading-relaxed">{p.aiSummary}</p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { k: "Wallet age", v: `${p.ageYears}y` },
              { k: "Chains", v: p.chains },
              { k: "Contracts", v: p.contracts },
              { k: "Signals", v: p.signals },
            ].map((s) => <Stat key={s.k} k={s.k} v={String(s.v)} />)}
          </div>
        </div>

        <div className="lg:col-span-5 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Verified Credentials</div>
            <button className="text-[11px] text-gold flex items-center gap-1 hover:brightness-110">
              View all <ArrowUpRight size={14} className="text-current" />
            </button>
          </div>
          <ul className="mt-4 space-y-2.5">
            {(p.credentials ?? []).map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-success shrink-0" />
                <span className="text-foreground/90">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Reputation Timeline</div>
        <ol className="relative border-l border-border pl-6 space-y-4">
          {(activity ?? []).map((a) => (
            <li key={a.id}>
              <span className="absolute -left-1.5 size-3 rounded-full bg-gold ring-4 ring-gold/10" />
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="break-words">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.meta}</div>
                </div>
                <div className="font-mono text-xs text-muted-foreground shrink-0">{a.time}</div>
              </div>
            </li>
          ))}
          {!activity?.length && (
            <li className="text-sm text-muted-foreground">No recent wallet activity yet.</li>
          )}
        </ol>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-inset px-3 py-2">
      <div className="text-muted-foreground text-[10px] uppercase tracking-widest">{k}</div>
      <div className="font-mono">{v}</div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const size = 128;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, score / 1000);
  const dash = c * pct;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="dashring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 85)" />
            <stop offset="100%" stopColor="oklch(0.65 0.14 240)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--elevated-strong)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#dashring)" strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold font-mono">{score}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 1000</div>
      </div>
    </div>
  );
}

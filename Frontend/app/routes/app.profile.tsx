import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Share2, Copy, Check, ExternalLink, Shield, Network, Coins, Activity } from "lucide-react";
import { useState } from "react";
import { shortenAddress } from "@/lib/wallet/useWallet";
import { useWalletSession } from "@/lib/wallet/session";
import { useReputation, useWalletActivity } from "@/lib/wallet/useWalletData";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNum, formatUsd } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Wallet Reputation Profile · CredLayer" },
      {
        name: "description",
        content:
          "Your portable CredLayer wallet profile: reputation score, tier, risk level, behavior signals, and verified credentials.",
      },
      { property: "og:title", content: "Wallet Reputation Profile · CredLayer" },
      {
        property: "og:description",
        content: "A portable, shareable on-chain reputation profile for your wallet.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/profile" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/profile" }],
  }),
});

function ProfilePage() {
  const s = useWalletSession();
  const [copied, setCopied] = useState(false);
  const { data: p, isLoading, isError, error, refetch } = useReputation();
  const { data: activity } = useWalletActivity();

  if (s.restoring) return <DashboardSkeleton />;
  if (!s.authenticated || !s.address)
    return <ConnectPrompt title="Connect your wallet to view your profile" />;
  if (isError) return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  if (isLoading || !p) return <DashboardSkeleton label="Loading your profile…" />;

  const address = s.address;
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/app/explorer?q=${address}` : "";

  const share = async () => {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-5 sm:p-8 relative overflow-hidden"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Wallet Profile
            </div>
            <div className="mt-2 font-mono text-lg sm:text-2xl break-all">
              {shortenAddress(address, 10)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <Network className="size-3.5" /> {s.networkLabel}
              </span>
              <span>·</span>
              <span>{p.chains} chains active</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="glass" size="sm" onClick={share}>
              {copied ? <Check className="size-4 text-success" /> : <Share2 className="size-4" />}
              {copied ? "Link copied" : "Share reputation"}
            </Button>
            {s.explorerUrl && (
              <Button variant="glass" size="sm" asChild>
                <a href={s.explorerUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" /> View on chain
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <BigStat label="Score" value={String(p.score)} tone="gold" />
          <BigStat label="Tier" value={p.tier} tone="brand" />
          <BigStat
            label="Risk"
            value={p.risk}
            tone={p.risk === "Low" ? "success" : p.risk === "Medium" ? "warn" : "danger"}
          />
          <BigStat label="Trust" value={`${p.trust}%`} tone="azure" />
        </div>
      </motion.div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel icon={<Coins className="size-4 text-gold" />} title="On-chain footprint">
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { label: "Transactions (30d)", value: formatNum(p.tx30d) },
              { label: "Volume (30d)", value: formatUsd(p.volumeUsd) },
              { label: "Contracts interacted", value: formatNum(p.contracts) },
              { label: "Reputation signals", value: formatNum(p.signals) },
            ].map((r) => (
              <li
                key={r.label}
                className="flex justify-between border-b border-border py-2 last:border-0"
              >
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-mono">{r.value}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon={<Shield className="size-4 text-success" />} title="Behavior signals">
          {p.metrics?.length ? (
            <ul className="mt-3 space-y-3 text-sm">
              {p.metrics.map((m) => (
                <li key={m.key}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{m.key}</span>
                    <span className="font-mono">{m.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-elevated-strong overflow-hidden">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${m.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No behavior signals computed for this wallet yet.
            </p>
          )}
        </Panel>

        <Panel icon={<Network className="size-4 text-gold" />} title="Verified credentials">
          {p.credentials?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.credentials.map((c) => (
                <span key={c} className="glass rounded-full text-xs px-2.5 py-1">
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No credentials attested to this wallet yet.
            </p>
          )}
        </Panel>

        <Panel icon={<Activity className="size-4 text-accent" />} title="Recent activity">
          {activity?.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {activity.slice(0, 6).map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-3 border-b border-border py-2 last:border-0"
                >
                  <span className="min-w-0 truncate">{a.label}</span>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">{a.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="py-6"
              title="No activity yet"
              description="Activity appears here as soon as it is indexed for this wallet."
            />
          )}
        </Panel>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Public profile URL
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-inset px-3 py-2.5">
          <span className="font-mono text-xs truncate">{publicUrl}</span>
          <button
            onClick={share}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Copy profile link"
          >
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Shareable link — anyone can view your reputation score, credentials, and trust history
          without connecting a wallet.
        </p>
      </div>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function BigStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gold" | "brand" | "azure" | "success" | "warn" | "danger";
}) {
  const cls =
    tone === "gold"
      ? "text-gold"
      : tone === "success"
        ? "text-success"
        : tone === "warn"
          ? "text-warn"
          : tone === "danger"
            ? "text-danger"
            : "text-accent";
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl sm:text-3xl font-semibold ${cls}`}>{value}</div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search, ShieldCheck, Compass } from "lucide-react";
import { useState } from "react";
import { useWalletProfile } from "@/hooks/api/useWallets";
import { shortenAddress } from "@/lib/wallet/useWallet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { CardSkeleton } from "@/components/ui/loading-state";

export const Route = createFileRoute("/app/explorer")({
  component: ExplorerPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({
    meta: [
      { title: "Reputation Explorer · CredLayer" },
      {
        name: "description",
        content:
          "Look up any wallet or agent identifier and view its CredLayer reputation score, behavior signals, and verified credentials.",
      },
      { property: "og:title", content: "Reputation Explorer · CredLayer" },
      {
        property: "og:description",
        content: "Search wallets and agents on the CredLayer reputation network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/explorer" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/explorer" }],
  }),
});

function ExplorerPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [submitted, setSubmitted] = useState(q ?? "");

  const { data, isLoading, isError, error, refetch } = useWalletProfile(submitted.trim());
  const profile = data?.data;

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-w-0">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Explorer</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Reputation Explorer</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Search any wallet address, ENS name, or agent identifier. Reputation is portable and
          public — no connection required.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query.trim());
        }}
        className="glass-strong rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"
      >
        <div className="glass flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wallet address, ENS name, or agent id"
            className="bg-transparent outline-none w-full min-w-0 font-mono text-sm"
          />
        </div>
        <Button type="submit" variant="gold" className="h-11 w-full sm:w-auto">
          Search
        </Button>
      </form>

      {!submitted && (
        <div className="glass rounded-2xl">
          <EmptyState
            icon={Compass}
            title="Nothing indexed to show yet"
            description="Search for a wallet or agent identifier to load its reputation profile from the CredLayer network."
          />
        </div>
      )}

      {submitted && isLoading && (
        <div className="grid gap-3 lg:grid-cols-3">
          <CardSkeleton />
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
        </div>
      )}

      {submitted && isError && (
        <ErrorState error={error as Error} onRetry={() => refetch()} />
      )}

      {submitted && !isLoading && !isError && !profile && (
        <div className="glass rounded-2xl">
          <EmptyState
            icon={Search}
            title="No results found"
            description="This identifier has no reputation record on the CredLayer network yet."
          />
        </div>
      )}

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 lg:grid-cols-3"
        >
          <div className="glass rounded-2xl p-4 sm:p-6 lg:col-span-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Wallet</div>
            <div className="mt-1 font-mono text-sm break-all">
              {shortenAddress(profile.address, 8)}
            </div>
            <div className="mt-6 text-5xl sm:text-6xl font-semibold text-gold font-mono">
              {profile.score}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">/ 1000 · {profile.tier}</div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <MiniStat k="Trust" v={`${profile.trust}%`} />
              <MiniStat k="Risk" v={profile.risk} />
              <MiniStat k="Age" v={`${profile.ageYears}y`} />
              <MiniStat k="Chains" v={String(profile.chains)} />
            </div>
          </div>

          <div className="glass rounded-2xl p-4 sm:p-6 lg:col-span-2 min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Behavior breakdown
            </div>
            {profile.metrics?.length ? (
              <ul className="mt-4 space-y-4">
                {profile.metrics.map((m) => (
                  <li key={m.key}>
                    <div className="flex justify-between text-sm">
                      <span>{m.key}</span>
                      <span className="font-mono text-muted-foreground">{m.value}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-elevated] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gold"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No behavior signals available for this address.
              </p>
            )}

            <div className="mt-5 text-xs text-muted-foreground uppercase tracking-widest">
              Credentials
            </div>
            {profile.credentials?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.credentials.map((c) => (
                  <span
                    key={c}
                    className="glass rounded-full text-xs px-2.5 py-1 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="size-3 text-success" /> {c}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No verified credentials found.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-inset px-3 py-2">
      <div className="text-muted-foreground text-[10px] uppercase tracking-widest">{k}</div>
      <div className="font-mono">{v}</div>
    </div>
  );
}

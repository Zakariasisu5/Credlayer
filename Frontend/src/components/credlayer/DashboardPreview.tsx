import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Activity,
  Bot,
  ArrowUpRight,
  Wallet as WalletIcon,
  BadgeCheck,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Landing section describing the dashboard modules.
 * Intentionally contains no scores, metrics, or sample records — every number in
 * CredLayer comes from the reputation API once a wallet is connected.
 */

const MODULES = [
  {
    icon: LineChart,
    title: "Reputation score",
    body: "A single 0–1000 score with tier and risk level, recomputed from live on-chain behavior across every connected network.",
  },
  {
    icon: Activity,
    title: "Behavioral metrics",
    body: "DeFi engagement, protocol diversity, sybil resistance, and volatility exposure — each derived from indexed activity, never estimated.",
  },
  {
    icon: Bot,
    title: "AI agent trust",
    body: "Verify autonomous agent wallets before delegating authority, with attested action history and permission analysis.",
  },
  {
    icon: BadgeCheck,
    title: "Verified credentials",
    body: "Portable attestations issued by identity providers, DAOs, and protocols — signed, revocable, and wallet-bound.",
  },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">The Dashboard</div>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold">
            A control room for on-chain reputation.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Monitor scores, credentials, and behavioral signals in real time — for a single wallet,
            an AI agent, or an entire network. Connect a wallet to load your own data; CredLayer
            never displays simulated results.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative rounded-3xl p-3 md:p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-inset px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-danger/70" />
                <span className="size-2.5 rounded-full bg-warn/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
              </div>
              <div className="glass flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs">
                <WalletIcon className="size-3.5 text-gold" />
                No wallet connected
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-gold" />
              Signature-based sign-in · read-only
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {MODULES.map((m) => (
              <div key={m.title} className="glass rounded-2xl p-5 sm:p-6 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="glass-strong rounded-xl p-2.5 shrink-0">
                    <m.icon className="size-5 text-gold" />
                  </div>
                  <div className="text-sm font-medium">{m.title}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-inset px-4 py-4">
            <p className="flex-1 text-sm text-muted-foreground">
              Connect a wallet to load your live reputation dashboard.
            </p>
            <Button asChild variant="gold" size="sm">
              <Link to="/app">
                Open dashboard
                <ArrowUpRight size={14} className="text-current" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

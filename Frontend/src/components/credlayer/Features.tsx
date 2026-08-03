import { motion } from "motion/react";
import {
  Gauge, BrainCircuit, Activity, FileClock, Fingerprint, Code2,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Wallet Reputation Score",
    desc: "A single portable score (0–1000) that summarizes on-chain trustworthiness across every EVM and non-EVM chain.",
    tone: "gold",
  },
  {
    icon: BrainCircuit,
    title: "AI Agent Trust Verification",
    desc: "Verifiable identity and behavior attestations for autonomous agents transacting on behalf of users.",
    tone: "azure",
  },
  {
    icon: Activity,
    title: "On-chain Behavior Analysis",
    desc: "Real-time signals: DeFi engagement, protocol diversity, sybil resistance, and anomaly detection.",
    tone: "gold",
  },
  {
    icon: FileClock,
    title: "Transparent Credit History",
    desc: "An auditable, tamper-proof record of every reputation-affecting event, exportable on demand.",
    tone: "azure",
  },
  {
    icon: Fingerprint,
    title: "Decentralized Identity",
    desc: "Bind wallets, ENS, ZK-attestations, and off-chain credentials to one sovereign CredLayer DID.",
    tone: "gold",
  },
  {
    icon: Code2,
    title: "Reputation APIs",
    desc: "REST, GraphQL, and streaming endpoints that drop reputation into any Web3 app in under 5 minutes.",
    tone: "azure",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold">The Protocol</div>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold">
            One trust layer for every wallet, user, and agent.
          </h2>
          <p className="mt-4 text-muted-foreground">
            CredLayer aggregates on-chain behavior, verifiable credentials, and social
            attestations into a portable reputation primitive that any Web3 application
            can consume.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isGold = f.tone === "gold";
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative"
              >
                <div className="glass-strong h-full rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-card-hover">
                  <div
                    className={
                      "inline-flex size-11 items-center justify-center rounded-xl " +
                      (isGold
                        ? "bg-gold/10 text-gold ring-1 ring-inset ring-gold/20"
                        : "bg-accent/10 text-accent ring-1 ring-inset ring-accent/20")
                    }
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletSession } from "@/lib/wallet/session";
import { UnifiedConnectButton } from "@/components/wallet/UnifiedConnectButton";

export function ConnectPrompt({
  title = "Connect your wallet to continue",
  description = "CredLayer needs a signed message to verify wallet ownership before generating your reputation profile. No transactions, no gas.",
}: {
  title?: string;
  description?: string;
}) {
  const s = useWalletSession();

  if (s.restoring) {
    return (
      <div className="glass-strong rounded-3xl p-10 max-w-2xl mx-auto text-center mt-16">
        <Loader2 className="mx-auto size-6 animate-spin text-gold" />
        <p className="mt-4 text-sm text-muted-foreground">Restoring your wallet…</p>
      </div>
    );
  }

  const needsSignature = s.isConnected && !s.authenticated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-10 max-w-2xl mx-auto text-center mt-16"
    >
      <div className="mx-auto size-14 rounded-2xl glass flex items-center justify-center mb-6">
        <ShieldAlert className="size-6 text-gold" />
      </div>
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="mt-3 text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {needsSignature ? (
          <Button variant="gold" size="lg" className="h-11 px-6" onClick={() => s.authenticate()} disabled={s.signing}>
            {s.signing ? "Waiting for signature…" : "Sign to verify wallet"}
          </Button>
        ) : (
          <UnifiedConnectButton size="lg" />
        )}
      </div>
      {s.error && <p className="mt-4 text-xs text-danger">{s.error}</p>}

      <ol className="mt-10 grid gap-3 text-left text-sm sm:grid-cols-2 sm:grid-cols-4">
        {["Connect wallet", "Sign auth message", "Verify ownership", "Generate profile"].map((step, i) => (
          <li key={step} className="glass rounded-xl px-3 py-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
            <div className="mt-1 text-sm">{step}</div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

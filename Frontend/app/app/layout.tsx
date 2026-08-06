"use client";

import { AppShell } from "@/components/app/AppShell";
import { WalletProvider } from "@/lib/wallet/WalletProvider";
import { WalletSessionProvider } from "@/lib/wallet/session";
import { SolanaProvider } from "@/lib/wallet/solana/SolanaProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <SolanaProvider>
        <WalletSessionProvider>
          <AppShell>{children}</AppShell>
        </WalletSessionProvider>
      </SolanaProvider>
    </WalletProvider>
  );
}

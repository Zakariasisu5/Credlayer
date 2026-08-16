"use client";

import { ThemeToggle } from "./Frontend/app/components/theme-toggle";
import { ClusterSelect } from "./Frontend/app/components/cluster-select";
import { WalletButton } from "./Frontend/app/components/wallet-button";

export function AppHeader() {
  return (
    <header className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
      <span className="text-sm font-semibold tracking-tight">
        Solana Kit Starter
      </span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ClusterSelect />
        <WalletButton />
      </div>
    </header>
  );
}

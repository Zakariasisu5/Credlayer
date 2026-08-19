"use client";

import { Wallet } from "lucide-react";
import { Button } from "../ui";

export function NoWallet() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-transparent border border-primary/40 p-6 mb-6">
        <Wallet className="size-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Connect your Solana wallet to view your CredLayer reputation, trust score, and verifiable credentials.
      </p>
      <Button>Connect Wallet</Button>
    </div>
  );
}

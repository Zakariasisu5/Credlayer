"use client";

import { UserRound } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useTrustScore, useCredentials, useConnections } from "../../lib/hooks";

export function ProfilePage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  // Fetch real data from backend (same hooks as dashboard for consistency)
  const { data: trustScore, isLoading: scoreLoading } = useTrustScore(walletAddress);
  const { data: credentials, isLoading: credentialsLoading } = useCredentials(walletAddress);
  const { data: connections, isLoading: connectionsLoading } = useConnections(walletAddress);

  // Calculate stats
  const verifiedSignals = trustScore?.signals.filter(s => s.verified).length ?? 0;
  const connectionCount = connections?.totalCount ?? 0;
  const credentialCount = credentials?.length ?? 0;
  const verifiedCredentials = credentials?.filter(c => c.verificationStatus === 'verified').length ?? 0;

  const hasData = walletAddress && (verifiedSignals > 0 || connectionCount > 0 || credentialCount > 0);

  return (
    <Shell title="Profile" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Your identity, your permissions.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Stat 
            label="Verified signals" 
            value={scoreLoading ? "..." : verifiedSignals > 0 ? verifiedSignals.toString() : "—"}
            note={walletAddress ? (verifiedSignals > 0 ? "Trust score signals" : "No signals yet") : "Connect wallet"}
          />
          <Stat 
            label="Trust connections" 
            value={connectionsLoading ? "..." : connectionCount > 0 ? connectionCount.toString() : "—"}
            note={walletAddress ? (connectionCount > 0 ? "Linked identities" : "No connections yet") : "Connect wallet"}
          />
          <Stat 
            label="Credentials" 
            value={credentialsLoading ? "..." : credentialCount > 0 ? credentialCount.toString() : "—"}
            note={walletAddress ? (credentialCount > 0 ? `${verifiedCredentials} verified` : "No credentials yet") : "Connect wallet"}
          />
        </div>
        <div className="mt-5">
          {!walletAddress ? (
            <Empty
              icon={UserRound}
              title="No wallet connected"
              description="Connect your wallet to view your profile data and identity verification status."
            />
          ) : !hasData ? (
            <Empty
              icon={UserRound}
              title="No profile data yet"
              description="This workspace is connected to the CredLayer protocol. Issue an attestation or verify credentials to see your profile data."
            />
          ) : (
            <div className="rounded-lg border border-border bg-background/50 p-6">
              <h3 className="mb-4 font-semibold">Profile Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wallet Address</span>
                  <span className="font-mono text-xs text-primary">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </span>
                </div>
                {trustScore && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-semibold text-primary">{trustScore.score}</span>
                  </div>
                )}
                {trustScore && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="text-muted-foreground">{trustScore.confidence}%</span>
                  </div>
                )}
                {credentials && credentials.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verification Status</span>
                    <span className={verifiedCredentials > 0 ? "text-green-500" : "text-amber-400"}>
                      {verifiedCredentials > 0 ? "Verified" : "Pending"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}


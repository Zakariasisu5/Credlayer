"use client";

import { UserRound, RefreshCw } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";
import { useWalletData } from "../../hooks/use-wallet-data";

export function ProfilePage() {
  const { data, loading, error, exists, refetch, walletAddress } = useWalletData();

  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Profile" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Your identity and verification status.
          </p>
          {walletAddress && (
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>

        {loading && !data ? (
          <div className="rounded-lg border border-border bg-background/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Loading wallet data...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !walletAddress ? (
          <Empty
            icon={UserRound}
            title="No wallet connected"
            description="Connect your Solana wallet to view your CredLayer profile and verification status."
          />
        ) : !hasAttestation ? (
          <Empty
            icon={UserRound}
            title="No CredLayer attestation"
            description="You haven't created a CredLayer attestation yet. Go to the Dashboard to get your trust score and create your on-chain attestation."
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3 mb-6">
              <Stat 
                label="Trust Score" 
                value={data.score.trustScore.toString()}
                note={`${data.score.trustScore} / 1000`}
              />
              <Stat 
                label="Risk Level" 
                value={data.score.riskLevel}
                note={`${data.score.trustLevel ? data.score.trustLevel.toUpperCase() + ' trust' : 'Risk assessment'}`}
              />
              {data.score.confidence !== undefined && (
                <Stat 
                  label="Confidence" 
                  value={`${(data.score.confidence * 100).toFixed(1)}%`}
                  note="Model confidence"
                />
              )}
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-6 space-y-4">
              <h3 className="font-semibold">Wallet Information</h3>
              
              <div className="grid gap-3 text-sm">
                <div className="flex items-start justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Wallet Address</span>
                  <span className="font-mono text-xs text-primary break-all text-right max-w-[60%]">
                    {walletAddress}
                  </span>
                </div>

                {data.score.network && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Network</span>
                    <span className="capitalize">{data.score.network}</span>
                  </div>
                )}

                {data.attestation.verified && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Attestation Status</span>
                    <span className="text-green-500 font-medium">Verified On-Chain</span>
                  </div>
                )}

                {data.attestationPda && (
                  <div className="flex items-start justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Attestation PDA</span>
                    <span className="font-mono text-xs break-all text-right max-w-[60%]">
                      {data.attestationPda}
                    </span>
                  </div>
                )}

                {data.txHash && (
                  <div className="flex items-start justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-xs break-all text-right max-w-[60%]">
                      {data.txHash}
                    </span>
                  </div>
                )}

                {data.score.fraudProbability !== undefined && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Fraud Probability</span>
                    <span>{(data.score.fraudProbability * 100).toFixed(2)}%</span>
                  </div>
                )}

                {data.timestamp && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-xs">{new Date(data.timestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {data.score.explanation && (
              <div className="mt-6 rounded-lg border border-border bg-background/50 p-6">
                <h3 className="mb-3 font-semibold">Analysis Explanation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.score.explanation}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}


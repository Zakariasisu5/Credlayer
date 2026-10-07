"use client";

import { Sparkles, RefreshCw } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";
import { useWalletData } from "../../hooks/use-wallet-data";

export function AgentsPage() {
  const { data, loading, error, exists, refetch } = useWalletData();

  const walletAddress = data?.walletAddress;
  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Agents" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            AI agents acting with your trust credentials.
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
            icon={Sparkles}
            title="No wallet connected"
            description="Connect your Solana wallet to register and manage AI agents."
          />
        ) : !hasAttestation ? (
          <Empty
            icon={Sparkles}
            title="No attestation found"
            description="Create a CredLayer attestation first. Agents will use your trust credentials to act on your behalf."
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3 mb-6">
              <Stat 
                label="AI Agents" 
                value="0"
                note="No agents registered"
              />
              <Stat 
                label="Wallet Trust" 
                value={data.score.trustScore.toString()}
                note="Available for agents"
              />
              <Stat 
                label="Risk Level" 
                value={data.score.riskLevel}
                note="Agent authorization"
              />
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-8 text-center">
              <Sparkles className="size-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">No AI agents associated with this wallet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                AI agents will be able to use your CredLayer attestation to perform trusted actions on your behalf. 
                Agent registration and management features are coming soon.
              </p>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Your Current Trust Credentials</h4>
                <div className="grid gap-3 text-sm max-w-md mx-auto">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-semibold">{data.score.trustScore} / 1000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="capitalize">{data.score.riskLevel.toLowerCase()}</span>
                  </div>
                  {data.score.confidence !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Confidence</span>
                      <span>{(data.score.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Attestation Status</span>
                    <span className="text-green-500">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

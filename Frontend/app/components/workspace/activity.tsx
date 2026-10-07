"use client";

import { Activity as ActivityIcon, RefreshCw, CheckCircle2 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat } from "../shared/common-components";
import { useWalletData } from "../../hooks/use-wallet-data";

export function ActivityPage() {
  const { data, loading, error, exists, refetch } = useWalletData();

  const walletAddress = data?.walletAddress;
  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Activity" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Your wallet's verification and attestation history.
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
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !walletAddress ? (
          <Empty
            icon={ActivityIcon}
            title="No wallet connected"
            description="Connect your Solana wallet to view your activity feed and protocol events."
          />
        ) : !hasAttestation ? (
          <Empty
            icon={ActivityIcon}
            title="No activity found"
            description="Create a CredLayer attestation to start tracking your wallet's verification and credential activity."
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3 mb-6">
              <Stat 
                label="Total Events" 
                value="1"
                note="Attestation created"
              />
              <Stat 
                label="Status" 
                value="Active"
                note="Verified on-chain"
              />
              <Stat 
                label="Last Updated" 
                value={new Date(data.timestamp).toLocaleDateString()}
                note={new Date(data.timestamp).toLocaleTimeString()}
              />
            </div>

            <div className="rounded-lg border border-border bg-background/50">
              <div className="border-b border-border p-4">
                <h3 className="font-semibold">Activity Feed</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Wallet-specific events and verification history
                </p>
              </div>

              <div className="p-4 space-y-3">
                {/* Attestation Creation Event */}
                <div className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-4">
                  <div className="mt-1 size-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="size-4 text-primary" />
                      <h4 className="font-semibold text-sm">Attestation Created</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">
                        success
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.attestation.alreadyExisted 
                        ? 'Existing attestation verified and loaded'
                        : 'New trust attestation created on-chain'}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Trust Score</span>
                        <span className="font-semibold text-primary">{data.score.trustScore}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Risk</span>
                        <span className="capitalize">{data.score.riskLevel.toLowerCase()}</span>
                      </span>
                      <span>{new Date(data.timestamp).toLocaleString()}</span>
                    </div>

                    {/* Event Details */}
                    <details className="mt-3">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">
                        View details
                      </summary>
                      <div className="mt-2 p-3 rounded bg-background border border-border">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Wallet Address:</span>
                            <span className="font-mono break-all text-right max-w-[60%]">{walletAddress}</span>
                          </div>
                          {data.attestationPda && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Attestation PDA:</span>
                              <span className="font-mono break-all text-right max-w-[60%]">{data.attestationPda}</span>
                            </div>
                          )}
                          {data.txHash && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Transaction:</span>
                              <span className="font-mono break-all text-right max-w-[60%]">{data.txHash}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trust Score:</span>
                            <span className="font-semibold">{data.score.trustScore} / 1000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Level:</span>
                            <span className="capitalize">{data.score.riskLevel.toLowerCase()}</span>
                          </div>
                          {data.score.confidence !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confidence:</span>
                              <span>{(data.score.confidence * 100).toFixed(1)}%</span>
                            </div>
                          )}
                          {data.score.network && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Network:</span>
                              <span className="capitalize">{data.score.network}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Activity tracking is currently limited to attestation events. 
                  Future updates will include detailed transaction history, score updates, and credential lifecycle events.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

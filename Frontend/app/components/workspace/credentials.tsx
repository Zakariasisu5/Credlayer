"use client";

import { ShieldCheck, RefreshCw } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { useWalletData } from "../../hooks/use-wallet-data";

export function CredentialsPage() {
  const { data, loading, error, exists, refetch } = useWalletData();

  const walletAddress = data?.walletAddress;
  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Credentials" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Your verifiable credentials and attestations.
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
            <p className="text-sm text-muted-foreground">Loading credentials...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !walletAddress ? (
          <Empty
            icon={ShieldCheck}
            title="No wallet connected"
            description="Connect your Solana wallet to view your credentials and attestations."
          />
        ) : !hasAttestation ? (
          <Empty
            icon={ShieldCheck}
            title="No credentials found"
            description="Create a CredLayer attestation first to generate your on-chain verifiable credential."
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3 mb-6">
              <Stat 
                label="Credentials" 
                value="1"
                note="CredLayer Attestation"
              />
              <Stat 
                label="Status" 
                value="Verified"
                note="On-chain verified"
              />
              <Stat 
                label="Network" 
                value={data.score.network || "Solana"}
                note="Blockchain network"
              />
            </div>

            <div className="space-y-4">
              {/* Main CredLayer Attestation Credential */}
              <StyledCard>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="size-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">CredLayer Trust Attestation</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Issued by: CredLayer Protocol
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-semibold mt-1 text-green-500">
                          Active
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Verification</p>
                        <span className="text-xs px-2 py-1 rounded mt-1 inline-block bg-green-500/10 text-green-500">
                          Verified
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Trust Score</p>
                        <p className="text-sm mt-1 font-semibold">
                          {data.score.trustScore} / 1000
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Level</p>
                        <p className="text-sm mt-1 font-semibold capitalize">
                          {data.score.riskLevel.toLowerCase()}
                        </p>
                      </div>
                      {data.score.confidence !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="text-sm mt-1">
                            {(data.score.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                      {data.timestamp && (
                        <div>
                          <p className="text-xs text-muted-foreground">Last Updated</p>
                          <p className="text-sm mt-1">
                            {new Date(data.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Credential Details */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-3">Credential Details</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start justify-between py-1">
                          <span className="text-muted-foreground">Wallet Address</span>
                          <span className="font-mono text-xs break-all text-right max-w-[60%]">
                            {walletAddress}
                          </span>
                        </div>
                        {data.attestationPda && (
                          <div className="flex items-start justify-between py-1">
                            <span className="text-muted-foreground">Attestation PDA</span>
                            <span className="font-mono text-xs break-all text-right max-w-[60%]">
                              {data.attestationPda}
                            </span>
                          </div>
                        )}
                        {data.txHash && (
                          <div className="flex items-start justify-between py-1">
                            <span className="text-muted-foreground">Transaction Hash</span>
                            <span className="font-mono text-xs break-all text-right max-w-[60%]">
                              {data.txHash}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-1">
                          <span className="text-muted-foreground">Network</span>
                          <span className="capitalize">{data.score.network || "Solana"}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-muted-foreground">Verification Method</span>
                          <span>On-Chain Attestation</span>
                        </div>
                      </div>
                    </div>

                    {/* Attestation Metadata */}
                    {(data.score.trustLevel || data.score.fraudProbability !== undefined) && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">Attestation Metadata</p>
                        <div className="text-xs bg-background/50 rounded p-3 space-y-1">
                          {data.score.trustLevel && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trust Level:</span>
                              <span className="capitalize">{data.score.trustLevel}</span>
                            </div>
                          )}
                          {data.score.fraudProbability !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fraud Probability:</span>
                              <span>{(data.score.fraudProbability * 100).toFixed(2)}%</span>
                            </div>
                          )}
                          {data.attestation.alreadyExisted !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{data.attestation.alreadyExisted ? 'Existing' : 'Newly Created'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-green-500">
                        <ShieldCheck className="size-8" />
                      </div>
                      <span className="text-xs text-green-500 font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </StyledCard>

              <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">About Credentials:</strong> Your CredLayer attestation is a verifiable credential stored on-chain. 
                  It proves your trust score and risk assessment in a cryptographically secure way. 
                  This credential can be verified by anyone without revealing your private data.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}


"use client";

import { BarChart3, RefreshCw } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { useWalletData } from "../../hooks/use-wallet-data";

export function AnalysisPage() {
  const { data, loading, error, exists, refetch } = useWalletData();

  const walletAddress = data?.walletAddress;
  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Analysis" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Understand the signals behind your reputation.
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
            <p className="text-sm text-muted-foreground">Loading analysis data...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !walletAddress ? (
          <Empty
            icon={BarChart3}
            title="No wallet connected"
            description="Connect your Solana wallet to view detailed signal analysis and reputation breakdown."
          />
        ) : !hasAttestation ? (
          <Empty
            icon={BarChart3}
            title="No analysis data"
            description="Create a CredLayer attestation first to see detailed trust score analysis and risk assessment."
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-4 mb-6">
              <Stat 
                label="Trust Score" 
                value={data.score.trustScore.toString()}
                note={`${data.score.trustScore} / 1000`}
              />
              <Stat 
                label="Risk Level" 
                value={data.score.riskLevel}
                note={data.score.trustLevel ? data.score.trustLevel.toUpperCase() : undefined}
              />
              {data.score.confidence !== undefined && (
                <Stat 
                  label="Confidence" 
                  value={`${(data.score.confidence * 100).toFixed(1)}%`}
                  note="Model confidence"
                />
              )}
              {data.score.fraudProbability !== undefined && (
                <Stat 
                  label="Fraud Risk" 
                  value={`${(data.score.fraudProbability * 100).toFixed(1)}%`}
                  note="Fraud probability"
                />
              )}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Trust Score Details */}
              <StyledCard>
                <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Trust Score Analysis</h3>
                <div className="space-y-4">
                  <div className="text-center py-6 border-b border-border">
                    <div className="text-5xl font-bold text-primary">{data.score.trustScore}</div>
                    <p className="mt-2 text-sm text-muted-foreground">Overall Trust Score</p>
                    <p className="mt-1 text-xs text-muted-foreground capitalize">
                      {data.score.riskLevel.toLowerCase()} Risk · {data.score.trustLevel || 'Assessment'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {data.score.confidence !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence Level</span>
                        <span className="font-semibold">{(data.score.confidence * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {data.score.fraudProbability !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fraud Probability</span>
                        <span className="font-semibold">{(data.score.fraudProbability * 100).toFixed(2)}%</span>
                      </div>
                    )}
                    {data.score.network && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Network</span>
                        <span className="font-semibold capitalize">{data.score.network}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Attestation Status</span>
                      <span className="font-semibold text-green-500">Verified</span>
                    </div>
                    {data.timestamp && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(data.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </StyledCard>

              {/* Wallet Risk Assessment */}
              <StyledCard>
                <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Risk Category</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        data.score.riskLevel === 'LOW' || data.score.riskLevel === 'MINIMAL' 
                          ? 'bg-green-500/10 text-green-500' 
                          : data.score.riskLevel === 'MEDIUM' 
                          ? 'bg-yellow-500/10 text-yellow-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {data.score.riskLevel}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trust Level</span>
                        <span className="capitalize">{data.score.trustLevel || 'Standard'}</span>
                      </div>
                      {data.attestationPda && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">On-Chain</span>
                          <span className="text-green-500 text-xs">✓ Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {data.score.explanation && (
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                      <h4 className="text-sm font-medium mb-2">Analysis Details</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {data.score.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </StyledCard>

              {/* Verification Details */}
              {data.attestationPda && (
                <StyledCard className="lg:col-span-2">
                  <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Verification Details</h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Wallet Address</span>
                      <span className="font-mono text-xs break-all text-right max-w-[60%]">
                        {walletAddress}
                      </span>
                    </div>
                    <div className="flex items-start justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Attestation PDA</span>
                      <span className="font-mono text-xs break-all text-right max-w-[60%]">
                        {data.attestationPda}
                      </span>
                    </div>
                    {data.txHash && (
                      <div className="flex items-start justify-between py-2">
                        <span className="text-muted-foreground">Transaction</span>
                        <span className="font-mono text-xs break-all text-right max-w-[60%]">
                          {data.txHash}
                        </span>
                      </div>
                    )}
                  </div>
                </StyledCard>
              )}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}


"use client";

import { BarChart3 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useTrustScore, useCredentials, useConnections } from "../../lib/hooks";

export function AnalysisPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  // Use same hooks as profile.tsx for consistency
  const { data: trustScore, isLoading: scoreLoading } = useTrustScore(walletAddress);
  const { data: credentials, isLoading: credentialsLoading } = useCredentials(walletAddress);
  const { data: connections, isLoading: connectionsLoading } = useConnections(walletAddress);

  // Calculate stats (same as profile)
  const verifiedSignals = trustScore?.signals.filter(s => s.verified).length ?? 0;
  const connectionCount = connections?.totalCount ?? 0;
  const credentialCount = credentials?.length ?? 0;
  const verifiedCredentials = credentials?.filter(c => c.verificationStatus === 'verified').length ?? 0;

  const hasData = walletAddress && (verifiedSignals > 0 || connectionCount > 0 || credentialCount > 0);

  return (
    <Shell title="Analysis" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Understand the signals behind your reputation.
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
              icon={BarChart3}
              title="No wallet connected"
              description="Connect your wallet to view signal analysis and reputation breakdown."
            />
          ) : !hasData ? (
            <Empty
              icon={BarChart3}
              title="No analysis data yet"
              description="Issue attestations or verify credentials to see detailed signal analysis and reputation metrics."
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Signal Breakdown */}
              {trustScore && trustScore.signals.length > 0 && (
                <StyledCard>
                  <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Signal Breakdown</h3>
                  <div className="space-y-3">
                    {trustScore.signals.map((signal, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                        <div>
                          <p className="text-sm font-medium">{signal.type}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Weight: {signal.weight}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          signal.verified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {signal.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </StyledCard>
              )}

              {/* Trust Score Details */}
              {trustScore && (
                <StyledCard>
                  <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Trust Score Analysis</h3>
                  <div className="space-y-4">
                    <div className="text-center py-6 border-b border-border">
                      <div className="text-5xl font-bold text-primary">{trustScore.score}</div>
                      <p className="mt-2 text-sm text-muted-foreground">Overall Trust Score</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence Level</span>
                        <span className="font-semibold">{trustScore.confidence}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Signals</span>
                        <span className="font-semibold">{trustScore.signals.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Verified Signals</span>
                        <span className="font-semibold text-green-500">{verifiedSignals}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(trustScore.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </StyledCard>
              )}

              {/* Connections Analysis */}
              {connections && connections.connections.length > 0 && (
                <StyledCard>
                  <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Connection Analysis</h3>
                  <div className="space-y-3">
                    {connections.connections.slice(0, 5).map((conn) => (
                      <div key={conn.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{conn.connectionType}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                            {conn.targetWallet.slice(0, 8)}...{conn.targetWallet.slice(-8)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">Strength: {conn.strength}</p>
                          <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                            conn.verified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {conn.verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </StyledCard>
              )}

              {/* Credentials Summary */}
              {credentials && credentials.length > 0 && (
                <StyledCard>
                  <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Credentials Summary</h3>
                  <div className="space-y-3">
                    {credentials.slice(0, 5).map((cred) => (
                      <div key={cred.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                        <div>
                          <p className="text-sm font-medium">{cred.credentialType}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Issuer: {cred.issuer}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          cred.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-500' : 
                          cred.verificationStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {cred.verificationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </StyledCard>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}


"use client";

import { Shell } from "../layout/app-shell";
import { StyledCard } from "../shared/common-components";
import { Settings as SettingsIcon, RefreshCw } from "lucide-react";
import { useWalletData } from "../../hooks/use-wallet-data";

export function SettingsPage() {
  const { data, loading, error, exists, refetch } = useWalletData();

  const walletAddress = data?.walletAddress;
  const hasAttestation = exists && data !== null;

  return (
    <Shell title="Settings" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage your wallet preferences and settings.
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
          <StyledCard>
            <div className="py-12 text-center">
              <SettingsIcon className="size-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Connect your wallet to access settings
              </p>
            </div>
          </StyledCard>
        ) : (
          <div className="space-y-5">
            {/* Wallet Information */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Wallet Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
                  <p className="text-sm font-mono break-all">
                    {walletAddress}
                  </p>
                </div>

                {hasAttestation ? (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
                      <p className="text-sm font-semibold">
                        {data.score.trustScore} / 1000
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                      <p className="text-sm capitalize">
                        {data.score.riskLevel.toLowerCase()}
                      </p>
                    </div>

                    {data.attestationPda && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Attestation PDA</p>
                        <p className="text-sm font-mono break-all">
                          {data.attestationPda}
                        </p>
                      </div>
                    )}

                    {data.score.network && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Network</p>
                        <p className="text-sm capitalize">
                          {data.score.network}
                        </p>
                      </div>
                    )}

                    {data.timestamp && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                        <p className="text-sm">
                          {new Date(data.timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-4 text-center border border-border rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">
                      No attestation found. Create one from the Dashboard.
                    </p>
                  </div>
                )}
              </div>
            </StyledCard>

            {/* Privacy Settings */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Privacy Settings</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer opacity-60">
                  <span>
                    <span className="block font-medium">Public Profile</span>
                    <span className="text-xs text-muted-foreground">
                      Make your trust score visible to others (Coming soon)
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    disabled
                    className="accent-primary scale-125" 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer opacity-60">
                  <span>
                    <span className="block font-medium">Show Connections</span>
                    <span className="text-xs text-muted-foreground">
                      Display your trust connections (Coming soon)
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    disabled
                    className="accent-primary scale-125" 
                  />
                </label>
              </div>
            </StyledCard>

            {/* Notification Settings */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Notifications</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer opacity-60">
                  <span>
                    <span className="block font-medium">Email Notifications</span>
                    <span className="text-xs text-muted-foreground">
                      Updates for new attestations (Coming soon)
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    disabled
                    className="accent-primary scale-125" 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer opacity-60">
                  <span>
                    <span className="block font-medium">Webhook Notifications</span>
                    <span className="text-xs text-muted-foreground">
                      Send events to endpoints (Coming soon)
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    disabled
                    className="accent-primary scale-125" 
                  />
                </label>
              </div>
            </StyledCard>

            {/* Data Management */}
            {hasAttestation && (
              <StyledCard>
                <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Data Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Clear Cache</p>
                      <p className="text-xs text-muted-foreground">
                        Remove locally stored wallet data
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem(`credlayer_wallet_${walletAddress}`);
                        refetch();
                      }}
                      className="px-3 py-1.5 rounded border border-border text-sm hover:bg-accent transition"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Your attestation data is stored on-chain and cannot be deleted. 
                    Clearing the cache only removes locally stored data for faster loading.
                  </div>
                </div>
              </StyledCard>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

"use client";

import { ShieldCheck, RefreshCw } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useCredentials, reverifyCredential } from "../../lib/hooks";
import { useState } from "react";
import { toast } from "sonner";

export function CredentialsPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const { data: credentials, isLoading, mutate: refreshCredentials } = useCredentials(walletAddress);
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);

  const credentialCount = credentials?.length ?? 0;
  const verifiedCount = credentials?.filter(c => c.verificationStatus === 'verified').length ?? 0;
  const pendingCount = credentials?.filter(c => c.verificationStatus === 'pending').length ?? 0;
  const failedCount = credentials?.filter(c => c.verificationStatus === 'failed').length ?? 0;

  const handleReverify = async (credentialId: string) => {
    if (!walletAddress) return;
    
    setReverifyingId(credentialId);
    try {
      await reverifyCredential(credentialId, walletAddress);
      toast.success('Credential re-verification initiated');
      refreshCredentials();
    } catch (error) {
      console.error('Reverify error:', error);
      toast.error('Failed to re-verify credential');
    } finally {
      setReverifyingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'failed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getCredentialStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'revoked': return 'text-red-500';
      case 'expired': return 'text-gray-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Shell title="Credentials" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Portable proof you can share with consent.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Stat 
            label="Total Credentials" 
            value={isLoading ? "..." : credentialCount > 0 ? credentialCount.toString() : "—"}
            note={walletAddress ? (credentialCount > 0 ? "Issued credentials" : "No credentials yet") : "Connect wallet"}
          />
          <Stat 
            label="Verified" 
            value={isLoading ? "..." : verifiedCount > 0 ? verifiedCount.toString() : "—"}
            note={walletAddress ? (verifiedCount > 0 ? "Successfully verified" : "None verified") : "Connect wallet"}
          />
          <Stat 
            label="Pending" 
            value={isLoading ? "..." : pendingCount > 0 ? pendingCount.toString() : "—"}
            note={walletAddress ? (pendingCount > 0 ? "Awaiting verification" : "None pending") : "Connect wallet"}
          />
        </div>
        <div className="mt-5">
          {!walletAddress ? (
            <Empty
              icon={ShieldCheck}
              title="No wallet connected"
              description="Connect your wallet to view and manage your credentials."
            />
          ) : isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading credentials...</div>
          ) : !credentials || credentials.length === 0 ? (
            <Empty
              icon={ShieldCheck}
              title="No credentials yet"
              description="Issue attestations to receive verifiable credentials that you can share with consent."
            />
          ) : (
            <div className="space-y-4">
              {credentials.map((credential) => (
                <StyledCard key={credential.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="size-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{credential.credentialType}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Issued by: {credential.issuer}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className={`text-sm font-semibold mt-1 ${getCredentialStatusColor(credential.status)}`}>
                            {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Verification</p>
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getStatusColor(credential.verificationStatus)}`}>
                            {credential.verificationStatus.charAt(0).toUpperCase() + credential.verificationStatus.slice(1)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Issued</p>
                          <p className="text-sm mt-1">
                            {new Date(credential.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {credential.expiresAt && (
                          <div>
                            <p className="text-xs text-muted-foreground">Expires</p>
                            <p className="text-sm mt-1">
                              {new Date(credential.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {credential.lastVerifiedAt && (
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Last Verified</p>
                            <p className="text-sm mt-1">
                              {new Date(credential.lastVerifiedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {credential.metadata && Object.keys(credential.metadata).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Metadata</p>
                          <pre className="text-xs bg-background/50 rounded p-2 overflow-auto">
                            {JSON.stringify(credential.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {(credential.verificationStatus === 'failed' || credential.verificationStatus === 'unverified') && (
                        <button
                          onClick={() => handleReverify(credential.id)}
                          disabled={reverifyingId === credential.id}
                          className="flex items-center gap-2 px-3 py-2 rounded bg-primary/10 hover:bg-primary/20 text-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`size-4 ${reverifyingId === credential.id ? 'animate-spin' : ''}`} />
                          Re-verify
                        </button>
                      )}
                    </div>
                  </div>
                </StyledCard>
              ))}

              {failedCount > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-red-500">
                    <strong>{failedCount}</strong> credential{failedCount > 1 ? 's' : ''} failed verification. 
                    Click "Re-verify" to attempt verification again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}


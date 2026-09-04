"use client";

import { KeyRound, Copy, Trash2, X } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Button, ConfirmDialog, PermissionsInput, SkeletonCard, SkeletonList } from "../ui";
import { Empty, StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useApiKeys, createApiKey, revokeApiKey, type CreateApiKeyRequest } from "../../lib/hooks";
import { useState } from "react";
import { toast } from "sonner";

export function ApiKeysPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const { data: apiKeys, isLoading, mutate: refreshKeys } = useApiKeys(walletAddress);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeDialog, setRevokeDialog] = useState<{ keyId: string; keyName: string } | null>(null);

  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    ownerWallet: walletAddress || '',
    name: '',
    permissions: {},
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setCreating(true);
    try {
      const result = await createApiKey({
        ...formData,
        ownerWallet: walletAddress,
      });
      setNewKeyData({ key: result.key, name: result.name });
      toast.success('API key created successfully');
      setShowCreateForm(false);
      setFormData({ ownerWallet: walletAddress, name: '', permissions: {} });
      refreshKeys();
    } catch (error) {
      console.error('Create key error:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string, keyName: string) => {
    if (!walletAddress) return;
    
    setRevokingId(keyId);
    try {
      await revokeApiKey(keyId, walletAddress);
      toast.success('API key revoked successfully');
      refreshKeys();
    } catch (error) {
      console.error('Revoke key error:', error);
      toast.error('Failed to revoke API key');
    } finally {
      setRevokingId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!walletAddress) {
    return (
      <Shell title="API keys" eyebrow="Developer console" developer>
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
          <StyledCard>
            <div className="py-12 text-center text-sm text-muted-foreground">
              Connect your wallet to manage API keys
            </div>
          </StyledCard>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="API keys" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
        {/* Revoke Confirmation Dialog */}
        <ConfirmDialog
          open={!!revokeDialog}
          onOpenChange={(open) => !open && setRevokeDialog(null)}
          title="Revoke API Key"
          description={`Are you sure you want to revoke "${revokeDialog?.keyName}"? This action cannot be undone and will immediately invalidate all requests using this key.`}
          confirmLabel="Revoke Key"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={() => {
            if (revokeDialog) {
              handleRevoke(revokeDialog.keyId, revokeDialog.keyName);
            }
          }}
        />

        {/* New Key Display (One-time show) */}
        {newKeyData && (
          <StyledCard className="mb-5 border-green-500/50 bg-green-500/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-green-500">🎉 API Key Created: {newKeyData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Copy this key now. You won't be able to see it again!
                </p>
              </div>
              <button
                onClick={() => setNewKeyData(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded border border-border font-mono text-sm">
              <code className="flex-1">{newKeyData.key}</code>
              <button
                onClick={() => copyToClipboard(newKeyData.key, 'API key')}
                className="text-primary hover:text-primary/80"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </StyledCard>
        )}

        <StyledCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Project API keys</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage API keys for your applications. Supports multiple active keys per wallet.
              </p>
            </div>
            {!showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)}>
                Create key <KeyRound className="size-4" />
              </Button>
            )}
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <form onSubmit={handleCreate} className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Create New API Key</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Key Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Production Key"
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <PermissionsInput
                    value={formData.permissions || {}}
                    onChange={(permissions) => setFormData({ ...formData, permissions })}
                    label="Permissions"
                    description="Optional"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create API Key'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Keys List */}
          <div className="mt-6">
            {isLoading ? (
              <SkeletonList count={3} />
            ) : !apiKeys || apiKeys.length === 0 ? (
              <Empty
                icon={KeyRound}
                title="No API keys"
                description="Create a key to authenticate your first integration."
              />
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-start gap-4 rounded-lg border border-border bg-background/50 p-4"
                  >
                    <KeyRound className="size-5 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{key.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          key.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {key.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-muted-foreground">
                          {key.keyPrefix}••••••••••••••••
                        </code>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                        {key.lastUsedAt && (
                          <span>Last used: {new Date(key.lastUsedAt).toLocaleString()}</span>
                        )}
                        {key.expiresAt && (
                          <span>Expires: {new Date(key.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      {key.permissions && Object.keys(key.permissions).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-primary cursor-pointer hover:underline">
                            View permissions
                          </summary>
                          <pre className="text-xs bg-background/50 rounded p-2 mt-2 overflow-auto">
                            {JSON.stringify(key.permissions, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                    {key.isActive && (
                      <button
                        onClick={() => setRevokeDialog({ keyId: key.id, keyName: key.name })}
                        disabled={revokingId === key.id}
                        className="text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </StyledCard>
      </div>
    </Shell>
  );
}


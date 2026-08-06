import { Key, Copy, Trash2, Plus, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { useAPIKeys, useCreateAPIKey, useRevokeAPIKey } from "@/hooks/api/useDeveloper";
import { LoadingState, CardSkeleton } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import type { CreateAPIKeyRequest } from "@/types/developer";

export function APIKeys() {
  const { data: keysResponse, isLoading, error, refetch } = useAPIKeys();
  const createMutation = useCreateAPIKey();
  const revokeMutation = useRevokeAPIKey();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<CreateAPIKeyRequest>({
    name: "",
    environment: "development",
    permissions: ["read:reputation", "read:credentials"],
  });

  const keys = keysResponse?.data || [];

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const handleRevokeKey = async (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      await revokeMutation.mutateAsync(keyId);
    }
  };

  const handleCreateKey = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a key name");
      return;
    }
    
    await createMutation.mutateAsync(formData);
    setShowCreateModal(false);
    setFormData({
      name: "",
      environment: "development",
      permissions: ["read:reputation", "read:credentials"],
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
            <Key className="size-3.5" />
            API Keys
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">API Key Management</h1>
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    // Check if it's a network error (no backend)
    const isNetworkError = error instanceof Error && 
      (error.message.includes('Network Error') || 
       error.message.includes('ECONNREFUSED') ||
       error.message.includes('Failed to fetch'));
    
    return (
      <div className="max-w-5xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
            <Key className="size-3.5" />
            API Keys
          </div>
          <h1 className="text-3xl font-semibold mb-8">API Key Management</h1>
        </div>
        
        {isNetworkError ? (
          <div className="glass-strong rounded-2xl p-8 text-center border-l-4 border-warn">
            <AlertCircle className="size-12 text-warn mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-3">Backend Not Connected</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              The CredLayer API backend is not currently running. This page will work once you:
            </p>
            <div className="glass rounded-xl p-6 text-left max-w-2xl mx-auto">
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-mono text-gold shrink-0">1.</span>
                  <span>Set up the backend API server (see <code className="glass px-2 py-1 rounded font-mono text-xs">BACKEND_INTEGRATION_GUIDE.md</code>)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-gold shrink-0">2.</span>
                  <span>Start the API server on <code className="glass px-2 py-1 rounded font-mono text-xs">http://localhost:3000</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-gold shrink-0">3.</span>
                  <span>Refresh this page to see your API keys</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              The frontend is ready for backend integration. All API endpoints are documented.
            </p>
          </div>
        ) : (
          <ErrorState
            title="Failed to load API keys"
            error={error as Error}
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <Key className="size-3.5" />
          API Keys
        </div>
        <h1 className="text-3xl font-semibold">API Key Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage API keys to authenticate your requests to the CredLayer API.
        </p>
      </div>

      {/* Security Warning */}
      <div className="glass rounded-xl p-5 bg-warn/5 border-warn/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-6 text-warn shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Keep Your API Keys Secret</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your API keys have access to your account data. Never share them publicly or commit
              them to version control. Use environment variables to store keys securely.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Store keys in environment variables
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Use separate keys for development and production
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Rotate keys regularly and revoke unused keys
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create New Key Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Your API Keys</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {keys.filter((k) => k.status === "active").length} active key
            {keys.filter((k) => k.status === "active").length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-background px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
        >
          <Plus className="size-4" />
          Create New Key
        </button>
      </div>

      {/* API Keys List */}
      {keys.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No API keys yet"
          description="Create your first API key to start making requests to the CredLayer API"
          action={{
            label: "Create API Key",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          {keys.map((key) => (
            <div
              key={key.id}
              className={`glass rounded-xl p-4 sm:p-6 transition-all ${
                key.status === "revoked" ? "opacity-50" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-semibold truncate">{key.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        key.environment === "production"
                          ? "bg-gold/20 text-gold"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {key.environment}
                    </span>
                    {key.status === "revoked" && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-danger/20 text-danger whitespace-nowrap">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full overflow-hidden">
                    <code className="text-xs sm:text-sm font-mono text-muted-foreground truncate">
                      {visibleKeys.has(key.id)
                        ? key.key
                        : `${key.key.substring(0, 20)}${"•".repeat(20)}`}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      aria-label={visibleKeys.has(key.id) ? "Hide key" : "Show key"}
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {key.status === "active" && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => copyKey(key.key)}
                      className="flex-1 sm:flex-none p-2 hover:bg-elevated-strong rounded-lg transition-colors"
                      title="Copy to clipboard"
                      aria-label="Copy API key"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      disabled={revokeMutation.isPending}
                      className="flex-1 sm:flex-none p-2 hover:bg-danger/20 text-danger rounded-lg transition-colors disabled:opacity-50"
                      title="Revoke key"
                      aria-label="Revoke API key"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Created</div>
                  <div className="text-sm font-medium">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Last Used</div>
                  <div className="text-sm font-medium">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Requests</div>
                  <div className="text-sm font-medium">{key.usage.totalRequests.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Using Your API Key</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Include your API key in the Authorization header of all requests:
        </p>
        <CodeBlock
          language="bash"
          code={`curl https://api.credlayer.com/v1/wallets/0xd8dA... \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-3">JavaScript Example</h3>
          <CodeBlock
            language="javascript"
            code={`const client = new CredLayer({
  apiKey: process.env.CREDLAYER_API_KEY
});

const reputation = await client.wallets.get(address);`}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-3">Python Example</h3>
          <CodeBlock
            language="python"
            code={`import os
from credlayer import CredLayer

client = CredLayer(
    api_key=os.getenv('CREDLAYER_API_KEY')
)

reputation = client.wallets.get(address)`}
          />
        </div>
      </div>

      {/* Environment Variables */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Store your API keys as environment variables:
        </p>
        <CodeBlock
          language="bash"
          code={`# .env file
CREDLAYER_API_KEY=cl_live_your_api_key_here

# Never commit this file to git!
# Add .env to your .gitignore`}
        />
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-inset backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Create New API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key Name</label>
                <input
                  type="text"
                  placeholder="e.g., Production Key"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-elevated] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Environment</label>
                <select 
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                  className="w-full bg-elevated] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-elevated-strong hover:bg-elevated-strong rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gold text-background rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Key"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

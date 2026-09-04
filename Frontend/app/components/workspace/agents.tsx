"use client";

import { ArrowRight, Sparkles, Activity as ActivityIcon, X } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Button, PermissionsInput } from "../ui";
import { Empty, StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useAgent, useAgentActivity, registerAgent, type RegisterAgentRequest } from "../../lib/hooks";
import { useState } from "react";
import { toast } from "sonner";

export function AgentsPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  // Form state
  const [formData, setFormData] = useState<RegisterAgentRequest>({
    agentId: '',
    ownerWallet: walletAddress || '',
    name: '',
    description: '',
    permissions: {},
  });

  // Fetch agent details and activity
  const { data: agent, mutate: refreshAgent } = useAgent(selectedAgentId);
  const { data: agentActivity } = useAgentActivity(selectedAgentId, 50);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setRegistering(true);
    try {
      const result = await registerAgent({
        ...formData,
        ownerWallet: walletAddress,
      });
      toast.success(`Agent "${result.name}" registered successfully`);
      setShowRegisterForm(false);
      setSelectedAgentId(result.agentId);
      // Reset form
      setFormData({
        agentId: '',
        ownerWallet: walletAddress,
        name: '',
        description: '',
        permissions: {},
      });
      refreshAgent();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register agent');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-500';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Shell title="Agents" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Create trusted workflows for your products.
        </p>
        <div className="flex flex-col gap-5">
          <StyledCard>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Registered agents</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agents will use scoped credentials to act on your behalf.
                </p>
              </div>
              {!showRegisterForm && (
                <Button 
                  variant="outline"
                  onClick={() => setShowRegisterForm(true)}
                  disabled={!walletAddress}
                >
                  Register agent <ArrowRight className="size-4" />
                </Button>
              )}
            </div>

            {/* Registration Form */}
            {showRegisterForm && (
              <form onSubmit={handleRegister} className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Register New Agent</h3>
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agent ID</label>
                    <input
                      type="text"
                      value={formData.agentId}
                      onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                      placeholder="e.g., my-ai-agent"
                      required
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Agent Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., My AI Assistant"
                      required
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what this agent does..."
                      rows={3}
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
                    <Button type="submit" disabled={registering || !walletAddress}>
                      {registering ? 'Registering...' : 'Register Agent'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowRegisterForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </StyledCard>

          {/* Agent Details & Activity */}
          {agent ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
              {/* Agent Info */}
              <StyledCard>
                <h3 className="font-semibold border-b border-primary/20 pb-3 mb-4">Agent Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-semibold mt-1">{agent.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Agent ID</p>
                    <p className="text-sm font-mono mt-1">{agent.agentId}</p>
                  </div>
                  {agent.description && (
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm mt-1">{agent.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className={`text-sm font-semibold mt-1 inline-block ${
                      agent.status === 'active' ? 'text-green-500' :
                      agent.status === 'suspended' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Permissions</p>
                    <pre className="text-xs bg-background/50 rounded p-2 mt-1 overflow-auto">
                      {JSON.stringify(agent.permissions, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm mt-1">{new Date(agent.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </StyledCard>

              {/* Agent Activity */}
              <StyledCard>
                <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
                  <h3 className="font-semibold">Live Traffic</h3>
                  <ActivityIcon className="size-4 text-muted-foreground" />
                </div>
                {!agentActivity || agentActivity.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No activity yet for this agent
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {agentActivity.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3 text-sm"
                      >
                        <div className={`mt-1 size-2 rounded-full ${
                          activity.statusCode >= 200 && activity.statusCode < 300 ? 'bg-green-500' :
                          activity.statusCode >= 400 && activity.statusCode < 500 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold">{activity.method}</span>
                            <span className="font-mono text-xs truncate">{activity.endpoint}</span>
                            <span className={`font-mono text-xs ${getStatusColor(activity.statusCode)}`}>
                              {activity.statusCode}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {activity.activityType}
                            {activity.durationMs && ` • ${activity.durationMs}ms`}
                          </p>
                          {activity.errorMessage && (
                            <p className="text-xs text-red-500 mt-1">{activity.errorMessage}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </StyledCard>
            </div>
          ) : !walletAddress ? (
            <Empty
              icon={Sparkles}
              title="No wallet connected"
              description="Connect your wallet to register and manage agents."
            />
          ) : (
            <Empty
              icon={Sparkles}
              title="No agents registered"
              description="Create an agent when you are ready to automate a trusted workflow."
            />
          )}
        </div>
      </div>
    </Shell>
  );
}


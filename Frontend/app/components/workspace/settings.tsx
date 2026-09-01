"use client";

import { Shell } from "../layout/app-shell";
import { StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useSettings, updateSettings, type UpdateSettingsRequest } from "../../lib/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui";

export function SettingsPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const { data: settings, isLoading, mutate: refreshSettings } = useSettings(walletAddress);
  const [saving, setSaving] = useState(false);

  // Local state for form
  const [formData, setFormData] = useState<UpdateSettingsRequest>({
    preferences: {},
    notifications: {
      email: false,
      push: false,
      webhook: false,
    },
    privacy: {
      publicProfile: false,
      showConnections: false,
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        preferences: settings.preferences,
        notifications: settings.notifications,
        privacy: settings.privacy,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setSaving(true);
    try {
      await updateSettings(walletAddress, formData);
      toast.success('Settings saved successfully');
      refreshSettings();
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key: 'email' | 'push' | 'webhook', value: boolean) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: value,
      },
    });
  };

  const handlePrivacyChange = (key: 'publicProfile' | 'showConnections', value: boolean) => {
    setFormData({
      ...formData,
      privacy: {
        ...formData.privacy,
        [key]: value,
      },
    });
  };

  if (!walletAddress) {
    return (
      <Shell title="Settings" eyebrow="App workspace">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
          <p className="mb-7 text-sm text-muted-foreground">
            Manage preferences and connected services.
          </p>
          <StyledCard>
            <div className="py-12 text-center text-sm text-muted-foreground">
              Connect your wallet to access settings
            </div>
          </StyledCard>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Settings" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          Manage preferences and connected services.
        </p>

        {isLoading ? (
          <StyledCard>
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading settings...
            </div>
          </StyledCard>
        ) : (
          <div className="space-y-5">
            {/* Privacy Settings */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Privacy Settings</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer">
                  <span>
                    <span className="block font-medium">Public Profile</span>
                    <span className="text-xs text-muted-foreground">
                      Make your trust score and credentials visible to others
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={formData.privacy?.publicProfile ?? false}
                    onChange={(e) => handlePrivacyChange('publicProfile', e.target.checked)}
                    className="accent-primary scale-125" 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer">
                  <span>
                    <span className="block font-medium">Show Connections</span>
                    <span className="text-xs text-muted-foreground">
                      Display your trust connections to other users
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={formData.privacy?.showConnections ?? false}
                    onChange={(e) => handlePrivacyChange('showConnections', e.target.checked)}
                    className="accent-primary scale-125" 
                  />
                </label>
              </div>
            </StyledCard>

            {/* Notification Settings */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Notifications</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer">
                  <span>
                    <span className="block font-medium">Email Notifications</span>
                    <span className="text-xs text-muted-foreground">
                      Receive updates for new attestations and credentials
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={formData.notifications?.email ?? false}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="accent-primary scale-125" 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer">
                  <span>
                    <span className="block font-medium">Push Notifications</span>
                    <span className="text-xs text-muted-foreground">
                      Get instant alerts for important activity
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={formData.notifications?.push ?? false}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="accent-primary scale-125" 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:bg-background/50 transition-colors cursor-pointer">
                  <span>
                    <span className="block font-medium">Webhook Notifications</span>
                    <span className="text-xs text-muted-foreground">
                      Send events to your registered webhook endpoints
                    </span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={formData.notifications?.webhook ?? false}
                    onChange={(e) => handleNotificationChange('webhook', e.target.checked)}
                    className="accent-primary scale-125" 
                  />
                </label>
              </div>
            </StyledCard>

            {/* Account Info */}
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Connected Wallet</p>
                  <p className="text-sm font-mono mt-1">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </p>
                </div>
                {settings && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Account Created</p>
                      <p className="text-sm mt-1">
                        {new Date(settings.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm mt-1">
                        {new Date(settings.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </StyledCard>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}


/*
@solana/accounts
 @solana/codecs 
 @solana/errors 
 @solana/transactions 
 @solana/signers 
 @solana/instructions
 */
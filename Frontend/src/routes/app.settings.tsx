import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Bell, Shield, Share2, LogOut, Loader2, Palette } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useWallet, shortenAddress } from "@/lib/wallet/useWallet";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUserProfile, useUpdateProfile } from "@/hooks/api/useUsers";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import type { UserPreferences } from "@/types/user";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · CredLayer" },
      { name: "description", content: "Manage privacy, data-sharing, notification, and security preferences for your CredLayer identity." },
      { property: "og:title", content: "Settings · CredLayer" },
      { property: "og:description", content: "Manage privacy, data-sharing, notification, and security preferences for your CredLayer identity." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/settings" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/settings" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { address, authenticated, signOut } = useWallet();
  const { data, isLoading, error, refetch } = useUserProfile();
  const updateUser = useUpdateProfile();
  const { theme, setTheme } = useTheme();
  const user = data?.data;

  if (!authenticated || !address) return <ConnectPrompt title="Connect to manage settings" />;
  if (isLoading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  if (!user) return null;


  const prefs: UserPreferences = user.preferences ?? ({} as UserPreferences);
  const privacy = prefs.privacy ?? ({} as NonNullable<UserPreferences["privacy"]>);
  const notifications = prefs.notifications ?? ({} as NonNullable<UserPreferences["notifications"]>);
  const security = prefs.security ?? ({} as NonNullable<UserPreferences["security"]>);


  const updatePreference = async (updates: Partial<UserPreferences>) => {
    await updateUser.mutateAsync({
      preferences: {
        ...prefs,
        ...updates,
      },
    });
  };

  const togglePrivacy = (key: keyof NonNullable<UserPreferences['privacy']>) => {
    updatePreference({
      privacy: {
        ...privacy,
        [key]: !privacy[key],
      },
    });
  };

  const toggleNotification = (key: keyof NonNullable<UserPreferences['notifications']>) => {
    updatePreference({
      notifications: {
        ...notifications,
        [key]: !notifications[key],
      },
    });
  };

  const toggleSecurity = (key: keyof NonNullable<UserPreferences['security']>) => {
    updatePreference({
      security: {
        ...security,
        [key]: !security[key],
      },
    });
  };

  const isUpdating = updateUser.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Settings</div>
        <h1 className="mt-2 text-3xl font-semibold">Account & privacy</h1>
      </div>

      <Section icon={<Wallet className="size-4 text-gold" />} title="Connected wallet">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-sm">{shortenAddress(address, 8)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Signature verified · Session active</div>
          </div>
          <Button variant="glass" size="sm" onClick={signOut}>
            <LogOut className="size-4" /> Disconnect
          </Button>
        </div>
      </Section>

      <Section icon={<Palette className="size-4 text-gold" />} title="Appearance">
        <Row label="Dark mode" desc="Dark is the default. Your choice is saved on this device.">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle dark mode"
          />
        </Row>
      </Section>

      <Section icon={<Share2 className="size-4 text-gold" />} title="Data sharing">
        <Row label="Public reputation profile" desc="Anyone can view your score and credentials via profile URL">
          <Switch 
            checked={privacy.publicProfile ?? true} 
            onCheckedChange={() => togglePrivacy("publicProfile")}
            disabled={isUpdating}
          />
        </Row>
        <Row label="Share DeFi activity" desc="Include DeFi positions in public profile">
          <Switch 
            checked={privacy.shareDeFiActivity ?? true} 
            onCheckedChange={() => togglePrivacy("shareDeFiActivity")}
            disabled={isUpdating}
          />
        </Row>
        <Row label="Share NFT activity" desc="Include NFT holdings and mints">
          <Switch 
            checked={privacy.shareNFTActivity ?? false} 
            onCheckedChange={() => togglePrivacy("shareNFTActivity")}
            disabled={isUpdating}
          />
        </Row>
      </Section>

      <Section icon={<Bell className="size-4 text-accent" />} title="Notifications">
        <Row label="Reputation changes" desc="Score moves ±10 or higher">
          <Switch 
            checked={notifications.reputationChanges ?? true} 
            onCheckedChange={() => toggleNotification("reputationChanges")}
            disabled={isUpdating}
          />
        </Row>
        <Row label="Risk transitions" desc="Alert when risk level changes">
          <Switch 
            checked={notifications.riskTransitions ?? true} 
            onCheckedChange={() => toggleNotification("riskTransitions")}
            disabled={isUpdating}
          />
        </Row>
        <Row label="New credentials" desc="When a new attestation is issued">
          <Switch 
            checked={notifications.newCredentials ?? false} 
            onCheckedChange={() => toggleNotification("newCredentials")}
            disabled={isUpdating}
          />
        </Row>
      </Section>

      <Section icon={<Shield className="size-4 text-success" />} title="Security">
        <Row label="Require signature for API access" desc="Extra signature step when creating API keys">
          <Switch 
            checked={security.requireSignatureForApiKeys ?? true} 
            onCheckedChange={() => toggleSecurity("requireSignatureForApiKeys")}
            disabled={isUpdating}
          />
        </Row>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="glass" size="sm" disabled={isUpdating}>
            {isUpdating && <Loader2 className="size-4 animate-spin" />}
            Rotate session
          </Button>
          <Button variant="glass" size="sm" disabled={isUpdating}>Export data</Button>
          <Button variant="glass" size="sm" className="text-danger hover:text-danger" disabled={isUpdating}>
            Delete profile
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
        {icon} {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <div>
        <div className="text-sm">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

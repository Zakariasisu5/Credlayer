// "use client";

// import { Activity, BarChart3 } from "lucide-react";
// import { Shell } from "../layout/app-shell";
// import { Badge } from "../ui";
// import { Empty, Stat, StyledCard } from "../shared/common-components";

// export function DashboardPage() {
//   return (
//     <Shell title="Dashboard" eyebrow="App workspace">
//       <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
//         <p className="mb-7 text-sm text-muted-foreground">
//           A private view of your verifiable identity and reputation.
//         </p>
//         <div className="mb-6 flex items-center justify-end">
//           <Badge tone="amber">Preview · No live data</Badge>
//         </div>
//         <div className="grid gap-5 md:grid-cols-3">
//           <Stat label="Reputation score" value="—" note="Connect wallet to view" />
//           <Stat label="Credentials" value="—" note="No credentials issued" />
//           <Stat label="Network activity" value="—" note="Awaiting first transaction" />
//         </div>
//         <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
//           <StyledCard>
//             <div className="flex items-center justify-between border-b border-primary/20 pb-4">
//               <h2 className="font-semibold">Signal overview</h2>
//               <BarChart3 className="size-4 text-muted-foreground" />
//             </div>
//             <div className="mt-6 space-y-4">
//               <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
//                 <div>
//                   <p className="text-sm font-medium">Verified signals</p>
//                   <p className="mt-1 text-xs text-muted-foreground">Total verification events</p>
//                 </div>
//                 <span className="text-2xl font-bold text-primary">—</span>
//               </div>
//               <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
//                 <div>
//                   <p className="text-sm font-medium">Trust connections</p>
//                   <p className="mt-1 text-xs text-muted-foreground">Linked identities</p>
//                 </div>
//                 <span className="text-2xl font-bold text-primary">—</span>
//               </div>
//               <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
//                 <div>
//                   <p className="text-sm font-medium">Attestations</p>
//                   <p className="mt-1 text-xs text-muted-foreground">Third-party verifications</p>
//                 </div>
//                 <span className="text-2xl font-bold text-primary">—</span>
//               </div>
//             </div>
//             <p className="mt-4 text-xs text-muted-foreground italic">
//               Connect a wallet to enable signal analysis
//             </p>
//           </StyledCard>
//           <StyledCard>
//             <div className="border-b border-primary/20 pb-4">
//               <h2 className="font-semibold">Connected identity</h2>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 Link your wallet to view reputation data
//               </p>
//             </div>
//             <div className="mt-5 flex flex-col gap-3">
//               <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
//                 <span className="text-muted-foreground">Wallet</span>
//                 <span className="text-amber-400">Not connected</span>
//               </div>
//               <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
//                 <span className="text-muted-foreground">Network</span>
//                 <span className="text-primary">Solana Devnet</span>
//               </div>
//               <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
//                 <span className="text-muted-foreground">Status</span>
//                 <span className="flex items-center gap-2">
//                   <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_#22d3ee] animate-pulse" />
//                   Active
//                 </span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Privacy mode</span>
//                 <span className="text-green-400">Enabled</span>
//               </div>
//             </div>
//           </StyledCard>
//         </div>
//         <div className="mt-5">
//           <StyledCard>
//             <div className="flex items-center justify-between border-b border-primary/20 pb-4">
//               <h2 className="font-semibold">Recent activity</h2>
//               <Activity className="size-4 text-muted-foreground" />
//             </div>
//             <Empty
//               icon={Activity}
//               title="No activity recorded"
//               description="Your verification events and credential issuance will appear here once you connect your wallet."
//             />
//           </StyledCard>
//         </div>
//       </div>
//     </Shell>
//   );
// }


// this code below has frontend integrated with relayer 

"use client";

import { Activity, BarChart3, ShieldCheck } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge } from "../ui";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { TrustScoreLiveDemo } from "./sdk-client";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useTrustScore, useCredentials, useConnections, useActivity } from "../../lib/hooks";

export function DashboardPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  // Fetch real data from backend
  const { data: trustScore, isLoading: scoreLoading } = useTrustScore(walletAddress);
  const { data: credentials, isLoading: credentialsLoading } = useCredentials(walletAddress);
  const { data: connections, isLoading: connectionsLoading } = useConnections(walletAddress);
  const { data: activity, isLoading: activityLoading } = useActivity(walletAddress, 10);

  // Calculate stats
  const reputationScore = trustScore?.score ?? null;
  const credentialCount = credentials?.length ?? 0;
  const verifiedCredentials = credentials?.filter(c => c.verificationStatus === 'verified').length ?? 0;
  const connectionCount = connections?.totalCount ?? 0;
  const recentActivityCount = activity?.length ?? 0;

  return (
    <Shell title="Dashboard" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            A private view of your verifiable identity, reputation, and on-chain attestations.
          </p>
          <Badge tone="amber">Devnet · Live Testbench Active</Badge>
        </div>

        {/* Live SDK & Relayer Interactive Testbench */}
        <StyledCard>
          <div className="flex items-center justify-between border-b border-primary/20 pb-4">
            <div>
              <h2 className="font-semibold text-foreground">Solana SAS Attestation Engine</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issue mock AI trust scores and verify attestations on-chain via @credlayer/sdk
              </p>
            </div>
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div className="mt-4">
            <TrustScoreLiveDemo />
          </div>
        </StyledCard>

        {/* Quick Stats Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          <Stat 
            label="Reputation score" 
            value={scoreLoading ? "..." : reputationScore !== null ? reputationScore.toString() : "—"} 
            note={walletAddress ? (reputationScore !== null ? `Confidence: ${trustScore?.confidence}%` : "No score yet") : "Connect wallet to view"} 
          />
          <Stat 
            label="Credentials" 
            value={credentialsLoading ? "..." : credentialCount > 0 ? credentialCount.toString() : "—"} 
            note={walletAddress ? (credentialCount > 0 ? `${verifiedCredentials} verified` : "No credentials issued") : "Connect wallet"} 
          />
          <Stat 
            label="Network activity" 
            value={activityLoading ? "..." : recentActivityCount > 0 ? recentActivityCount.toString() : "—"} 
            note={walletAddress ? (recentActivityCount > 0 ? "Recent events" : "No activity yet") : "Connect wallet"} 
          />
        </div>

        {/* Signal & Identity Overview */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <StyledCard>
            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
              <h2 className="font-semibold">Signal overview</h2>
              <BarChart3 className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <p className="text-sm font-medium">Verified signals</p>
                  <p className="mt-1 text-xs text-muted-foreground">Total verification events</p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {scoreLoading ? "..." : trustScore?.signals.filter(s => s.verified).length ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <p className="text-sm font-medium">Trust connections</p>
                  <p className="mt-1 text-xs text-muted-foreground">Linked identities</p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {connectionsLoading ? "..." : connectionCount > 0 ? connectionCount : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <p className="text-sm font-medium">Attestations</p>
                  <p className="mt-1 text-xs text-muted-foreground">Third-party verifications</p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {credentialsLoading ? "..." : verifiedCredentials > 0 ? verifiedCredentials : "—"}
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">
              {walletAddress ? "Live data from backend" : "Connect a wallet or enter an address above to analyze signals"}
            </p>
          </StyledCard>

          <StyledCard>
            <div className="border-b border-primary/20 pb-4">
              <h2 className="font-semibold">Connected identity</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {walletAddress ? "Wallet connected" : "Link your wallet to view reputation data"}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span className="text-muted-foreground">Wallet</span>
                <span className={walletAddress ? "text-primary font-mono text-xs" : "text-amber-400"}>
                  {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Not connected"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="text-primary">Solana Devnet</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Privacy mode</span>
                <span className="text-green-400">Enabled</span>
              </div>
            </div>
          </StyledCard>
        </div>

        {/* Activity Section */}
        <div>
          <StyledCard>
            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
              <h2 className="font-semibold">Recent activity</h2>
              <Activity className="size-4 text-muted-foreground" />
            </div>
            {activityLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading activity...</div>
            ) : activity && activity.length > 0 ? (
              <div className="mt-4 space-y-3">
                {activity.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                    <div className={`mt-1 size-2 rounded-full ${
                      event.status === 'success' ? 'bg-green-500' : 
                      event.status === 'pending' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      {event.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.status === 'success' ? 'bg-green-500/10 text-green-500' :
                      event.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={Activity}
                title="No activity recorded"
                description={walletAddress 
                  ? "Your verification events and credential issuance will appear here once you issue and verify an attestation."
                  : "Connect your wallet to view activity"}
              />
            )}
          </StyledCard>
        </div>
      </div>
    </Shell>
  );
}
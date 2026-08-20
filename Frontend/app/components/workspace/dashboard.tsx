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

export function DashboardPage() {
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
          <Stat label="Reputation score" value="—" note="Run verification above" />
          <Stat label="Credentials" value="—" note="SAS PDA schema v1" />
          <Stat label="Network activity" value="—" note="Solana Devnet" />
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
                <span className="text-2xl font-bold text-primary">—</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <p className="text-sm font-medium">Trust connections</p>
                  <p className="mt-1 text-xs text-muted-foreground">Linked identities</p>
                </div>
                <span className="text-2xl font-bold text-primary">—</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <p className="text-sm font-medium">Attestations</p>
                  <p className="mt-1 text-xs text-muted-foreground">Third-party verifications</p>
                </div>
                <span className="text-2xl font-bold text-primary">—</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Connect a wallet or enter an address above to analyze signals
            </p>
          </StyledCard>

          <StyledCard>
            <div className="border-b border-primary/20 pb-4">
              <h2 className="font-semibold">Connected identity</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Link your wallet to view reputation data
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span className="text-muted-foreground">Wallet</span>
                <span className="text-amber-400">Devnet Mock Target</span>
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
            <Empty
              icon={Activity}
              title="No activity recorded"
              description="Your verification events and credential issuance will appear here once you issue and verify an attestation."
            />
          </StyledCard>
        </div>
      </div>
    </Shell>
  );
}
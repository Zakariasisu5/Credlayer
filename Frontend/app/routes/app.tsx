import { createFileRoute, Outlet, ClientOnly } from "@tanstack/react-router";
import { lazy } from "react";

const AppRuntime = lazy(() =>
  Promise.all([
    import("@/components/app/AppShell"),
    import("@/lib/wallet/WalletProvider"),
    import("@/lib/wallet/solana/SolanaProvider"),
    import("@/lib/wallet/session"),
  ]).then(([{ AppShell }, { WalletProvider }, { SolanaProvider }, { WalletSessionProvider }]) => ({
    default: function AppRuntimeInner() {
      return (
        <WalletProvider>
          <SolanaProvider>
            <WalletSessionProvider>
              <AppShell>
                <Outlet />
              </AppShell>
            </WalletSessionProvider>
          </SolanaProvider>
        </WalletProvider>
      );
    },
  })),
);

export const Route = createFileRoute("/app")({
  component: AppLayout,
  head: () => ({
    meta: [
      { title: "CredLayer · Reputation Dashboard" },
      { name: "description", content: "Your on-chain reputation, credentials, and trust signals across every chain." },
      { property: "og:title", content: "CredLayer · Reputation Dashboard" },
      { property: "og:description", content: "Portable Web3 reputation for wallets and AI agents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AppLayout() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <AppRuntime />
    </ClientOnly>
  );
}


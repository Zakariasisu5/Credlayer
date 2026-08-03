import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { wagmiConfig, networks, projectId, appMetadata, wagmiAdapter } from "./config";

// Initialize AppKit once at module load. Guarded so it only runs in the browser;
// the /app route tree renders inside <ClientOnly>, so this module is not
// evaluated during SSR for that subtree.
let appKitInitialized = false;
if (typeof window !== "undefined" && !appKitInitialized) {
  appKitInitialized = true;
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata: appMetadata,
    features: { analytics: false, email: false, socials: false },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "oklch(0.85 0.17 90)",
      "--w3m-color-mix": "oklch(0.14 0.02 260)",
      "--w3m-color-mix-strength": 20,
      "--w3m-border-radius-master": "3px",
      "--w3m-font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
    },
  });
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}


import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, optimism, polygon, base } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Reown Cloud project id. Replace with your own from https://cloud.reown.com.
// A public/demo projectId works for local development; set VITE_REOWN_PROJECT_ID for production.
export const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  arbitrum,
  optimism,
  polygon,
  base,
];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://credlayer.io";

export const appMetadata = {
  name: "CredLayer",
  description: "The Reputation Layer for Web3",
  url: appOrigin,
  icons: [`${appOrigin}/favicon.png`],
};

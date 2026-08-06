import type { Metadata } from "next";
import "./styles.css";
import { ThemeProvider } from "./lib/theme";
import { WalletProvider } from "./lib/wallet/WalletProvider";
import { SolanaProvider } from "./lib/wallet/solana/SolanaProvider";
import { WalletSessionProvider } from "./lib/wallet/session";

export const metadata: Metadata = {
  title: "CredLayer — The Reputation Layer for Web3",
  description: "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis.",
  authors: [{ name: "Lovable" }],
  openGraph: {
    title: "CredLayer — The Reputation Layer for Web3",
    description: "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis.",
    type: "website",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/010cad31-f20a-4f1d-990b-7cd3c3012b3b/id-preview-ee19c208--58dc7b40-951b-4d3f-9b04-d0aeebd51c2b.lovable.app-1785028396079.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "CredLayer — The Reputation Layer for Web3",
    description: "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/010cad31-f20a-4f1d-990b-7cd3c3012b3b/id-preview-ee19c208--58dc7b40-951b-4d3f-9b04-d0aeebd51c2b.lovable.app-1785028396079.png",
    ],
  },
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>
          <WalletProvider>
            <SolanaProvider>
              <WalletSessionProvider>
                {children}
              </WalletSessionProvider>
            </SolanaProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

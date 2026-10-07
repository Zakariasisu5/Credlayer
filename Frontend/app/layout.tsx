import type { Metadata } from "next";
import "./lib/polyfills";
import "./globals.css";
import { Providers } from "./components/providers";
import { ConsoleFilter } from "./components/console-filter";

// Using system fonts to avoid Turbopack font loading issues
const inter = {
  variable: "--font-inter",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "CredLayer — AI-Powered Web3 Trust & Verification",
  description:
    "CredLayer is the AI-powered verification layer for Web3. Build trust with reputation scoring, verifiable credentials, and blockchain attestations.",
  icons: {
    icon: "/assets/icon.jpeg",
    shortcut: "/assets/icon.jpeg",
    apple: "/assets/icon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ConsoleFilter />
        <Providers>
          <div className="min-h-screen bg-transparent text-foreground">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

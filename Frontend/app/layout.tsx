import type { Metadata } from "next";
import "./lib/polyfills";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { ConsoleFilter } from "./components/console-filter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className="bg-background" suppressHydrationWarning>
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

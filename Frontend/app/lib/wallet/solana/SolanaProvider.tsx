"use client";

import { ReactNode, useCallback, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork, type WalletError } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import "./wallet-adapter.css";


export const SOLANA_NETWORK: WalletAdapterNetwork =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) ||
  WalletAdapterNetwork.Devnet;

export const SOLANA_NETWORK_LABEL =
  SOLANA_NETWORK === WalletAdapterNetwork.Mainnet
    ? "Mainnet"
    : SOLANA_NETWORK === WalletAdapterNetwork.Testnet
    ? "Testnet"
    : "Devnet";

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => (process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string) || clusterApiUrl(SOLANA_NETWORK),
    [],
  );
  // Wallet Standard auto-detects Phantom, Solflare, Backpack, Glow,
  // Trust Wallet, and any other wallet-standard-compliant provider.
  const wallets = useMemo(() => [], []);
  const onError = useCallback((err: WalletError) => {
    // Surface adapter errors to the console; UI reads state via hooks.
    console.warn("[solana-wallet]", err.name, err.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

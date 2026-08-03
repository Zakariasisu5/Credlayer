import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useWallet as useEvmWallet, shortenAddress } from "@/lib/wallet/useWallet";
import { useSolanaWallet, shortenSolAddress } from "@/lib/wallet/solana/useSolanaWallet";

export type WalletChain = "evm" | "sol";

export interface WalletSession {
  /** true while the provider is attempting to restore a previous session */
  restoring: boolean;
  /** a wallet is connected (may still need a signature) */
  isConnected: boolean;
  /** connected + signature verified */
  authenticated: boolean;
  chain: WalletChain | null;
  address: string | null;
  shortAddress: string;
  displayAddress: string;
  walletName: string | null;
  walletIcon: string | null;
  networkLabel: string;
  balanceLabel: string | null;
  explorerUrl: string | null;
  signing: boolean;
  error: string | null;
  authenticate: () => Promise<unknown>;
  signOut: () => void | Promise<void>;
}

const Ctx = createContext<WalletSession | null>(null);

const LAST_WALLET_KEY = "credlayer.wallet.last";

function evmExplorer(chainId: number | undefined, address: string) {
  const base: Record<number, string> = {
    1: "https://etherscan.io",
    10: "https://optimistic.etherscan.io",
    137: "https://polygonscan.com",
    8453: "https://basescan.org",
    42161: "https://arbiscan.io",
  };
  return `${base[chainId ?? 1] ?? base[1]}/address/${address}`;
}

function solExplorer(address: string, network: string) {
  const cluster = network.toLowerCase() === "mainnet" ? "" : `?cluster=${network.toLowerCase()}`;
  return `https://explorer.solana.com/address/${address}${cluster}`;
}

export function WalletSessionProvider({ children }: { children: ReactNode }) {
  const evm = useEvmWallet();
  const sol = useSolanaWallet();

  // Track whether a previous session exists so we can show a restore state
  // instead of flashing the disconnected UI on refresh.
  const hadSession = useRef<boolean>(
    typeof window !== "undefined" && !!window.localStorage.getItem(LAST_WALLET_KEY),
  );
  const [graceElapsed, setGraceElapsed] = useState(!hadSession.current);

  useEffect(() => {
    if (graceElapsed) return;
    const t = setTimeout(() => setGraceElapsed(true), 2500);
    return () => clearTimeout(t);
  }, [graceElapsed]);

  const chain: WalletChain | null = evm.isConnected ? "evm" : sol.isConnected ? "sol" : null;

  // Persist / clear the "last connected chain" marker.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (chain) {
      window.localStorage.setItem(LAST_WALLET_KEY, chain);
      hadSession.current = true;
      setGraceElapsed(true);
    }
  }, [chain]);

  const value = useMemo<WalletSession>(() => {
    const connecting =
      evm.status === "connecting" || evm.status === "reconnecting" || sol.connecting;
    const restoring = !chain && (connecting || !graceElapsed);

    if (chain === "evm") {
      const address = evm.address ?? null;
      return {
        restoring: false,
        isConnected: true,
        authenticated: evm.authenticated,
        chain,
        address,
        shortAddress: shortenAddress(address, 4),
        displayAddress: shortenAddress(address, 8),
        walletName: evm.connector?.name ?? "EVM Wallet",
        walletIcon: null,
        networkLabel: `EVM · Chain ${evm.chainId ?? "—"}`,
        balanceLabel: null,
        explorerUrl: address ? evmExplorer(evm.chainId, address) : null,
        signing: evm.signing,
        error: evm.authError ?? null,
        authenticate: evm.authenticate,
        signOut: evm.signOut,
      };
    }

    if (chain === "sol") {
      const address = sol.address ?? null;
      return {
        restoring: false,
        isConnected: true,
        authenticated: sol.authenticated,
        chain,
        address,
        shortAddress: shortenSolAddress(address, 4),
        displayAddress: shortenSolAddress(address, 8),
        walletName: sol.walletName ?? "Solana Wallet",
        walletIcon: sol.walletIcon ?? null,
        networkLabel: `Solana · ${sol.network}`,
        balanceLabel:
          sol.balance !== null
            ? `${sol.balance.toLocaleString("en-US", { maximumFractionDigits: 4 })} SOL`
            : null,
        explorerUrl: address ? solExplorer(address, sol.network) : null,
        signing: sol.signing,
        error: sol.authError ?? null,
        authenticate: sol.authenticate,
        signOut: sol.signOut,
      };
    }

    return {
      restoring,
      isConnected: false,
      authenticated: false,
      chain: null,
      address: null,
      shortAddress: "",
      displayAddress: "",
      walletName: null,
      walletIcon: null,
      networkLabel: "—",
      balanceLabel: null,
      explorerUrl: null,
      signing: false,
      error: null,
      authenticate: async () => null,
      signOut: () => {
        if (typeof window !== "undefined") window.localStorage.removeItem(LAST_WALLET_KEY);
      },
    };
  }, [chain, graceElapsed, evm, sol]);

  // Clear the marker on an explicit full disconnect.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!chain && graceElapsed && !value.restoring) {
      // keep the marker only while a provider could still reconnect
      if (evm.status === "disconnected" && !sol.connecting) {
        window.localStorage.removeItem(LAST_WALLET_KEY);
      }
    }
  }, [chain, graceElapsed, value.restoring, evm.status, sol.connecting]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWalletSession(): WalletSession {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWalletSession must be used inside <WalletSessionProvider>");
  return ctx;
}

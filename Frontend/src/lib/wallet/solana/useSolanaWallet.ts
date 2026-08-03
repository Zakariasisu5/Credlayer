import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SOLANA_NETWORK_LABEL } from "./SolanaProvider";
import { authApi } from "@/services/api";

const AUTH_KEY = "credlayer.solana.siws";

type SolanaSession = {
  address: string;
  signature: string; // base64
  message: string;
  issuedAt: string;
  walletProvider: string;
  network: string;
};

function loadSession(address?: string | null): SolanaSession | null {
  if (typeof window === "undefined" || !address) return null;
  try {
    const raw = localStorage.getItem(`${AUTH_KEY}:${address}`);
    return raw ? (JSON.parse(raw) as SolanaSession) : null;
  } catch {
    return null;
  }
}

function saveSession(s: SolanaSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${AUTH_KEY}:${s.address}`, JSON.stringify(s));
}

function clearSession(address?: string | null) {
  if (typeof window === "undefined" || !address) return;
  localStorage.removeItem(`${AUTH_KEY}:${address}`);
}

export function shortenSolAddress(addr?: string | null, size = 4) {
  if (!addr) return "";
  return `${addr.slice(0, size)}…${addr.slice(-size)}`;
}

function toBase64(bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bytes).toString("base64");
}

export function useSolanaWallet() {
  const {
    publicKey,
    connected,
    connecting,
    disconnecting,
    disconnect,
    wallet,
    signMessage,
    select,
    wallets,
  } = useWallet();
  const { connection } = useConnection();

  const address = publicKey?.toBase58() ?? null;
  const [session, setSession] = useState<SolanaSession | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [signing, setSigning] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadSession(address));
  }, [address]);

  // Fetch SOL balance + subscribe to changes
  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    let subId: number | null = null;
    let cancelled = false;
    connection
      .getBalance(publicKey)
      .then((lamports) => !cancelled && setBalance(lamports / LAMPORTS_PER_SOL))
      .catch(() => !cancelled && setBalance(null));
    try {
      subId = connection.onAccountChange(publicKey, (acc) => {
        setBalance(acc.lamports / LAMPORTS_PER_SOL);
      });
    } catch {
      /* ignore */
    }
    return () => {
      cancelled = true;
      if (subId !== null) connection.removeAccountChangeListener(subId).catch(() => {});
    };
  }, [connection, publicKey]);

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setAuthError("This wallet does not support message signing");
      return null;
    }
    setAuthError(null);
    setSigning(true);
    try {
      const address = publicKey.toBase58();

      // Get the challenge message from the backend (single source of truth
      // for the nonce - the server verifies the signed bytes match exactly
      // what it issued).
      const messageRes = await authApi.getSignMessage({
        walletAddress: address,
        chain: "solana",
      });
      const message = messageRes.data.message;

      const encoded = new TextEncoder().encode(message);
      const sig = await signMessage(encoded);
      const signature = toBase64(sig);

      // Authenticate with backend
      const authRes = await authApi.authenticateWallet({
        walletAddress: address,
        signature,
        message,
        chain: "solana",
      });

      const tokens = authRes.data.tokens;
      if (tokens?.accessToken) {
        localStorage.setItem("accessToken", tokens.accessToken);
      }
      if (tokens?.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }

      const issuedAt = new Date().toISOString();
      const s: SolanaSession = {
        address,
        signature,
        message,
        issuedAt,
        walletProvider: wallet?.adapter.name ?? "unknown",
        network: SOLANA_NETWORK_LABEL,
      };
      saveSession(s);
      setSession(s);
      return s;
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Signature rejected");
      return null;
    } finally {
      setSigning(false);
    }
  }, [publicKey, signMessage, wallet]);

  const signOut = useCallback(async () => {
    // Clear backend tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    clearSession(address);
    setSession(null);
    try {
      await disconnect();
    } catch {
      /* noop */
    }
  }, [address, disconnect]);

  const isValidAddress = useCallback((addr: string) => {
    try {
      new PublicKey(addr);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    address,
    publicKey,
    isConnected: connected,
    connecting,
    disconnecting,
    signing,
    authError,
    authenticated:
      !!session && !!address && session.address === address,
    session,
    walletName: wallet?.adapter.name ?? null,
    walletIcon: wallet?.adapter.icon ?? null,
    installedWallets: wallets,
    network: SOLANA_NETWORK_LABEL,
    balance,
    authenticate,
    signOut,
    disconnect,
    select,
    isValidAddress,
  };
}

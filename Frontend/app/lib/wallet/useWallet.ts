import { useAccount, useDisconnect, useSignMessage, useChainId } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { authApi } from "@/services/api";

const AUTH_KEY = "credlayer.siwe";

type SiweSession = {
  address: `0x${string}`;
  signature: `0x${string}`;
  message: string;
  issuedAt: string;
};

function loadSession(address?: string | null): SiweSession | null {
  if (typeof window === "undefined" || !address) return null;
  try {
    const raw = localStorage.getItem(`${AUTH_KEY}:${address.toLowerCase()}`);
    return raw ? (JSON.parse(raw) as SiweSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: SiweSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${AUTH_KEY}:${session.address.toLowerCase()}`, JSON.stringify(session));
}

function clearSession(address?: string | null) {
  if (typeof window === "undefined" || !address) return;
  localStorage.removeItem(`${AUTH_KEY}:${address.toLowerCase()}`);
}

export function shortenAddress(addr?: string | null, size = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

export function useWallet() {
  const { address, isConnected, status, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isPending: signing } = useSignMessage();
  const chainId = useChainId();

  const [session, setSession] = useState<SiweSession | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadSession(address));
  }, [address]);

  const authenticate = useCallback(async () => {
    if (!address) return null;
    setAuthError(null);

    try {
      // Get message from backend
      const messageRes = await authApi.getSignMessage({
        walletAddress: address,
        chain: String(chainId),
      });
      const message = messageRes.data.message;

      // Sign the message
      const signature = await signMessageAsync({ message });

      // Authenticate with backend
      const authRes = await authApi.authenticateWallet({
        walletAddress: address,
        signature,
        message,
        chain: String(chainId),
      });

      // Store tokens from backend
      const tokens = authRes.data.tokens;
      if (tokens?.accessToken) {
        localStorage.setItem("credlayer.access_token", tokens.accessToken);
      }
      if (tokens?.refreshToken) {
        localStorage.setItem("credlayer.refresh_token", tokens.refreshToken);
      }

      // Store session locally for UI state
      const issuedAt = new Date().toISOString();
      const s: SiweSession = { address, signature, message, issuedAt };
      saveSession(s);
      setSession(s);



      return s;
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Authentication failed");
      return null;
    }
  }, [address, chainId, signMessageAsync]);

  const signOut = useCallback(() => {
    // Clear backend tokens
    localStorage.removeItem("credlayer.access_token");
    localStorage.removeItem("credlayer.refresh_token");

    // Clear session
    clearSession(address);
    setSession(null);

    // Disconnect wallet
    disconnect();
  }, [address, disconnect]);

  return {
    address,
    isConnected,
    status,
    connector,
    chainId,
    session,
    authenticated: !!session && session.address.toLowerCase() === address?.toLowerCase(),
    signing,
    authError,
    authenticate,
    signOut,
    disconnect,
  };
}

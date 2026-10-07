"use client";

import { useEffect, useState, useRef } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../lib/client-provider";
import { apiClient } from "../lib/api-client";

/**
 * Complete wallet data type including all fields from backend
 */
export type WalletData = {
  walletAddress: string;
  score: {
    address?: string;
    trustScore: number;
    trustLevel?: string;
    riskLevel: string;
    confidence?: number;
    fraudProbability?: number;
    network?: string;
    explanation?: string;
  };
  attestation: {
    verified: boolean;
    alreadyExisted: boolean;
    trustScore: number;
    riskLevel: string;
  };
  txHash?: string;
  attestationPda?: string;
  timestamp: number;
};

export type WalletDataState = {
  data: WalletData | null;
  loading: boolean;
  error: string | null;
  exists: boolean;
  refetch: () => Promise<void>;
  walletAddress: string | null;
};

const CACHE_KEY = (wallet: string) => `credlayer_wallet_${wallet}`;

function loadCached(wallet: string): WalletData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY(wallet));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCached(wallet: string, data: WalletData) {
  try {
    localStorage.setItem(CACHE_KEY(wallet), JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function clearCached(wallet: string) {
  try {
    localStorage.removeItem(CACHE_KEY(wallet));
  } catch {
    // Non-fatal
  }
}

/**
 * Centralized hook for wallet data across all pages
 * 
 * Usage:
 * ```ts
 * const { data, loading, error, exists, refetch, walletAddress } = useWalletData();
 * 
 * if (!walletAddress) return <div>Connect wallet</div>;
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>{error}</div>;
 * 
 * return <div>Trust Score: {data.score.trustScore}</div>;
 * ```
 */
export function useWalletData(): WalletDataState {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address
    ? String(connectedWallet.account.address)
    : null;

  console.log('[useWalletData] Wallet connection state:', {
    hasClient: !!client,
    hasConnectedWallet: !!connectedWallet,
    walletAddress,
  });

  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  
  const previousWallet = useRef<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchWalletData = async (wallet: string, useCache = true) => {
    // Cancel any pending request
    if (abortController.current) {
      abortController.current.abort();
    }

    const controller = new AbortController();
    abortController.current = controller;

    console.log(`[useWalletData] Fetching data for wallet: ${wallet}`);
    setLoading(true);
    setError(null);

    // Try cache first
    let hasCachedData = false;
    if (useCache) {
      const cached = loadCached(wallet);
      if (cached) {
        console.log(`[useWalletData] Using cached data`);
        setData(cached);
        setExists(true);
        hasCachedData = true;
        // Continue to fetch fresh data in background
      }
    }

    try {
      const checkUrl = apiClient.getUri({
        url: `/scores/${encodeURIComponent(wallet)}/attestation/check`,
      });

      const response = await fetch(checkUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (response.ok) {
        const payload = await response.json().catch(() => ({}));

        if (payload.success && payload.exists && payload.attestation) {
          const trustScore = Number(payload.attestation.trustScore ?? 0);
          const riskLevel = String(payload.attestation.riskLevel ?? "unknown").toUpperCase();

          if (Number.isFinite(trustScore) && riskLevel) {
            const walletData: WalletData = {
              walletAddress: wallet,
              score: {
                trustScore,
                riskLevel,
                trustLevel: payload.attestation.trustLevel,
                confidence: payload.attestation.confidence,
                fraudProbability: payload.attestation.fraudProbability,
                network: payload.attestation.network || "solana",
                explanation: payload.attestation.explanation,
              },
              attestation: {
                verified: true,
                alreadyExisted: true,
                trustScore,
                riskLevel,
              },
              attestationPda: payload.attestation.attestationPda,
              txHash: payload.attestation.txHash,
              timestamp: Date.now(),
            };

            setData(walletData);
            setExists(true);
            setError(null);
            saveCached(wallet, walletData);
            console.log(`[useWalletData] Loaded existing attestation`);
            setLoading(false);
            return;
          }
        }
      }

      // No attestation found from server
      console.log(`[useWalletData] No attestation found for wallet`);
      
      // Only clear data if we don't have cached data
      if (!hasCachedData) {
        setData(null);
        setExists(false);
      } else {
        console.log(`[useWalletData] Keeping cached data since server returned no data`);
      }
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      
      console.error(`[useWalletData] Error fetching wallet data:`, err);
      
      // Only show error if we don't have cached data
      if (!hasCachedData) {
        setError("Failed to load wallet data");
        setData(null);
        setExists(false);
      } else {
        console.log(`[useWalletData] Keeping cached data despite fetch error`);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        if (abortController.current === controller) {
          abortController.current = null;
        }
      }
    }
  };

  // Effect: Handle wallet connection/disconnection/change
  useEffect(() => {
    const walletChanged = previousWallet.current !== walletAddress;
    previousWallet.current = walletAddress;

    if (!walletChanged) return;

    if (!walletAddress) {
      // Wallet disconnected
      console.log(`[useWalletData] Wallet disconnected`);
      setData(null);
      setExists(false);
      setError(null);
      setLoading(false);
      return;
    }

    // New wallet connected
    fetchWalletData(walletAddress);

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [walletAddress]);

  const refetch = async () => {
    if (!walletAddress) return;
    clearCached(walletAddress);
    await fetchWalletData(walletAddress, false);
  };

  return {
    data,
    loading,
    error,
    exists,
    refetch,
    walletAddress,
  };
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWalletSession } from "@/lib/wallet/session";
import { walletsApi } from "@/services/api";
import type { Wallet, WalletActivity } from "@/types/wallet";

/**
 * Wallet-scoped data layer.
 *
 * Each hook is a TanStack Query keyed on the connected address so every widget
 * shares one cache entry, refetches in the background, and invalidates
 * automatically when the connected wallet changes.
 */

const COMMON = {
  staleTime: 60_000,
  gcTime: 10 * 60_000,
  refetchOnWindowFocus: true,
  retry: 1,
} as const;

export function reputationQueryKey(address: string | null) {
  return ["reputation", address] as const;
}

export function useReputation() {
  const { address, authenticated } = useWalletSession();
  return useQuery<Wallet>({
    queryKey: reputationQueryKey(address),
    enabled: !!address && authenticated,
    queryFn: async () => {
      if (!address) throw new Error("No address connected");
      const res = await walletsApi.getWalletReputation(address);
      return res.data;
    },
    ...COMMON,
  });
}

export function useWalletActivity() {
  const { address, authenticated } = useWalletSession();
  return useQuery<WalletActivity[]>({
    queryKey: ["wallet-activity", address],
    enabled: !!address && authenticated,
    queryFn: async () => {
      if (!address) throw new Error("No address connected");
      const res = await walletsApi.getWalletActivity(address);
      return res.data;
    },

    ...COMMON,
  });
}

/** Refresh every wallet-scoped query — used on connect, reconnect and refresh. */
export function useWalletDataSync() {
  const queryClient = useQueryClient();
  const { address, authenticated } = useWalletSession();

  useEffect(() => {
    if (!address || !authenticated) return;
    queryClient.invalidateQueries({ queryKey: ["reputation"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-activity"] });
  }, [address, authenticated, queryClient]);
}

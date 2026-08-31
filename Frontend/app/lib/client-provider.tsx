"use client";

import { useMemo, type ReactNode } from "react";
import { ClientProvider, useClient } from "@solana/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppClient, type AppClient } from "./solana-client";
import { useCluster } from "../components/cluster-context";

export function AppClientProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const client = useMemo(() => createAppClient(cluster), [cluster]);
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000,
        retry: 2,
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider client={client}>{children}</ClientProvider>
    </QueryClientProvider>
  );
}

export function useAppClient() {
  return useClient<AppClient>();
}

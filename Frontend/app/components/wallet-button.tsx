"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { WalletCards } from "lucide-react";
import { address, formatDecimalFixedPoint, lamportsToSol } from "@solana/kit";
import {
  useWallets,
  useConnect,
  useDisconnect,
  useConnectedWallet,
  useWalletStatus,
} from "@solana/kit-plugin-wallet/react";
import { useBalance } from "../lib/hooks/use-balance";
import { ellipsify } from "../lib/explorer";
import { useCluster } from "./cluster-context";
import { useAppClient } from "../lib/client-provider";

// Prevent hydration mismatch by only showing wallet state after mount
function useHasMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

const solFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 5,
});

function formatWalletError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("denied")) return "Connection request was rejected.";
  if (normalized.includes("locked")) return "Unlock your wallet extension and try again.";
  if (normalized.includes("timeout") || normalized.includes("timed out")) return "The wallet took too long to respond. Try again.";
  if (normalized.includes("not found") || normalized.includes("not installed")) return "Install a Solana wallet extension to continue.";
  return message.length > 180 ? `${message.slice(0, 180)}…` : message;
}

function getWalletBrowseUrl(wallet: "phantom" | "solflare" | "backpack") {
  if (typeof window === "undefined") return "#";
  const pageUrl = encodeURIComponent(window.location.href);
  const browseUrls = {
    phantom: `https://phantom.app/ul/browse/${pageUrl}?ref=${pageUrl}`,
    solflare: `https://solflare.com/ul/v1/browse/${pageUrl}`,
    backpack: `https://backpack.app/ul/browse/${pageUrl}`,
  };
  return browseUrls[wallet];
}

export function WalletButton() {
  const hasMounted = useHasMounted();
  const client = useAppClient();
  const wallets = useWallets(client);
  const status = useWalletStatus(client);
  const connected = useConnectedWallet(client);
  const { dispatch: connect, error } = useConnect(client);
  const { dispatch: disconnect } = useDisconnect(client);

  const { getExplorerUrl } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requestingWallet, setRequestingWallet] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const walletAddress = connected?.account.address;
  const balance = useBalance(
    walletAddress ? address(walletAddress) : undefined
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const isConnecting = status === "connecting" || (requestingWallet !== null && error == null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (insecure origin) or permission denied.
    }
  };

  // Show a placeholder during SSR and initial client render to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="relative">
        <button
          disabled
          aria-label="Connect wallet"
          className="flex size-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-2 py-2 text-xs font-medium text-primary-foreground shadow-xs opacity-50 sm:h-auto sm:w-auto sm:px-4"
        >
          <WalletCards className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => (isOpen ? close() : open())}
          aria-label="Connect wallet"
          title="Connect wallet"
          className="flex size-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-2 py-2 text-xs font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 sm:h-auto sm:w-auto sm:px-4"
        >
          <WalletCards className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border-low bg-card p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-muted">
              Choose a wallet
            </p>
            {wallets.length === 0 ? (
              <div className="flex flex-col gap-2 text-xs text-muted">
                <p>No wallet extension was detected. On mobile, open CredLayer inside a wallet app to connect.</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["phantom", "solflare", "backpack"] as const).map((wallet) => (
                    <a
                      key={wallet}
                      className="rounded-lg border border-border-low px-2 py-2 text-center font-medium capitalize text-foreground transition hover:bg-cream"
                      href={getWalletBrowseUrl(wallet)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {wallet}
                    </a>
                  ))}
                </div>
                <p className="pt-1 text-[11px] text-muted-foreground">
                  Desktop users can install a wallet extension:
                  <span className="ml-1">
                    <a className="text-primary underline underline-offset-4" href="https://phantom.app/download" target="_blank" rel="noreferrer">Phantom</a>
                    {" or "}
                    <a className="text-primary underline underline-offset-4" href="https://backpack.app/download" target="_blank" rel="noreferrer">Backpack</a>
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={async () => {
                      if (isConnecting) return;
                      setRequestingWallet(wallet.name);
                      setRequestError(null);
                      try {
                        await Promise.race([
                          Promise.resolve(connect(wallet)),
                          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Wallet connection timed out.")), 15000)),
                        ]);
                      } catch (connectionError) {
                        setRequestingWallet(null);
                        setRequestError(formatWalletError(connectionError));
                      }
                    }}
                    disabled={isConnecting}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-cream disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {wallet.icon && (
                      // eslint-disable-next-line @next/next/no-img-element -- wallet-standard icons are data URIs
                      <img
                        src={wallet.icon}
                        alt=""
                        className="h-5 w-5 rounded"
                      />
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))}
              </div>
            )}
            {isConnecting && (
              <p className="mt-2 text-xs text-muted">Connecting to {requestingWallet ?? "wallet"}… Keep this menu open.</p>
            )}
            {(requestError || error != null) && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {requestError ?? formatWalletError(error)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => (isOpen ? close() : open())}
        aria-label={`Wallet connected: ${ellipsify(walletAddress!, 4)}`}
        title="Wallet account"
        className="flex size-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border-low bg-card px-2 py-2 text-xs font-medium transition hover:bg-cream sm:h-auto sm:w-auto sm:px-3"
      >
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <WalletCards className="size-4 sm:hidden" aria-hidden="true" />
        <span className="hidden font-mono sm:inline">{ellipsify(walletAddress!, 4)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border-low bg-card p-4 shadow-lg">
          <div className="mb-3">
            <p className="text-xs text-muted">Balance</p>
            <p className="text-lg font-bold tabular-nums">
              {balance.lamports != null
                ? formatDecimalFixedPoint(
                    solFormatter,
                    lamportsToSol(balance.lamports)
                  )
                : "—"}{" "}
              <span className="text-sm font-normal text-muted">SOL</span>
            </p>
          </div>

          <div className="mb-3 rounded-lg border border-border-low bg-cream/50 px-3 py-2">
            <p className="break-all font-mono text-xs">{walletAddress}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            <a
              href={getExplorerUrl(`/address/${walletAddress}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-border-low bg-card px-3 py-2 text-center text-xs font-medium transition hover:bg-cream"
            >
              Explorer
            </a>
          </div>

          <button
            onClick={() => {
              disconnect();
              close();
            }}
            className="mt-2 w-full cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

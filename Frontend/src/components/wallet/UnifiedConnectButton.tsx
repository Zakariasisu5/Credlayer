import { useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Link } from "@tanstack/react-router";
import {
  Wallet,
  ChevronDown,
  LogOut,
  UserRound,
  Settings2,
  ShieldCheck,
  Copy,
  Check,
  RefreshCcw,
  ExternalLink,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletSession } from "@/lib/wallet/session";

/**
 * Single "Connect Wallet" entry point for the whole app. Opens a wallet
 * chooser (Solana first, EVM kept for multi-chain expansion) and switches to
 * the connected-address dropdown once a session exists.
 */
export function UnifiedConnectButton({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = useWalletSession();
  const { open } = useAppKit();
  const { setVisible: setSolanaVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!s.address) return;
    try {
      await navigator.clipboard.writeText(s.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const btnClass = size === "lg" ? "h-12 px-6 text-base" : "";

  // Restoring a persisted session
  if (s.restoring) {
    return (
      <Button size={size === "lg" ? "lg" : "sm"} variant="glass" disabled className={btnClass}>
        <Loader2 className="size-4 animate-spin" />
        Restoring your wallet…
      </Button>
    );
  }

  if (!s.isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={size === "lg" ? "lg" : "sm"} variant="gold" className={btnClass}>
            <Wallet className="size-4" />
            Connect Wallet
            <ChevronDown className="size-3.5 opacity-80" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 glass-strong border-border">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Choose a network
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSolanaVisible(true)} className="cursor-pointer">
            <Wallet className="size-4" />
            <div className="flex flex-col">
              <span className="text-sm">Solana Wallet</span>
              <span className="text-[11px] text-muted-foreground">Phantom, Solflare, Backpack…</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => open()} className="cursor-pointer">
            <Wallet className="size-4" />
            <div className="flex flex-col">
              <span className="text-sm">EVM Wallet</span>
              <span className="text-[11px] text-muted-foreground">MetaMask, WalletConnect, Coinbase…</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (!s.authenticated) {
    return (
      <Button
        size={size === "lg" ? "lg" : "sm"}
        variant="gold"
        onClick={() => s.authenticate()}
        disabled={s.signing}
        className={btnClass}
      >
        <ShieldCheck className="size-4" />
        {s.signing ? "Sign in wallet…" : "Sign to verify"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="glass rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-2 hover:bg-elevated-strong transition-colors">
          {s.walletIcon ? (
            <img src={s.walletIcon} alt="" className="size-4 rounded-sm" />
          ) : (
            <Wallet className="size-3.5 text-gold" />
          )}
          {s.shortAddress}
          <span className="size-1.5 rounded-full bg-success animate-pulse" aria-label="Connected" />
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 glass-strong border-border">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" /> {s.networkLabel}
          </span>
          <span className="normal-case tracking-normal text-muted-foreground/80">{s.walletName}</span>
        </DropdownMenuLabel>
        <div className="px-2 pb-2 space-y-1.5">
          <div className="flex items-center justify-between rounded-md bg-inset px-2.5 py-1.5">
            <span className="font-mono text-xs">{s.displayAddress}</span>
            <button onClick={copy} className="text-muted-foreground hover:text-foreground" aria-label="Copy wallet address">
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
            </button>
          </div>
          {s.balanceLabel && (
            <div className="flex items-center justify-between rounded-md bg-inset px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">Balance</span>
              <span className="font-mono">{s.balanceLabel}</span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copy} className="cursor-pointer">
          <Copy className="size-4" /> Copy wallet address
        </DropdownMenuItem>
        {s.explorerUrl && (
          <DropdownMenuItem asChild>
            <a href={s.explorerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 cursor-pointer">
              <ExternalLink className="size-4" /> View on explorer
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/app" className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="size-4" /> Reputation Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/profile" className="flex items-center gap-2 cursor-pointer">
            <UserRound className="size-4" /> View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings2 className="size-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => (s.chain === "evm" ? open({ view: "Networks" }) : setSolanaVisible(true))}
          className="cursor-pointer"
        >
          <RefreshCcw className="size-4" /> {s.chain === "evm" ? "Switch network" : "Switch wallet"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => s.signOut()} className="text-danger focus:text-danger cursor-pointer">
          <LogOut className="size-4" /> Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

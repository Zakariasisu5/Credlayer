"use client";

import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletSession } from "@/lib/wallet/session";
import { useState } from "react";

export function ConnectWalletButton({ 
  className = "h-9",
  showIcon = true,
  fullWidth = false 
}: { 
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}) {
  const { open: openEvmModal } = useAppKit();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const session = useWalletSession();
  const [isOpening, setIsOpening] = useState(false);

  const handleConnect = async () => {
    try {
      setIsOpening(true);
      // Open EVM wallet modal by default
      // You can add a chain selector here later
      await openEvmModal();
    } catch (error) {
      console.error("Failed to open wallet modal:", error);
    } finally {
      setIsOpening(false);
    }
  };

  const handleGoToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/app';
    }
  };

  // Show loading state while restoring session
  if (session.restoring) {
    return (
      <Button 
        size="sm" 
        variant="gold" 
        className={className}
        disabled
      >
        <Loader2 className="mr-1.5 size-4 animate-spin" />
        <span className="hidden sm:inline">Connecting...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  // Show connected state
  if (session.isConnected) {
    return (
      <Button 
        size="sm" 
        variant="gold" 
        className={className}
        onClick={handleGoToDashboard}
      >
        {showIcon && session.walletIcon && (
          <img 
            src={session.walletIcon} 
            alt={session.walletName || "Wallet"} 
            className="mr-1.5 size-4 rounded-full"
          />
        )}
        <span className="hidden sm:inline">{session.displayAddress}</span>
        <span className="sm:hidden">{session.shortAddress}</span>
      </Button>
    );
  }

  // Show connect button
  return (
    <Button 
      size="sm" 
      variant="gold" 
      className={className}
      onClick={handleConnect}
      disabled={isOpening}
    >
      {isOpening ? (
        <Loader2 className="mr-1.5 size-4 animate-spin" />
      ) : showIcon ? (
        <Wallet className="mr-1.5 size-4" />
      ) : null}
      <span className="hidden sm:inline">
        {isOpening ? "Opening..." : "Connect Wallet"}
      </span>
      <span className="sm:hidden">
        {isOpening ? "..." : "Connect"}
      </span>
    </Button>
  );
}

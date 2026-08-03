import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TrustGraph } from "./TrustGraph";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";


export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-gold" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              CredLayer Protocol · Reputation infrastructure
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] md:leading-[1.02]"
            >
              The <span className="text-gold">Reputation Layer</span>
              <br />
              for Web3.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Decentralized reputation scoring for wallets, users, and AI agents.
              On-chain behavior, verified credentials, and trust graphs — unified
              into a single portable identity across every chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3"
            >
              <Button asChild size="lg" variant="gold" className="h-12 px-6 text-base w-full sm:w-auto">
                <Link to="/app">
                  <Wallet className="size-4" />
                  Connect Wallet
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass" className="h-12 px-6 text-base w-full sm:w-auto">
                <Link to="/app/explorer" search={{ q: undefined }}>
                  Explore Network
                  <ArrowRight size={16} className="text-current" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" /> Non-custodial · signature sign-in only
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span>Multi-chain EVM & Solana</span>
                <span>Portable credentials</span>
                <span>Developer API</span>
              </div>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="justify-self-center lg:justify-self-end w-full flex justify-center"
          >
            <TrustGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}


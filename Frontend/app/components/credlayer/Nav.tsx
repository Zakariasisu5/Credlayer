"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/credlayer/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

const links = [
  { label: "Protocol", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Developers", href: "/app/developers" as const },
  { label: "Explorer", href: "/app/explorer" as const },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="glass-strong rounded-2xl px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <Logo className="h-7 sm:h-8" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) =>
                l.href.startsWith("/") ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <Link
                href="/app"
                className="hidden lg:inline-flex items-center rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-elevated-strong transition-colors"
              >
                Open App
              </Link>
              <ConnectWalletButton />
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="md:hidden flex size-9 items-center justify-center rounded-md text-foreground hover:bg-elevated-strong transition-colors"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                  {links.map((l) =>
                    l.href.startsWith("/") ? (
                      <Link
                        key={l.label}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        key={l.label}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    ),
                  )}
                  <Link
                    href="/app"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
                  >
                    Open App
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

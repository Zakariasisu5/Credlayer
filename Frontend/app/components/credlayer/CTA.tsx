"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export function CTA() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative overflow-hidden rounded-3xl px-5 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20 text-center"
        >
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.1] sm:leading-[1.05]">
              Build on the <span className="text-gold">trust layer</span>
              <br className="hidden md:block" /> of the open web.
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
              Connect a wallet, mint a CredLayer identity, or plug reputation into your
              product with two lines of code.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="gold" className="h-12 px-6 text-base w-full sm:w-auto">
                <Link href="/app">
                  <Wallet className="size-4" /> Connect Wallet
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass" className="h-12 px-6 text-base w-full sm:w-auto">
                <Link href="/app/developers">
                  Read the Docs <ArrowRight size={16} className="text-current" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type FooterLink = { label: string; href: string };
const footerCols: { h: string; l: FooterLink[] }[] = [
  {
    h: "Protocol",
    l: [
      { label: "Overview", href: "#features" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Explorer", href: "/app/explorer" },
      { label: "Credentials", href: "/app/credentials" },
    ],
  },
  {
    h: "Developers",
    l: [
      { label: "API", href: "/app/developers" },
      { label: "AI Agents", href: "/app/agents" },
      { label: "Settings", href: "/app/settings" },
      { label: "Status", href: "#dashboard" },
    ],
  },
  {
    h: "Company",
    l: [
      { label: "About", href: "#features" },
      { label: "Open App", href: "/app" },
      { label: "Profile", href: "/app/profile" },
      { label: "Contact", href: "mailto:hello@credlayer.io" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/">
            <Logo className="h-8" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            The reputation layer for wallets, users, and AI agents across the open web.
          </p>
        </div>
        {footerCols.map((c) => (
          <div key={c.h}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {c.h}
            </div>
            <ul className="space-y-2 text-sm">
              {c.l.map((i) => (
                <li key={i.label}>
                  {i.href.startsWith("/") && !i.href.startsWith("mailto:") ? (
                    <Link
                      href={i.href}
                      className="inline-block py-1 text-foreground/80 hover:text-foreground"
                    >
                      {i.label}
                    </Link>
                  ) : (
                    <a
                      href={i.href}
                      className="inline-block py-1 text-foreground/80 hover:text-foreground"
                    >
                      {i.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CredLayer Labs. All rights reserved.</div>
          <div className="font-mono">v1.0.0 · mainnet</div>
        </div>
      </div>
    </footer>
  );
}

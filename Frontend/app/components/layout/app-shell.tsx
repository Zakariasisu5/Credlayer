"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Activity, 
  ArrowLeft,
  ArrowRight, 
  BarChart3, 
  Code2, 
  LayoutDashboard, 
  Menu, 
  Radar, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  UserRound, 
  X 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WalletButton } from "../wallet-button";
import { Header, Brand } from "../layout";
import { Button } from "../ui";

export const appNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/dashboard", label: "Dashboard", icon: Radar },
  { href: "/app/profile", label: "Profile", icon: UserRound },
  { href: "/app/analysis", label: "Analysis", icon: BarChart3 },
  { href: "/app/agents", label: "Agents", icon: Sparkles },
  { href: "/app/credentials", label: "Credentials", icon: ShieldCheck },
  { href: "/app/activity", label: "Activity", icon: Activity },
  { href: "/app/settings", label: "Settings", icon: Settings }
];

export const developerNav: { href: string; label: string }[] = [
  { href: "/developers/dashboard", label: "Dashboard" },
  { href: "/developers/api-keys", label: "API keys" },
  { href: "/developers/docs", label: "Documentation" },
  { href: "/developers/sdk", label: "SDK" }
];

function AppSidebar({ developer = false }: { developer?: boolean }) {
  const items = developer ? developerNav.map((item) => ({ ...item, icon: Code2 })) : appNav;
  const pathname = usePathname();
  
  return (
    <aside className="sticky top-0 h-screen w-60 shrink-0 border-r border-border bg-card/40 p-4 overflow-y-auto hidden lg:block">
      <div className="mb-8 px-2">
        <Brand />
      </div>
      <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {developer ? "Developer console" : "Workspace"}
      </p>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon: LucideIcon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      {!developer && (
        <div className="mt-6">
          <Link
            href="/developers/dashboard"
            className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm transition hover:bg-primary/10 hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <Code2 className="size-4 text-primary" />
              <span className="font-medium text-primary">Developers Portal</span>
            </div>
            <ArrowRight className="size-3.5 text-primary" />
          </Link>
        </div>
      )}
      {developer && (
        <div className="mt-6">
          <Link
            href="/app"
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-accent/50 px-3 py-2.5 text-sm transition hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <ArrowLeft className="size-4" />
              <span className="font-medium">Back to Workspace</span>
            </div>
          </Link>
        </div>
      )}
      <div className="mt-auto pt-16">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <p className="text-xs font-semibold">Need help?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Read the docs or talk to the community.
          </p>
          <Button href="/developers/docs" variant="ghost">
            Open docs <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function WalletControl() {
  return <WalletButton />;
}

export function Shell({ 
  children, 
  title, 
  eyebrow, 
  developer = false 
}: { 
  children: React.ReactNode; 
  title?: string; 
  eyebrow?: string; 
  developer?: boolean 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = developer ? developerNav.map((item) => ({ ...item, icon: Code2 })) : appNav;
  const pathname = usePathname();
  
  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px]">
        {title && <AppSidebar developer={developer} />}
        <main className="min-w-0 flex-1">
          {title && (
            <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-5 py-7 lg:px-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle menu"
                  >
                    <Menu className="size-5" />
                  </button>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                      {eyebrow || "CredLayer"}
                    </p>
                    <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight lg:text-3xl">
                      {title}
                    </h1>
                  </div>
                </div>
                <WalletControl />
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
      
      {/* Mobile menu overlay */}
      {title && (
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`absolute left-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-xl border-r border-border shadow-xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Brand />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
              <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {developer ? "Developer console" : "Workspace"}
              </p>
              <div className="flex flex-col gap-1">
                {items.map((item) => {
                  const Icon: LucideIcon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              {!developer && (
                <div className="mt-6">
                  <Link
                    href="/developers/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm transition hover:bg-primary/10 hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="size-4 text-primary" />
                      <span className="font-medium text-primary">Developers Portal</span>
                    </div>
                    <ArrowRight className="size-3.5 text-primary" />
                  </Link>
                </div>
              )}
              {developer && (
                <div className="mt-6">
                  <Link
                    href="/app"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-accent/50 px-3 py-2.5 text-sm transition hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowLeft className="size-4" />
                      <span className="font-medium">Back to Workspace</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  UserRound,
  Search,
  Bot,
  BadgeCheck,
  Code2,
  Settings2,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/credlayer/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UnifiedConnectButton } from "@/components/wallet/UnifiedConnectButton";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/profile", label: "Reputation", icon: UserRound },
  { to: "/app/explorer", label: "Explorer", icon: Search },
  { to: "/app/agents", label: "AI Agents", icon: Bot },
  { to: "/app/credentials", label: "Credentials", icon: BadgeCheck },
  { to: "/app/developers", label: "Developers", icon: Code2 },
  { to: "/app/settings", label: "Settings", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  
  // Check if we're on developer pages
  const isDeveloperPage = pathname.startsWith("/app/developers");

  // If on developer pages, render children without app shell navigation
  if (isDeveloperPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar — desktop */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: desktopCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden lg:flex fixed inset-y-0 left-0 flex-col p-4 z-40"
        >
          <div className="glass-strong flex-1 rounded-2xl p-4 flex flex-col relative overflow-hidden">
            <Link to="/" className="px-2 pb-4">
              {desktopCollapsed ? (
                <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">C</span>
                </div>
              ) : (
                <Logo className="h-8" />
              )}
            </Link>
            <SidebarLinks pathname={pathname} collapsed={desktopCollapsed} />
            {!desktopCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-auto pt-4 border-t border-border"
              >
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pb-2">
                  Protocol
                </div>
                <div className="text-xs text-muted-foreground px-2">v1.0 · Mainnet</div>
                <div className="mt-1.5 px-2 flex items-center gap-1.5 text-[11px] text-success">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" /> All systems
                  operational
                </div>
              </motion.div>
            )}

            {/* Toggle Button - Better Positioned */}
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 
                       w-9 h-9 rounded-full 
                       bg-background/95 backdrop-blur-sm
                       border-2 border-border
                       shadow-[0_0_20px_rgba(0,0,0,0.3)]
                       flex items-center justify-center
                       hover:border-gold/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]
                       hover:scale-110
                       active:scale-95
                       transition-all duration-200 group"
              aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {desktopCollapsed ? (
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-gold transition-colors relative z-10" />
              ) : (
                <ChevronLeft className="size-4 text-muted-foreground group-hover:text-gold transition-colors relative z-10" />
              )}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Top bar */}
      <header
        className="sticky top-0 z-30 transition-all duration-300 lg:block hidden lg:pl-[var(--sidebar-w)]"
        style={{ "--sidebar-w": desktopCollapsed ? "80px" : "256px" } as React.CSSProperties}
      >
        <div className="p-4">

          <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="glass flex items-center gap-2 rounded-lg px-3 py-1.5 w-full">
                <Search className="size-3.5 text-muted-foreground" />
                <input
                  className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/70 font-mono"
                  placeholder="Search wallet address, ENS, or agent…"
                />
                <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                  ⌘K
                </kbd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UnifiedConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Top bar - Mobile */}
      <header className="lg:hidden sticky top-0 z-30">
        <div className="p-4">
          <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5">
            <button
              className="text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Logo className="h-7" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UnifiedConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-40 p-4"
            >
              <div className="glass-strong flex-1 rounded-2xl p-4 flex flex-col h-full">
                <Link to="/" className="px-2 pb-4" onClick={() => setMobileOpen(false)}>
                  <Logo className="h-8" />
                </Link>
                <SidebarLinks
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  collapsed={false}
                />
              </div>
            </motion.aside>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              className="lg:hidden fixed inset-0 z-30 bg-overlay backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main
        className="transition-all duration-300 min-h-screen lg:pl-[var(--sidebar-w)]"
        style={{ "--sidebar-w": desktopCollapsed ? "80px" : "256px" } as React.CSSProperties}
      >
        <div className="p-3 sm:p-4 pt-2 pb-16">{children}</div>
      </main>

    </div>
  );
}

function SidebarLinks({
  pathname,
  onNavigate,
  collapsed,
}: {
  pathname: string;
  onNavigate?: () => void;
  collapsed: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={
              "group flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors relative " +
              (collapsed ? "justify-center" : "gap-2.5") +
              " " +
              (active
                ? "bg-elevated-strong text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-elevated]")
            }
            title={collapsed ? item.label : undefined}
          >
            <Icon
              className={
                "size-5 shrink-0 transition-colors " +
                (active ? "text-gold" : "text-muted-foreground group-hover:text-foreground")
              }
            />
            {!collapsed && (
              <>
                <span className="truncate flex-1">{item.label}</span>
                {active && <span className="size-1.5 rounded-full bg-gold shrink-0" />}
              </>
            )}
            {collapsed && active && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-gold" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

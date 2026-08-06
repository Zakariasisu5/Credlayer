import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Book,
  Code2,
  FileCode,
  Webhook,
  Terminal,
  Key,
  BarChart3,
  AlertCircle,
  Zap,
  Package,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type NavItem = {
  label: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: Omit<NavItem, "children">[];
};

const navigation: NavItem[] = [
  {
    label: "Overview",
    to: "/app/developers",
    icon: Book,
  },
  {
    label: "Quick Start",
    to: "/app/developers/quickstart",
    icon: Zap,
  },
  {
    label: "Documentation",
    icon: Book,
    children: [
      { label: "Getting Started", to: "/app/developers/docs/getting-started", icon: Book },
      { label: "Authentication", to: "/app/developers/docs/authentication", icon: Key },
      { label: "Wallet Analysis", to: "/app/developers/docs/wallet-analysis", icon: FileCode },
      { label: "Reputation Engine", to: "/app/developers/docs/reputation", icon: BarChart3 },
      { label: "AI Analysis", to: "/app/developers/docs/ai-analysis", icon: Code2 },
      { label: "Best Practices", to: "/app/developers/docs/best-practices", icon: Zap },
    ],
  },
  {
    label: "API Reference",
    to: "/app/developers/api-reference",
    icon: Code2,
  },
  {
    label: "SDKs",
    icon: Package,
    children: [
      { label: "JavaScript", to: "/app/developers/sdks/javascript", icon: FileCode },
      { label: "TypeScript", to: "/app/developers/sdks/typescript", icon: FileCode },
      { label: "Python", to: "/app/developers/sdks/python", icon: FileCode },
      { label: "cURL", to: "/app/developers/sdks/curl", icon: Terminal },
    ],
  },
  {
    label: "Webhooks",
    to: "/app/developers/webhooks",
    icon: Webhook,
  },
  {
    label: "Error Codes",
    to: "/app/developers/errors",
    icon: AlertCircle,
  },
  {
    label: "Rate Limits",
    to: "/app/developers/rate-limits",
    icon: Zap,
  },
  {
    label: "API Keys",
    to: "/app/developers/api-keys",
    icon: Key,
  },
  {
    label: "Dashboard",
    to: "/app/developers/dashboard",
    icon: BarChart3,
  },
];

export function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Back to App Button */}
            <button
              onClick={() => navigate({ to: "/app" })}
              className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors group"
              title="Back to App"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center 
                            bg-elevated] hover:bg-elevated-strong 
                            border border-border hover:border-gold/30
                            transition-all group-hover:shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                <ArrowLeft className="size-4" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">Back to App</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-elevated-strong" />

            {/* Mobile Menu & Logo */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link to="/app/developers" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Code2 className="size-5 text-gold" />
              <span className="font-semibold">Developers</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="glass rounded-lg px-2 sm:px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search docs...</span>
              <kbd className="hidden md:inline text-[10px] border border-border rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <Button variant="gold" size="sm" className="text-xs sm:text-sm" asChild>
              <Link to="/app/developers/api-keys">
                <span className="hidden sm:inline">Get API Key</span>
                <span className="sm:hidden">API Key</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar Navigation - Desktop */}
        <AnimatePresence mode="wait">
          <motion.aside
            initial={false}
            animate={{ width: desktopCollapsed ? 64 : 256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden lg:block fixed inset-y-0 left-0 z-30 border-r border-border bg-background pt-14 overflow-hidden"
          >
            <nav className="h-full overflow-y-auto p-4 space-y-1">
              {navigation.map((item) => (
                <NavItemComponent
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  collapsed={desktopCollapsed}
                />
              ))}
            </nav>

            {/* Toggle Button - Better Positioned */}
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="absolute right-0 top-20 translate-x-1/2 z-50 
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
          </motion.aside>
        </AnimatePresence>

        {/* Sidebar Navigation - Mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background pt-14 shadow-2xl"
              >
                <nav className="h-full overflow-y-auto p-4 space-y-1">
                  {navigation.map((item) => (
                    <NavItemComponent
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      collapsed={false}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </nav>
              </motion.aside>

              {/* Mobile Overlay */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm lg:hidden"
                aria-label="Close menu"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className="flex-1 min-h-screen transition-all duration-300 lg:ml-[var(--dev-sidebar-w)]"
          style={{ "--dev-sidebar-w": desktopCollapsed ? "64px" : "256px" } as React.CSSProperties}
        >
          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

function NavItemComponent({
  item,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(
    item.children?.some((child) => pathname.startsWith(child.to || "")) ?? false
  );

  if (item.children) {
    // Don't show nested items when collapsed
    if (collapsed) {
      // Show parent button only - no expansion in collapsed mode
      const hasActiveChild = item.children.some((child) => pathname === child.to);
      return (
        <button
          onClick={() => !collapsed && setExpanded(!expanded)}
          className={`
            flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors relative
            ${collapsed ? "justify-center" : "justify-between"}
            ${hasActiveChild ? "bg-elevated-strong text-foreground" : "text-muted-foreground hover:bg-elevated] hover:text-foreground"}
          `}
          title={item.label}
        >
          <item.icon className={`size-5 shrink-0 ${hasActiveChild ? "text-gold" : ""}`} />
          {collapsed && hasActiveChild && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-gold" />
          )}
        </button>
      );
    }

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-elevated] hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          {expanded ? (
            <ChevronDown className="size-3.5 shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0" />
          )}
        </button>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-3 mt-1 space-y-1 border-l border-border pl-3 overflow-hidden"
          >
            {item.children.map((child) => {
              const isActive = pathname === child.to;
              return (
                <Link
                  key={child.to}
                  to={child.to!}
                  onClick={onNavigate}
                  className={`
                    flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors
                    ${
                      isActive
                        ? "bg-elevated-strong text-gold"
                        : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
                    }
                  `}
                >
                  <child.icon className="size-3.5 shrink-0" />
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    );
  }

  const isActive = pathname === item.to;
  return (
    <Link
      to={item.to!}
      onClick={onNavigate}
      className={`
        flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors relative
        ${collapsed ? "justify-center" : "gap-2"}
        ${
          isActive
            ? "bg-elevated-strong text-foreground"
            : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
        }
      `}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className={`size-5 shrink-0 ${isActive ? "text-gold" : ""}`} />
      {!collapsed && (
        <>
          <span className="truncate flex-1">{item.label}</span>
          {isActive && <span className="size-1.5 rounded-full bg-gold shrink-0" />}
        </>
      )}
      {collapsed && isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-gold" />
      )}
    </Link>
  );
}

"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    // Show system as default during hydration
    return (
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground" aria-label="Light mode" disabled>
          <Sun className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground" aria-label="Dark mode" disabled>
          <Moon className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground" aria-label="System mode" disabled>
          <Monitor className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          theme === "light"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          theme === "dark"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          theme === "system"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-label="System mode"
        title="System mode"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}

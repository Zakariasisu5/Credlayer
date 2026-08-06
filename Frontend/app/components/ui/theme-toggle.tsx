import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Single-button dark/light switch. Uses design tokens only so it reads
 * correctly in both themes.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "glass relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg",
        "text-muted-foreground transition-colors hover:bg-elevated-strong hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ y: 8, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -8, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4 text-gold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

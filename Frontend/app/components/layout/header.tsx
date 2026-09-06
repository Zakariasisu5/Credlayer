"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { FaHome, FaServicestack, FaBriefcase, FaInfoCircle, FaBlog, FaEnvelope } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Brand } from "./brand";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  color: string;
}

const navigationItems: NavItem[] = [
  { href: "/", label: "Home", icon: FaHome, color: "#3b82f6" }, // blue
  { href: "/services", label: "Services", icon: FaServicestack, color: "#10b981" }, // green
  { href: "/case-studies", label: "Case Studies", icon: FaBriefcase, color: "#8b5cf6" }, // purple
  { href: "/about", label: "About", icon: FaInfoCircle, color: "#06b6d4" }, // cyan
  { href: "/blog", label: "Blog", icon: FaBlog, color: "#f59e0b" }, // orange
  { href: "/contact", label: "Contact", icon: FaEnvelope, color: "#ec4899" }, // pink
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide header on app pages (workspace/developer console)
  const shouldShowHeader = !pathname.startsWith("/app") && !pathname.startsWith("/developers");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Don't render header on app pages
  if (!shouldShowHeader) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Nav card with rounded corners and subtle background */}
        <div className="relative rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo - Far Left */}
            <div className="relative z-50 shrink-0">
              <Brand />
            </div>

            {/* Desktop Navigation - Center/Left-of-Center */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navigationItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Actions - Far Right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <ThemeToggle />
              <Link
                href="/app"
                className="inline-flex items-center justify-center px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all text-sm shadow-sm"
              >
                Get Secure
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="relative z-50 flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent lg:hidden"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-24 left-4 right-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl transition-all duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col p-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="size-5" style={{ color: item.color }} />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile Actions */}
            <div className="mt-4 pt-4 px-2 border-t border-border space-y-3">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <Link
                href="/app"
                onClick={closeMenu}
                className="flex items-center justify-center w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors text-sm"
              >
                Get Secure
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
        {/* Logo - Always Visible */}
        <div className="relative z-50 shrink-0">
          <Brand />
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group whitespace-nowrap"
              >
                <Icon className="size-4" style={{ color: item.color }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA + Theme Toggle - Hidden on Mobile */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <ThemeToggle />
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-colors text-sm"
          >
            Get Secure
          </Link>
        </div>

        {/* Mobile Menu Toggle - Visible on Mobile Only */}
        <button
          className="relative z-50 flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu - Full Screen Overlay */}
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
          className={`absolute top-16 sm:top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav className="flex flex-col px-4 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground border-b border-border last:border-b-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="size-5" style={{ color: item.color }} />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Theme Toggle in Mobile Menu */}
            <div className="mt-4 px-4 flex justify-center">
              <ThemeToggle />
            </div>
            
            {/* Mobile CTA Button */}
            <div className="mt-6 px-4">
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

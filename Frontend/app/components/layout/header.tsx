"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "../ui/button";

interface NavItem {
  href: string;
  label: string;
}

const navigationItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/protocol", label: "Services" },
  { href: "/explorer", label: "Case Studies" },
  { href: "/developers", label: "About" },
  { href: "/dashboard-preview", label: "Blog" },
  { href: "/app", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide header on all pages except the landing page
  const shouldShowHeader = pathname === "/";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Don't render header on sub pages
  if (!shouldShowHeader) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#061426]/95 backdrop-blur-xl border-b border-cyan-500/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
        {/* Logo - Always Visible */}
        <div className="relative z-50 flex-shrink-0">
          <Brand />
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-gray-300 transition-colors hover:text-cyan-400 group whitespace-nowrap"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - Hidden on Mobile */}
        <div className="hidden lg:flex flex-shrink-0">
          <Button 
            href="/app" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white whitespace-nowrap"
          >
            Get Secure
          </Button>
        </div>

        {/* Mobile Menu Toggle - Visible on Mobile Only */}
        <button
          className="relative z-50 flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 transition-colors hover:text-cyan-400 hover:bg-cyan-500/10 lg:hidden"
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-16 sm:top-20 left-0 right-0 bg-[#061426]/98 backdrop-blur-xl border-b border-cyan-500/10 shadow-xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav className="flex flex-col px-4 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-4 py-4 text-base font-medium text-gray-300 transition-all hover:bg-cyan-500/10 hover:text-cyan-400 border-b border-cyan-500/10 last:border-b-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            <div className="mt-6 px-4">
              <Button 
                href="/app" 
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4"
                onClick={closeMenu}
              >
                Get Secure
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Brand } from "../layout/brand";

export function HeaderV2() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const shouldShowHeader = pathname === "/";

  if (!shouldShowHeader) {
    return null;
  }

  const productItems = [
    { label: "Analysis", href: "/app/analysis", desc: "AI-powered trust scoring and analytics" },
    { label: "Agents", href: "/app/agents", desc: "Autonomous AI agent management" },
    { label: "Credentials", href: "/app/credentials", desc: "Blockchain credential verification" },
    { label: "Activity", href: "/app/activity", desc: "Transaction and event history" },
    { label: "Settings", href: "/app/settings", desc: "Account and preferences" },
    { label: "Developers", href: "/developers", desc: "API documentation and tools" },
  ];

  const developersItems = [
    { label: "API Documentation", href: "/developers/docs", desc: "Complete API reference" },
    { label: "SDK Guide", href: "/developers/sdk", desc: "Integration libraries" },
  ];

  const companyItems = [
    { label: "About", href: "/about", desc: "Our mission and vision" },
    { label: "Services", href: "/services", desc: "What we offer" },
    { label: "Case Studies", href: "/case-studies", desc: "Success stories" },
    { label: "Blog", href: "/blog", desc: "Latest updates and insights" },
    { label: "Contact", href: "/contact", desc: "Get in touch" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="relative z-50 shrink-0">
          <Brand />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {/* Product Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Product
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-[500px] bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="grid grid-cols-2 gap-4">
                {productItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block p-3 rounded hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm font-medium text-white mb-1">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Developers Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Developers
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="space-y-2">
                {developersItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block p-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Company Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Company
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="space-y-2">
                {companyItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block p-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex shrink-0">
          <Link
            href="/app"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="relative z-50 flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <nav className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Product Section - Collapsible */}
            <div>
              <button
                onClick={() => setExpandedSection(expandedSection === 'product' ? null : 'product')}
                className="flex items-center justify-between w-full text-left px-3 py-2 rounded hover:bg-gray-900 transition-colors"
              >
                <span className="text-sm font-semibold text-white">Product</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'product' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'product' && (
                <div className="mt-2 space-y-2 pl-3">
                  {productItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block p-2 rounded hover:bg-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Developers Section - Collapsible */}
            <div>
              <button
                onClick={() => setExpandedSection(expandedSection === 'developers' ? null : 'developers')}
                className="flex items-center justify-between w-full text-left px-3 py-2 rounded hover:bg-gray-900 transition-colors"
              >
                <span className="text-sm font-semibold text-white">Developers</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'developers' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'developers' && (
                <div className="mt-2 space-y-2 pl-3">
                  {developersItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block p-2 rounded hover:bg-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Company Section - Collapsible */}
            <div>
              <button
                onClick={() => setExpandedSection(expandedSection === 'company' ? null : 'company')}
                className="flex items-center justify-between w-full text-left px-3 py-2 rounded hover:bg-gray-900 transition-colors"
              >
                <span className="text-sm font-semibold text-white">Company</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'company' && (
                <div className="mt-2 space-y-2 pl-3">
                  {companyItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block p-2 rounded hover:bg-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-800">
              <Link
                href="/app"
                className="block w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white text-center font-semibold rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

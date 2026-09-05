"use client";

import Link from "next/link";
import { Brand } from "../layout/brand";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { HiMail } from "react-icons/hi";

const footerLinks = {
  product: [
    { label: "Features", href: "/services" },
    { label: "Security", href: "/services" },
    { label: "API", href: "/developers" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Documentation", href: "/developers" },
    { label: "Case Studies", href: "/case-studies" },
  ],
};

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/credlayer/",
    icon: FaLinkedin,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/BitTrustProtoco",
    icon: FaXTwitter,
  },
  {
    name: "Email",
    href: "mailto:Zakariasisu5@gmail.com",
    icon: HiMail,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background mt-24">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Brand />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Building the future of digital trust and verification with advanced blockchain technology.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CredLayer. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

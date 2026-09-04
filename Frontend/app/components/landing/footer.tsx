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
    color: "hover:text-blue-500"
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/BitTrustProtoco",
    icon: FaXTwitter,
    color: "hover:text-cyan-400"
  },
  {
    name: "Email",
    href: "mailto:Zakariasisu5@gmail.com",
    icon: HiMail,
    color: "hover:text-cyan-400"
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/10 bg-gradient-to-b from-transparent to-[#030c18]/50 mt-20 sm:mt-32">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Brand />
            <p className="mt-4 sm:mt-6 max-w-md text-xs sm:text-sm leading-relaxed text-gray-400">
              Building the future of digital trust and verification with advanced blockchain technology.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-cyan-500/20 text-gray-400 transition-all hover:border-cyan-400/50 ${social.color} hover:bg-cyan-500/5 active:scale-95`}
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
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-gray-400 transition-colors hover:text-cyan-400 active:text-cyan-300"
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
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} CredLayer. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors whitespace-nowrap">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

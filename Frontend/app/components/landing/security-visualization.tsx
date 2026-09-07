"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SecurityVisualization() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = mounted && (resolvedTheme === "dark" || resolvedTheme === "system");
  
  // CredLayer brand colors
  const primaryColor = "#06b6d4"; // Cyan
  const accentPurple = "#8b5cf6"; // Purple
  const accentMagenta = "#ec4899"; // Pink/Magenta
  const cardBg = isDark ? "#0a0a0a" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const textColor = isDark ? "#ffffff" : "#141210";
  const mutedColor = isDark ? "#9ca3af" : "#6b6b6b";

  return (
    <div className="relative w-full aspect-square max-w-[700px]">
      <svg
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background glow effects */}
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentPurple} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accentPurple} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={accentPurple} />
            <stop offset="100%" stopColor={accentMagenta} />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Subtle background grid */}
        <g opacity="0.05" stroke={textColor} strokeWidth="0.5">
          <line x1="0" y1="175" x2="700" y2="175" />
          <line x1="0" y1="350" x2="700" y2="350" />
          <line x1="0" y1="525" x2="700" y2="525" />
          <line x1="175" y1="0" x2="175" y2="700" />
          <line x1="350" y1="0" x2="350" y2="700" />
          <line x1="525" y1="0" x2="525" y2="700" />
        </g>

        {/* Central Shield (Trust/Security) - Larger and more prominent */}
        <g transform="translate(270, 220)">
          {/* Shield glow - subtle */}
          <ellipse cx="80" cy="100" rx="140" ry="160" fill="url(#glow1)" opacity="0.4" />
          
          {/* Shield body - larger */}
          <path
            d="M80 20 L150 50 L150 130 Q150 180 80 220 Q10 180 10 130 L10 50 Z"
            fill="url(#shieldGradient)"
            opacity="0.95"
            stroke={primaryColor}
            strokeWidth="3"
            filter="url(#shadow)"
          />
          
          {/* Shield border highlight */}
          <path
            d="M80 20 L150 50 L150 130 Q150 180 80 220 Q10 180 10 130 L10 50 Z"
            fill="none"
            stroke="url(#shieldGradient)"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Shield checkmark - larger and bolder */}
          <path
            d="M50 100 L70 120 L110 70"
            stroke={cardBg}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* AI/Tech pattern inside shield */}
          <g opacity="0.2">
            <circle cx="80" cy="100" r="40" stroke={cardBg} strokeWidth="1" strokeDasharray="4,4" />
            <circle cx="80" cy="100" r="25" stroke={cardBg} strokeWidth="1" strokeDasharray="3,3" />
          </g>
        </g>

        {/* Floating verification cards (representing wallet analysis) - Larger */}
        {/* Card 1 - Top Right - Trust Score */}
        <g transform="translate(480, 100)" filter="url(#shadow)">
          <rect
            x="0"
            y="0"
            width="180"
            height="110"
            rx="12"
            fill={cardBg}
            stroke={cardBorder}
            strokeWidth="2"
            opacity="0.98"
          />
          {/* Card header */}
          <rect x="0" y="0" width="180" height="35" rx="12" fill={primaryColor} opacity="0.15" />
          <text x="15" y="23" fill={primaryColor} fontSize="12" fontWeight="bold" opacity="0.9">TRUST SCORE</text>
          
          {/* Score display */}
          <text x="15" y="60" fill={textColor} fontSize="36" fontWeight="bold" opacity="0.9">87</text>
          <text x="65" y="60" fill={mutedColor} fontSize="14" opacity="0.7">/100</text>
          
          {/* Status indicator */}
          <circle cx="155" cy="85" r="6" fill={primaryColor} opacity="0.8" />
          <text x="95" y="90" fill={mutedColor} fontSize="11" opacity="0.7">Verified</text>
        </g>

        {/* Card 2 - Left - Wallet Analysis */}
        <g transform="translate(30, 300)" filter="url(#shadow)">
          <rect
            x="0"
            y="0"
            width="180"
            height="110"
            rx="12"
            fill={cardBg}
            stroke={cardBorder}
            strokeWidth="2"
            opacity="0.98"
          />
          {/* Card header */}
          <rect x="0" y="0" width="180" height="35" rx="12" fill={accentPurple} opacity="0.15" />
          <text x="15" y="23" fill={accentPurple} fontSize="12" fontWeight="bold" opacity="0.9">WALLET ANALYSIS</text>
          
          {/* Data bars */}
          <rect x="15" y="50" width="120" height="8" rx="4" fill={mutedColor} opacity="0.2" />
          <rect x="15" y="50" width="95" height="8" rx="4" fill={accentPurple} opacity="0.8" />
          
          <rect x="15" y="65" width="120" height="8" rx="4" fill={mutedColor} opacity="0.2" />
          <rect x="15" y="65" width="70" height="8" rx="4" fill={accentPurple} opacity="0.6" />
          
          <rect x="15" y="80" width="120" height="8" rx="4" fill={mutedColor} opacity="0.2" />
          <rect x="15" y="80" width="110" height="8" rx="4" fill={accentPurple} opacity="0.7" />
          
          {/* Icon */}
          <circle cx="155" cy="70" r="15" stroke={accentPurple} strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M150 70 L155 75 L162 65" stroke={accentPurple} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Card 3 - Bottom Right - Blockchain Attestation */}
        <g transform="translate(480, 500)" filter="url(#shadow)">
          <rect
            x="0"
            y="0"
            width="180"
            height="110"
            rx="12"
            fill={cardBg}
            stroke={cardBorder}
            strokeWidth="2"
            opacity="0.98"
          />
          {/* Card header */}
          <rect x="0" y="0" width="180" height="35" rx="12" fill={accentMagenta} opacity="0.15" />
          <text x="15" y="23" fill={accentMagenta} fontSize="12" fontWeight="bold" opacity="0.9">ON-CHAIN</text>
          
          {/* Blockchain chain icon - larger */}
          <g transform="translate(15, 50)">
            <circle cx="15" cy="15" r="12" stroke={accentMagenta} strokeWidth="2.5" fill="none" opacity="0.8" />
            <circle cx="45" cy="15" r="12" stroke={accentMagenta} strokeWidth="2.5" fill="none" opacity="0.8" />
            <circle cx="75" cy="15" r="12" stroke={accentMagenta} strokeWidth="2.5" fill="none" opacity="0.8" />
            <line x1="27" y1="15" x2="33" y2="15" stroke={accentMagenta} strokeWidth="2.5" opacity="0.8" />
            <line x1="57" y1="15" x2="63" y2="15" stroke={accentMagenta} strokeWidth="2.5" opacity="0.8" />
          </g>
          
          {/* Status */}
          <text x="15" y="85" fill={mutedColor} fontSize="11" opacity="0.7">Attestation Active</text>
          <circle cx="155" cy="80" r="6" fill={accentMagenta} opacity="0.8" />
        </g>

        {/* Corner accent nodes - subtle and professional */}
        <circle cx="50" cy="50" r="4" fill={primaryColor} opacity="0.4" />
        <circle cx="650" cy="50" r="4" fill={accentPurple} opacity="0.4" />
        <circle cx="50" cy="650" r="4" fill={accentMagenta} opacity="0.4" />
        <circle cx="650" cy="650" r="4" fill={primaryColor} opacity="0.4" />
      </svg>
    </div>
  );
}

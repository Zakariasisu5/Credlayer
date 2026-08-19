"use client";

import Image from "next/image";
import securityVisualization from "../../assets/security-visualization.png";

export function SecurityVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[600px]">
      {/* Animated rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse" />
      <div className="absolute inset-[8%] rounded-full border border-cyan-400/15 animate-pulse [animation-delay:1s]" />
      <div className="absolute inset-[16%] rounded-full border border-cyan-300/10 animate-pulse [animation-delay:2s]" />

      {/* Central image container - increased size, no box */}
      <div className="absolute inset-[15%] flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Animated glow */}
          <div className="absolute -inset-8 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
          
          {/* Security Visualization Image - No border/box */}
          <div className="relative w-full h-full">
            <Image
              src={securityVisualization}
              alt="CredLayer Security Visualization"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.3)]"
              priority
            />
          </div>

          {/* Animated corner accents - positioned at outer corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/70 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/70 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/70 animate-pulse [animation-delay:1s]" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/70 animate-pulse [animation-delay:1.5s]" />
        </div>
      </div>

      {/* Animated connection nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Animated lines */}
        <line x1="20" y1="30" x2="80" y2="70" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" className="animate-pulse" />
        <line x1="80" y1="30" x2="20" y2="70" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" className="animate-pulse [animation-delay:1s]" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" className="animate-pulse [animation-delay:2s]" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" className="animate-pulse [animation-delay:3s]" />
        
        {/* Animated node points */}
        <circle cx="20" cy="30" r="2" fill="#22d3ee" opacity="0.7" className="animate-pulse" />
        <circle cx="80" cy="30" r="2" fill="#22d3ee" opacity="0.7" className="animate-pulse [animation-delay:0.5s]" />
        <circle cx="20" cy="70" r="2" fill="#22d3ee" opacity="0.7" className="animate-pulse [animation-delay:1s]" />
        <circle cx="80" cy="70" r="2" fill="#22d3ee" opacity="0.7" className="animate-pulse [animation-delay:1.5s]" />
        <circle cx="50" cy="10" r="1.5" fill="#60a5fa" opacity="0.6" className="animate-pulse [animation-delay:2s]" />
        <circle cx="50" cy="90" r="1.5" fill="#60a5fa" opacity="0.6" className="animate-pulse [animation-delay:2.5s]" />
        <circle cx="10" cy="50" r="1.5" fill="#60a5fa" opacity="0.6" className="animate-pulse [animation-delay:3s]" />
        <circle cx="90" cy="50" r="1.5" fill="#60a5fa" opacity="0.6" className="animate-pulse [animation-delay:3.5s]" />
      </svg>

      {/* Rotating scan line effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-[2px] animate-[spin_8s_linear_infinite]" 
             style={{ transformOrigin: 'center center' }} />
      </div>
    </div>
  );
}

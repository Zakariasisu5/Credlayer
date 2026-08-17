"use client";

import Image from "next/image";

const credLayerLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000050c081f4ade2ab8730a0e87d-RQX8RDIugIzMfNeu4oYtO2nx88jhHr.png";

export function SecurityVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[500px]">
      {/* Animated rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse" />
      <div className="absolute inset-[8%] rounded-full border border-cyan-400/15 animate-pulse [animation-delay:1s]" />
      <div className="absolute inset-[16%] rounded-full border border-cyan-300/10 animate-pulse [animation-delay:2s]" />

      {/* Central logo container */}
      <div className="absolute inset-[28%] flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Animated glow */}
          <div className="absolute -inset-6 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
          
          {/* Logo container with transparent background */}
          <div className="relative w-full h-full rounded-2xl border border-cyan-400/40 bg-transparent backdrop-blur-sm shadow-[0_0_60px_rgba(34,211,238,0.25)] p-8 transition-all duration-300 hover:border-cyan-300/60 hover:shadow-[0_0_80px_rgba(34,211,238,0.35)]">
            <div className="relative w-full h-full">
              <Image
                src={credLayerLogo}
                alt="CredLayer Security Shield"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Animated corner accents */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-cyan-400/70 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-r-2 border-t-2 border-cyan-400/70 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-2 border-b-2 border-cyan-400/70 animate-pulse [animation-delay:1s]" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-cyan-400/70 animate-pulse [animation-delay:1.5s]" />
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

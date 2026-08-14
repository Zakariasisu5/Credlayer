"use client";

import Image from "next/image";

const credLayerLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000050c081f4ade2ab8730a0e87d-RQX8RDIugIzMfNeu4oYtO2nx88jhHr.png";

export function SecurityVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[500px]">
      {/* Simple outer ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
      
      {/* Middle ring */}
      <div className="absolute inset-[12%] rounded-full border border-cyan-400/15" />

      {/* Central logo container */}
      <div className="absolute inset-[28%] flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Subtle glow */}
          <div className="absolute -inset-4 rounded-full bg-cyan-400/10 blur-2xl" />
          
          {/* Logo container with clean border */}
          <div className="relative w-full h-full rounded-2xl border border-cyan-400/30 bg-[#0a1628]/80 backdrop-blur-sm shadow-[0_0_40px_rgba(34,211,238,0.15)] p-8">
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

          {/* Simple corner accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60" />
        </div>
      </div>

      {/* Minimal connection points */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Simple lines */}
        <line x1="20" y1="30" x2="80" y2="70" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" />
        <line x1="80" y1="30" x2="20" y2="70" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" />
        
        {/* Clean node points */}
        <circle cx="20" cy="30" r="1.5" fill="#22d3ee" opacity="0.6" />
        <circle cx="80" cy="30" r="1.5" fill="#22d3ee" opacity="0.6" />
        <circle cx="20" cy="70" r="1.5" fill="#22d3ee" opacity="0.6" />
        <circle cx="80" cy="70" r="1.5" fill="#22d3ee" opacity="0.6" />
      </svg>
    </div>
  );
}

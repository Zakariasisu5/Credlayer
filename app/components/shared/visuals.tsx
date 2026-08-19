"use client";

import Image from "next/image";
import logoImage from "../../assets/logo.jpeg";

// Network topology visualization
export function NetworkVisual({ dashboard = false }: { dashboard?: boolean }) {
  const nodes = dashboard 
    ? [[18,18],[38,32],[62,18],[80,38],[25,63],[50,50],[72,68],[88,82],[12,82]] 
    : [[16,28],[32,48],[52,20],[70,38],[86,22],[25,78],[50,68],[76,76],[90,56]];
  
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-primary/30 bg-[#061426] ${dashboard ? "min-h-[280px]" : "min-h-[390px]"}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute left-1/2 top-[42%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 opacity-70 animate-[ping_4s_ease-in-out_infinite]" />
      <div className="absolute left-1/2 top-[42%] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 opacity-50 animate-[ping_5s_ease-in-out_1s_infinite]" />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-primary/40 bg-transparent p-3 shadow-[0_0_34px_rgba(32,214,208,0.24)] transition duration-500 group-hover:scale-110">
        <Image 
          src={logoImage} 
          alt="CredLayer verification infrastructure" 
          width={72} 
          height={72} 
          className="size-16 object-contain" 
        />
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g stroke="rgba(56,189,248,0.45)" strokeWidth="0.25">
          {nodes.slice(0, -1).map((node, i) => (
            <line 
              key={`line-${i}`} 
              x1={node[0]} 
              y1={node[1]} 
              x2={nodes[i + 1][0]} 
              y2={nodes[i + 1][1]} 
            />
          ))}
          {nodes.slice(2).map((node, i) => (
            <line 
              key={`cross-${i}`} 
              x1={nodes[i][0]} 
              y1={nodes[i][1]} 
              x2={node[0]} 
              y2={node[1]} 
            />
          ))}
        </g>
        <g fill="#22d3ee">
          {nodes.map((node, i) => (
            <circle 
              key={`node-${i}`} 
              cx={node[0]} 
              cy={node[1]} 
              r={i === 5 ? 1.8 : 0.8} 
              className="animate-pulse" 
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-xl border border-primary/20 bg-background/80 px-4 py-3 backdrop-blur">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {dashboard ? "Network topology" : "Verification infrastructure"}
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_#22d3ee] animate-pulse" />
          Live preview
        </span>
      </div>
    </div>
  );
}

// Security logo visualization
export function SecurityLogoVisual() {
  const particles = Array.from({ length: 12 });
  
  return (
    <div className="relative isolate flex min-h-[430px] items-center justify-center overflow-hidden bg-[#020915] px-4 py-10 sm:min-h-[560px] sm:px-8">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
      <div className="absolute size-72 rounded-full bg-primary/20 blur-3xl sm:size-96" />
      <div className="absolute size-[78%] rounded-full border border-primary/20 [animation:spin_26s_linear_infinite]" />
      <div className="absolute size-[62%] rounded-full border border-cyan-300/20 border-dashed [animation:spin_18s_linear_infinite_reverse]" />
      <div className="absolute size-[48%] rounded-full border border-sky-400/15 [animation:spin_34s_linear_infinite]" />
      <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-70 [animation:scan 5s_ease-in-out_infinite]" />
      {particles.map((_, index) => {
        const angle = index * 30;
        return (
          <span 
            key={index} 
            className="absolute size-1 rounded-full bg-cyan-200 shadow-[0_0_14px_4px_rgba(34,211,238,0.65)] [animation:particle-float_6s_ease-in-out_infinite]" 
            style={{ 
              transform: `rotate(${angle}deg) translateY(-${36 + (index % 3) * 7}%)`, 
              animationDelay: `${index * -0.45}s` 
            }} 
          />
        );
      })}
      <div className="absolute bottom-[9%] left-1/2 h-10 w-[48%] -translate-x-1/2 rounded-[50%] bg-cyan-400/25 blur-2xl [animation:ground-pulse_4s_ease-in-out_infinite]" />
      <div className="relative w-[72%] max-w-[410px] [animation:logo-float_6s_ease-in-out_infinite]">
        <div className="absolute -inset-8 rounded-full bg-cyan-400/20 blur-2xl [animation:shield-pulse_4s_ease-in-out_infinite]" />
        <div className="relative aspect-square overflow-visible bg-transparent shadow-[0_0_70px_rgba(14,165,233,0.35)]">
          <Image 
            src={logoImage} 
            alt="CredLayer security shield" 
            fill 
            priority 
            loading="eager" 
            sizes="(max-width: 640px) 70vw, 430px" 
            className="object-contain mix-blend-screen" 
          />
        </div>
      </div>
    </div>
  );
}

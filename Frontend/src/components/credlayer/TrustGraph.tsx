import { motion } from "motion/react";

/**
 * Abstract blockchain / trust-graph visualization built with SVG + motion.
 * Purely presentational — no real network data.
 */
export function TrustGraph() {
  type Node = { id: string; x: number; y: number; r: number; kind?: "core" };
  const nodes: Node[] = [
    { id: "core", x: 200, y: 200, r: 28, kind: "core" },
    { id: "a", x: 60, y: 90, r: 12 },
    { id: "b", x: 340, y: 70, r: 14 },
    { id: "c", x: 360, y: 300, r: 11 },
    { id: "d", x: 40, y: 300, r: 13 },
    { id: "e", x: 200, y: 30, r: 9 },
    { id: "f", x: 200, y: 370, r: 10 },
    { id: "g", x: 110, y: 210, r: 8 },
    { id: "h", x: 290, y: 190, r: 8 },
  ];

  const edges: Array<[string, string]> = [
    ["core", "a"], ["core", "b"], ["core", "c"], ["core", "d"],
    ["core", "e"], ["core", "f"], ["core", "g"], ["core", "h"],
    ["a", "e"], ["b", "e"], ["b", "h"], ["c", "f"], ["d", "f"], ["d", "g"],
  ];

  const map = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      {/* Rotating orbit rings */}
      <div className="absolute inset-0 animate-orbit">
        <div className="absolute inset-8 rounded-full border border-border" />
        <div className="absolute inset-16 rounded-full border border-border" />
        <div className="absolute inset-24 rounded-full border border-gold/[0.08]" />
      </div>

      <svg viewBox="0 0 400 400" className="relative w-full h-full">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 85)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.65 0.14 240)" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="coreFill">
            <stop offset="0%" stopColor="oklch(0.85 0.14 85)" />
            <stop offset="100%" stopColor="oklch(0.65 0.15 80)" />
          </radialGradient>
          <radialGradient id="nodeFill">
            <stop offset="0%" stopColor="oklch(0.30 0.04 240)" />
            <stop offset="100%" stopColor="oklch(0.20 0.08 240)" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const na = map.get(a)!;
          const nb = map.get(b)!;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="url(#edge)"
              strokeWidth={1}
              strokeOpacity={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: "easeOut" }}
            />
          );
        })}

        {/* Data packet pulses along key edges */}
        {edges.slice(0, 6).map(([a, b], i) => {
          const na = map.get(a)!;
          const nb = map.get(b)!;
          return (
            <motion.circle
              key={`p-${i}`}
              r={2}
              fill="oklch(0.85 0.15 85)"
              initial={{ cx: na.x, cy: na.y, opacity: 0 }}
              animate={{ cx: [na.x, nb.x], cy: [na.y, nb.y], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}

        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: "backOut" }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            {n.kind === "core" && (
              <>
                <circle cx={n.x} cy={n.y} r={n.r + 12} fill="oklch(0.82 0.15 85 / 0.06)" />
                <circle cx={n.x} cy={n.y} r={n.r + 6} fill="oklch(0.82 0.15 85 / 0.10)" />
              </>
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.kind === "core" ? "url(#coreFill)" : "url(#nodeFill)"}
              stroke={n.kind === "core" ? "oklch(0.85 0.15 85)" : "oklch(0.65 0.10 240)"}
              strokeWidth={n.kind === "core" ? 1.5 : 0.8}
            />
            {n.kind === "core" && (
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="oklch(0.12 0.015 260)"
                fontFamily="var(--font-mono)"
              >
                892
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Floating trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass-strong absolute -left-2 top-16 rounded-xl px-3 py-2 text-xs animate-float-slow"
      >
        <div className="text-muted-foreground">Trust Score</div>
        <div className="font-mono text-gold text-sm font-semibold">A+ / 892</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="glass-strong absolute right-0 bottom-20 rounded-xl px-3 py-2 text-xs animate-float-slow"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="text-muted-foreground">Verified</div>
        <div className="font-mono text-accent text-sm font-semibold">14 Signals</div>
      </motion.div>
    </div>
  );
}

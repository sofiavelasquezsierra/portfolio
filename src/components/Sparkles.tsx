"use client";

import { useMemo } from "react";

/**
 * Faint daytime sparkles — dust-mote feel. Static positions, very low opacity.
 * Adds atmosphere without competing with the sun/sky.
 */
const SPARKLES = Array.from({ length: 22 }).map((_, i) => ({
  x: (i * 53 + 17) % 95 + 2,
  y: ((i * 91 + 31) % 65) + 2,
  size: 1 + (i % 3),
  opacity: 0.35 + (i % 4) * 0.15,
  glyph: i % 5 === 0 ? "✦" : i % 3 === 0 ? "·" : "✧",
}));

export default function Sparkles({ tone = "light" }: { tone?: "light" | "dark" }) {
  const items = useMemo(() => SPARKLES, []);
  const color = tone === "light" ? "#FFFFFF" : "#FAF7EE";

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
      {items.map((s, i) => (
        <span
          key={i}
          className="absolute font-serif animate-twinkle leading-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            color,
            fontSize: 8 + s.size * 2,
            opacity: s.opacity,
            animationDelay: `${(i * 0.27) % 4}s`,
          }}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}

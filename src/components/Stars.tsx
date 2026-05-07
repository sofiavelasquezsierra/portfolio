"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Painted-style stars — fixed constellation positions using ASCII glyphs
 * (✦ ✧ ⋆ ·). Almost no animation, with a single very-slow shooting line.
 */

type Star = {
  x: number;
  y: number;
  glyph: string;
  size: number;
  opacity: number;
};

// Hand-curated constellation. Looks composed, not random.
const STARS: Star[] = [
  { x: 8, y: 12, glyph: "✦", size: 14, opacity: 0.95 },
  { x: 14, y: 22, glyph: "·", size: 8, opacity: 0.5 },
  { x: 22, y: 8, glyph: "⋆", size: 10, opacity: 0.7 },
  { x: 28, y: 18, glyph: "✧", size: 12, opacity: 0.85 },
  { x: 34, y: 28, glyph: "·", size: 6, opacity: 0.4 },
  { x: 44, y: 14, glyph: "✦", size: 16, opacity: 1 },
  { x: 52, y: 24, glyph: "⋆", size: 10, opacity: 0.65 },
  { x: 60, y: 10, glyph: "·", size: 7, opacity: 0.45 },
  { x: 66, y: 32, glyph: "✧", size: 11, opacity: 0.8 },
  { x: 72, y: 18, glyph: "✦", size: 13, opacity: 0.9 },
  { x: 80, y: 8, glyph: "⋆", size: 9, opacity: 0.6 },
  { x: 86, y: 26, glyph: "·", size: 7, opacity: 0.45 },
  { x: 92, y: 14, glyph: "✦", size: 14, opacity: 0.95 },
  { x: 18, y: 38, glyph: "·", size: 6, opacity: 0.35 },
  { x: 38, y: 42, glyph: "⋆", size: 8, opacity: 0.5 },
  { x: 58, y: 38, glyph: "·", size: 5, opacity: 0.3 },
  { x: 78, y: 44, glyph: "✧", size: 9, opacity: 0.55 },
];

export default function Stars() {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none font-serif text-white/90 select-none">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute leading-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            textShadow: "0 0 6px rgba(255,255,255,0.45)",
          }}
        >
          {s.glyph}
        </span>
      ))}

      {!reduced && (
        <div
          className="absolute"
          style={{
            top: "16%",
            left: "20%",
            animation: "shoot 4.5s ease-out 6s infinite",
          }}
        >
          <span className="block w-[80px] h-[2px] bg-gradient-to-r from-white via-white/60 to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

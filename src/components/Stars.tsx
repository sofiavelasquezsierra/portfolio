"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Painted-style stars — fixed constellation positions using ASCII glyphs.
 * Brighter at night: bigger glyphs, stronger glow, a few feature stars
 * that pulse harder so the sky reads as actually starlit instead of dim.
 */

type Star = {
  x: number;
  y: number;
  glyph: string;
  size: number;
  opacity: number;
  /** When true, gets a heavier glow + slow pulse animation. */
  bright?: boolean;
};

const STARS: Star[] = [
  // Top row — feature stars + companions
  { x: 8, y: 10, glyph: "✦", size: 22, opacity: 1, bright: true },
  { x: 14, y: 20, glyph: "·", size: 10, opacity: 0.7 },
  { x: 22, y: 6, glyph: "⋆", size: 14, opacity: 0.85 },
  { x: 28, y: 16, glyph: "✧", size: 16, opacity: 1 },
  { x: 34, y: 26, glyph: "·", size: 9, opacity: 0.6 },
  { x: 44, y: 12, glyph: "✦", size: 26, opacity: 1, bright: true },
  { x: 52, y: 22, glyph: "⋆", size: 14, opacity: 0.85 },
  { x: 60, y: 8, glyph: "·", size: 11, opacity: 0.65 },
  { x: 66, y: 30, glyph: "✧", size: 15, opacity: 0.95 },
  { x: 72, y: 16, glyph: "✦", size: 20, opacity: 1, bright: true },
  { x: 80, y: 6, glyph: "⋆", size: 13, opacity: 0.8 },
  { x: 86, y: 24, glyph: "·", size: 10, opacity: 0.65 },
  { x: 92, y: 12, glyph: "✦", size: 18, opacity: 1 },

  // Mid band
  { x: 6, y: 36, glyph: "·", size: 9, opacity: 0.6 },
  { x: 18, y: 38, glyph: "⋆", size: 12, opacity: 0.75 },
  { x: 30, y: 34, glyph: "✧", size: 13, opacity: 0.85 },
  { x: 38, y: 42, glyph: "✦", size: 14, opacity: 0.9 },
  { x: 48, y: 36, glyph: "·", size: 8, opacity: 0.55 },
  { x: 58, y: 40, glyph: "⋆", size: 11, opacity: 0.7 },
  { x: 70, y: 38, glyph: "✧", size: 13, opacity: 0.8 },
  { x: 82, y: 42, glyph: "·", size: 9, opacity: 0.6 },
  { x: 90, y: 36, glyph: "⋆", size: 12, opacity: 0.75 },

  // Lower band — sparser, dimmer (sky fades toward horizon)
  { x: 10, y: 50, glyph: "·", size: 8, opacity: 0.5 },
  { x: 26, y: 54, glyph: "⋆", size: 10, opacity: 0.6 },
  { x: 42, y: 50, glyph: "·", size: 7, opacity: 0.45 },
  { x: 56, y: 56, glyph: "✧", size: 11, opacity: 0.65 },
  { x: 76, y: 52, glyph: "·", size: 8, opacity: 0.55 },
  { x: 88, y: 56, glyph: "⋆", size: 10, opacity: 0.6 },
];

export default function Stars() {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none font-serif text-white select-none">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`absolute leading-none ${
            !reduced ? (s.bright ? "star-pulse" : "star-twinkle") : ""
          }`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            textShadow: s.bright
              ? "0 0 14px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.7)"
              : "0 0 8px rgba(255,255,255,0.65)",
            animationDelay: `${(i * 0.13) % 3.2}s`,
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
          <span className="block w-[100px] h-[2px] bg-gradient-to-r from-white via-white/80 to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

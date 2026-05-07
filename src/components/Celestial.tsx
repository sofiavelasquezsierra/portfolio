"use client";

import { useEffect, useState } from "react";
import { type SkyMode } from "@/lib/sky";

/**
 * The sun (day) or moon (night), positioned along an arc based on the hour.
 * Daytime sparkles are scattered as faint dust.
 */
export default function Celestial({ mode }: { mode: SkyMode }) {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (mode === "night") return <Moon />;

  // Daytime celestial: position along arc from 5am (left, low) → 12pm (top) → 8pm (right, low)
  const { x, y, glowColor, discColor, ringColor } = useSunStyle(hour, mode);

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* Soft halo */}
      <div
        className="absolute"
        style={{
          left: `calc(${x}% - 130px)`,
          top: `calc(${y}% - 130px)`,
          width: 260,
          height: 260,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: 0.85,
        }}
      />
      {/* Sun disc */}
      <div
        className="absolute rounded-full"
        style={{
          left: `calc(${x}% - 28px)`,
          top: `calc(${y}% - 28px)`,
          width: 56,
          height: 56,
          background: discColor,
          boxShadow: `0 0 30px 6px ${ringColor}`,
        }}
      />
    </div>
  );
}

function useSunStyle(hour: number, mode: SkyMode) {
  // Time fraction 0 (5am) → 1 (8pm)
  const start = 5;
  const end = 20;
  const clamped = Math.max(start, Math.min(end, hour + new Date().getMinutes() / 60));
  const t = (clamped - start) / (end - start);
  const x = 8 + t * 84;
  // Arc: low at edges, high mid
  const arc = Math.sin(t * Math.PI);
  const y = 70 - arc * 50;

  let glowColor = "rgba(255, 230, 180, 0.7)";
  let discColor = "#F8D27A";
  let ringColor = "rgba(248, 210, 122, 0.5)";

  if (mode === "dawn") {
    glowColor = "rgba(255, 200, 170, 0.7)";
    discColor = "#F6BD9A";
    ringColor = "rgba(246, 189, 154, 0.55)";
  } else if (mode === "sunset") {
    glowColor = "rgba(255, 165, 130, 0.75)";
    discColor = "#F19C7B";
    ringColor = "rgba(241, 156, 123, 0.55)";
  } else if (mode === "dusk") {
    glowColor = "rgba(255, 165, 130, 0.55)";
    discColor = "#D7806A";
    ringColor = "rgba(215, 128, 106, 0.45)";
  }
  return { x, y, glowColor, discColor, ringColor };
}

function Moon() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* Halo */}
      <div
        className="absolute"
        style={{
          right: 80,
          top: 90,
          width: 200,
          height: 200,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.32) 0%, transparent 70%)",
          filter: "blur(34px)",
        }}
      />
      {/* Crescent moon — outer disc with offset inner disc to create the curve */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          right: 132,
          top: 142,
          width: 72,
          height: 72,
          background: "#F6F1E2",
          boxShadow: "0 0 30px 4px rgba(246,241,226,0.45)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: -8,
            left: 16,
            width: 76,
            height: 76,
            background: "#11192A",
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useWeather } from "@/hooks/useWeather";
import Stars from "./Stars";
import Sparkles from "./Sparkles";
import Celestial from "./Celestial";
import Rain from "./Rain";
import Snow from "./Snow";

type Props = {
  fullscreen?: boolean;
  fixed?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Time-of-day backdrop, rebuilt from scratch.
 * Just a clean three-stop CSS gradient + lightweight overlays:
 *   - Sun (day) or moon (night)
 *   - Stars at night, sparkles by day
 *   - Subtle paper grain + vignette
 *   - Rain or snow if the visitor's local weather currently matches
 *
 * No shader, no fbm noise — the gradient is the gradient.
 */
export default function Sky({
  fullscreen = false,
  fixed = false,
  className = "",
  children,
}: Props) {
  const palette = useTimeOfDay();
  const { weather } = useWeather();

  const showStars = palette.mode === "night" || palette.mode === "dusk";
  const wantsRain = weather === "rain" || weather === "storm";
  const wantsSnow = weather === "snow";

  return (
    <div
      className={`${fixed ? "fixed inset-0 -z-10" : "relative"} ${
        fullscreen ? "min-h-screen w-full" : ""
      } overflow-hidden transition-colors duration-1000 ${className}`}
      style={{
        background: `linear-gradient(180deg, ${palette.top} 0%, ${palette.mid} 50%, ${palette.bottom} 100%)`,
        color: palette.textOnSky,
      }}
      aria-hidden={fixed ? true : undefined}
    >
      {/* Sun / moon */}
      <Celestial mode={palette.mode} />

      {/* Stars at night, faint sparkles by day */}
      {showStars ? <Stars /> : <Sparkles tone="light" />}

      {/* Soft paper grain — subtle, keeps the gradient clean */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.10]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.16) 100%)",
        }}
      />

      {/* Painted horizon at sunset/dusk */}
      {(palette.mode === "sunset" || palette.mode === "dusk") && <Horizon />}

      {/* Real-weather overlays */}
      {wantsRain && <Rain intensity={weather === "storm" ? "heavy" : "light"} />}
      {wantsSnow && <Snow />}

      {children}
    </div>
  );
}

function Horizon() {
  return (
    <svg
      aria-hidden
      className="absolute bottom-0 left-0 right-0 w-full h-[16%] pointer-events-none"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
    >
      <path
        d="M0,170 C240,150 380,180 580,160 C780,140 940,175 1140,155 C1300,140 1380,160 1440,150 L1440,200 L0,200 Z"
        fill="rgba(44,62,80,0.20)"
      />
      <path
        d="M0,185 C300,170 480,200 740,182 C980,164 1180,200 1440,178 L1440,200 L0,200 Z"
        fill="rgba(44,62,80,0.32)"
      />
    </svg>
  );
}

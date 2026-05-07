/**
 * Moon-phase math.
 * Reference new moon: 2000-01-06 18:14 UTC.
 * Synodic month: 29.530588853 days.
 * No API call — pure date arithmetic.
 */

const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);
const SYNODIC_MS = 29.530588853 * 86400 * 1000;

export type MoonPhase = {
  /** 0 (new) → 0.25 (first quarter) → 0.5 (full) → 0.75 (last quarter) → 1 */
  fraction: number;
  emoji: string;
  label: string;
  /** Illumination 0..1 (visible portion of the lit side). */
  illumination: number;
};

const PHASES: { emoji: string; label: string }[] = [
  { emoji: "🌑", label: "new moon" },
  { emoji: "🌒", label: "waxing crescent" },
  { emoji: "🌓", label: "first quarter" },
  { emoji: "🌔", label: "waxing gibbous" },
  { emoji: "🌕", label: "full moon" },
  { emoji: "🌖", label: "waning gibbous" },
  { emoji: "🌗", label: "last quarter" },
  { emoji: "🌘", label: "waning crescent" },
];

export function moonPhase(d: Date = new Date()): MoonPhase {
  const diff = d.getTime() - REF_NEW_MOON_MS;
  const f = (((diff % SYNODIC_MS) + SYNODIC_MS) % SYNODIC_MS) / SYNODIC_MS;
  // Pick the closest of the 8 phase emojis.
  const idx = Math.floor(f * 8 + 0.5) % 8;
  const phase = PHASES[idx];
  // Illumination: cosine-shaped curve, 0 at new moon, 1 at full moon.
  const illumination = (1 - Math.cos(f * Math.PI * 2)) / 2;
  return {
    fraction: f,
    emoji: phase.emoji,
    label: phase.label,
    illumination,
  };
}

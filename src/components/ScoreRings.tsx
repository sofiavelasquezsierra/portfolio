import React from "react";

export type Score = {
  label: string;
  value: number;
  /** Denominator for the ring fill. Defaults to 10. */
  max?: number;
};

/** Palette-matched colour for a score: green (good) → amber → soft red. */
function ringColor(value: number, max = 10): string {
  const pct = value / max;
  if (pct >= 0.8) return "#7FA17F"; // sage green
  if (pct >= 0.6) return "#D9B068"; // honey amber
  return "#D98C8C"; // soft red
}

function Ring({
  label,
  value,
  max = 10,
  ringMax,
}: Score & { ringMax: number }) {
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, value / max));
  const color = ringColor(value, max);

  return (
    <div
      className="flex w-full flex-col items-center gap-2"
      style={{ maxWidth: ringMax }}
    >
      <svg viewBox="0 0 100 100" className="w-full">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#2C3E50"
          strokeOpacity="0.1"
          strokeWidth="8"
        />
        {/* Value arc */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference * frac} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="34"
          fontWeight="600"
          fill={color}
        >
          {value}
        </text>
      </svg>
      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-ink/55">
        {label}
      </span>
    </div>
  );
}

/**
 * A row of circular score gauges (mirrors AgentTrace's evaluation report),
 * rendered natively so it stays crisp and on-palette. Used as the AgentTrace
 * hero and index-card thumbnail.
 */
export default function ScoreRings({
  scores,
  verdict,
  showVerdict = true,
  ringMax = 128,
  gapClass = "gap-6 sm:gap-10",
  className = "",
}: {
  scores: Score[];
  verdict?: string;
  showVerdict?: boolean;
  ringMax?: number;
  gapClass?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showVerdict && verdict && (
        <div className="mb-5 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/45">
            evaluation verdict
          </p>
          <span
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-semibold text-ink"
            style={{ background: "color-mix(in srgb, #D9B068 42%, #FAF7EE)" }}
          >
            <span aria-hidden>◠</span>
            {verdict}
          </span>
        </div>
      )}
      <div
        className={`flex w-full items-start justify-center px-2 ${gapClass}`}
      >
        {scores.map((s, i) => (
          <Ring key={i} {...s} ringMax={ringMax} />
        ))}
      </div>
    </div>
  );
}

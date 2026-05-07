"use client";

type Props = {
  size?: number;
  className?: string;
  /** Star color — defaults to dusty rose. */
  color?: string;
  /** Set false to render a static (non-animated) version. */
  animated?: boolean;
};

/**
 * Sofia's mark: a 4-point sparkle-star with three smaller sparkles around it.
 * Each sparkle twinkles on its own clock so the logo feels like it's
 * sprinkling. The whole group also gently floats.
 */
export default function Logo({
  size = 64,
  className = "",
  color = "#7E91C0",
  animated = true,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? "logo-float" : ""}`}
      aria-label="Sofia logo"
    >
      {/* Main 4-point sparkle */}
      <SparkleStar
        cx={32}
        cy={32}
        r={18}
        fill={color}
        className={animated ? "logo-sparkle logo-sparkle-main" : ""}
      />

      {/* Top-right satellite */}
      <SparkleStar
        cx={52}
        cy={14}
        r={5}
        fill={color}
        className={animated ? "logo-sparkle logo-sparkle-1" : ""}
      />

      {/* Bottom-left satellite */}
      <SparkleStar
        cx={12}
        cy={48}
        r={4}
        fill={color}
        className={animated ? "logo-sparkle logo-sparkle-2" : ""}
      />

      {/* Top-left dot satellite */}
      <SparkleStar
        cx={16}
        cy={16}
        r={3}
        fill={color}
        className={animated ? "logo-sparkle logo-sparkle-3" : ""}
      />

      {/* Bottom-right tiny */}
      <SparkleStar
        cx={50}
        cy={50}
        r={2.5}
        fill={color}
        className={animated ? "logo-sparkle logo-sparkle-4" : ""}
      />
    </svg>
  );
}

/**
 * 4-point "sparkle" star with concave sides — long arms, short waist.
 * Looks like ✦ but as a real path so it scales and animates cleanly.
 */
function SparkleStar({
  cx,
  cy,
  r,
  fill,
  className = "",
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  className?: string;
}) {
  const inner = r * 0.28;
  const d =
    `M${cx},${cy - r} ` +
    `L${cx + inner},${cy - inner} ` +
    `L${cx + r},${cy} ` +
    `L${cx + inner},${cy + inner} ` +
    `L${cx},${cy + r} ` +
    `L${cx - inner},${cy + inner} ` +
    `L${cx - r},${cy} ` +
    `L${cx - inner},${cy - inner} Z`;
  return (
    <path
      d={d}
      fill={fill}
      className={className}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

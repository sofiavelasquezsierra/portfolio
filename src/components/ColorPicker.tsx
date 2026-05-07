"use client";

import { useState } from "react";

const swatches = [
  "#E8533A", // coral
  "#FF8E72", // peach
  "#FCD981", // butter
  "#C8D5C0", // sage
  "#A8D2EA", // sky
  "#D7CDEB", // lavender
  "#F5C6CB", // blush
  "#2D2D44", // ink
];

export default function ColorPicker({
  onChange,
}: {
  onChange: (color: string) => void;
}) {
  const [active, setActive] = useState(swatches[0]);

  function pick(c: string) {
    setActive(c);
    onChange(c);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", c);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-mute mb-3">
        pick a vibe
      </p>
      <div className="flex flex-wrap gap-2">
        {swatches.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              onClick={() => pick(c)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                isActive ? "border-ink scale-110" : "border-white/80"
              }`}
              style={{
                background: c,
                boxShadow: isActive ? "0 0 0 3px rgba(45,45,68,0.15)" : undefined,
              }}
              aria-label={`pick ${c}`}
            />
          );
        })}
      </div>
    </div>
  );
}

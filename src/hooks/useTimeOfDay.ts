"use client";

import { useEffect, useState } from "react";
import { paletteForHour, type SkyPalette } from "@/lib/sky";

export function useTimeOfDay(refreshMs = 60_000): SkyPalette {
  const [palette, setPalette] = useState<SkyPalette>(() =>
    paletteForHour(new Date().getHours())
  );

  useEffect(() => {
    const tick = () => setPalette(paletteForHour(new Date().getHours()));
    tick();
    const id = setInterval(tick, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  return palette;
}

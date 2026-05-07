"use client";

import { useEffect, useState } from "react";
import { moonPhase } from "@/lib/moon";
import { useWeather } from "@/hooks/useWeather";

type Props = {
  /** Forced text color from the time-of-day palette so the panel stays
   *  readable on whatever sky is showing. */
  color?: string;
};

const WEATHER_LABEL: Record<string, { emoji: string; word: string }> = {
  clear: { emoji: "☀️", word: "clear" },
  cloudy: { emoji: "☁️", word: "cloudy" },
  rain: { emoji: "🌧️", word: "raining" },
  snow: { emoji: "❄️", word: "snowing" },
  fog: { emoji: "🌫️", word: "foggy" },
  storm: { emoji: "⛈️", word: "stormy" },
  unknown: { emoji: "·", word: "" },
};

/** Top-right widget on the landing page: time (with seconds), moon phase, weather. */
export default function CornerInfo({ color }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const { weather, location } = useWeather();

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const day = now
    .toLocaleDateString([], { weekday: "short" })
    .toUpperCase();
  const moon = moonPhase(now);
  const wx = WEATHER_LABEL[weather];

  return (
    <div
      className="absolute top-6 right-6 md:top-8 md:right-10 text-right text-[11px] uppercase tracking-[0.22em] leading-tight pointer-events-none select-none"
      style={{ color: color ?? "currentColor", opacity: 0.88 }}
    >
      <p className="font-mono text-[15px] tracking-[0.04em] normal-case">
        {day} · {time}
      </p>
      <p className="mt-1 flex items-center justify-end gap-1.5">
        <span className="text-base">{moon.emoji}</span>
        <span>{moon.label}</span>
      </p>
      <p className="mt-0.5 font-mono text-[10px] opacity-70">
        {Math.round(moon.illumination * 100)}% lit
      </p>
      {wx.word && (
        <p className="mt-2 flex items-center justify-end gap-1.5">
          <span className="text-base">{wx.emoji}</span>
          <span>
            {wx.word}
            {location ? ` · ${location.toLowerCase()}` : ""}
          </span>
        </p>
      )}
    </div>
  );
}

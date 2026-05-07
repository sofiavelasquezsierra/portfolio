"use client";

import { useEffect, useState } from "react";

export type Weather =
  | "clear"
  | "cloudy"
  | "rain"
  | "snow"
  | "fog"
  | "storm"
  | "unknown";

const CACHE_KEY = "sofia.weather";
const CACHE_MS = 30 * 60 * 1000; // 30 min — keeps API calls trivial.

type Cache = { w: Weather; loc: string | null; t: number };

/**
 * Fetches current weather using IP-based location → Open-Meteo.
 * Both services are free and require no API key. Cached in localStorage
 * for 30 minutes; falls back silently to "clear" on any error.
 */
export function useWeather(): { weather: Weather; location: string | null } {
  const [weather, setWeather] = useState<Weather>("unknown");
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    // Read cache first.
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as Cache;
        if (cached && Date.now() - cached.t < CACHE_MS) {
          setWeather(cached.w);
          setLocation(cached.loc);
          return;
        }
      }
    } catch {
      // ignore
    }

    let cancelled = false;
    (async () => {
      try {
        const geoRes = await fetch("https://ipapi.co/json/", {
          cache: "no-store",
        });
        if (!geoRes.ok) throw new Error("geo");
        const geo = await geoRes.json();
        const lat = geo?.latitude;
        const lon = geo?.longitude;
        const city = geo?.city as string | undefined;
        if (typeof lat !== "number" || typeof lon !== "number") {
          throw new Error("no coords");
        }

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code`,
          { cache: "no-store" }
        );
        if (!wxRes.ok) throw new Error("wx");
        const wx = await wxRes.json();
        const w = mapWeatherCode(wx?.current?.weather_code);

        if (cancelled) return;
        setWeather(w);
        setLocation(city ?? null);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ w, loc: city ?? null, t: Date.now() } as Cache)
          );
        } catch {
          // ignore quota
        }
      } catch {
        if (!cancelled) setWeather("clear");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, location };
}

function mapWeatherCode(code: number | undefined): Weather {
  if (code == null) return "clear";
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95 && code <= 99) return "storm";
  return "clear";
}

export type SkyMode = "dawn" | "morning" | "day" | "sunset" | "dusk" | "night";

export type SkyPalette = {
  mode: SkyMode;
  top: string;
  mid: string;
  bottom: string;
  textOnSky: string;
  greeting: string;
};

export function modeForHour(h: number): SkyMode {
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 10) return "morning";
  if (h >= 10 && h < 16) return "day";
  if (h >= 16 && h < 18) return "sunset";
  if (h >= 18 && h < 20) return "dusk";
  return "night";
}

/**
 * Cleaner three-stop gradients. Cooler overall — sunset shifts from orange
 * to a twilight blue-mauve-amber, matching the rest of the cool-pastel
 * palette and avoiding the brick-orange feel.
 */
export const palettes: Record<SkyMode, SkyPalette> = {
  dawn: {
    mode: "dawn",
    top: "#9FA8C9",
    mid: "#D9C5D2",
    bottom: "#EDD9C5",
    textOnSky: "#2C3E50",
    greeting: "Good early morning",
  },
  morning: {
    mode: "morning",
    top: "#8FBADE",
    mid: "#C2D9EA",
    bottom: "#EFE8DA",
    textOnSky: "#2C3E50",
    greeting: "Good morning",
  },
  day: {
    mode: "day",
    top: "#7DB1DD",
    mid: "#A8CBE5",
    bottom: "#E8F0F5",
    textOnSky: "#2C3E50",
    greeting: "Good afternoon",
  },
  sunset: {
    mode: "sunset",
    top: "#5C698C",
    mid: "#A89AAB",
    bottom: "#D9B7A5",
    textOnSky: "#FFFFFF",
    greeting: "Good evening",
  },
  dusk: {
    mode: "dusk",
    top: "#2D3450",
    mid: "#5E576E",
    bottom: "#8A7B85",
    textOnSky: "#FFFFFF",
    greeting: "Good evening",
  },
  night: {
    mode: "night",
    top: "#0F1733",
    mid: "#1F2447",
    bottom: "#393864",
    textOnSky: "#FFFFFF",
    greeting: "Hello night owl",
  },
};

export function paletteForHour(h: number): SkyPalette {
  return palettes[modeForHour(h)];
}

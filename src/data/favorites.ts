export type Favorite = {
  id: string;
  emoji: string;
  label: string;
  caption: string;
  /** Replace placeholder emoji with a real photo by setting this to /favorites/<file>.png */
  src?: string;
  /** rotation for the sticker-on-tray look */
  rotate: number;
  /** wearables-related → gets a small accent dot */
  wearables?: boolean;
};

// User can swap any emoji for a real photo by adding a file at the `src` path.
// 8 items fit comfortably in a 4×2 grid inside the tray.
export const favorites: Favorite[] = [
  {
    id: "watch",
    emoji: "⌚",
    label: "WHOOP",
    caption: "data on my wrist 24/7",
    rotate: -6,
    wearables: true,
  },
  {
    id: "headphones",
    emoji: "🎧",
    label: "Beats",
    caption: "flight playlists, on repeat",
    rotate: 4,
    wearables: true,
  },
  {
    id: "passport",
    emoji: "📕",
    label: "Passport",
    caption: "🇨🇴 — six countries deep",
    rotate: -3,
  },
  {
    id: "coffee",
    emoji: "☕",
    label: "Cortado",
    caption: "fuel of choice",
    rotate: 7,
  },
  {
    id: "camera",
    emoji: "📷",
    label: "Camera",
    caption: "i over-document everything",
    rotate: -4,
  },
  {
    id: "book",
    emoji: "📖",
    label: "Reading",
    caption: "currently: design of everyday things",
    rotate: 3,
  },
  {
    id: "eeg",
    emoji: "🧠",
    label: "EEG cap",
    caption: "64 channels of brainwaves",
    rotate: -8,
    wearables: true,
  },
  {
    id: "ticket",
    emoji: "🎫",
    label: "Boarding stubs",
    caption: "i keep every single one",
    rotate: 5,
  },
];

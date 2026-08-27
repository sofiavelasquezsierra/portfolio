export type Place = {
  country: string;
  city?: string;
  flag: string;
  years: string;
  note: string;
};

export const placesLived: Place[] = [
  {
    country: "France",
    city: "Paris",
    flag: "🇫🇷",
    years: "early childhood",
    note: "where my love for pastries and trains started.",
  },
  {
    country: "Colombia",
    city: "Bogotá",
    flag: "🇨🇴",
    years: "childhood",
    note: "home base — family, music, hot chocolate with cheese.",
  },
  {
    country: "Kenya",
    city: "Nairobi",
    flag: "🇰🇪",
    years: "childhood",
    note: "elephants on the way to school. seriously.",
  },
  {
    country: "Brazil",
    city: "Rio de Janeiro",
    flag: "🇧🇷",
    years: "teenage years",
    note: "where i learned portuguese and how to be loud at futebol games.",
  },
  {
    country: "Canada",
    city: "Montreal",
    flag: "🇨🇦",
    years: "2021 – 2025",
    note: "mcgill, blockchain at mcgill, my first real winters.",
  },
  {
    country: "USA",
    city: "Pittsburgh",
    flag: "🇺🇸",
    years: "2025 – now",
    note: "cmu, weber lab, three rivers, lots of coffee.",
  },
];

export type Language = {
  name: string;
  level: "native" | "fluent" | "conversational" | "learning";
  flag: string;
};

export const languages: Language[] = [
  { name: "Spanish", level: "native", flag: "🇨🇴" },
  { name: "English", level: "fluent", flag: "🇺🇸" },
  { name: "Portuguese", level: "fluent", flag: "🇧🇷" },
  { name: "French", level: "fluent", flag: "🇫🇷" },
  { name: "Urdu", level: "learning", flag: "🇵🇰" },
];

export const funFacts: string[] = [
  "i've lived on three continents before turning twenty.",
  "my passport has stamps from kenya, brazil, france, canada, and the usa.",
  "i can switch between four languages in a single conversation (and confuse everyone).",
  "i'm currently learning urdu — slowly, lovingly.",
  "i've never met a city i couldn't find a good coffee shop in.",
  "i make playlists for every flight i take.",
  "i think the best ideas come from layovers in foreign airports.",
];

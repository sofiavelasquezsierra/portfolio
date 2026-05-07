export type CountryStamp = {
  id: string;
  country: string;
  flag: string;
  /** path inside /public — replace placeholder file when ready */
  src: string;
  /** descriptive alt text for accessibility */
  alt: string;
  /** rotation applied when displayed in the tray (visual variety) */
  rotate?: number;
};

// Drop your real stamp images into /public/stamps/ with these filenames.
// Until you do, the postcard renders a styled placeholder card with the country name.
export const countryStamps: CountryStamp[] = [
  {
    id: "brazil",
    country: "Brazil",
    flag: "🇧🇷",
    src: "/stamps/brazil-arara.png",
    alt: "Brazil 1993 Arara stamp",
    rotate: -4,
  },
  {
    id: "france",
    country: "France",
    flag: "🇫🇷",
    src: "/stamps/france-paris.png",
    alt: "Paris Eiffel Tower stamp",
    rotate: 3,
  },
  {
    id: "kenya-butterfly",
    country: "Kenya",
    flag: "🇰🇪",
    src: "/stamps/kenya-butterfly.png",
    alt: "Kenya Cyrestis camillus butterfly stamp",
    rotate: -2,
  },
  {
    id: "kenya-safari",
    country: "Kenya",
    flag: "🇰🇪",
    src: "/stamps/kenya-safari.png",
    alt: "Kenya 25th Safari Rally stamp",
    rotate: 5,
  },
  {
    id: "col",
    country: "Colombia",
    flag: "🇧🇷",
    src: "/stamps/colombia-town.png",
    alt: "col town stamp",
    rotate: -4,
  },
  /*/
  {
    id: "kenya-kilimanjaro",
    country: "Kenya",
    flag: "🇰🇪",
    src: "/stamps/kenya-kilimanjaro.png",
    alt: "Kenya Kilimanjaro Buffalo Lodge stamp",
    rotate: -3,
  },
  /*/
  {
    id: "colombia",
    country: "Colombia",
    flag: "🇨🇴",
    src: "/stamps/colombia.png",
    alt: "Colombia stamp (placeholder)",
    rotate: 2,
  },
  {
    id: "canada",
    country: "Canada",
    flag: "🇨🇦",
    src: "/stamps/canada.png",
    alt: "Canada stamp (placeholder)",
    rotate: -5,
  },
   {
    id: "brazil",
    country: "Brazil",
    flag: "🇧🇷",
    src: "/stamps/brasil-flag.png",
    alt: "Brasil flag",
    rotate: -4,
  },
];

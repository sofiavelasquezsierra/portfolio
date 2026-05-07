# sofia velasquez sierra — portfolio

**building ai products for health and wearables.** cmu ms biomedical engineering, aug 2026.
[live site →](https://sofiavelasquez.com) · [linkedin →](https://www.linkedin.com/in/sofia-velasquez-sierra/) · [github →](https://github.com/sofiavelasquezsierra)

a portfolio site that doubles as a product demo. every interaction here is something i&apos;d want to ship in a real wearables product — onboarding that personalizes, time-aware backgrounds, weather-driven overlays, persistent state across sessions, motion-safe animations. designed, built, and iterated on by me.

## what's in here

- **a sky that knows the time and weather.** the gradient shifts dawn → morning → day → sunset → dusk → night based on the visitor's local clock. the sun arcs across the screen by hour, the moon shows the right phase. if it's actually raining or snowing where you are, you'll see it falling.
- **cursor onboarding.** pick a cursor on entry — sparkle, heart, plane, moon, etc. — and it follows you across every page. persisted in localStorage and re-broadcast across components via a custom event, so swapping it from any page updates the whole site instantly.
- **project case studies.** index-card style cards that reveal role / team / timeframe on hover. column-based layout so hovering one card only displaces siblings in the same column, not the whole row.
- **drag-and-drop postcard contact.** seven country stamps from places i&apos;ve lived. drag any onto the postcard, fill in the form, send.
- **honest visitor counter.** `/api/visit` increments once per browser. no analytics, no third-party trackers.

## product decisions worth calling out

a portfolio is the cleanest possible product to ship — single user, no backend, no SLA. that makes it the right place to demonstrate judgment, not just code. a few decisions i'm proud of:

**personalization that survives.** most portfolios have a flashy intro you do once. mine connects to a real preference (the cursor) so the customization persists every session. it's onboarding that does work, not theatre.

**weather privacy by default.** ip-based geolocation (no permission prompt), city name only surfaces in the corner widget, cached 30 minutes, nothing stored server-side. visitors get atmosphere, not a tracking pixel.

**cards that don't move their siblings.** the first version used css grid, which forced row-height to match the tallest cell. when one card expanded on hover, the whole row shifted. i switched to round-robin column distribution — only same-column siblings move. felt right immediately and the code got simpler.

**one stamp per postcard.** the original spec allowed multiple. positioning math was unreliable and the postcard ended up cluttered. restricting to a single stamp at a fixed slot eliminated the bug surface and read more like a real postcard. simpler code, better ux.

**no fbm noise on the sky.** i prototyped a webgl sky with book-of-shaders fbm noise for cloud-like atmosphere. it competed with the gradient instead of supporting it. stripped back to a clean three-stop css gradient + paper grain. cleanliness > cleverness.

**accessibility wasn't an afterthought.** every animation respects `prefers-reduced-motion`. the cursor falls back to native on touch devices. visitor count never blocks render. weather fetch fails silently on privacy extensions. each placeholder asset has a working fallback so the site never breaks if a file is missing.

## stack

next.js 14 (app router) · typescript · tailwind · framer motion · canvas particles · open-meteo for weather · ipapi.co for geolocation. deployed on vercel.

## pages

| route | what it is |
|---|---|
| `/` | welcome + cursor picker + time-of-day sky |
| `/work` | project grid with case-study cards |
| `/work/[slug]` | full case study (problem → decisions → outcomes) |
| `/about` | bio, identity grid, experience, education, favourites tray, signature pad |
| `/gallery` | interactive particle sandbox + visitor counter |
| `/contact` | postcard with draggable country stamps |
| `/api/visit` | visitor counter (in-memory; swap to vercel kv for prod) |

## run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## deploy

push to github → import in vercel → click deploy. no env vars required for the free tier.

for a persistent visitor count in production, install `@vercel/kv`, attach a kv instance in the vercel dashboard, then update `src/app/api/visit/route.ts` to use `kv.incr("visits")` and `kv.get("visits")`. six-line change, documented inline.

## where things live

| what | where |
|---|---|
| projects + case studies | [src/data/projects.ts](src/data/projects.ts) |
| experience + education | [src/data/experience.ts](src/data/experience.ts) |
| places lived, languages, fun facts | [src/data/places.ts](src/data/places.ts) |
| country stamps | [src/data/stamps.ts](src/data/stamps.ts) |
| cursor options | [src/data/cursors.ts](src/data/cursors.ts) |
| favourites (tray items) | [src/data/favorites.ts](src/data/favorites.ts) |
| sky palette per time of day | [src/lib/sky.ts](src/lib/sky.ts) |
| moon phase math | [src/lib/moon.ts](src/lib/moon.ts) |

## assets

drop into `public/`:
- `photos/sofia.jpg` — portrait
- `stamps/*.png` — country stamp images (filenames in `src/data/stamps.ts`)
- `favorites/*.png` — sticker-style item photos
- `security-tray.png` — background image for the favourites tray

every asset has a working placeholder; the site doesn't break if any are missing.

## design system

| | |
|---|---|
| **base** | warm white `#FAF7EE` |
| **ink** | deep slate `#2C3E50` |
| **accent** | periwinkle `#7E91C0` |
| **secondary** | sage `#7FA17F`, honey `#D9B068` |
| **soft palette** | sky, peach, blush, butter, lavender for time-of-day gradients |
| **headers** | fraunces (variable serif) |
| **body** | dm sans |
| **handwritten** | caveat |

---

written and shipped with claude code · 2026

# Favorite-things stickers

Drop sticker-style photos here using these filenames so the security tray on `/about` picks them up automatically:

- `watch.png` — your WHOOP / smartwatch
- `headphones.png`
- `passport.png`
- `coffee.png`
- `camera.png`
- `book.png`
- `eeg.png`
- `ticket.png`

PNG with transparent background reads best (sticker feel). Square ~400×400 works well.

To wire a file up, set `src: "/favorites/<file>.png"` on the corresponding entry in `src/data/favorites.ts`. Until then, each item shows its emoji placeholder.

Want to add or remove items? Edit `src/data/favorites.ts` — the tray adapts.

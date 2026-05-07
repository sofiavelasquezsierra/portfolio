# Org logos

Drop logo PNGs here using these filenames so the experience + education timeline picks them up:

- `cmu.png` — CMU (used for HCII, Weber Lab, MS BME)
- `mcgill.png` — McGill (used for BE + Blockchain at McGill)
- `btg.png` — BTG Pactual
- `bnp.png` — BNP Paribas
- `blockchain-mcgill.png` — Blockchain at McGill (optional, falls back to cmu/mcgill if missing)

Square PNGs (~80×80) with transparent background work best. Each logo renders as a small circle next to the org name. Until a file exists at the expected path, the timeline shows a tidy initials chip in its place — nothing breaks.

Add more logos in [src/data/experience.ts](../../src/data/experience.ts) by setting `logo: "/logos/your-file.png"` on the entry.

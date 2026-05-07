# Country stamps

Drop your stamp images here using these exact filenames so the postcard picks them up automatically:

| Filename                   | Source                                    |
| -------------------------- | ----------------------------------------- |
| `brazil-arara.png`         | the Brazil 1993 Arara parrot stamp        |
| `france-paris.png`         | the Paris / Eiffel Tower stamp            |
| `kenya-butterfly.png`      | Kenya Cyrestis camillus butterfly stamp   |
| `kenya-safari.png`         | Kenya 25th Safari Rally stamp             |
| `kenya-kilimanjaro.png`    | Kenya Kilimanjaro Buffalo Lodge stamp     |
| `colombia.png`             | a Colombia stamp (you'll add later)       |
| `canada.png`               | a Canada stamp (you'll add later)         |

PNG with transparent background works best. JPGs are fine too — just keep the filename.

If you want to add more, append to `src/data/stamps.ts` with the `id`, `country`, `flag`, `src`, and `alt` fields. Until a file exists at `src`, the tray shows a styled placeholder so nothing breaks.

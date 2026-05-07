export type CursorType = {
  id: string;
  label: string;
  glyph: string;
  color: string;
};

export const cursors: CursorType[] = [
  { id: "sparkle", label: "sparkle", glyph: "✦", color: "#7E91C0" },
  { id: "heart", label: "heart", glyph: "♥", color: "#E5849C" },
  { id: "star", label: "star", glyph: "★", color: "#E5C57E" },
  { id: "plane", label: "plane", glyph: "✈", color: "#8FA88E" },
  { id: "cloud", label: "cloud", glyph: "☁", color: "#7CA8C0" },
  { id: "moon", label: "moon", glyph: "☽", color: "#9A85B8" },
  { id: "flower", label: "flower", glyph: "✿", color: "#F2A6B0" },
  { id: "dot", label: "classic", glyph: "●", color: "#7E91C0" },
];

export function getCursor(id: string | null): CursorType {
  if (!id) return cursors[0];
  return cursors.find((c) => c.id === id) ?? cursors[0];
}

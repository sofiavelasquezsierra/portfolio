export type Avatar = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

export const avatars: Avatar[] = [
  { id: "plane", emoji: "✈️", label: "Traveler", color: "#A8D2EA" },
  { id: "moon", emoji: "🌙", label: "Night Owl", color: "#5B4E84" },
  { id: "sun", emoji: "☀️", label: "Early Bird", color: "#FCD981" },
  { id: "cloud", emoji: "☁️", label: "Daydreamer", color: "#E5F2F8" },
  { id: "star", emoji: "⭐", label: "Stargazer", color: "#FFC4A3" },
  { id: "flower", emoji: "🌸", label: "Romantic", color: "#F5C6CB" },
  { id: "sprout", emoji: "🌱", label: "Builder", color: "#C8D5C0" },
  { id: "ghost", emoji: "👻", label: "Mystery Guest", color: "#D7CDEB" },
];

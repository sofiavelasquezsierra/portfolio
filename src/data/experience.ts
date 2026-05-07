export type Experience = {
  date: string;
  role: string;
  org: string;
  detail?: string;
};

export const experience: Experience[] = [
  {
    date: "Apr 2026 – Present",
    role: "Graduate Researcher",
    org: "Weber Neural Interfaces Lab (Meta Collaboration), CMU",
    detail: "ML pipelines for Meta's sEMG wristband.",
  },
  {
    date: "Jun – Aug 2025",
    role: "Software Engineering Intern",
    org: "BTG Pactual",
  },
  {
    date: "May – Aug 2024",
    role: "IT Production Security Intern",
    org: "BNP Paribas",
  },
  {
    date: "Jan 2023 – Jun 2025",
    role: "Co-President",
    org: "Blockchain at McGill",
  },
];

export type Education = {
  school: string;
  degree: string;
  date: string;
};

export const education: Education[] = [
  {
    school: "Carnegie Mellon University",
    degree: "MS Biomedical Engineering",
    date: "Aug 2026",
  },
  {
    school: "McGill University",
    degree: "BE Computer Engineering",
    date: "Jun 2025",
  },
];

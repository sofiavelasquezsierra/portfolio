export type Experience = {
  date: string;
  role: string;
  org: string;
  detail?: string;
  /** Path inside /public — drops to a styled initials chip if missing. */
  logo?: string;
};

export const experience: Experience[] = [
  {
    date: "May 2026 – Present",
    role: "Research Assistant",
    org: "HCII (Human-Computer Interaction Institute), CMU",
    detail: "Wearables + interaction research.",
    logo: "/logos/cmu.png",
  },
  {
    date: "Apr 2026 – Present",
    role: "Graduate Researcher",
    org: "Weber Neural Interfaces Lab (Meta Collaboration), CMU",
    detail: "ML pipelines for Meta's sEMG wristband.",
    logo: "/logos/cmu.png",
  },
  {
    date: "Jun – Aug 2025",
    role: "Software Engineering Intern",
    org: "BTG Pactual",
    logo: "/logos/btg.png",
  },
  {
    date: "May – Aug 2024",
    role: "IT Production Security Intern",
    org: "BNP Paribas",
    logo: "/logos/bnp.png",
  },
  {
    date: "Jan 2023 – Jun 2025",
    role: "Co-President",
    org: "Blockchain at McGill",
    logo: "/logos/blockchain-mcgill.png",
  },
];

export type Education = {
  school: string;
  degree: string;
  date: string;
  logo?: string;
};

export const education: Education[] = [
  {
    school: "Carnegie Mellon University",
    degree: "MS Biomedical Engineering",
    date: "Aug 2026",
    logo: "/logos/cmu.png",
  },
  {
    school: "McGill University",
    degree: "BE Computer Engineering",
    date: "Jun 2025",
    logo: "/logos/mcgill.png",
  },
];

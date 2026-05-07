export type ProjectCategory = "ai" | "research" | "engineering";

export type CaseStudySection = {
  heading: string;
  body: string;
};

export type ProjectStatus =
  | "SHIPPED"
  | "RESEARCH"
  | "INTERNSHIP"
  | "IN PROGRESS"
  | "HANDED OVER";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  cover: { color: string; emoji: string };
  problem: string;
  blurb: string;
  metrics?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  reportUrl?: string;
  featured?: boolean;
  /** Optional second tag shown on the index card. */
  status?: ProjectStatus;
  /** Marks card with a Side Project tag. */
  sideProject?: boolean;
  // Case-study content
  role?: string;
  duration?: string;
  team?: string;
  stack?: string[];
  caseStudy?: CaseStudySection[];
  keyDecisions?: { title: string; body: string }[];
  outcomes?: string[];
};

export const projects: Project[] = [
  {
    slug: "agenttrace",
    title: "AgentTrace",
    subtitle: "AI Agent Evaluation Tool",
    category: "ai",
    year: "2025",
    cover: { color: "#FFD6C2", emoji: "🤖" },
    problem:
      "Teams deploying AI agents have no systematic way to know if their agent behaves as designed — before real customers find out it doesn't.",
    blurb:
      "Configure any AI agent's persona and policies, run test conversations, and get a scored report.",
    tags: ["Claude API", "Python", "Streamlit", "LLM Agents"],
    liveUrl: "https://agenttrace.streamlit.app/",
    githubUrl: "https://github.com/sofiavelasquezsierra/agenttrace",
    featured: true,
    status: "SHIPPED",
    sideProject: true,
    role: "Sole builder · designer · researcher",
    duration: "3 weeks",
    team: "Solo",
    stack: ["Python", "Streamlit", "Anthropic SDK", "Pydantic"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "Every team I talked to deploying customer-facing AI agents was doing the same thing: spot-checking conversations by hand. That falls apart at any meaningful scale, and it skips the whole class of failures you don't think to look for. AgentTrace gives you a structured way to stress-test an agent before users do.",
      },
      {
        heading: "How it works",
        body: "You define your agent's persona and policies. AgentTrace generates synthetic test conversations across categories (helpful queries, edge cases, policy probes, attempted jailbreaks). A separate evaluator model scores each transcript on five dimensions and returns three concrete fixes ranked by severity.",
      },
      {
        heading: "What I learned",
        body: "The single biggest unlock was separating the agent and evaluator into two model calls with different system prompts. When the same model does both, it tends to grade itself generously and miss tone issues. Splitting them produced sharper, more actionable evaluations.",
      },
    ],
    keyDecisions: [
      {
        title: "Two Claude calls, not one",
        body: "The agent stays in character. The evaluator steps outside and judges it. Self-evaluation collapses both jobs and hides failure modes.",
      },
      {
        title: "Output decisions, not dashboards",
        body: "The eval report ends with three ranked fixes, not a wall of metrics. PMs use it to decide what to ship next, not to admire charts.",
      },
      {
        title: "Streamlit on purpose",
        body: "I wanted to ship in 3 weeks and validate the workflow with real users before investing in custom UI. Streamlit was the right tool for the question.",
      },
    ],
    outcomes: [
      "Live demo deployed and used by 5+ early testers",
      "Generates a full eval cycle in under 90 seconds",
      "Open-sourced on GitHub",
    ],
  },
  {
    slug: "merchantpulse",
    title: "MerchantPulse",
    subtitle: "AI-Powered Product Feedback Analyzer",
    category: "ai",
    year: "2025",
    cover: { color: "#C8D5C0", emoji: "🛍️" },
    problem:
      "Merchants have hundreds of reviews but no fast way to turn them into product decisions.",
    blurb:
      "Drops in a CSV of reviews and gets back: themes, sentiment shifts, and the three things to fix this week.",
    tags: ["Claude API", "Python", "Streamlit", "Product"],
    liveUrl: "https://merchantpulse.streamlit.app/",
    githubUrl: "https://github.com/sofiavelasquezsierra/merchantpulse",
    status: "SHIPPED",
    sideProject: true,
    role: "Sole builder",
    duration: "2 weeks",
    team: "Solo",
    stack: ["Python", "Streamlit", "Anthropic SDK", "Pandas"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "I kept seeing small Shopify merchants drown in reviews — they'd export a CSV, glance at the 1-stars, and call it a day. The signal in the 4-stars (almost-loved-it) is where product decisions actually live.",
      },
      {
        heading: "How it works",
        body: "Upload a CSV. The pipeline clusters reviews by theme, scores sentiment, and surfaces movement (e.g., 'sizing complaints up 22% week-over-week'). The output is a one-page brief, not a dashboard.",
      },
    ],
    keyDecisions: [
      {
        title: "Decisions over dashboards",
        body: "Most review tools throw charts at you. I made the deliverable a one-page brief that ends with three concrete actions ranked by impact.",
      },
    ],
    outcomes: [
      "Processes 500+ reviews into a 1-page brief in under 30s",
      "Live demo deployed",
    ],
  },
  {
    slug: "rof",
    title: "ROF",
    subtitle: "Student Club Management Platform",
    category: "ai",
    year: "2024",
    cover: { color: "#D7CDEB", emoji: "🎓" },
    problem:
      "Club institutional knowledge disappears when leadership graduates.",
    blurb:
      "Built for the handoff, not the day-to-day. Onboarding the next generation is the real workflow.",
    tags: ["Next.js", "TypeScript", "T3 Stack", "Full-Stack"],
    liveUrl: "https://rof-zyb9.vercel.app/",
    githubUrl: "https://github.com/sofiavelasquezsierra/rof",
    status: "HANDED OVER",
    role: "Co-lead · full-stack",
    duration: "Semester project",
    team: "3 engineers",
    stack: ["Next.js", "TypeScript", "tRPC", "Prisma", "Postgres", "Tailwind"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "Every May, McGill clubs lose two years of muscle memory when senior leadership graduates. Notion docs go unread; Slacks die. We built a platform where club knowledge lives in structured, handoff-ready form by default.",
      },
    ],
    keyDecisions: [
      {
        title: "Optimize for the handoff",
        body: "We refused to build a generic CMS. Every feature was scored against: does this make next year's leadership 1% better off?",
      },
    ],
    outcomes: ["Deployed live; used by Blockchain at McGill leadership team"],
  },
  {
    slug: "bci-decoder",
    title: "BCI Decoder",
    subtitle: "Sensorimotor-rhythm decoder, 64-channel EEG",
    category: "research",
    year: "2025",
    cover: { color: "#A8D2EA", emoji: "🧠" },
    problem:
      "Off-the-shelf BCI decoders plateau at low accuracy on noisy real-world EEG.",
    blurb:
      "Built the full stack: electrodes, preprocessing, and two ML architectures. Hit 90.9% offline accuracy on 22.4M+ data points.",
    metrics: "64-channel EEG · 90.9% accuracy · 22.4M+ data points",
    tags: ["Python", "PyTorch", "EEG", "Signal Processing"],
    githubUrl:
      "https://github.com/sofiavelasquezsierra/Offline-Optimization-of-Sensorimotor-Rhythm-BCI-Decoders",
    featured: true,
    status: "RESEARCH",
    role: "Lead researcher",
    duration: "2 semesters",
    team: "Solo with faculty advisor",
    stack: ["Python", "PyTorch", "MNE", "NumPy", "scikit-learn"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "Sensorimotor-rhythm BCIs let people move a cursor or prosthetic by imagining motion. The blocker is decoder accuracy on raw EEG, which is noisy, drifty, and subject-specific. I rebuilt the pipeline end-to-end to find where the wins actually came from.",
      },
      {
        heading: "What I built",
        body: "Electrode setup and recording protocol → bandpass filtering → ICA-based artifact rejection → CSP feature extraction → two model architectures (a CSP+LDA baseline and a small CNN). Cross-validated across subjects.",
      },
      {
        heading: "What I learned",
        body: "The biggest accuracy gains came from the boring parts: artifact rejection and per-subject calibration. Model architecture mattered less than I expected. This shaped how I think about ML in messy-data domains generally.",
      },
    ],
    keyDecisions: [
      {
        title: "Rebuild the pipeline, don't tune the model",
        body: "I started with a solid model and bad preprocessing. Flipping that produced bigger gains than any hyperparameter sweep.",
      },
    ],
    outcomes: [
      "90.9% offline decoder accuracy",
      "22.4M+ data points processed",
      "Open-sourced",
    ],
  },
  {
    slug: "greenllama",
    title: "GreenLlama",
    subtitle: "Compressed, FPGA-accelerated LLM with bias eval",
    category: "research",
    year: "2025",
    cover: { color: "#C8D5C0", emoji: "🦙" },
    problem:
      "Running LLMs on edge devices is power-hungry, and compression often degrades fairness in non-obvious ways.",
    blurb:
      "8× LLM compression · 43× power reduction · 56% bias reduction. FPGA-accelerated inference plus a responsible-AI evaluation pipeline.",
    metrics: "8× compression · 43× power reduction · 56% bias reduction",
    tags: ["PyTorch", "FPGA", "LLM", "Responsible AI"],
    reportUrl:
      "https://drive.google.com/file/d/1P1sH-5KYsKo7ho5Hpou_4GErsYZcyEit/view?usp=sharing",
    status: "RESEARCH",
    role: "Contributor — quantization + bias eval",
    duration: "1 semester",
    team: "4 engineers",
    stack: ["PyTorch", "Verilog", "FPGA toolchain", "BOLD eval suite"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "Compressing LLMs to run on edge hardware tends to amplify existing biases — and nobody measures it. We treated bias eval as a first-class metric alongside latency and power.",
      },
    ],
    keyDecisions: [
      {
        title: "Bias as a first-class metric",
        body: "We blocked any compression configuration that improved power but regressed bias scores past a threshold.",
      },
    ],
    outcomes: [
      "8× compression",
      "43× power reduction on FPGA",
      "56% reduction in measured bias vs. baseline",
    ],
  },
  {
    slug: "exoskeleton",
    title: "Parkinson's Exoskeleton",
    subtitle: "EMG/IMU-driven assistive arm",
    category: "engineering",
    year: "2024",
    cover: { color: "#F5C6CB", emoji: "🦾" },
    problem:
      "Tremor makes everyday tasks like drinking from a cup difficult for Parkinson's patients.",
    blurb:
      "Led 5-person team. 500 Hz EMG/IMU sampling, 15+ human sessions, 10-month delivery — translating clinical needs into sensor specs.",
    metrics: "500 Hz EMG/IMU · 15+ human sessions · 10-month build",
    tags: ["PyTorch", "EMG", "IMU", "Hardware"],
    status: "SHIPPED",
    role: "Team lead (5)",
    duration: "10 months",
    team: "5 engineers",
    stack: ["Python", "PyTorch", "Arduino", "Custom EMG/IMU rig"],
    caseStudy: [
      {
        heading: "Why this exists",
        body: "We started by asking: 'can a patient drink from a cup?' Every spec — sample rate, latency budget, weight — got mapped backward from that single user task.",
      },
    ],
    outcomes: [
      "Functional prototype delivered on time",
      "15+ human-subject sessions",
      "Closed the loop from sensor to assistive actuation",
    ],
  },
  {
    slug: "sensing-vest",
    title: "Smart Sensing Vest",
    subtitle: "Wearable gesture-recognition vest",
    category: "engineering",
    year: "2023",
    cover: { color: "#FCE9B6", emoji: "🦺" },
    problem:
      "Most wearable gesture systems fail when sensor placement varies between users.",
    blurb:
      "Iterated 6 sensor configurations to push gesture-recognition accuracy from 72% to 89%.",
    metrics: "6 configs · 72% → 89% accuracy",
    tags: ["Python", "Sensor Fusion", "Wearable"],
    status: "RESEARCH",
    role: "Researcher",
    duration: "1 semester",
    team: "Solo",
    stack: ["Python", "scikit-learn", "Custom sensor harness"],
    outcomes: ["Final config: 89% gesture-recognition accuracy"],
  },
  {
    slug: "gesture-synth",
    title: "Gesture Synthesizer",
    subtitle: "Real-time 3D gesture-controlled audio synth",
    category: "engineering",
    year: "2023",
    cover: { color: "#D7CDEB", emoji: "🎛️" },
    problem:
      "Embedded gesture inputs are usually slow or coarse — fine for menus, useless for music.",
    blurb:
      "Real-time 3D gesture recognition on STM32 driving a custom audio synthesizer.",
    metrics: "Real-time on STM32 · sub-frame latency",
    tags: ["C++", "RTOS", "Embedded", "STM32"],
    status: "SHIPPED",
    role: "Sole builder",
    duration: "Course project",
    team: "Solo",
    stack: ["C++", "FreeRTOS", "STM32 HAL"],
    outcomes: ["Live demo with audible, expressive gesture-to-tone mapping"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

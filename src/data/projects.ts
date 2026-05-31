export type ProjectCategory = "ai" | "research" | "engineering";

export type Screenshot = {
  /** Path under /public, e.g. "/projects/gesture-synth/hero.png" */
  src: string;
  /** Short caption shown under the image. */
  caption: string;
  /** Accessibility alt text. Defaults to caption if omitted. */
  alt?: string;
  /** Aspect ratio hint for the placeholder box, e.g. "16/9", "4/3", "1/1". */
  aspect?: string;
};

export type CaseStudySection = {
  heading: string;
  /** Supports inline emphasis with **double asterisks** → renders <strong>. */
  body: string;
  /** Optional screenshot rendered immediately after this section's body. */
  screenshot?: Screenshot;
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
  /** Optional hero image rendered at the top of the case study (replaces emoji block). */
  heroImage?: string;
  /** Optional looping hero video (muted autoplay). Takes priority over heroImage;
   *  heroImage is used as the poster while it loads. */
  heroVideo?: string;
  /** Optional thumbnail shown on the /work index card. Falls back to heroImage. */
  cardImage?: string;
  /** Inline screenshots rendered as a gallery after the case study sections. */
  screenshots?: Screenshot[];
};

export const projects: Project[] = [
  {
    slug: "agenttrace",
    title: "AgentTrace",
    subtitle: "AI Agent Evaluation Tool",
    category: "ai",
    year: "2025",
    cover: { color: "#FFD6C2", emoji: "🤖" },
    cardImage: "/projects/agenttrace/card.png",
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
    cardImage: "/projects/merchantpulse/card.png",
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
    cardImage: "/projects/rof/card.png",
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
    cardImage: "/projects/bci-decoder/card.png",
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
    cardImage: "/projects/greenllama/card.png",
    problem:
      "Running LLMs on edge devices is power-hungry, and compression often degrades fairness in non-obvious ways.",
    blurb:
      "8× LLM compression · 43× power reduction · 56% bias reduction. FPGA-accelerated inference plus a responsible-AI evaluation pipeline.",
    metrics: "8× compression · 43× power reduction · 56% bias reduction",
    tags: ["PyTorch", "FPGA", "LLM", "Responsible AI"],
    reportUrl:
      "https://drive.google.com/file/d/1fR2bXgjVwXstJf0-KpICgG9OVb1JLaes/view?usp=sharing",
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
    cardImage: "/projects/exoskeleton/card.png",
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
    cardImage: "/projects/sensing-vest/card.png",
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
    title: "My Melody MotionBox",
    subtitle: "A handheld synth that turns kids' gestures into sound",
    category: "engineering",
    year: "2023",
    cover: { color: "#D7CDEB", emoji: "🎛️" },
    cardImage: "/projects/gesture-synth/card.png",
    heroImage: "/projects/gesture-synth/hero.png",
    heroVideo: "/projects/gesture-synth/hero.mp4",
    problem:
      "Kids zone out the moment STEM stops being physical. We needed an instrument that taught sound and motion through play, not slides.",
    blurb:
      "STM32-based handheld toy that maps gyroscope motion to real-time sine-wave audio, with two-channel stereo feedback so every tilt has a sound.",
    metrics: "Two-channel real-time audio · 4 RTOS threads · LSM6DSL gyroscope",
    tags: ["Product", "Embedded C", "STM32", "RTOS"],
    status: "SHIPPED",
    role: "Product lead · Embedded engineer",
    duration: "1 semester · McGill ECSE 444",
    team: "4 engineers",
    githubUrl: "https://github.com/sofiavelasquezsierra/melody-motionbox",
    stack: [
      "Embedded C",
      "STM32L4 HAL",
      "CMSIS-DSP",
      "FreeRTOS (CMSIS-OS)",
      "LSM6DSL (I2C)",
      "DAC + DMA",
      "UART",
    ],
    caseStudy: [
      {
        heading: "Who it's for",
        body: "**Kids aged 6–10** learning STEM concepts at home or in a classroom. The blocker we kept hearing from parents and teachers wasn't curiosity — kids have plenty of that — it was **the gap between abstract physics** (sound waves, frequency, motion) **and anything they could touch**. So we built an instrument: pick it up, tilt it, hear what changes. **The lesson is inside the toy.**",
      },
      {
        heading: "Product bets",
        body: "Three calls shaped the build:\n\n1. **Sound first, screens never.** A screen would have pulled attention away from the body. UART output goes to a debug console for parents/teachers, not the kid.\n\n2. **Two channels, not one.** A single speaker collapses X and Y motion into a muddy tone. Routing X and Y to separate channels (stereo) gives each axis its own voice, so kids physically hear that **motion has dimensions**.\n\n3. **Continuous mapping, not buttons.** Frequency scales with angular velocity instead of triggering preset notes. Slow tilt = low hum, fast shake = high pitch. The cause-and-effect is **unmistakable in the first 5 seconds**.",
      },
      {
        heading: "How it works",
        body: "An **LSM6DSL 6-axis IMU** (over I2C) samples gyroscope data at ~1 kHz. A `ReadSensorTask` thread updates a shared state struct with the latest X/Y angular velocity. Two generator threads — one per axis — gate on motion magnitude (`|ω| > 10000 dps` raw), then synthesize a sine wave whose period is modulated by the angular speed:\n\n    samples_per_cycle = base / (1 + (|ω| − 10000) / 15000)\n\nThe sine table is built with **CMSIS-DSP's `arm_sin_f32`** (single-cycle fixed-point on Cortex-M4), scaled to the 12-bit DAC range, and streamed out via **DMA** so the CPU stays free to read the next sample. X and Y are routed to `DAC_CHANNEL_1` and `DAC_CHANNEL_2` — **different speakers, different ears**. A fourth `PrintTask` thread emits UART debug messages so adults can verify the device is working.",
        screenshot: {
          src: "/projects/gesture-synth/waveform.png",
          caption: "Faster tilt → fewer samples per cycle → higher pitch. The same gyro-to-frequency mapping the firmware computes, visualized.",
          aspect: "16/9",
        },
      },
      {
        heading: "Engineering decisions worth calling out",
        body: "• **Threading model:** 4 cooperative RTOS threads sharing state through a single sensor struct. Cheaper than a message queue at this scale, and the read-mostly access pattern means we don't need locks if the producer is single-writer.\n\n• **DMA-driven audio:** Blocking the CPU on each sample would have starved the gyro read loop. DMA frees the M4 to keep sampling motion while audio plays out.\n\n• **Dynamic sample buffers:** Sample count varies with frequency, so we malloc/free per cycle. **Not ideal for production** (fragmentation risk on long sessions) — a fixed-size ring buffer is item #1 on the rewrite list.\n\n• **Threshold gating:** The ±10000 dps deadband stops the toy from droning when it sits on a table. Tuned empirically with a 7-year-old test subject.",
        screenshot: {
          src: "/projects/gesture-synth/code-freq.png",
          caption: "The frequency-modulation core: angular velocity scales the sample count per cycle, which sets the pitch.",
          aspect: "3.8/1",
        },
      },
      {
        heading: "What I'd ship next",
        body: "If this became a real product, the **v2 backlog** I'd push for:\n\n1. **Velocity-to-timbre, not just pitch.** Add harmonics so fast shakes sound 'brighter,' not just higher.\n\n2. **Onboard LED ring.** The visual feedback currently lives in a UART console no kid will ever see — move it onto the device with an addressable LED strip.\n\n3. **Accelerometer fusion.** Gyroscope alone misses translation (kid swinging it through the air). Fusing accel + gyro unlocks gesture vocabularies like 'cast' and 'swipe.'\n\n4. **Curriculum sleeve.** The instrument is the hook; the real product is the 4-page activity guide that turns it into a 30-minute lesson on waves.",
        screenshot: {
          src: "/projects/gesture-synth/uart.png",
          caption: "Today's feedback — a UART debug stream over serial. Tomorrow's: an onboard LED ring the kid can actually see.",
          aspect: "16/5",
        },
      },
    ],
    keyDecisions: [
      {
        title: "Build an instrument, not a screen",
        body: "Every competing STEM toy we looked at had a display. We deliberately removed that affordance — the kid's attention stays on the device in their hands and the sound coming out of it.",
      },
      {
        title: "Stereo channels for spatial learning",
        body: "Splitting X and Y motion across two DAC channels added hardware complexity but turned the toy into an actual lesson about axes. It's the difference between 'a noise' and 'this side does this, that side does that.'",
      },
      {
        title: "Continuous mapping over presets",
        body: "Preset notes would have made it a button box. Mapping angular velocity directly to frequency means kids learn that physics is continuous — small change in, small change out.",
      },
    ],
    outcomes: [
      "Working prototype demoed end-of-semester to faculty and TAs",
      "Two-axis stereo audio with sub-perceptual (<20 ms) gesture-to-sound latency",
      "4 RTOS threads coordinating sensor read, X/Y synthesis, and debug output without lock contention",
      "Top-grade group project (ECSE 444, McGill)",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

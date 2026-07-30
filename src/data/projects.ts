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
  /** Render inside a device frame. "iphone" = phone frame (ignores `aspect`);
   *  "browser" = web-browser window chrome (uses `aspect` for the screen). */
  device?: "iphone" | "browser";
  /** When a section screenshot is `wide`, it renders full-width below the text
   *  instead of side-by-side — for detailed shots that need to be legible. */
  wide?: boolean;
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
  /** Per-case-study accent (hex). Drives section labels, the meta bar fill,
   *  bullets/borders, the title logo, and the sidebar pill. Should be a light
   *  palette pastel (dark text is placed on it). Falls back to periwinkle. */
  accent?: string;
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
  /** Score gauges (0–10) rendered natively as the hero + card thumbnail —
   *  e.g. AgentTrace's evaluation report. Takes priority over hero/card images. */
  scores?: { label: string; value: number; max?: number }[];
  /** Verdict pill shown above the score rings (e.g. "Needs Tuning"). */
  verdict?: string;
};

export const projects: Project[] = [
  {
    slug: "neurobridge",
    title: "NeuroBridge",
    subtitle: "Bilateral EMG rehab wearable with a clinician-gated AI coach",
    category: "engineering",
    year: "2026",
    cover: { color: "#C3CDE6", emoji: "💪" },
    accent: "#C3CDE6",
    heroImage: "/projects/neurobridge/hero.png",
    heroVideo: "/projects/neurobridge/hero.mp4",
    cardImage: "/projects/neurobridge/card.png",
    problem:
      "Stroke and post-surgical rehab happens in a few minutes of clinic observation, then the patient goes home to a black box — no continuous data, no at-home monitoring, and no way to compare the affected limb against the healthy one, which is exactly the signal recovery hinges on.",
    blurb:
      "A wearable bilateral EMG system for upper-limb rehab: two textile arm sleeves stream muscle activity from both arms to a native iOS app, where clinicians and patients see real-time asymmetry — and an AI agent suggests exercises that a clinician approves before they ever reach the patient.",
    metrics: "7 muscle groups · ≥90% accuracy · clinician-gated AI",
    tags: ["SwiftUI", "EMG", "ESP32", "Claude API", "Medical Device"],
    githubUrl: "https://github.com/sofiavelasquezsierra/NeuroBridge",
    reportUrl: "https://docs.google.com/document/d/1WPKOY--j-qDWCjcf4MOb5ND5NbhtJaDaawo6EtvXulU/edit?usp=sharing",
    featured: true,
    status: "SHIPPED",
    role: "iOS developer · AI agent designer · Regulatory (510k)",
    duration: "Spring 2026",
    team: "5-person CMU team",
    stack: [
      "Swift / SwiftUI",
      "ESP32 + BLE",
      "Claude API",
      "SwiftData",
      "Swift Charts",
      "MVVM",
      "MyoWare EMG",
    ],
    caseStudy: [
      {
        heading: "how it works",
        body: "Two textile sleeves — one per arm — read muscle activity from **seven muscle groups** and stream it over Bluetooth to a native iOS app that shows, in real time, **how the recovering limb compares to the healthy one**. Each sleeve embeds surface EMG electrodes (OYMotion Gravity + MyoWare 2.0); an **ESP32** handles signal conditioning, ADC, and BLE. Textile and wireless on purpose — anything a stroke patient has to wire up at home doesn't get worn.",
        screenshot: {
          src: "/projects/neurobridge/architecture.png",
          caption: "Signal path — bilateral EMG sleeves through the ESP32, into the iOS app, to a Claude agent gated by clinician review.",
          aspect: "4/5",
        },
      },
      {
        heading: "the app & ai",
        body: "**Native Swift / SwiftUI** (MVVM) with **SwiftData** persistence and **Swift Charts** for live EMG traces — a **patient** view for exercises and progress, and a **provider** view for trends and asymmetry. A **Claude API** agent drafts the next exercise set from recent history, but **a clinician approves every recommendation before it reaches the patient**. The AI drafts; the human decides.",
        screenshot: {
          src: "/projects/neurobridge/app-emg-chart.png",
          caption: "Real-time EMG visualization in Swift Charts",
          device: "iphone",
        },
      },
      {
        heading: "my role",
        body: "I **built the iOS app** (with Claude Code as my primary dev tool), **designed the AI agent** and its clinician-review workflow, **owned hardware-to-software integration** off the ESP32's BLE stream, ran **human-factors testing**, and authored the **510(k) analysis** — a Class II device mapped against **ISO 13485**, **ISO 14971**, and **IEC 60601-1**, with K-Myo (Kinvent) as the predicate.",
      },
    ],
    screenshots: [
      {
        src: "/projects/neurobridge/sleeve.jpg",
        caption: "The textile sleeve — electrodes across the seven target muscles, wired to the ESP32.",
        aspect: "3/4",
      },
      {
        src: "/projects/neurobridge/app-patient-home.png",
        caption: "Patient view — today's exercises, progress, and live feedback.",
        device: "iphone",
      },
      {
        src: "/projects/neurobridge/app-provider-dashboard.png",
        caption: "Provider view — sessions, trends, and bilateral asymmetry over time.",
        device: "iphone",
      },
      {
        src: "/projects/neurobridge/agent-review.png",
        caption: "AI agent — Claude drafts an exercise plan; a clinician approves it before it ever reaches the patient.",
        device: "iphone",
      },
    ],
    keyDecisions: [
      {
        title: "Clinician-in-the-loop, always",
        body: "The AI never speaks to the patient directly. Every recommendation is drafted by Claude and gated behind a clinician's approval — the only safe way to put a model anywhere near a recovering patient.",
      },
      {
        title: "Bilateral by design",
        body: "Two sleeves, not one. The healthy limb is the baseline you measure recovery against, so symmetric sensing was the whole point — not a nice-to-have.",
      },
      {
        title: "Native iOS, built with Claude Code",
        body: "SwiftUI + Swift Charts gave us real-time clinical visualization with first-class performance. Claude Code as the primary dev tool let one person ship a clinical-grade app on a semester timeline.",
      },
      {
        title: "Regulated from day one",
        body: "We designed against 510(k), ISO 13485, and IEC 60601-1 from the first sketch instead of retrofitting compliance later — it changed hardware, software, and the AI workflow alike.",
      },
    ],
    outcomes: [
      "Human-in-the-loop AI — every Claude-drafted exercise plan is clinician-approved before it reaches the patient",
      "≥90% target signal-acquisition accuracy across 7 muscle groups",
      "<100ms sensor-to-screen feedback latency",
      "Bilateral asymmetry detection validated under controlled, known imbalances",
      "FDA 510(k) pathway analysis with K-Myo (Kinvent) as predicate device",
      "Human-factors testing across multiple sessions",
    ],
  },
  {
    slug: "agenttrace",
    title: "AgentTrace",
    subtitle: "AI Agent Evaluation Tool",
    category: "ai",
    year: "2025",
    cover: { color: "#FFD6C2", emoji: "🤖" },
    accent: "#F2B89A",
    // Native score gauges (from a real evaluation run) power the hero + card.
    scores: [
      { label: "Helpfulness", value: 7 },
      { label: "Policy", value: 9 },
      { label: "Tone", value: 8 },
    ],
    verdict: "Needs Tuning",
    metrics: "5-dimension scoring · 3 ranked fixes · <90s per run",
    problem:
      "Teams deploying AI agents have no systematic way to know if their agent behaves as designed — before real customers find out it doesn't.",
    blurb:
      "Configure any AI agent's persona and policies, run synthetic test conversations, and get back a scored report with the three fixes to make next.",
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
        heading: "how it works",
        body: "You define your agent's **persona and policies**. AgentTrace spins up synthetic test conversations across four categories — **helpful queries, edge cases, policy probes, and attempted jailbreaks** — then hands each transcript to a **separate evaluator** that scores it and returns fixes.",
        screenshot: {
          src: "/projects/agenttrace/flow.png",
          caption: "The eval loop — an agent-in-persona is stress-tested, then judged by a separate evaluator model.",
          aspect: "4/5",
        },
      },
      {
        heading: "the report",
        body: "The output isn't a dashboard — it's a **decision**. Every run ends with **five dimension scores** and **three concrete fixes, ranked by severity**, so a PM knows exactly what to change before the next deploy.",
        screenshot: {
          src: "/projects/agenttrace/report.png",
          caption: "The scored report: five evaluation dimensions and three ranked, actionable fixes.",
          device: "browser",
          aspect: "3024/1648",
          wide: true,
        },
      },
      {
        heading: "what i learned",
        body: "The biggest unlock was **splitting the agent and the evaluator into two separate model calls** with different system prompts. When one model does both, it grades itself generously and misses tone problems. Two Claude calls produced sharper, more actionable evaluations.",
      },
    ],
    screenshots: [
      {
        src: "/projects/agenttrace/configure.png",
        caption: "Configure — define the agent's persona, policies, and guardrails.",
        device: "browser",
        aspect: "1088/1300",
      },
      {
        src: "/projects/agenttrace/conversations.png",
        caption: "Synthetic test conversations across helpful, edge-case, policy, and jailbreak categories.",
        device: "browser",
        aspect: "2030/1490",
      },
    ],
    keyDecisions: [
      {
        title: "Two Claude calls, not one",
        body: "The agent stays in character. The evaluator steps outside and judges it. Self-evaluation collapses both jobs and hides failure modes.",
      },
      {
        title: "Decisions, not dashboards",
        body: "The report ends with three ranked fixes, not a wall of metrics. PMs use it to decide what to ship next.",
      },
    ],
    outcomes: [
      "Live demo deployed and used by 5+ early testers",
      "Full eval cycle in under 90 seconds",
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
    accent: "#C8D5C0",
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
    accent: "#B8AED4",
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
    subtitle: "Offline CSP + LDA decoder for a motor-imagery cursor BCI",
    category: "research",
    year: "2025",
    cover: { color: "#A8D2EA", emoji: "🧠" },
    cardImage: "/projects/bci-decoder/card.png",
    heroImage: "/projects/bci-decoder/hero.png",
    accent: "#A8C5DC",
    problem:
      "A live BCI decoder is calibrated by hand during the session — fast, but blind to each person's brain. Could an automated, data-driven pipeline match a decoder a human tuned in real time?",
    blurb:
      "An offline EEG decoding pipeline — Common Spatial Patterns + LDA — that learns user-specific spatial filters to move a cursor by imagining left- vs right-hand movement. It matched a hand-tuned live decoder at ~91%, and showed that fewer electrodes beat more.",
    metrics: "~91% accuracy · 10-electrode montage · matched the live decoder",
    tags: ["EEG / BCI", "Python", "CSP + LDA", "Signal Processing"],
    githubUrl:
      "https://github.com/sofiavelasquezsierra/Offline-Optimization-of-Sensorimotor-Rhythm-BCI-Decoders",
    featured: true,
    status: "RESEARCH",
    role: "Solo researcher",
    duration: "~1 month",
    team: "Solo",
    stack: ["Python", "scikit-learn", "SciPy", "NumPy", "Matplotlib"],
    caseStudy: [
      {
        heading: "how it works",
        body: "A person imagines moving their **left or right hand** to steer a cursor; the two produce mirror-image drops in EEG power over opposite hemispheres. The pipeline applies a **common-average reference** and an **8–15 Hz bandpass**, then **Common Spatial Patterns** learns spatial filters tuned to *that* person's brain. The **log-variance** of the filtered signal feeds an **LDA** classifier, validated with **5-fold cross-validation**.",
        screenshot: {
          src: "/projects/bci-decoder/pipeline.png",
          caption: "The offline decoding pipeline — from imagined movement to cursor control.",
          aspect: "1139/1341",
        },
      },
      {
        heading: "fewer electrodes, better decoder",
        body: "The hypothesis: **strict feature selection beats a broad montage**. Trimming from **17 electrodes down to 10** motor-cortex channels consistently *improved* accuracy — the extra channels were feeding eye-blink and muscle artifacts into CSP, which maximizes variance blindly. **More data isn't always better.**",
        screenshot: {
          src: "/projects/bci-decoder/montage.png",
          caption: "Left-Right decoding accuracy: the 10-electrode motor montage edged out the broader 17-electrode set on both sessions.",
          aspect: "1623/1080",
        },
      },
      {
        heading: "what CSP could and couldn't do",
        body: "On the **lateralized left-right task**, the automated decoder **matched the hand-tuned live baseline** (within cross-validation error) — parity from a fully data-driven pipeline. On the **up-down task** (both hands vs. rest) it **dropped**: both classes light up *both* hemispheres, so there's no spatial contrast for CSP to exploit. The failure mapped cleanly onto the math.",
        screenshot: {
          src: "/projects/bci-decoder/results.png",
          caption: "Offline CSP + LDA vs. the live, hand-tuned baseline — parity on lateralized tasks, a drop on bilateral ones.",
          aspect: "1623/948",
          wide: true,
        },
      },
    ],
    keyDecisions: [
      {
        title: "CSP + LDA over deep learning",
        body: "With only ~135 valid trials, a CNN would overfit. CSP learns robust spatial filters from a tiny dataset, and LDA's assumptions fit the log-variance features — data-efficient and interpretable, not a black box.",
      },
      {
        title: "Cut electrodes, don't add them",
        body: "Peripheral channels added high-dimensional noise to CSP's covariance estimates. Restricting to the motor cortex improved generalization — a feature-selection win, not a model win.",
      },
    ],
    outcomes: [
      "Matched a hand-tuned live decoder on the left-right task (~91%, within CV error)",
      "Feature selection (17 → 10 electrodes) improved accuracy on both sessions",
      "Diagnosed why CSP fails on bilateral tasks — spatially symmetric classes",
      "Validated with 5-fold cross-validation (±5% std)",
      "Open-sourced on GitHub",
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
    accent: "#F2DC9C",
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
    accent: "#F5C6CB",
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
    accent: "#E8B5C0",
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
    accent: "#E6E6FA",
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

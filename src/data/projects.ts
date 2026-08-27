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
  /** Hidden from the site (grid + "up next"), but kept in the data. */
  hidden?: boolean;
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
  /** Aspect ratio for the hero frame, e.g. "2436/1656". Defaults to 16/9 —
   *  set it to the asset's real dimensions when the shot shouldn't be cropped. */
  heroAspect?: string;
  /** Render the hero inside browser-window chrome, like a `device: "browser"`
   *  screenshot. Use for raw captures of a web app that have no chrome of their own. */
  heroDevice?: "browser";
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
    slug: "medrag",
    title: "MedRAG",
    subtitle: "Self-correcting RAG over biomedical papers",
    category: "ai",
    year: "2026",
    cover: { color: "#BADCDD", emoji: "🧬" },
    accent: "#A8D1D2",
    // The hero is a bare app capture (2436×1656), so it keeps its own
    // proportions and borrows browser chrome instead of being cropped to 16/9.
    heroImage: "/projects/medrag/hero.png",
    heroAspect: "2436/1656",
    heroDevice: "browser",
    cardImage: "/projects/medrag/hero.png",
    problem:
      "Ask a general-purpose RAG tool about a clinical paper and it runs one semantic search, then answers from whatever came back — even when what came back was thin. You get a confident paragraph and no page to check it against.",
    blurb:
      "Upload a stack of biomedical papers and ask questions about them. MedRAG judges its own retrieval before it answers — if the passages are too thin it rewrites the query and searches again — and every claim comes back cited to a page you can open.",
    metrics: "5-node LangGraph loop · 768-d PubMedBERT · page-level citations",
    tags: ["LangGraph", "RAG", "PubMedBERT", "Supabase", "Python"],
    githubUrl: "https://github.com/sofiavelasquezsierra/research-navigator-chat",
    featured: true,
    status: "SHIPPED",
    sideProject: true,
    role: "Sole builder · designer",
    duration: "Summer 2026",
    team: "Solo",
    stack: [
      "LangGraph",
      "Python",
      "FastAPI",
      "PubMedBERT",
      "Supabase pgvector",
      "Pydantic",
      "Mermaid.js",
    ],
    caseStudy: [
      {
        heading: "how it works",
        body: "MedRAG runs as a **LangGraph** pipeline — five nodes over one shared state object, not a single call. `query_analysis` rewrites what you asked into something a vector index can match, `retrieve` embeds that with **PubMedBERT** and pulls the closest passages out of Supabase, and `relevance_check` reads them back to decide whether they're enough. Only then does `synthesize` write an answer.\n\nThe node I care about most is `relevance_check`. It asks an **LLM judge** whether the passages actually cover the question, and if they don't it doesn't answer anyway — it routes back to `query_analysis` **with a note about what was missing**, so the next search is a different search and not the same one twice. That loop is **bounded**: `max_query_retries` caps it, and when the budget runs out MedRAG says the papers don't cover it rather than filling the gap itself.",
        screenshot: {
          src: "/projects/medrag/architecture.png",
          caption: "The five nodes and the edge that matters — relevance_check can send the whole thing back to the top.",
          aspect: "1160/1300",
        },
      },
      {
        heading: "citations you can check",
        body: "A citation like “(Title, p. 4, Efficacy Results)” is only worth anything if page 4 really says that. So the citation pass runs **after** synthesis: it walks every inline citation in the response, matches it against the metadata of the chunks that were actually retrieved, and rewrites the matches into badges that link to the exact passage. **Citations that don't match a retrieved chunk don't become links** — if the model invented one, it stays plain text instead of getting a badge that lends it authority.\n\nSelf-correcting retrieval is easy to **claim**, so there's a benchmark harness behind all of it, scoring **Hit@K** and **Precision@K** on retrieval, **citation accuracy**, and **faithfulness** — does the answer stay inside the excerpts it was given. Faithfulness is the one that kept me honest: it's the metric that catches the model quietly going beyond its sources.",
        screenshot: {
          src: "/projects/medrag/citations.png",
          caption: "Every badge in the answer resolves to the retrieved passage behind it.",
          device: "browser",
        },
      },
      {
        heading: "diagram mode",
        body: "Ask for a diagram instead of a paragraph and `synthesize` emits a **Mermaid** spec rather than prose. The catch is that a model writing Mermaid produces syntax that **almost** parses — a stray code fence, an unquoted label with a parenthesis in it — and one bad character renders nothing at all.\n\nSo `render_diagram` cleans it before it ever reaches a renderer: strip the fences and preamble, quote every node label across all the shapes, then validate. The **browser** does the actual drawing, which keeps a headless Chrome off the server entirely.",
        screenshot: {
          src: "/projects/medrag/diagram.png",
          caption: "Diagram mode — a sanitized Mermaid spec rendered client-side.",
          device: "browser",
        },
      },
    ],
    keyDecisions: [
      {
        title: "Judge the retrieval, not just the answer",
        body: "Most guardrails check the output after the fact. Checking the passages first means a bad search gets fixed by searching again, instead of being papered over by a well-written paragraph.",
      },
      {
        title: "PubMedBERT over a general embedding API",
        body: "Drug names, trial acronyms, and clinical jargon are exactly where general-purpose embeddings blur together. A domain model runs locally, costs nothing per token, and separates the terms that matter here.",
      },
      {
        title: "Sanitize on the server, render in the browser",
        body: "The backend owns correctness — cleaning and validating the Mermaid spec. The browser owns pixels. That split keeps Puppeteer and a headless Chrome out of the deployment entirely.",
      },
      {
        title: "Stateless server, state in the browser",
        body: "Threads, uploaded PDFs, and history live in localStorage; each request carries the document ids it should search. The server stays trivial to scale and retrieval stays scoped to the papers you're actually reading.",
      },
    ],
    outcomes: [
      "Bounded self-correction — thin retrievals trigger a rewritten query instead of a confident guess",
      "768-d PubMedBERT embeddings over Supabase pgvector, scoped per conversation",
      "Citations resolve to a page, and unmatched ones never render as links",
      "Mermaid specs validated server-side before they reach the renderer",
      "Eval harness scoring Hit@K, Precision@K, faithfulness, and citation accuracy",
      "Open-sourced on GitHub",
    ],
  },
  {
    slug: "neurobridge",
    title: "NeuroBridge",
    subtitle: "Clinician-gated AI exercise agent for upper-limb rehab",
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
      "A clinical AI agent that drafts personalized rehab exercises from live muscle-activity data — gated by human-in-the-loop clinician review before anything reaches the patient. Runs on a native iOS app backed by a bilateral EMG wearable.",
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
        body: "Two textile sleeves — one per arm — read muscle activity from **seven muscle groups** and stream it over Bluetooth. Each sleeve embeds surface EMG electrodes (OYMotion Gravity + MyoWare 2.0); an **ESP32** handles signal conditioning, ADC, and BLE. A **native Swift / SwiftUI** app (SwiftData + Swift Charts) shows, in real time, **how the recovering limb compares to the healthy one** — in a patient view and a clinician view.",
        screenshot: {
          src: "/projects/neurobridge/architecture.png",
          caption: "Signal path — bilateral EMG sleeves through the ESP32, into the iOS app, to a Claude agent gated by clinician review.",
          aspect: "4/5",
        },
      },
      {
        heading: "the claude agent",
        body: "The recommendation engine is an **agent built on the Claude API**. It reads a patient's recent EMG history and **drafts the next set of exercises** — reasoning over trends, asymmetry, and progress the way a therapist would. But every plan is **gated behind human-in-the-loop clinician review** before it reaches the patient: **Claude drafts, the clinician decides.** That review gate is the whole reason a model can sit this close to a recovering patient safely — and it mirrors how a real prior-auth or triage agent has to work in a clinical setting.",
        screenshot: {
          src: "/projects/neurobridge/agent-review.png",
          caption: "The Claude agent drafts an exercise plan; a clinician approves or edits it before it ever reaches the patient.",
          device: "iphone",
        },
      },
      {
        heading: "my role",
        body: "I **designed and built the Claude-powered recommendation agent** and its clinician-review workflow, **built the iOS app** with **Claude Code as my primary dev tool**, **owned hardware-to-software integration** off the ESP32's BLE stream, ran **human-factors testing**, and authored the **510(k) analysis** — a Class II device mapped against **ISO 13485**, **ISO 14971**, and **IEC 60601-1**, with K-Myo (Kinvent) as the predicate.",
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
        src: "/projects/neurobridge/app-emg-chart.png",
        caption: "Real-time EMG visualization in Swift Charts, both arms side by side.",
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
    hidden: true,
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
    slug: "goalorch",
    title: "GoalOrch",
    subtitle: "Production database & ETL layer for a student-analytics platform",
    category: "engineering",
    year: "2025",
    cover: { color: "#C6DED3", emoji: "🎯" },
    cardImage: "/projects/goalorch/card.png",
    heroImage: "/projects/goalorch/hero.png",
    accent: "#A9CFC0",
    metrics: "19-table schema · 15+ safe migrations · live in 3 states",
    problem:
      "A CMU research group was shipping a live dashboard to middle-school math teachers — but the data behind it came from messy exports and a database that was risky to change while real classrooms depended on it every week.",
    blurb:
      "I designed and built the entire data layer behind GoalOrch — a platform where math teachers track student engagement, diagnostics, and weekly goals. Schema, ETL, safe migrations, backups, and tests, all shipped to a production server through code review.",
    tags: ["Data Engineering", "MySQL", "Python", "Production"],
    liveUrl: "https://goals.cs.cmu.edu/",
    featured: true,
    status: "SHIPPED",
    role: "Database & data-engineering lead",
    duration: "Ongoing · CMU PLUS Lab",
    team: "Small research team",
    stack: [
      "MySQL 8",
      "Python",
      "SQLAlchemy",
      "Bash",
      "Ubuntu",
      "Git · PR workflow",
      "cron",
    ],
    caseStudy: [
      {
        heading: "how it works",
        body: "Student data lands as **exports from Box** — i-Ready usage, lesson completion, diagnostic scores. An **ETL pipeline** (Python + SQLAlchemy) cleans and loads it into a **19-table MySQL schema**: teachers, classes, students, daily and weekly usage, diagnostics, goals, secure share links, and session logging — wired together with foreign keys, unique and CHECK constraints, and indexes tuned for fast dashboard queries. The React app reads straight from it.",
        screenshot: {
          src: "/projects/goalorch/dashboard.png",
          caption: "The teacher dashboard my data layer serves — engagement, lesson completion, and diagnostic scores per class.",
          device: "browser",
          aspect: "1375/861",
        },
      },
      {
        heading: "shipping safely on a live database",
        body: "Every schema change ships as a **versioned, backward-compatible migration** paired with an **automated verification script** that asserts the result is exactly right — column types, nullability, defaults, indexes, constraints, foreign keys. Nothing touches production directly: changes are **applied and verified on a QA database, opened as a pull request, reviewed, and only then promoted to prod**. Automated **nightly backups** (compressed dumps, read-only user, 14-day rotation) and a guarded snapshot-restore tool with dry-run validation keep the live database recoverable.",
        screenshot: {
          src: "/projects/goalorch/workflow.png",
          caption: "The safe-change loop — no migration reaches production without passing QA verification and code review.",
          aspect: "1139/1315",
        },
      },
      {
        heading: "data teachers can trust",
        body: "The data has to be **trustworthy and private**. A test matrix covers real loading scenarios — new semester, weekly and daily updates, malformed files, duplicates, out-of-order loads — and automated tests assert **no orphaned records, no duplicates, consistent aggregates, and no personal identifiers in the logging tables**. Deterministic **seed and reset tooling** generates internally-consistent mock data (coherent engagement tiers across scores, usage, and goals), so the app can be demoed and tested realistically even when real student data is restricted.",
      },
    ],
    screenshots: [
      {
        src: "/projects/goalorch/goals.png",
        caption: "Weekly goal recommendations, generated from each student's usage and diagnostic trends.",
        device: "browser",
        aspect: "776/634",
      },
      {
        src: "/projects/goalorch/student.png",
        caption: "A single student's progress — engagement, lessons, and diagnostic history over time.",
        device: "browser",
        aspect: "1115/815",
      },
    ],
    keyDecisions: [
      {
        title: "QA first, production last",
        body: "Every change is verified on a QA database and reviewed as a PR before it touches prod. Iterating fast on a live system means never breaking the classrooms already depending on it.",
      },
      {
        title: "Synthetic data that can't contradict itself",
        body: "Mock data is generated from engagement tiers, so scores, usage, and goals stay coherent — realistic enough to demo and test against when real student data is restricted.",
      },
      {
        title: "Privacy by construction",
        body: "Logging tables carry no personal identifiers, and the test suite fails if any slip in. Student privacy is enforced by the schema and the tests, not by convention.",
      },
    ],
    outcomes: [
      "Shipped to production, serving the live teacher dashboard",
      "Started with 2 schools in Pennsylvania — now expanding to California and Tennessee",
      "Shaped features through direct teacher interviews",
      "19-table schema evolved via 15+ verified, backward-compatible migrations",
      "Automated nightly backups + guarded restore keep production recoverable",
    ],
  },
  {
    slug: "rof",
    title: "ROF",
    subtitle: "Full-stack platform for managing university clubs",
    category: "engineering",
    year: "2024",
    cover: { color: "#D7CDEB", emoji: "🎓" },
    cardImage: "/projects/rof/card.png",
    heroImage: "/projects/rof/hero.png",
    accent: "#B8AED4",
    metrics: "9 pages shipped · role-based auth · live on Vercel",
    problem:
      "University clubs run on scattered Excel sheets and Google Forms that fall apart when leadership graduates — with no single place to register members, verify them, and hand the whole club off intact.",
    blurb:
      "A full-stack platform where club execs create clubs, register and verify members, and track engagement — and students join and manage their memberships. Built T3-stack (Next.js, tRPC, Prisma, Postgres), with each feature owned end-to-end from UI to API to database, and shipped live on Vercel.",
    tags: ["Full-Stack", "Next.js", "tRPC", "Prisma"],
    liveUrl: "https://rof-zyb9.vercel.app/",
    githubUrl: "https://github.com/sofiavelasquezsierra/rof",
    status: "HANDED OVER",
    role: "Co-lead · full-stack feature owner",
    duration: "1 semester · McGill",
    team: "3 engineers",
    stack: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "PostgreSQL (Neon)",
      "NextAuth",
      "UploadThing",
      "Tailwind",
    ],
    caseStudy: [
      {
        heading: "how it works",
        body: "Two roles share one system. **Club execs** create a club, **register and verify members** (custom ID checks, email confirmation, and double-registration prevention), and track engagement through a **membership dashboard** and an **analytics view** of enrollment trends and demographics — plus an **event scheduler**. **Students** sign in, verify their registration, and manage which clubs they've joined. It's **9 pages** in all, gated by **role-based access control**.",
        screenshot: {
          src: "/projects/rof/dashboard.png",
          caption: "The club membership dashboard — overview, verified members, and activity at a glance.",
          device: "browser",
          aspect: "1142/573",
        },
      },
      {
        heading: "full-stack, per feature",
        body: "We built on the **T3 stack** — Next.js, **tRPC**, **Prisma**, and **Postgres** (Neon) — so a change to the database schema surfaces as a **type error in the UI** before it can ship broken. Rather than splitting into frontend and backend people, **each of us owned whole features end-to-end**: the React UI, the tRPC API routes, and the schema behind them. Auth runs on **NextAuth**, file uploads on **UploadThing**, and the whole thing deploys to **Vercel**.",
      },
      {
        heading: "built for the handoff",
        body: "The real workflow isn't the day-to-day — it's **May, when leadership graduates** and two years of muscle memory walks out the door. Every feature was scored against one question: *does this make next year's exec team better off?* Structured member data, verified rosters, and a live dashboard mean a club can be **handed off intact** instead of rebuilt from scratch.",
      },
    ],
    screenshots: [
      {
        src: "/projects/rof/landing.png",
        caption: "Landing — two roles, one system: club execs manage clubs, students verify and join.",
        device: "browser",
        aspect: "1142/598",
      },
      {
        src: "/projects/rof/analytics.png",
        caption: "Analytics dashboard — enrollment trends and membership demographics.",
        device: "browser",
        aspect: "1096/612",
      },
      {
        src: "/projects/rof/events.png",
        caption: "Event scheduler — planning and tracking club events.",
        device: "browser",
        aspect: "1143/642",
      },
    ],
    keyDecisions: [
      {
        title: "T3 for end-to-end type safety",
        body: "Next.js + tRPC + Prisma meant a change to the Postgres schema showed up as a type error in the UI. A 3-person team shipped 9 pages in a semester without an API contract silently drifting.",
      },
      {
        title: "Own features, not layers",
        body: "Instead of a frontend person and a backend person, each of us owned whole features — UI, tRPC routes, and schema. Fewer handoffs, faster iteration, clearer ownership.",
      },
      {
        title: "A roster you can trust",
        body: "Custom ID verification, email confirmation, and double-registration prevention — because a membership list is only useful if it's real.",
      },
    ],
    outcomes: [
      "Shipped to production on Vercel — adopted by the Blockchain at McGill leadership team",
      "9 pages, 5 fully database-backed, with role-based access control",
      "Each feature owned end-to-end: React UI → tRPC API → Prisma → Postgres",
      "Integrated NextAuth (auth), UploadThing (uploads), and Neon (Postgres)",
    ],
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
    reportUrl:
      "https://docs.google.com/document/d/1z1d4Me4yEaNhA1GdGfsDZoyCaTRz83ev/edit?usp=sharing&ouid=107914815789740637612&rtpof=true&sd=true",
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
    subtitle: "Compressed, FPGA-accelerated LLM with a fairness gate",
    category: "research",
    year: "2025",
    cover: { color: "#C8D5C0", emoji: "🦙" },
    cardImage: "/projects/greenllama/card.png",
    heroImage: "/projects/greenllama/hero.png",
    accent: "#F2DC9C",
    problem:
      "Shrinking an LLM to run on edge hardware saves power — but compression quietly amplifies the model's biases, and almost nobody measures it.",
    blurb:
      "A compressed, FPGA-accelerated LLM that pairs aggressive efficiency with a responsible-AI gate: 8× smaller, 43× less power, and 56% less measured bias — because a configuration that saved power but degraded fairness never shipped.",
    metrics: "8× compression · 43× power reduction · 56% bias reduction",
    tags: ["LLM", "Quantization", "FPGA", "Responsible AI"],
    reportUrl:
      "https://drive.google.com/file/d/1fR2bXgjVwXstJf0-KpICgG9OVb1JLaes/view?usp=sharing",
    status: "RESEARCH",
    role: "Contributor — quantization + bias eval",
    duration: "1 semester",
    team: "4 engineers",
    stack: [
      "PyTorch",
      "Quantization",
      "Verilog",
      "FPGA toolchain",
      "BOLD bias eval",
    ],
    caseStudy: [
      {
        heading: "how it works",
        body: "Start with a large language model, then **quantize and compress it ~8× smaller**. Inference runs on an **FPGA** (implemented in Verilog) for a **43× drop in power** versus the baseline. Crucially, every compression configuration is scored on **bias** — using the **BOLD** benchmark — right alongside latency and power, so fairness is a metric you optimize, not something you discover in production.",
      },
      {
        heading: "bias is a first-class metric",
        body: "Compression doesn't degrade a model evenly — it **amplifies existing biases** in ways that don't show up in accuracy numbers. We measured bias at **every** configuration and **blocked any that improved power or size but regressed fairness past a threshold**. The result: **56% less measured bias** than the uncompressed baseline while still hitting the efficiency targets. Treating fairness as a gate — not a report filed afterward — is the whole point.",
      },
      {
        heading: "my role",
        body: "I worked on **quantization** — finding compression configurations that held up under the efficiency targets — and built the **bias-evaluation pipeline** that scored each one on the **BOLD** benchmark, so fairness could sit next to power and latency as a first-class objective.",
      },
    ],
    keyDecisions: [
      {
        title: "Fairness as a gate, not a report",
        body: "Any configuration that saved power but regressed bias past a threshold was blocked. Bias sat next to latency and power as a hard constraint — not a footnote discovered after the fact.",
      },
      {
        title: "Efficiency proven on hardware",
        body: "Inference in Verilog on an FPGA — not a GPU with the power dialed down — so the 43× power number reflects the edge hardware these models actually have to run on.",
      },
    ],
    outcomes: [
      "8× model compression",
      "43× lower inference power on FPGA vs. baseline",
      "56% reduction in measured bias (BOLD) vs. the uncompressed baseline",
      "Bias evaluated as a hard constraint at every compression configuration",
    ],
  },
  {
    slug: "exoskeleton",
    title: "Parkinson's Exoskeleton",
    subtitle: "EMG/IMU-driven assistive arm",
    category: "engineering",
    year: "2024",
    hidden: true,
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

/** Display order for the /work grid — leads with the AI/software builds, with
 *  the hardware-heavy projects further down. The home page leads with the first
 *  three, so reordering here is how you change what the landing page shows. */
export const projectOrder = [
  "medrag",
  "agenttrace",
  "goalorch",
  "neurobridge",
  "rof",
  "greenllama",
  "bci-decoder",
  "exoskeleton",
  "sensing-vest",
  "gesture-synth",
];

const rank = (slug: string) => {
  const i = projectOrder.indexOf(slug);
  return i === -1 ? 999 : i;
};

/** Every visible project, in display order. */
export const orderedProjects = [...projects]
  .filter((p) => !p.hidden)
  .sort((a, b) => rank(a.slug) - rank(b.slug));

/** The three the home page leads with. */
export const recentProjects = orderedProjects.slice(0, 3);

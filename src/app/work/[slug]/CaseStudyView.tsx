"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Project, Screenshot } from "@/data/projects";
import Logo from "@/components/Logo";
import ScoreRings from "@/components/ScoreRings";

/** Stable, URL-safe id from a section heading. Must match
 *  CaseStudySidebarMount's slugify. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CaseStudyView({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const accent = project.accent ?? "#7E91C0";

  return (
    <main
      id="top"
      className="relative min-h-screen pt-16 lg:pt-20 pb-20"
      style={
        {
          "--accent": accent,
          "--accent-ink": `color-mix(in srgb, ${accent} 45%, #2C3E50)`,
        } as React.CSSProperties
      }
    >
      <div className="section-padding">
        <article className="mx-auto w-full max-w-[960px]">
          {/* ── Identity ───────────────────────────────────────────────── */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          )}

          <h1 className="mt-4 flex items-center gap-3 font-serif text-4xl md:text-5xl text-ink leading-[1.05]">
            <Logo size={36} className="shrink-0" color="var(--accent-ink)" />
            <span>{project.title}</span>
          </h1>
          <p className="mt-2 text-lg md:text-xl text-mute">
            {project.subtitle}
          </p>

          <p className="mt-5 max-w-[70ch] text-ink/85 text-lg leading-relaxed">
            <RichText text={project.blurb} />
          </p>

          {/* ── Single snapshot card: key metrics + stack ──────────────── */}
          <SummaryCard metrics={project.metrics} stack={project.stack} />

          {/* ── Links ──────────────────────────────────────────────────── */}
          {(project.liveUrl || project.githubUrl || project.reportUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl && (
                <LinkButton href={project.liveUrl} primary>
                  visit {project.title} →
                </LinkButton>
              )}
              {project.githubUrl && (
                <LinkButton href={project.githubUrl}>github ↗</LinkButton>
              )}
              {project.reportUrl && (
                <LinkButton href={project.reportUrl}>report ↗</LinkButton>
              )}
            </div>
          )}

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <div className="mt-8">
            {project.scores && project.scores.length > 0 ? (
              <div
                data-pet-perch
                className="relative flex w-full items-center justify-center rounded-3xl border border-ink/10 bg-cream px-6 py-10 md:py-12 shadow-[0_12px_40px_-24px_rgba(44,62,80,0.5)]"
              >
                <ScoreRings
                  scores={project.scores}
                  verdict={project.verdict}
                />
              </div>
            ) : (
              <HeroBlock
                heroImage={project.heroImage}
                heroVideo={project.heroVideo}
                fallbackColor={project.cover.color}
                fallbackEmoji={project.cover.emoji}
                title={project.title}
              />
            )}
          </div>

          {/* ── Problem ────────────────────────────────────────────────── */}
          <section id="overview" className="mt-12 scroll-mt-28">
            <Panel tint={20}>
              <SectionLabel>the problem</SectionLabel>
              <p className="max-w-[48ch] text-2xl md:text-[1.9rem] text-ink leading-snug font-serif">
                {project.problem}
              </p>
            </Panel>
          </section>

          {/* ── Body sections (text + image side by side) ──────────────── */}
          {project.caseStudy?.map((s, i) => (
            <BodySection key={i} section={s} index={i} />
          ))}

          {/* ── Gallery ────────────────────────────────────────────────── */}
          {project.screenshots && project.screenshots.length > 0 && (
            <section id="gallery" className="mt-8 scroll-mt-28">
              <Panel tint={8}>
                <SectionLabel>more</SectionLabel>
                <Gallery screenshots={project.screenshots} />
              </Panel>
            </section>
          )}

          {/* ── Key decisions ──────────────────────────────────────────── */}
          {project.keyDecisions && project.keyDecisions.length > 0 && (
            <section id="key-decisions" className="mt-8 scroll-mt-28">
              <Panel>
                <SectionLabel>key decisions</SectionLabel>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.keyDecisions.map((d, i) => (
                    <div
                      key={i}
                      data-pet-perch
                      className="rounded-2xl border border-ink/10 bg-cream p-6 border-l-[3px] shadow-[0_6px_20px_-16px_rgba(44,62,80,0.5)]"
                      style={{ borderLeftColor: "var(--accent-ink)" }}
                    >
                      <p className="font-serif text-xl text-ink">{d.title}</p>
                      <p className="mt-2 text-ink/75 leading-relaxed">
                        {d.body}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>
          )}

          {/* ── Outcomes ───────────────────────────────────────────────── */}
          {project.outcomes && project.outcomes.length > 0 && (
            <section id="outcomes" className="mt-8 scroll-mt-28">
              <Panel tint={16}>
                <SectionLabel>outcomes</SectionLabel>
                <ul className="space-y-2.5">
                  {project.outcomes.map((o, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-ink/85 text-lg"
                    >
                      <span
                        className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--accent-ink)" }}
                      />
                      <span className="max-w-[62ch]">{o}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </section>
          )}

          {/* ── Up next ────────────────────────────────────────────────── */}
          <section className="mt-24 pt-10 border-t border-ink/10">
            <SectionLabel>up next</SectionLabel>
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-2xl md:text-3xl text-ink transition-colors group-hover:text-[color:var(--accent-ink)]">
                  {next.title}
                </p>
                <p className="text-sm text-mute">{next.subtitle}</p>
              </div>
              <span
                className="text-2xl group-hover:translate-x-1 transition-transform"
                style={{ color: "var(--accent-ink)" }}
              >
                →
              </span>
            </Link>
          </section>
        </article>
      </div>
    </main>
  );
}

/* ── Sections ───────────────────────────────────────────────────────── */

/** A body section. If it has a screenshot, text and image sit side by side
 *  (alternating sides for rhythm); otherwise it's a single prose column. */
function BodySection({
  section,
  index,
}: {
  section: NonNullable<Project["caseStudy"]>[number];
  index: number;
}) {
  const id = slugify(section.heading);

  if (!section.screenshot) {
    return (
      <section id={id} className="mt-8 scroll-mt-28">
        <Panel>
          <SectionLabel>{section.heading}</SectionLabel>
          <p className="max-w-[68ch] text-ink/85 text-lg leading-relaxed whitespace-pre-line">
            <RichText text={section.body} />
          </p>
        </Panel>
      </section>
    );
  }

  // Detailed shots render full-width below the text so they stay legible.
  if (section.screenshot.wide) {
    return (
      <section id={id} className="mt-8 scroll-mt-28">
        <Panel>
          <SectionLabel>{section.heading}</SectionLabel>
          <p className="max-w-[68ch] text-ink/85 text-lg leading-relaxed whitespace-pre-line">
            <RichText text={section.body} />
          </p>
          <div className="mt-6">
            <ScreenshotCard
              shot={section.screenshot}
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        </Panel>
      </section>
    );
  }

  const imageRight = index % 2 === 0;

  return (
    <section id={id} className="mt-8 scroll-mt-28">
      <Panel>
        <SectionLabel>{section.heading}</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className={imageRight ? "" : "lg:order-2"}>
            <p className="text-ink/85 text-lg leading-relaxed whitespace-pre-line">
              <RichText text={section.body} />
            </p>
          </div>
          <div className={imageRight ? "" : "lg:order-1"}>
            <ScreenshotCard shot={section.screenshot} />
          </div>
        </div>
      </Panel>
    </section>
  );
}

/** Gallery — phone (app) screenshots render as a centered strip so they stay a
 *  sensible size and never leave a lone item stranded; wider photos/browser
 *  shots sit in their own row above. Keeps the two shapes from clashing. */
function Gallery({ screenshots }: { screenshots: Screenshot[] }) {
  const phones = screenshots.filter((s) => s.device === "iphone");
  const wide = screenshots.filter((s) => s.device !== "iphone");

  return (
    <>
      {wide.length === 1 ? (
        <div className="mx-auto max-w-[440px]">
          <ScreenshotCard shot={wide[0]} />
        </div>
      ) : wide.length > 1 ? (
        <div className="grid gap-6 items-start sm:grid-cols-2">
          {wide.map((s, i) => (
            <ScreenshotCard key={i} shot={s} />
          ))}
        </div>
      ) : null}

      {phones.length > 0 && (
        <div
          className={`flex flex-wrap justify-center gap-5 sm:gap-7 ${
            wide.length ? "mt-7" : ""
          }`}
        >
          {phones.map((s, i) => (
            <div key={i} className="w-[45%] max-w-[190px] sm:w-[180px]">
              <ScreenshotCard shot={s} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.16em] font-medium border border-ink/15 bg-codebg text-ink/70">
      {children}
    </span>
  );
}

function LinkButton({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors ${
        primary
          ? "bg-[color:var(--accent-ink)] text-cream hover:opacity-90"
          : "border border-ink/15 bg-cream text-ink hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)]"
      }`}
    >
      {children}
    </a>
  );
}

/** Soft, accent-tinted container that lifts a section off the cream page so
 *  the different parts of the case study read as distinct blocks. `tint` is the
 *  percentage of the project accent mixed into the cream background. */
function Panel({
  children,
  tint = 10,
  className = "",
}: {
  children: React.ReactNode;
  tint?: number;
  className?: string;
}) {
  return (
    <div
      data-pet-perch
      className={`rounded-3xl border border-ink/10 p-6 md:p-8 shadow-[0_10px_36px_-26px_rgba(44,62,80,0.55)] ${className}`}
      style={{
        background: `color-mix(in srgb, var(--accent) ${tint}%, #FAF7EE)`,
      }}
    >
      {children}
    </div>
  );
}

/** One accent-tinted card holding the highest-signal info: key metrics
 *  (parsed from the " · " separated `metrics`) and the tech stack. */
function SummaryCard({
  metrics,
  stack,
}: {
  metrics?: string;
  stack?: string[];
}) {
  const stats = (metrics ?? "")
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (stats.length === 0 && (!stack || stack.length === 0)) return null;

  return (
    <div
      data-pet-perch
      className="mt-6 overflow-hidden rounded-2xl border border-ink/10 shadow-[0_12px_36px_-24px_rgba(44,62,80,0.6)]"
      style={{ background: "color-mix(in srgb, var(--accent) 45%, #FAF7EE)" }}
    >
      {stats.length > 0 && (
        <div className="grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {stats.map((s, i) => (
            <div key={i} className="px-5 py-4">
              <p className="font-serif text-lg md:text-xl text-ink leading-tight">
                {s}
              </p>
            </div>
          ))}
        </div>
      )}
      {stack && stack.length > 0 && (
        <div className="border-t border-ink/10 px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55 mb-2">
            Stack
          </p>
          <p className="text-ink/85 text-sm leading-relaxed">
            {stack.map((t, i) => (
              <span key={i}>
                {t}
                {i < stack.length - 1 && (
                  <span className="text-ink/30"> · </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs uppercase tracking-[0.2em] mb-4"
      style={{ color: "var(--accent-ink)" }}
    >
      {children}
    </h2>
  );
}

/** Lightweight inline formatter — supports **bold** and `code`. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="text-ink font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-codebg text-ink/85 text-[0.92em] font-mono"
            >
              {p.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/** Hero block: looping video if provided, else image, else the colored emoji
 *  block. A fixed 16/9 frame keeps the layout stable across screen sizes. */
function HeroBlock({
  heroImage,
  heroVideo,
  fallbackColor,
  fallbackEmoji,
  title,
}: {
  heroImage?: string;
  heroVideo?: string;
  fallbackColor: string;
  fallbackEmoji: string;
  title: string;
}) {
  const [imgErrored, setImgErrored] = useState(false);
  const [videoErrored, setVideoErrored] = useState(false);

  const frame =
    "relative w-full rounded-3xl overflow-hidden border border-ink/10 bg-codebg aspect-[16/9]";

  const heroImageIsImage = heroImage && !/\.(mp4|webm|mov)$/i.test(heroImage);

  if (heroVideo && !videoErrored) {
    return (
      <div className={frame} data-pet-perch>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroImageIsImage ? heroImage : undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoErrored(true)}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (heroImageIsImage && !imgErrored) {
    return (
      <div className={frame} data-pet-perch>
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
          priority
          onError={() => setImgErrored(true)}
        />
      </div>
    );
  }

  return (
    <div
      data-pet-perch
      className="relative w-full rounded-3xl overflow-hidden border border-ink/10 aspect-[16/9] flex items-center justify-center text-6xl"
      style={{ background: fallbackColor }}
    >
      <span>{fallbackEmoji}</span>
    </div>
  );
}

/** Browser-window frame for web-app screenshots. */
function BrowserFrame({
  children,
  aspect,
}: {
  children: React.ReactNode;
  aspect: string;
}) {
  return (
    <div
      data-pet-perch
      className="w-full overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_14px_42px_-26px_rgba(44,62,80,0.6)]"
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-codebg px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
        <span className="ml-3 h-4 flex-1 rounded-md border border-ink/10 bg-cream" />
      </div>
      {/* Screen */}
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {children}
      </div>
    </div>
  );
}

/** iPhone device frame for app screenshots. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[230px]">
      <div
        data-pet-perch
        className="relative rounded-[2.2rem] bg-ink p-2 shadow-[0_22px_45px_-22px_rgba(44,62,80,0.55)]"
        style={{ aspectRatio: "9 / 19" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] bg-codebg">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Placeholder shown until the real asset is dropped in. */
function DropPlaceholder({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-mute/60 text-center px-4">
      <p className="text-3xl">🖼️</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.2em]">drop image at</p>
      <code className="mt-1 text-[10px] text-ink/50 break-all">{src}</code>
    </div>
  );
}

/** Screenshot / diagram. App screenshots (`device: "iphone"`) render inside an
 *  iPhone frame with `object-cover`; everything else uses `object-contain` on a
 *  soft matte so the whole asset is always visible — never cropped or distorted. */
function ScreenshotCard({
  shot,
  sizes,
}: {
  shot: Screenshot;
  sizes?: string;
}) {
  const [errored, setErrored] = useState(false);
  const isPhone = shot.device === "iphone";
  const isBrowser = shot.device === "browser";

  const defaultSizes = isPhone
    ? "(max-width: 768px) 45vw, 230px"
    : "(max-width: 1024px) 100vw, 480px";

  const fit = isPhone
    ? "object-cover"
    : isBrowser
    ? "object-cover object-top"
    : "object-contain";

  const media = !errored ? (
    <Image
      src={shot.src}
      alt={shot.alt ?? shot.caption}
      fill
      sizes={sizes ?? defaultSizes}
      className={fit}
      onError={() => setErrored(true)}
    />
  ) : (
    <DropPlaceholder src={shot.src} />
  );

  return (
    <figure className="space-y-2.5">
      {isPhone ? (
        <PhoneFrame>{media}</PhoneFrame>
      ) : isBrowser ? (
        <BrowserFrame aspect={shot.aspect ?? "16/10"}>{media}</BrowserFrame>
      ) : (
        <div
          data-pet-perch
          className="relative w-full rounded-2xl overflow-hidden bg-cream border border-ink/10 shadow-[0_8px_28px_-20px_rgba(44,62,80,0.5)]"
          style={{ aspectRatio: shot.aspect ?? "16/9" }}
        >
          {media}
        </div>
      )}
      <figcaption
        className={`text-xs text-mute leading-relaxed ${
          isPhone ? "mx-auto max-w-[230px] text-center" : ""
        }`}
      >
        {shot.caption}
      </figcaption>
    </figure>
  );
}

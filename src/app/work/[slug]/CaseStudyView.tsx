"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Project, Screenshot } from "@/data/projects";
import Logo from "@/components/Logo";

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
  const status = project.status ?? defaultStatus(project.category);

  return (
    <>
      <main id="top" className="relative min-h-screen pt-16 lg:pt-20 pb-20">
        <div className="w-full section-padding">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <HeroBlock
            heroImage={project.heroImage}
            heroVideo={project.heroVideo}
            fallbackColor={project.cover.color}
            fallbackEmoji={project.cover.emoji}
            title={project.title}
          />

          {/* ── Tag pills ────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2">
            {project.sideProject && <Pill>side project</Pill>}
            <Pill>{status}</Pill>
          </div>

          {/* ── Title ────────────────────────────────────────────────── */}
          <h1 className="mt-3 flex items-center gap-2.5 font-serif text-3xl md:text-4xl text-ink leading-[1.1]">
            <Logo size={32} className="shrink-0" />
            <span>{project.title}</span>
          </h1>

          {/* ── Intro ────────────────────────────────────────────────── */}
          <p className="mt-3 text-ink/80 text-base md:text-lg leading-relaxed">
            <RichText text={project.blurb} />
          </p>

          {/* ── Primary + secondary links ────────────────────────────── */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream py-3 text-ink hover:border-rose hover:text-rose transition-colors"
            >
              <span className="text-sm">visit {project.title}</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          )}
          {(project.githubUrl || project.reportUrl) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream py-2.5 text-sm text-ink hover:border-rose hover:text-rose transition-colors"
                >
                  github ↗
                </a>
              )}
              {project.reportUrl && (
                <a
                  href={project.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream py-2.5 text-sm text-ink hover:border-rose hover:text-rose transition-colors"
                >
                  report ↗
                </a>
              )}
            </div>
          )}

          {/* ── Meta bar ─────────────────────────────────────────────── */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 rounded-2xl bg-rose p-5 md:p-6 text-cream">
            {project.role && (
              <MetaCol label="Role" lines={splitList(project.role)} />
            )}
            {project.team && (
              <MetaCol label="Team" lines={splitList(project.team)} />
            )}
            {(project.duration || project.year) && (
              <MetaCol
                label="Timeline"
                lines={[project.duration ?? project.year]}
              />
            )}
            {project.stack && project.stack.length > 0 && (
              <MetaCol label="Skills" lines={project.stack.slice(0, 3)} />
            )}
          </div>

          {/* ── Body ─────────────────────────────────────────────────── */}
          <section id="overview" className="mt-14 scroll-mt-28">
            <SectionLabel>the problem</SectionLabel>
            <p className="text-2xl md:text-3xl text-ink leading-relaxed font-serif italic">
              {project.problem}
            </p>
          </section>

          {project.caseStudy?.map((s, i) => (
            <section
              key={i}
              id={slugify(s.heading)}
              className="mt-14 scroll-mt-28"
            >
              <SectionLabel>{s.heading}</SectionLabel>
              <p className="text-ink/85 text-lg leading-relaxed whitespace-pre-line">
                <RichText text={s.body} />
              </p>
              {s.screenshot && (
                <div className="mt-6">
                  <ScreenshotCard shot={s.screenshot} />
                </div>
              )}
            </section>
          ))}

          {project.screenshots && project.screenshots.length > 0 && (
            <section id="gallery" className="mt-14 scroll-mt-28">
              <SectionLabel>more</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.screenshots.map((s, i) => (
                  <ScreenshotCard key={i} shot={s} />
                ))}
              </div>
            </section>
          )}

          {project.keyDecisions && project.keyDecisions.length > 0 && (
            <section id="key-decisions" className="mt-14 scroll-mt-28">
              <SectionLabel>key decisions</SectionLabel>
              <div className="grid gap-4 md:grid-cols-2">
                {project.keyDecisions.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-ink/10 bg-cream p-6 border-l-[3px] border-l-rose"
                  >
                    <p className="font-serif text-2xl text-ink">{d.title}</p>
                    <p className="mt-2 text-ink/80 leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <section id="outcomes" className="mt-14 scroll-mt-28">
              <SectionLabel>outcomes</SectionLabel>
              <ul className="space-y-2">
                {project.outcomes.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-ink/85 text-lg"
                  >
                    <span className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Up next ──────────────────────────────────────────────── */}
          <section className="mt-20 pt-10 border-t border-ink/10">
            <SectionLabel>up next</SectionLabel>
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-3xl text-ink group-hover:text-rose transition-colors">
                  {next.title}
                </p>
                <p className="text-sm text-mute">{next.subtitle}</p>
              </div>
              <span className="text-2xl text-rose group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function defaultStatus(c: Project["category"]): string {
  if (c === "ai") return "SHIPPED";
  if (c === "research") return "RESEARCH";
  return "ENGINEERING";
}

/** Split a " · " or "/" separated string into display lines. */
function splitList(s: string): string[] {
  return s
    .split(/\s*[·/]\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.16em] font-medium border border-ink/15 bg-codebg text-ink/70">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.2em] text-rose mb-4">
      {children}
    </h2>
  );
}

function MetaCol({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
        {label}
      </p>
      <div className="mt-2 space-y-0.5">
        {lines.map((l, i) => (
          <p key={i} className="text-cream leading-snug">
            {l}
          </p>
        ))}
      </div>
    </div>
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
 *  block. If the video fails to load (e.g. not exported yet) it falls back to
 *  the image. */
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

  if (heroVideo && !videoErrored) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 mb-5 border border-ink/10">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroImage}
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

  if (heroImage && !imgErrored) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 mb-5 border border-ink/10">
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
          priority
          onError={() => setImgErrored(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl h-48 md:h-64 flex items-center justify-center text-6xl mb-5"
      style={{ background: fallbackColor }}
    >
      <span>{fallbackEmoji}</span>
    </div>
  );
}

/** Single screenshot card with a graceful placeholder until the file exists. */
function ScreenshotCard({ shot }: { shot: Screenshot }) {
  const [errored, setErrored] = useState(false);
  const aspect = shot.aspect ?? "4/3";

  return (
    <figure className="space-y-2">
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-cream border border-ink/10"
        style={{ aspectRatio: aspect }}
      >
        {!errored ? (
          <Image
            src={shot.src}
            alt={shot.alt ?? shot.caption}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-mute/60 text-center px-4">
            <p className="text-3xl">🖼️</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em]">
              drop image at
            </p>
            <code className="mt-1 text-[10px] text-ink/50 break-all">
              {shot.src}
            </code>
          </div>
        )}
      </div>
      <figcaption className="text-xs text-mute leading-relaxed">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { getProject, projects, Screenshot } from "@/data/projects";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const project = getProject(params.slug);

  if (!project) return notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="relative min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto section-padding">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-mute hover:text-coral mb-6"
        >
          <span>←</span> all work
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroBlock
            heroImage={project.heroImage}
            fallbackColor={project.cover.color}
            fallbackEmoji={project.cover.emoji}
            title={project.title}
          />

          <p className="stamp">{project.category} · {project.year}</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-ink leading-[1.05]">
            {project.title}
          </h1>
          <p className="mt-2 text-coral text-lg">{project.subtitle}</p>

          {project.metrics && (
            <p className="mt-4 text-sm font-medium text-ink/70">
              {project.metrics}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
        >
          {project.role && (
            <Meta label="role" value={project.role} />
          )}
          {project.duration && (
            <Meta label="duration" value={project.duration} />
          )}
          {project.team && <Meta label="team" value={project.team} />}
          {project.stack && (
            <Meta label="stack" value={project.stack.slice(0, 3).join(" · ")} />
          )}
        </motion.div>

        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-3">
            the problem
          </h2>
          <p className="text-xl md:text-2xl text-ink leading-relaxed font-serif italic">
            {project.problem}
          </p>
        </section>

        {project.caseStudy?.map((s, i) => (
          <section key={i} className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-3">
              {s.heading}
            </h2>
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
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-4">
              more
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.screenshots.map((s, i) => (
                <ScreenshotCard key={i} shot={s} />
              ))}
            </div>
          </section>
        )}

        {project.keyDecisions && project.keyDecisions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-4">
              key decisions
            </h2>
            <div className="space-y-4">
              {project.keyDecisions.map((d, i) => (
                <div
                  key={i}
                  className="card border-l-[3px] border-l-coral rounded-l-md"
                >
                  <p className="font-serif text-2xl text-ink">{d.title}</p>
                  <p className="mt-2 text-ink/80 leading-relaxed">{d.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.outcomes && project.outcomes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-coral mb-4">
              outcomes
            </h2>
            <ul className="space-y-2">
              {project.outcomes.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-ink/85 text-lg"
                >
                  <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-coral" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              live demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              github ↗
            </a>
          )}
          {project.reportUrl && (
            <a
              href={project.reportUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              report ↗
            </a>
          )}
        </section>

        <section className="mt-16 pt-10 border-t border-ink/10">
          <p className="text-xs uppercase tracking-[0.2em] text-mute mb-3">
            up next
          </p>
          <Link
            href={`/work/${next.slug}`}
            className="group flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-serif text-3xl text-ink group-hover:text-coral transition-colors">
                {next.title}
              </p>
              <p className="text-sm text-mute">{next.subtitle}</p>
            </div>
            <span className="text-2xl text-coral group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

/** Lightweight inline formatter — supports **bold** and `code`. Newlines
 *  are preserved by the parent's whitespace-pre-line. */
function RichText({ text }: { text: string }) {
  // Split on **bold** and `code` markers, preserving the markers themselves.
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
        {label}
      </p>
      <p className="mt-0.5 text-ink">{value}</p>
    </div>
  );
}

/** Hero block: renders the image if `heroImage` is provided and loads, otherwise
 *  falls back to the project's colored emoji block. */
function HeroBlock({
  heroImage,
  fallbackColor,
  fallbackEmoji,
  title,
}: {
  heroImage?: string;
  fallbackColor: string;
  fallbackEmoji: string;
  title: string;
}) {
  const [errored, setErrored] = useState(false);

  if (heroImage && !errored) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-56 md:h-80 mb-8">
        {/* object-cover fills the frame edge-to-edge, no background showing.
            A subtle scale pulse keeps it alive without cropping the edges. */}
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          style={{ animation: "heroBreathe 6s ease-in-out infinite" }}
          priority
          onError={() => setErrored(true)}
        />
        <style>{`
          @keyframes heroBreathe {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.025); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl h-56 flex items-center justify-center text-7xl mb-8"
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
            sizes="(max-width: 768px) 100vw, 400px"
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

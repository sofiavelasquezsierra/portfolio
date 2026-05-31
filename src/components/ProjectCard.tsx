"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Project } from "@/data/projects";

type Props = {
  project: Project;
  number: number;
  /** Small idle rotation so a row of cards reads as a loose stack. */
  tilt?: number;
};

/**
 * Index-card style: cream paper with hole-punch + No. NN badge,
 * hero image, title + tags, short description. Hover reveals a
 * ROLE / TEAM / TIMEFRAME grid below a hairline dashed divider.
 */
export default function ProjectCard({ project, number, tilt = 0 }: Props) {
  const num = String(number).padStart(2, "0");
  const href = `/work/${project.slug}`;
  const status = project.status ?? defaultStatus(project.category);

  return (
    <Link
      href={href}
      style={{ ["--card-tilt" as string]: `${tilt}deg` }}
      className="index-card group relative flex flex-col cursor-target"
    >
      {/* Top row: hole-punch + No. NN */}
      <div className="flex items-center justify-between w-full">
        <span className="index-card__hole" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink/55">
          No. {num}
        </span>
      </div>

      {/* Hero image frame */}
      <div
        className="relative w-full rounded-[12px] overflow-hidden mt-1.5"
        style={{ height: 188, background: project.cover.color }}
      >
        <CardMedia
          heroImage={project.heroImage}
          fallbackColor={project.cover.color}
          fallbackEmoji={project.cover.emoji}
          title={project.title}
        />
        <div className="index-card__sheen absolute inset-0 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="flex flex-col mt-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2.5">
            <h3 className="flex-1 min-w-0 font-serif text-[20px] leading-[1.15] text-ink truncate">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {project.sideProject && <Tag>SIDE PROJECT</Tag>}
              <Tag>{status}</Tag>
            </div>
          </div>

          <p className="text-[12px] leading-[1.4] text-ink/65 line-clamp-1">
            {project.subtitle}
          </p>
        </div>

        {/* Hover-reveal meta */}
        <div className="index-card__details">
          <div className="index-card__details-inner">
            <span className="index-card__rule" aria-hidden />
            <dl className="index-card__meta">
              {project.role && <MetaRow label="Role" value={project.role} />}
              {project.team && <MetaRow label="Team" value={project.team} />}
              <MetaRow
                label="Timeframe"
                value={project.duration ?? project.year}
              />
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Card thumbnail: if a heroImage is provided, fill the frame edge-to-edge.
 *  Otherwise fall back to the colored emoji block. */
function CardMedia({
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
      <div className="index-card__media absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 50vw, 400px"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="index-card__media absolute inset-0 flex items-center justify-center text-[88px] leading-none"
      style={{ background: fallbackColor }}
    >
      <span>{fallbackEmoji}</span>
    </div>
  );
}

function defaultStatus(c: Project["category"]): string {
  if (c === "ai") return "SHIPPED";
  if (c === "research") return "RESEARCH";
  return "ENGINEERING";
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-[2px] rounded text-[9px] uppercase tracking-[0.16em] font-medium border border-ink/15 bg-cream text-ink/70 whitespace-nowrap">
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-x-6 text-[11px] leading-[1.4]">
      <dt className="font-mono uppercase tracking-[0.04em] text-ink/55">
        {label}
      </dt>
      <dd className="m-0 text-ink/70">{value}</dd>
    </div>
  );
}

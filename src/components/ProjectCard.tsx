"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Project } from "@/data/projects";
import ScoreRings from "@/components/ScoreRings";

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

  return (
    <Link
      href={href}
      style={{ ["--card-tilt" as string]: `${tilt}deg` }}
      className="index-card group relative flex flex-col"
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
        {project.scores && project.scores.length > 0 ? (
          <div
            className="absolute inset-0 flex items-center justify-center px-4"
            style={{
              background: `color-mix(in srgb, ${
                project.accent ?? project.cover.color
              } 22%, #FAF7EE)`,
            }}
          >
            <ScoreRings
              scores={project.scores}
              showVerdict={false}
              ringMax={66}
              gapClass="gap-4"
            />
          </div>
        ) : (
          <CardMedia
            heroImage={project.cardImage ?? project.heroImage}
            fallbackColor={project.cover.color}
            fallbackEmoji={project.cover.emoji}
            title={project.title}
          />
        )}
        <div className="index-card__sheen absolute inset-0 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="flex flex-col mt-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-serif text-[20px] leading-[1.15] text-ink truncate">
            {project.title}
          </h3>

          <p className="text-[12px] leading-[1.4] text-ink/65 line-clamp-2">
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

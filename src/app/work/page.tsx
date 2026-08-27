"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { orderedProjects, ProjectCategory, Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const filters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "all" },
  { id: "ai", label: "side projects" },
  { id: "research", label: "research" },
  { id: "engineering", label: "engineering" },
];

const tiltCycle = [-1.2, 0.8, -0.4, 1.4, -0.6, 0.2];

/** Distribute items round-robin into N columns so each column flows
 * independently (a hover-expand on one card pushes only the cards below it
 * in the same column, not the whole row). */
function chunkColumns<T>(arr: T[], n: number): T[][] {
  const cols: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => cols[i % n].push(item));
  return cols;
}

export default function WorkPage() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const visible =
    filter === "all"
      ? orderedProjects
      : orderedProjects.filter((p) => p.category === filter);

  // Pre-compute three column distributions; CSS shows the matching one.
  const cols1 = chunkColumns(visible, 1);
  const cols2 = chunkColumns(visible, 2);
  const cols3 = chunkColumns(visible, 3);

  return (
    <main className="relative min-h-screen pt-20 lg:pt-10 pb-14 section-padding bg-cream">
      <div className="max-w-page mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="handwritten text-xl text-rose">a quick tour.</p>
            <h1 className="mt-1 font-serif text-4xl md:text-6xl text-ink leading-[1.05]">
              things i&apos;ve <span className="wavy">built</span>.
            </h1>
            <p className="mt-2 max-w-xl text-mute text-sm md:text-base">
              software engineer headed toward product — ai products, full-stack
              apps, and ml on real human signals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                  filter === f.id
                    ? "bg-ink text-white border-ink"
                    : "bg-transparent text-ink/70 border border-ink/15 hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Column variants — only one is visible at each breakpoint. */}
        <Columns cols={cols1} className="md:hidden" />
        <Columns cols={cols2} className="hidden md:grid lg:hidden" />
        <Columns cols={cols3} className="hidden lg:grid" />
      </div>
    </main>
  );
}

function Columns({
  cols,
  className,
}: {
  cols: Project[][];
  className: string;
}) {
  let runningIndex = 0;
  return (
    <div
      className={`grid gap-x-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`,
      }}
    >
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-8">
          {col.map((p) => {
            const idx = runningIndex++;
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                <ProjectCard
                  project={p}
                  number={
                    orderedProjects.findIndex((x) => x.slug === p.slug) + 1
                  }
                  tilt={tiltCycle[idx % tiltCycle.length]}
                />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

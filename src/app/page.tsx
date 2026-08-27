"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { recentProjects, orderedProjects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import PhotoOrLogo from "@/components/PhotoOrLogo";

/** Matches the loose-stack tilt used on the /work grid. */
const tiltCycle = [-1.2, 0.8, -0.4];

/**
 * Landing page. Deliberately short: who I am, then the three projects I'd most
 * want someone to open. Everything deeper (full grid, timeline, gallery) is one
 * click away in the rail.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen pt-20 lg:pt-10 pb-16 section-padding bg-cream">
      {/* Split: who i am on the left, what i've built on the right, so both
          are on screen at once. Stacks below lg. */}
      <div className="max-w-page mx-auto grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-10 xl:gap-14 items-start">
        <Intro />
        <RecentWork />
      </div>
    </main>
  );
}

function Intro() {
  return (
    <section className="pt-2">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="flex items-center gap-5">
          <PhotoOrLogo
            size={104}
            imgSize={140}
            rounded="rounded-2xl"
            className="shrink-0"
          />
          <div>
            <p className="handwritten text-xl text-rose">hello there.</p>
            <h1 className="mt-1 font-serif text-4xl md:text-5xl text-ink leading-[1.05]">
              hi, i&apos;m <span className="wavy">sofia</span>.
            </h1>
          </div>
        </div>

          {/* Recruiter's-eye view: what i can do and where, then where i'm
              from, then who i am — the last one lighter so the scan order
              holds. */}
          <div className="mt-5 max-w-[72ch]">
            <div className="space-y-4 text-lg md:text-xl text-ink/85 leading-relaxed">
              <p>
                software engineer with a{" "}
                <span className="bg-rose/15 text-ink px-1 rounded">
                  computational bme
                </span>{" "}
                background, moving toward{" "}
                <strong className="text-ink font-semibold">product</strong>.
                i&apos;ve shipped llm agents and rag systems, full-stack web
                apps, and models trained on biosignals — often all three inside
                one project. right now that&apos;s wearables data analysis at
                cmu&apos;s weber neural interfaces lab, training forecast models
                for stroke patient recovery, plus an edtech platform and a
                self-correcting rag agent i built recently. before cmu, two
                summers as an{" "}
                <strong className="text-ink font-semibold">swe intern</strong>{" "}
                at btg pactual and bnp paribas.
              </p>
              <p>
                i was lucky to grow up between paris, bogotá, nairobi and rio de
                janeiro before landing in montreal for a computer engineering
                degree at mcgill. carnegie mellon came next, where i finish my
                ms in august 2026.
              </p>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              more than anything, i like projects that start as a question and
              end as something people actually use. i spent two and a half years
              as co-president of blockchain at mcgill, i switch between spanish,
              english, portuguese and french mid-conversation (and i&apos;m
              slowly learning urdu), and most days you&apos;ll find me at the
              gym or working through the coffee shops of whatever city
              i&apos;m in.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KV label="based">🇺🇸 SF · NYC</KV>
            <KV label="status">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                open · aug 2026
              </span>
            </KV>
            <KV label="role">swe → product</KV>
            <KV label="focus">ai products · health</KV>
          </div>

          <div className="mt-7">
            <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
              swe internships
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <OrgChip
                src="/logos/btg.png"
                name="BTG Pactual"
                note="summer 2025"
              />
              <OrgChip
                src="/logos/bnp.png"
                name="BNP Paribas"
                note="summer 2024"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work" className="btn-primary">
              see all work →
            </Link>
            <Link href="/about" className="btn-secondary">
              more about me
            </Link>
            <Link href="/contact" className="btn-secondary">
              get in touch
            </Link>
          </div>
      </motion.div>
    </section>
  );
}

function RecentWork() {
  return (
    <section className="pt-10 lg:pt-2 border-t lg:border-t-0 border-ink/10">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="stamp">recent work</p>
        <Link
          href="/work"
          className="text-sm text-ink/70 hover:text-rose transition-colors"
        >
          all {orderedProjects.length} projects →
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
        {recentProjects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <ProjectCard
              project={p}
              number={orderedProjects.findIndex((x) => x.slug === p.slug) + 1}
              tilt={tiltCycle[i % tiltCycle.length]}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
        {label}
      </p>
      <p className="mt-1 text-[15px] text-ink">{children}</p>
    </div>
  );
}

/** Small logo + name chip. Falls back to name-only if the logo file is missing. */
function OrgChip({
  src,
  name,
  note,
}: {
  src: string;
  name: string;
  note: string;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-ink/15 bg-white/70">
      {!errored && (
        <span className="relative w-6 h-6 rounded-full overflow-hidden bg-white border border-ink/10 shrink-0">
          <Image
            src={src}
            alt=""
            fill
            sizes="24px"
            className="object-contain p-0.5"
            onError={() => setErrored(true)}
          />
        </span>
      )}
      <span className="text-sm text-ink">{name}</span>
      <span className="text-xs text-mute">{note}</span>
    </span>
  );
}

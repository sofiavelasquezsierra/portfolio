"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { experience, education } from "@/data/experience";
import { placesLived, languages } from "@/data/places";
import FavoritesBoard from "@/components/FavoritesBoard";
import PhotoOrLogo from "@/components/PhotoOrLogo";

const levelColor: Record<string, string> = {
  native: "#7E91C0",
  fluent: "#8FA88E",
  conversational: "#BFD8E8",
  learning: "#E5C57E",
};


const HERO_PHOTOS = [
  { src: "/photos/me-1.jpg", caption: "✦ a moment", rotate: -4 },
  { src: "/photos/me-2.jpg", caption: "✿ another", rotate: 3 },
  { src: "/photos/me-3.jpg", caption: "❋ and one more", rotate: -2 },
];

export default function AboutPage() {
  return (
    <main className="bg-cream">
      <Hero />
      <PhotoStrip />
      <TravelLog />
      <Favorites />
    </main>
  );
}

function Hero() {
  return (
    <section className="min-h-[calc(100vh-2rem)] flex items-center pt-20 lg:pt-10 pb-10 section-padding">
      <div className="max-w-page mx-auto w-full">
        <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-center">
          {/* Photo / logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <PhotoOrLogo size={220} imgSize={300} rounded="rounded-2xl" />
          </motion.div>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="stamp">02 · about</p>
            <h1 className="mt-3 font-serif text-5xl md:text-6xl text-ink leading-[1.05]">
              hi, i&apos;m <span className="wavy">sofia</span>.
            </h1>
            <p className="mt-4 text-lg text-ink/85 leading-relaxed">
              product and ml in{" "}
              <span className="bg-rose/15 text-ink px-1 rounded">
                wearables and health ai
              </span>
              . i turn noisy biosignals (eeg, semg, imu) into things people
              actually use on their wrist, ears, or head — and on the side i
              build little things with ai for fun.
            </p>

            {/* Identity grid — origin & passport removed */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <KV label="based">🇺🇸 Pittsburgh</KV>
              <KV label="status">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  open · aug 2026
                </span>
              </KV>
              <KV label="role">product &amp; ml engineer</KV>
              <KV label="focus">wearables · health ai</KV>
            </div>

            {/* Places + languages */}
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-mute mb-2">
                  places i&apos;ve called home
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {placesLived.map((p) => (
                    <span
                      key={p.country}
                      title={`${p.city ?? ""}, ${p.country} · ${p.years}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs border border-ink/15 rounded bg-white/70"
                    >
                      <span>{p.flag}</span>
                      <span className="text-ink/80">{p.country}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-mute mb-2">
                  languages
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((l) => (
                    <span
                      key={l.name}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded"
                      style={{
                        background: `${levelColor[l.level]}1A`,
                        border: `1px solid ${levelColor[l.level]}55`,
                      }}
                    >
                      <span>{l.flag}</span>
                      <span className="text-ink/80">{l.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Small Polaroid strip below the hero. Each is a placeholder until the
 *  photo file exists at the expected path. */
function PhotoStrip() {
  return (
    <section className="py-10 section-padding">
      <div className="max-w-page mx-auto">
        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          {HERO_PHOTOS.map((p, i) => (
            <PhotoPolaroid key={i} {...p} />
          ))}
        </div>  
      </div>
    </section>
  );
}

function PhotoPolaroid({
  src,
  caption,
  rotate,
}: {
  src: string;
  caption: string;
  rotate: number;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      whileHover={{ rotate: 0, y: -4, scale: 1.04, zIndex: 10 }}
      className="cursor-target relative bg-white p-3 pb-10 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.3)]"
      style={{ width: 200 }}
    >
      <div className="relative aspect-[4/5] bg-cream/80 overflow-hidden flex items-center justify-center">
        {!errored ? (
          <Image
            src={src}
            alt={caption}
            fill
            sizes="200px"
            className="object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="text-center text-mute/60">
            <p className="text-3xl">📷</p>
            <p className="text-[10px] uppercase tracking-[0.2em] mt-1">
              add photo
            </p>
          </div>
        )}
      </div>
      <p className="absolute bottom-2 left-3 right-3 text-center handwritten text-base text-ink">
        {caption}
      </p>
    </motion.div>
  );
}

function TravelLog() {
  return (
    <section className="min-h-[calc(100vh-2rem)] flex items-center py-12 section-padding border-t border-ink/5">
      <div className="max-w-page mx-auto w-full">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-12">
          <div>
            <p className="stamp">experience</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-tight mb-8">
              where i&apos;ve been working.
            </h2>
            <ol className="relative border-l border-ink/15 pl-6 space-y-7">
              {experience.map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="relative"
                >
                  <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-rose" />
                  <p className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    {e.date}
                  </p>
                  <h3 className="font-serif text-xl text-ink leading-tight mt-0.5">
                    {e.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <OrgLogo src={e.logo} fallback={initialsOf(e.org)} />
                    <p className="text-sm text-ink/75">{e.org}</p>
                  </div>
                  {e.detail && (
                    <p className="text-xs text-mute mt-1">{e.detail}</p>
                  )}
                </motion.li>
              ))}
            </ol>
          </div>

          <div>
            <p className="stamp">education</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-tight mb-8">
              schools.
            </h2>
            <div className="space-y-4">
              {education.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white/80 rounded-2xl p-5 border border-ink/5 flex items-start gap-3"
                >
                  <OrgLogo
                    src={e.logo}
                    fallback={initialsOf(e.school)}
                    big
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-mute">
                      {e.date}
                    </p>
                    <p className="font-serif text-xl text-ink mt-0.5 leading-tight">
                      {e.school}
                    </p>
                    <p className="text-sm text-ink/75 mt-0.5">{e.degree}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-rose/10 border border-rose/30">
              <p className="text-[10px] tracking-[0.22em] uppercase text-rose mb-1">
                currently
              </p>
              <p className="text-ink/85 text-sm leading-relaxed">
                building ml pipelines for meta&apos;s semg wristband at
                cmu&apos;s weber neural interfaces lab + a research assistant
                at the human-computer interaction institute.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Favorites() {
  return (
    <section className="min-h-[calc(100vh-2rem)] flex items-center py-12 section-padding border-t border-ink/5">
      <div className="max-w-page mx-auto w-full">
        <div className="text-center mb-8">
          <p className="stamp">favourites</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-tight">
            stuff i&apos;m into.
          </h2>
          <p className="mt-2 text-mute max-w-xl mx-auto">
            things i use, things i love, things i build with.
          </p>
        </div>

        <FavoritesBoard />
      </div>
    </section>
  );
}

function KV({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-ink">{children}</p>
    </div>
  );
}

/**
 * Small circular org logo. Falls back to a styled initials chip if the file
 * is missing — nothing breaks before the user drops images into /public/logos.
 */
function OrgLogo({
  src,
  fallback,
  big = false,
}: {
  src?: string;
  fallback: string;
  big?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const size = big ? 44 : 28;

  if (!src || errored) {
    return (
      <div
        className="flex-shrink-0 rounded-full bg-rose/10 border border-rose/30 flex items-center justify-center text-[10px] font-semibold text-rose tracking-tight"
        style={{ width: size, height: size }}
      >
        {fallback}
      </div>
    );
  }
  return (
    <div
      className="flex-shrink-0 rounded-full overflow-hidden border border-ink/10 bg-white relative"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-contain p-1"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

function initialsOf(name: string): string {
  // First letter of first two words, uppercased. "HCII" stays "HC".
  const cleaned = name.replace(/[^a-zA-Z\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

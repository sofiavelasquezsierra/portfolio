"use client";

import { motion } from "framer-motion";
import { experience, education } from "@/data/experience";
import { placesLived, languages } from "@/data/places";
import SecurityTray from "@/components/SecurityTray";
import PhotoOrLogo from "@/components/PhotoOrLogo";

const levelColor: Record<string, string> = {
  native: "#7E91C0",
  fluent: "#8FA88E",
  conversational: "#BFD8E8",
  learning: "#E5C57E",
};

export default function AboutPage() {
  return (
    <main className="bg-cream">
      {/* SECTION 1 — Hero (passport-style intro, fits one screen) */}
      <Hero />

      {/* SECTION 2 — Travel log + education (single screen) */}
      <TravelLog />

      {/* SECTION 3 — Security tray with favorites (single screen) */}
      <Favorites />
    </main>
  );
}

function Hero() {
  return (
    <section className="min-h-[calc(100vh-2rem)] flex items-center pt-20 lg:pt-10 pb-10 section-padding">
      <div className="max-w-page mx-auto w-full">
        <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-center">
          {/* Photo, or standalone logo if no photo present */}
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
              building with ai — product and ml for{" "}
              <span className="bg-rose/15 text-ink px-1 rounded">
                health and wearables
              </span>
              . i extract meaning from noisy biosignals (eeg, semg, imu) and
              ship it as something a person can actually use on their wrist,
              ears, or head.
            </p>

            {/* Identity grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <KV label="origin">🇨🇴 Bogotá</KV>
              <KV label="based">🇺🇸 Pittsburgh</KV>
              <KV label="status">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  open · aug 2026
                </span>
              </KV>
              <KV label="role">building with ai · ml engineer</KV>
              <KV label="focus">product · health · wearables</KV>
              <KV label="passport">🇨🇴 colombian</KV>
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
            <ol className="relative border-l border-ink/15 pl-6 space-y-6">
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
                  <p className="text-sm text-ink/75">{e.org}</p>
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
                  className="bg-white/80 rounded-2xl p-5 border border-ink/5"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    {e.date}
                  </p>
                  <p className="font-serif text-xl text-ink mt-0.5">
                    {e.school}
                  </p>
                  <p className="text-sm text-ink/75 mt-0.5">{e.degree}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-rose/10 border border-rose/30">
              <p className="text-[10px] tracking-[0.22em] uppercase text-rose mb-1">
                currently
              </p>
              <p className="text-ink/85 text-sm leading-relaxed">
                building ml pipelines for meta&apos;s semg wristband at
                cmu&apos;s weber neural interfaces lab.
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
        <div className="text-center mb-6">
          <p className="stamp">favourites</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-tight">
            stuff i&apos;m into.
          </h2>
          <p className="mt-2 text-mute max-w-xl mx-auto">
            things i use, things i love, things i build with.
          </p>
        </div>

        <SecurityTray />
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

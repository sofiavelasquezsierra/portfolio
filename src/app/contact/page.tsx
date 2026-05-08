"use client";

import { motion } from "framer-motion";
import Postcard from "@/components/Postcard";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen pt-20 lg:pt-10 pb-14 section-padding bg-cream">
      <div className="max-w-page mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3"
        >
          <div>
            <p className="stamp">04 · contact</p>
            <h1 className="mt-2 font-serif text-4xl md:text-6xl text-ink leading-[1.05]">
              let&apos;s build <span className="wavy">something</span>.
            </h1>
            <p className="mt-2 max-w-xl text-mute text-sm">
              full-time roles, august 2026 — product &amp; ml in wearables
              and health ai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="mailto:svelasqu@andrew.cmu.edu"
              className="px-3 py-1.5 rounded-full bg-ink text-white hover:bg-rose transition-colors"
            >
              svelasqu@andrew.cmu.edu
            </a>
            <a
              href="https://github.com/sofiavelasquezsierra"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-ink/15 text-ink hover:border-rose hover:text-rose transition-colors"
            >
              github ↗
            </a>
            <a
              href="https://www.linkedin.com/in/sofia-velasquez-sierra/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-ink/15 text-ink hover:border-rose hover:text-rose transition-colors"
            >
              linkedin ↗
            </a>
          </div>
        </motion.div>

        <Postcard />
      </div>
    </main>
  );
}

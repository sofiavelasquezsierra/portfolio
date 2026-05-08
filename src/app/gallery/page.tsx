"use client";

import { motion } from "framer-motion";
import ParticleSandbox from "@/components/ParticleSandbox";
import PetPlayground from "@/components/PetPlayground";
import PetTicTacToe from "@/components/PetTicTacToe";
import { useVisitor } from "@/hooks/useVisitor";

export default function GalleryPage() {
  const { count } = useVisitor();

  return (
    <main className="relative min-h-screen pt-20 lg:pt-10 pb-14 section-padding bg-cream">
      <div className="max-w-page mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="stamp">03 · gallery</p>
            <h1 className="mt-2 font-serif text-4xl md:text-6xl text-ink leading-[1.05]">
              a quiet little <span className="wavy">sandbox</span>.
            </h1>
            <p className="mt-2 max-w-xl text-mute text-sm">
              drag your cursor, click to scatter, hold to pull everything
              toward you. 
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/80 border border-ink/10 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
            <span className="text-mute">visitor</span>
            <span className="font-mono font-medium text-ink">
              #{count !== null ? count.toString().padStart(4, "0") : "—"}
            </span>
          </span>
        </motion.div>

        <ParticleSandbox />

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <PetPlayground />
          </div>
          <div className="flex-1">
            <PetTicTacToe />
          </div>
        </div>
      </div>
    </main>
  );
}

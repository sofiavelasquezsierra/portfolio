"use client";

import { motion } from "framer-motion";
import Sky from "@/components/Sky";
import CursorPicker from "@/components/CursorPicker";
import CornerInfo from "@/components/CornerInfo";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";

export default function LandingPage() {
  const palette = useTimeOfDay();

  return (
    <Sky fullscreen>
      {/* Time + moon phase in the corner — keeps the welcome center clean */}
      <CornerInfo color={palette.textOnSky} />

      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-6xl md:text-8xl leading-[1] tracking-tight text-center"
          style={{ color: palette.textOnSky }}
        >
          welcome.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 mb-10 text-center text-base md:text-lg opacity-90"
          style={{ color: palette.textOnSky }}
        >
          pick a cursor to take with you ↓
        </motion.p>

        <CursorPicker />
      </main>
    </Sky>
  );
}

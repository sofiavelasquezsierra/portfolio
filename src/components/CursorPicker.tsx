"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cursors } from "@/data/cursors";
import { useVisitor } from "@/hooks/useVisitor";

export default function CursorPicker() {
  const router = useRouter();
  const { setCursor } = useVisitor();
  const [picked, setPicked] = useState<string | null>(null);

  function pick(id: string) {
    setCursor(id);
    setPicked(id);
    setTimeout(() => router.push("/work"), 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-4 gap-3 max-w-md mx-auto"
    >
      {cursors.map((c, i) => {
        const active = picked === c.id;
        return (
          <motion.button
            key={c.id}
            onClick={() => pick(c.id)}
            aria-label={`${c.label} cursor`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-target group relative aspect-square rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center transition-colors"
            style={{
              borderColor: active ? c.color : undefined,
              background: active ? `${c.color}22` : undefined,
              boxShadow: active
                ? `0 0 0 2px ${c.color}55, 0 12px 24px -12px ${c.color}88`
                : undefined,
            }}
          >
            <span
              className="text-4xl leading-none transition-transform group-hover:scale-110"
              style={{ color: c.color }}
            >
              {c.glyph}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

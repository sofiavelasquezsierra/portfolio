"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { favorites, Favorite } from "@/data/favorites";

const TRAY_IMAGE = "/security-tray.png";

export default function SecurityTray() {
  const [trayLoaded, setTrayLoaded] = useState(true);

  return (
    <div className="relative">
      {/* Conveyor labels */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.32em] uppercase text-ink/60">
          ✦ x-ray · personal items
        </p>
        <p className="text-[10px] tracking-[0.32em] uppercase text-ink/60">
          nothing to declare
        </p>
      </div>

      {/* Tray container — uses the user's real tray image (transparent png),
          falls back to a styled gradient bin if the file is missing. */}
      <div
        className="relative w-full mx-auto"
        style={{ aspectRatio: "4 / 3", maxWidth: 880 }}
      >
        {trayLoaded && (
          <Image
            src={TRAY_IMAGE}
            alt="security tray"
            fill
            sizes="(max-width: 768px) 100vw, 880px"
            className="object-contain"
            onError={() => setTrayLoaded(false)}
            priority
          />
        )}

        {!trayLoaded && (
          <div
            className="absolute inset-0 rounded-[42px] border-4 border-[#A8B0B7]"
            style={{
              background:
                "linear-gradient(180deg, #C9CFD5 0%, #B6BDC4 50%, #C9CFD5 100%)",
              boxShadow:
                "inset 0 6px 14px rgba(0,0,0,0.18), inset 0 -3px 6px rgba(255,255,255,0.45)",
            }}
          />
        )}

        {/* Items grid, sitting in the interior of the tray */}
        <div className="absolute inset-[10%] grid grid-cols-4 grid-rows-2 gap-3 md:gap-4">
          {favorites.map((f, i) => (
            <Item key={f.id} item={f} index={i} />
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-mute italic text-center">
        hover to inspect
      </p>
    </div>
  );
}

function Item({ item, index }: { item: Favorite; index: number }) {
  const [errored, setErrored] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ rotate: 0, y: -4, scale: 1.06, zIndex: 10 }}
      className="relative bg-white border border-ink/10 rounded-xl flex flex-col items-center justify-center p-2 cursor-target shadow-md"
    >
      {item.wearables && (
        <span
          aria-label="wearables-related"
          className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] tracking-[0.18em] uppercase rounded-full bg-ink text-cream z-10"
        >
          ⌚
        </span>
      )}

      {item.src && !errored ? (
        <div className="relative w-full flex-1">
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="120px"
            className="object-contain"
            onError={() => setErrored(true)}
          />
        </div>
      ) : (
        <span className="text-[clamp(28px,5vw,44px)] leading-none">
          {item.emoji}
        </span>
      )}

      <p className="mt-1 font-serif text-sm text-ink leading-tight text-center">
        {item.label}
      </p>
      <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-ink/55 leading-tight text-center line-clamp-1">
        {item.caption}
      </p>
    </motion.div>
  );
}
